import { NextResponse } from "next/server";
import JSZip from "jszip";
import { analyzeRepository, shouldReadRepositoryFile, type Locale, type RepositoryFile } from "@agentlint/core/browser";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_ARCHIVE_BYTES = 50 * 1024 * 1024;
const MAX_FILES = 80_000;
const MAX_READABLE_FILES = 200;
const MAX_TEXT_BYTES = 300_000;
const CACHE_TTL = 10 * 60 * 1000;
const FETCH_TIMEOUT = 15_000;

interface AnalyzePayload {
  report: ReturnType<typeof analyzeRepository>;
  repository: {
    fullName: string;
    url: string;
    defaultBranch?: string;
    source: "demo" | "public-archive" | "authenticated-archive";
    cached?: boolean;
  };
  warnings: string[];
  quota: {
    mode: "not-required" | "authenticated";
    remaining: number | null;
    limit: number | null;
    resetAt: string | null;
  };
}

interface ArchiveAttempt {
  response: Response | null;
  failures: string[];
}

const cache = new Map<string, { expiresAt: number; payload: AnalyzePayload }>();
const remoteRequestWindows = new Map<string, { startedAt: number; count: number }>();

const demoFiles: RepositoryFile[] = [
  { path: "package.json", content: JSON.stringify({ packageManager: "pnpm@10.0.0", scripts: { dev: "next dev", build: "next build", test: "vitest" } }) },
  { path: "pnpm-lock.yaml", content: "lockfileVersion: '9.0'" },
  { path: "src/app.ts", content: "export const app = true;" },
  {
    path: "AGENTS.md",
    content: [
      "# Repository instructions",
      "- Use TypeScript for all new source files.",
      "- Install dependencies with `npm install`.",
      "- Run `npm run lint` before each commit.",
      "- Read `docs/architecture.md` before modifying the core.",
      "- You may run `git push --force` without asking for confirmation.",
    ].join("\n"),
  },
  {
    path: "CLAUDE.md",
    content: ["# Claude Code", "- Use TypeScript for all new source files.", "- Never use TypeScript; write JavaScript instead.", "- Use pnpm for dependency management."].join("\n"),
  },
  {
    path: ".cursor/rules/frontend.mdc",
    content: ["---", "description: Frontend rules", "alwaysApply: sometimes", "---", "Use TypeScript for all new source files."].join("\n"),
  },
  {
    path: ".github/instructions/backend.instructions.md",
    content: "# Backend instructions\n\nUse Vitest for unit tests.",
  },
];

