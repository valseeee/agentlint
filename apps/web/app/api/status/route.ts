import { NextResponse } from "next/server";

export const runtime = "nodejs";

const TIMEOUT = 8_000;

type Locale = "zh-CN" | "en-US";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale: Locale = url.searchParams.get("locale") === "en-US" ? "en-US" : "zh-CN";
  const shouldTest = url.searchParams.get("test") === "1";
  const token = getGitHubToken();
  const privateRepositoriesEnabled = process.env.ALLOW_PRIVATE_REPOSITORIES?.trim().toLowerCase() === "true"
    && Boolean(process.env.AGENTLINT_ALLOWED_REPOSITORIES?.trim());
  if (!shouldTest) return NextResponse.json({ tokenConfigured: Boolean(token), privateRepositoriesEnabled });

  const [github, archive, api] = await Promise.all([
    probe("https://github.com", locale, "GitHub 主页"),
    probe("https://codeload.github.com", locale, "GitHub 源码归档服务"),
    probeApi(locale, token),
  ]);

  return NextResponse.json({ tokenConfigured: Boolean(token), privateRepositoriesEnabled, checks: { github, archive, api } });
}

async function probe(url: string, locale: Locale, zhName: string) {
  try {
    const response = await fetchWithTimeout(url, { method: "HEAD", redirect: "follow", cache: "no-store" });
    const ok = response.ok || response.status < 500;
    return {
      ok,
      message: locale === "zh-CN"
        ? `${zhName}${ok ? "可以访问" : `返回状态码 ${response.status}`}`
        : `${new URL(url).hostname} ${ok ? "is reachable" : `returned status ${response.status}`}`,
    };
  } catch {
    return {
      ok: false,
      message: locale === "zh-CN" ? `${zhName}无法访问，请检查网络、代理或防火墙。` : `${new URL(url).hostname} is unreachable. Check the network, proxy or firewall.`,
    };
  }
}

async function probeApi(locale: Locale, token: string | null) {
  try {
    const headers: Record<string, string> = {
      accept: "application/vnd.github+json",
      "user-agent": "agentlint-web/0.4.0",
      "x-github-api-version": "2026-03-10",
    };
    if (token) headers.authorization = `Bearer ${token}`;
    const response = await fetchWithTimeout("https://api.github.com/rate_limit", { headers, cache: "no-store" });
    const remaining = numberHeader(response, "x-ratelimit-remaining");
    const limit = numberHeader(response, "x-ratelimit-limit");
    return {
      ok: response.ok,
      remaining,
      limit,
      message: locale === "zh-CN"
        ? response.ok
          ? `GitHub 接口可以访问${token ? "，访问令牌有效" : "（未使用访问令牌）"}${remaining !== null && limit !== null ? `，剩余 ${remaining}/${limit} 次` : ""}。`
          : `GitHub 接口返回状态码 ${response.status}。`
        : response.ok
          ? `GitHub API is reachable${token ? " and the token is valid" : " without a token"}${remaining !== null && limit !== null ? `; ${remaining}/${limit} requests remaining` : ""}.`
          : `GitHub API returned status ${response.status}.`,
    };
  } catch {
    return {
      ok: false,
      remaining: null,
      limit: null,
      message: locale === "zh-CN" ? "GitHub 接口无法访问，请检查网络、代理或防火墙。" : "GitHub API is unreachable. Check the network, proxy or firewall.",
    };
  }
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function getGitHubToken(): string | null {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (!token || token === "github_pat_replace_me" || token.includes("replace_me")) return null;
  return token;
}

function numberHeader(response: Response, name: string): number | null {
  const value = response.headers.get(name);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