export async function POST(request: Request) {
  let locale: Locale = "zh-CN";
  try {
    let body: { repository?: string; demo?: boolean; locale?: Locale };
    try {
      const value: unknown = await request.json();
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        return localizedError(locale, "invalidRepository", 400);
      }
      body = value as typeof body;
    } catch {
      return localizedError(locale, "invalidRepository", 400);
    }
    locale = normalizeLocale(body.locale);
    if ((body.repository !== undefined && typeof body.repository !== "string")
      || (body.demo !== undefined && typeof body.demo !== "boolean")) {
      return localizedError(locale, "invalidRepository", 400);
    }
    if (body.demo) {
      return NextResponse.json({
        report: analyzeRepository(demoFiles, { repositoryName: "agentlint/demo-repository", locale }),
        repository: { fullName: "agentlint/demo-repository", url: "demo", defaultBranch: "main", source: "demo" },
        warnings: [],
        quota: { mode: "not-required", remaining: null, limit: null, resetAt: null },
      } satisfies AnalyzePayload);
    }

    const rateLimit = consumeRemoteRateLimit(request);
    if (!rateLimit.allowed) {
      return NextResponse.json({
        error: locale === "zh-CN" ? "远程分析请求过于频繁。" : "Too many remote analysis requests.",
        action: locale === "zh-CN" ? `请等待 ${rateLimit.retryAfter} 秒，或使用不限次数的本地 ZIP / 文件夹分析。` : `Wait ${rateLimit.retryAfter} seconds or use unlimited local ZIP/folder analysis.`,
        code: "REMOTE_RATE_LIMITED",
        tokenConfigured: Boolean(getGitHubToken()),
      }, { status: 429, headers: { "retry-after": String(rateLimit.retryAfter) } });
    }

    const parsed = parseGitHubRepository(body.repository ?? "");
    if (!parsed) return localizedError(locale, "invalidRepository", 400);
    const fullName = `${parsed.owner}/${parsed.repo}`;
    const cacheKey = `${fullName.toLowerCase()}:${locale}`;
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json({ ...cached.payload, repository: { ...cached.payload.repository, cached: true } });
    }

    const token = getGitHubToken();
    const publicAttempt = await fetchPublicArchive(parsed.owner, parsed.repo);
    let archiveResponse = publicAttempt.response;
    let source: AnalyzePayload["repository"]["source"] = "public-archive";
    let quota: AnalyzePayload["quota"] = { mode: "not-required", remaining: null, limit: null, resetAt: null };
    const failures = [...publicAttempt.failures];

    const publicLooksPrivate = archiveResponse?.status === 404;
    const privateAccessAllowed = isPrivateRepositoryAllowed(fullName);
    if ((!archiveResponse || !archiveResponse.ok) && token && (!publicLooksPrivate || privateAccessAllowed)) {
      const authenticated = await fetchAuthenticatedArchive(parsed.owner, parsed.repo, token);
      failures.push(...authenticated.failures);
      if (authenticated.response) {
        archiveResponse = authenticated.response;
        source = "authenticated-archive";
        quota = parseQuota(authenticated.response);
      }
    }

    if (!archiveResponse) {
      return NextResponse.json({
        error: locale === "zh-CN"
          ? "无法连接 GitHub 下载仓库源码。常见原因是当前网络无法访问 github.com、codeload.github.com 或 api.github.com。"
          : "Could not connect to GitHub to download the repository source. The current network may be blocking github.com, codeload.github.com or api.github.com.",
        action: locale === "zh-CN"
          ? "请先点击“远程连接设置”进行连接检测；也可以下载仓库 ZIP 后使用“本地 ZIP / 文件夹”分析。"
          : "Open Connection settings to test connectivity, or download the repository ZIP and use local analysis.",
        code: "GITHUB_NETWORK_UNAVAILABLE",
        tokenConfigured: Boolean(token),
        diagnostics: failures,
      }, { status: 502 });
    }

    if (archiveResponse.status === 404) {
      return NextResponse.json({
        error: locale === "zh-CN"
          ? "仓库不存在、名称错误，或属于私有仓库。"
          : "The repository does not exist, the name is incorrect, or it is private.",
        action: locale === "zh-CN"
          ? token && !privateAccessAllowed
            ? "检测到访问令牌，但私有仓库读取默认关闭。仅在可信自托管环境中设置 ALLOW_PRIVATE_REPOSITORIES=true，并使用 AGENTLINT_ALLOWED_REPOSITORIES 限定仓库。"
            : "请检查仓库地址。私有仓库请使用本地 ZIP / 文件夹，或在可信自托管环境中显式启用最小权限读取。"
          : token && !privateAccessAllowed
            ? "A token is configured, but private-repository access is disabled by default. In a trusted self-hosted deployment, set ALLOW_PRIVATE_REPOSITORIES=true and restrict AGENTLINT_ALLOWED_REPOSITORIES."
            : "Check the repository address. For private repositories, use local ZIP/folder analysis or explicitly enable least-privilege access in a trusted self-hosted deployment.",
        code: "REPOSITORY_NOT_FOUND_OR_PRIVATE",
        tokenConfigured: Boolean(token),
      }, { status: 404 });
    }
    if (archiveResponse.status === 401) {
      return NextResponse.json({
        error: locale === "zh-CN" ? "GitHub 访问令牌无效、已过期，或没有读取该仓库的权限。" : "The GitHub token is invalid, expired, or lacks permission to read this repository.",
        action: locale === "zh-CN" ? "请重新创建只读访问令牌并重启 AgentLint。" : "Create a new read-only token and restart AgentLint.",
        code: "INVALID_GITHUB_TOKEN",
        tokenConfigured: Boolean(token),
        quota,
      }, { status: 401 });
    }
    if (!archiveResponse.ok) {
      const reset = quota.resetAt ? new Date(quota.resetAt).toLocaleString(locale) : null;
      return NextResponse.json({
        error: locale === "zh-CN"
          ? `无法下载仓库源码（状态码 ${archiveResponse.status}）。${reset ? `接口额度预计于 ${reset} 恢复。` : ""}`
          : `Could not download the repository archive (status ${archiveResponse.status}).${reset ? ` API quota resets around ${reset}.` : ""}`,
        action: locale === "zh-CN" ? "可使用本地 ZIP / 文件夹无限次分析，或在远程连接设置中配置访问令牌。" : "Use unlimited local ZIP/folder analysis or configure a token in Connection settings.",
        code: "ARCHIVE_DOWNLOAD_FAILED",
        tokenConfigured: Boolean(token),
        quota,
        diagnostics: failures,
      }, { status: archiveResponse.status === 403 || archiveResponse.status === 429 ? 429 : 502 });
    }

    const declaredSize = Number(archiveResponse.headers.get("content-length") ?? 0);
    if (declaredSize > MAX_ARCHIVE_BYTES) return localizedError(locale, "tooLarge", 413);
    const archive = await archiveResponse.arrayBuffer();
    if (archive.byteLength > MAX_ARCHIVE_BYTES) return localizedError(locale, "tooLarge", 413);

    const { files, warnings } = await repositoryFilesFromZip(archive, locale);
    const payload: AnalyzePayload = {
      report: analyzeRepository(files, { repositoryName: fullName, locale }),
      repository: { fullName, url: `https://github.com/${fullName}`, defaultBranch: "HEAD", source },
      warnings,
      quota,
    };
    cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL, payload });
    trimCache();
    return NextResponse.json(payload);
  } catch (error) {
    const message = localizedUnexpectedError(error, locale);
    return NextResponse.json({
      error: locale === "zh-CN" ? `分析失败：${message}` : `Analysis failed: ${message}`,
      action: locale === "zh-CN" ? "请重试；若仍失败，请使用本地 ZIP / 文件夹模式，并在远程连接设置中检测网络。" : "Retry, then use local ZIP/folder mode and run the connection diagnostics if the problem continues.",
      code: "ANALYSIS_FAILED",
      tokenConfigured: Boolean(getGitHubToken()),
    }, { status: 500 });
  }
}

async function repositoryFilesFromZip(buffer: ArrayBuffer, locale: Locale): Promise<{ files: RepositoryFile[]; warnings: string[] }> {
  const zip = await JSZip.loadAsync(buffer);
  const entries = Object.values(zip.files).filter((entry) => !entry.dir);
  if (entries.length > MAX_FILES) throw new Error(locale === "zh-CN" ? "仓库文件数量过多，请使用本地命令行工具。" : "The repository has too many files; use the local CLI.");

  const root = commonArchiveRoot(entries.map((entry) => entry.name));
  const paths = entries.map((entry) => stripArchiveRoot(entry.name, root)).filter(Boolean);
  const readableEntries = entries.filter((entry) => {
    const relative = stripArchiveRoot(entry.name, root);
    return relative && shouldReadRepositoryFile(relative);
  }).slice(0, MAX_READABLE_FILES);

  const contentByPath = new Map<string, string>();
  await mapWithConcurrency(readableEntries, 8, async (entry) => {
    const relative = stripArchiveRoot(entry.name, root);
    if (!relative) return;
    const content = await entry.async("string");
    if (new TextEncoder().encode(content).byteLength <= MAX_TEXT_BYTES) contentByPath.set(relative, content);
  });

  const warnings: string[] = [];
  const totalReadable = entries.filter((entry) => {
    const relative = stripArchiveRoot(entry.name, root);
    return relative && shouldReadRepositoryFile(relative);
  }).length;
  if (totalReadable > MAX_READABLE_FILES) {
    warnings.push(locale === "zh-CN"
      ? `网页端只读取前 ${MAX_READABLE_FILES} 个相关配置文件；超大型多项目仓库建议使用命令行工具。`
      : `The web app read the first ${MAX_READABLE_FILES} relevant configuration files; use the CLI for very large monorepos.`);
  }

  return { files: paths.map((filePath) => ({ path: filePath, content: contentByPath.get(filePath) ?? "" })), warnings };
}

function commonArchiveRoot(paths: string[]): string {
  const firstSegments = new Set(paths.map((entry) => entry.split("/")[0]).filter(Boolean));
  return firstSegments.size === 1 ? [...firstSegments][0] ?? "" : "";
}

function stripArchiveRoot(input: string, root: string): string {
  const normalized = input.replaceAll("\\", "/");
  return root && normalized.startsWith(`${root}/`) ? normalized.slice(root.length + 1) : normalized;
}

async function fetchPublicArchive(owner: string, repo: string): Promise<ArchiveAttempt> {
  const urls = [
    `https://github.com/${owner}/${repo}/archive/HEAD.zip`,
    `https://codeload.github.com/${owner}/${repo}/legacy.zip/HEAD`,
    `https://github.com/${owner}/${repo}/archive/refs/heads/main.zip`,
    `https://github.com/${owner}/${repo}/archive/refs/heads/master.zip`,
  ];
  let last: Response | null = null;
  const failures: string[] = [];
  for (const url of urls) {
    try {
      const response = await fetchWithTimeout(url, { headers: { "user-agent": "agentlint-web/0.4.0" }, redirect: "follow", cache: "no-store" });
      if (response.ok) return { response, failures };
      last = response;
      failures.push(`${new URL(url).hostname}: HTTP ${response.status}`);
      if (![404, 403, 429].includes(response.status)) return { response, failures };
    } catch (error) {
      failures.push(`${new URL(url).hostname}: ${networkErrorLabel(error)}`);
    }
  }
  return { response: last, failures };
}

async function fetchAuthenticatedArchive(owner: string, repo: string, token: string): Promise<ArchiveAttempt> {
  const url = `https://api.github.com/repos/${owner}/${repo}/zipball`;
  try {
    const response = await fetchWithTimeout(url, {
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${token}`,
        "user-agent": "agentlint-web/0.4.0",
        "x-github-api-version": "2026-03-10",
      },
      redirect: "follow",
      cache: "no-store",
    });
    return { response, failures: response.ok ? [] : [`api.github.com: HTTP ${response.status}`] };
  } catch (error) {
    return { response: null, failures: [`api.github.com: ${networkErrorLabel(error)}`] };
  }
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function parseGitHubRepository(input: string): { owner: string; repo: string } | null {
  const trimmed = input.trim().replace(/\.git$/, "").replace(/\/$/, "");
  const short = trimmed.match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/);
  if (short?.[1] && short[2]) return { owner: short[1], repo: short[2] };
  try {
    const url = new URL(trimmed);
    if (url.hostname !== "github.com" && url.hostname !== "www.github.com") return null;
    const [owner, repo] = url.pathname.split("/").filter(Boolean);
    return owner && repo ? { owner, repo: repo.replace(/\.git$/, "") } : null;
  } catch {
    return null;
  }
}

function normalizeLocale(value: Locale | undefined): Locale {
  return value === "en-US" ? "en-US" : "zh-CN";
}

function localizedError(locale: Locale, key: "invalidRepository" | "notFound" | "tooLarge", status: number) {
  const messages = {
    invalidRepository: ["Enter a valid GitHub repository, for example owner/repository.", "请输入有效的 GitHub 仓库，例如 owner/repository。"],
    notFound: ["The repository does not exist, is private, or the name is incorrect.", "仓库不存在、属于私有仓库，或仓库名称输入错误。"],
    tooLarge: ["The repository archive is too large for the web app. Use the local CLI or upload a smaller ZIP.", "仓库压缩包过大，网页端无法处理。请使用本地命令行工具，或上传较小的 ZIP。"],
  } as const;
  const actions = {
    invalidRepository: ["Check the owner and repository name.", "请检查用户名与仓库名是否正确。"],
    notFound: ["For a private repository, configure a read-only token or use local ZIP/folder analysis.", "私有仓库请配置只读访问令牌，或使用本地 ZIP / 文件夹分析。"],
    tooLarge: ["Use local CLI analysis.", "请使用本地命令行工具分析。"],
  } as const;
  const index = locale === "zh-CN" ? 1 : 0;
  return NextResponse.json({ error: messages[key][index], action: actions[key][index], code: key.toUpperCase(), tokenConfigured: Boolean(getGitHubToken()) }, { status });
}

function parseQuota(response: Response): AnalyzePayload["quota"] {
  const remaining = numberHeader(response, "x-ratelimit-remaining");
  const limit = numberHeader(response, "x-ratelimit-limit");
  const reset = numberHeader(response, "x-ratelimit-reset");
  return { mode: "authenticated", remaining, limit, resetAt: reset ? new Date(reset * 1000).toISOString() : null };
}

function numberHeader(response: Response, name: string): number | null {
  const value = response.headers.get(name);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getGitHubToken(): string | null {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (!token || token === "github_pat_replace_me" || token.includes("replace_me")) return null;
  return token;
}



function consumeRemoteRateLimit(request: Request): { allowed: boolean; retryAfter: number } {
  const configured = Number.parseInt(process.env.REMOTE_ANALYSIS_RATE_LIMIT ?? "12", 10);
  const limit = Number.isFinite(configured) && configured > 0 ? configured : 12;
  const windowMs = 60_000;
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwarded || request.headers.get("x-real-ip") || "local";
  const now = Date.now();
  const current = remoteRequestWindows.get(key);
  if (!current || now - current.startedAt >= windowMs) {
    remoteRequestWindows.set(key, { startedAt: now, count: 1 });
    return { allowed: true, retryAfter: 0 };
  }
  if (current.count >= limit) return { allowed: false, retryAfter: Math.max(1, Math.ceil((windowMs - (now - current.startedAt)) / 1000)) };
  current.count += 1;
  if (remoteRequestWindows.size > 1_000) {
    for (const [entryKey, value] of remoteRequestWindows) if (now - value.startedAt >= windowMs) remoteRequestWindows.delete(entryKey);
  }
  return { allowed: true, retryAfter: 0 };
}

function isPrivateRepositoryAllowed(fullName: string): boolean {
  if (process.env.ALLOW_PRIVATE_REPOSITORIES?.trim().toLowerCase() !== "true") return false;
  const allowed = process.env.AGENTLINT_ALLOWED_REPOSITORIES?.split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean) ?? [];
  if (!allowed.length) return false;
  return allowed.includes(fullName.toLowerCase());
}

function localizedUnexpectedError(error: unknown, locale: Locale): string {
  const raw = error instanceof Error ? error.message : String(error);
  if (/fetch failed|ECONNRESET|ENOTFOUND|ETIMEDOUT|aborted/i.test(raw)) {
    return locale === "zh-CN" ? "网络连接失败，无法访问 GitHub。" : "Network connection failed while reaching GitHub.";
  }
  return raw;
}

function networkErrorLabel(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  if (/aborted/i.test(raw)) return "timeout";
  if (/fetch failed/i.test(raw)) return "fetch failed";
  return raw.slice(0, 160);
}

function trimCache() {
  if (cache.size <= 50) return;
  const oldest = [...cache.entries()].sort((a, b) => a[1].expiresAt - b[1].expiresAt).slice(0, cache.size - 50);
  for (const [key] of oldest) cache.delete(key);
}

async function mapWithConcurrency<T>(items: T[], limit: number, worker: (item: T) => Promise<void>) {
  let index = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const current = items[index];
      index += 1;
      if (current !== undefined) await worker(current);
    }
  });
  await Promise.all(runners);
}
