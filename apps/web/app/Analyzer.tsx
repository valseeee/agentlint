"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import JSZip from "jszip";
import {
  analyzeRepository,
  localizeReportView,
  renderMarkdownReport,
  shouldReadRepositoryFile,
  type AnalysisReport,
  type FindingCategory,
  type FindingSeverity,
  type Locale,
  type RepositoryFile,
} from "@agentlint/core/browser";

type ApiSuccess = {
  report: AnalysisReport;
  repository: { fullName: string; url: string; defaultBranch?: string; source: string; cached?: boolean };
  warnings?: string[];
  quota?: { mode: string; remaining: number | null; limit: number | null; resetAt: string | null };
};
type ApiError = { error: string; code?: string; action?: string; tokenConfigured?: boolean; diagnostics?: string[] };
type ConnectionStatus = {
  tokenConfigured: boolean;
  privateRepositoriesEnabled?: boolean;
  checks?: {
    github: { ok: boolean; message: string };
    archive: { ok: boolean; message: string };
    api: { ok: boolean; message: string; remaining?: number | null; limit?: number | null };
  };
};
type SeverityFilter = "all" | FindingSeverity;
type CategoryFilter = "all" | FindingCategory;
type ReportTab = "findings" | "files" | "scope";
type InputMode = "github" | "local";

const MAX_LOCAL_ARCHIVE_BYTES = 100 * 1024 * 1024;
const MAX_LOCAL_FOLDER_BYTES = 500 * 1024 * 1024;
const MAX_LOCAL_FILES = 80_000;

interface LocalArchive {
  zip: JSZip;
  root: string;
  name: string;
  files: RepositoryFile[];
}

const TEXT = {
  "zh-CN": {
    github: "GitHub 仓库",
    local: "本地 ZIP / 文件夹",
    publicRepo: "公开 GitHub 仓库",
    publicRepoDesc: "优先下载公开源码压缩包，不消耗 GitHub 接口次数；失败时才使用已配置的访问令牌。",
    privacy: "内存分析 · 不持久化",
    placeholder: "owner/repository 或 GitHub URL",
    analyze: "开始体检",
    analyzing: "分析中",
    demo: "查看问题示例 →",
    supported: "支持 AGENTS.md、Claude、Cursor、Copilot、Gemini、Cline、Windsurf",
    failed: "无法完成分析",
    cliCopied: "命令行命令已复制",
    copy: "复制",
    dropTitle: "把仓库 ZIP 拖到这里",
    dropDesc: "或选择 ZIP / 整个项目文件夹。文件只在浏览器本地处理，不上传，不限次数。",
    selectZip: "选择 ZIP",
    selectFolder: "选择文件夹",
    localLimit: "建议压缩包不超过 100 MB；超大型仓库使用命令行工具更稳定。",
    reading: "正在读取本地仓库…",
    report: "仓库健康报告",
    openRepo: "打开仓库 ↗",
    defaultBranch: "默认引用",
    source: "分析来源",
    cached: "缓存结果",
    share: "复制分享链接",
    exportMd: "导出 Markdown",
    exportJson: "导出 JSON",
    fixedZip: "下载安全修复 ZIP",
    noFix: "没有可应用的安全修复",
    fixedReady: "修复后的 ZIP 已生成",
    linkCopied: "分析链接已复制",
    exported: "报告已导出",
    rules: "规则文件",
    instructions: "有效指令",
    tokens: "估算令牌数",
    avoidable: "可减少令牌数",
    fixes: "安全修复",
    suppressed: "已抑制",
    findings: "问题清单",
    files: "规则文件",
    scope: "作用域关系图",
    search: "搜索规则、文件或问题…",
    allCategories: "全部类别",
    categories: { coverage: "覆盖度", consistency: "一致性", validity: "有效性", security: "安全", efficiency: "效率" },
    metrics: { coverage: "配置覆盖", consistency: "一致性", validity: "有效性", security: "安全性", efficiency: "上下文效率" },
    severity: { error: "错误", warning: "警告", info: "建议" },
    fixable: "可自动修复",
    suggestedFix: "建议修复",
    docs: "查看格式文档 ↗",
    empty: "没有匹配的问题",
    emptyDesc: "尝试调整筛选条件；若所有筛选均为空，这个仓库当前表现很好。",
    table: { file: "规则文件", tool: "工具", scope: "作用域", instructions: "指令", tokens: "令牌数", lines: "行数" },
    graphEmpty: "还没有可显示的规则作用域。",
    graphHelp: "连线表示继承、重叠或同一作用域中的不同工具规则。",
    rateFree: "公开源码归档模式：不消耗 GitHub 普通接口额度",
    rateAuth: "GitHub 接口剩余额度",
    rateUnknown: "已使用认证归档",
    localSource: "浏览器本地分析",
    publicArchive: "GitHub 公开源码归档",
    authArchive: "GitHub 认证源码归档",
    demoSource: "内置问题示例",
    schema: "报告格式版本",
    settings: "远程连接设置",
    retry: "重新尝试",
    connectionTitle: "GitHub 连接与访问令牌",
    connectionIntro: "公开仓库通常不需要访问令牌。网络无法下载源码归档、需要分析私有仓库，或接口额度不足时，可以配置免费的 GitHub 访问令牌。",
    tokenReady: "已检测到访问令牌",
    tokenMissing: "尚未配置访问令牌",
    checkingConfig: "正在读取配置…",
    testConnection: "检测连接",
    testingConnection: "正在检测…",
    close: "关闭",
    tokenSteps: [
      "登录 GitHub，依次进入：头像 → Settings → Developer settings → Personal access tokens → Fine-grained tokens。",
      "创建只读令牌。公开仓库无需额外权限；私有仓库仅授权指定仓库，并将 Contents 设置为 Read-only。",
      "在项目根目录打开 apps\web\.env.local，写入 GITHUB_TOKEN=你的令牌。",
      "保存后在 PowerShell 按 Ctrl+C 停止服务，再重新运行 npm run dev 或 npm run preview。",
    ],
    openTokenPage: "打开 GitHub 令牌创建页面 ↗",
    openEnv: "复制配置命令",
    envCopied: "配置命令已复制",
    productionHint: "想隐藏左下角开发工具和英文调试层，请使用 npm run preview 预览正式效果。",
    diagnostics: "连接诊断",
    configured: "已配置",
    notConfigured: "未配置",
    privateEnabled: "私有仓库读取已启用，并受允许列表限制",
    privateDisabled: "私有仓库读取默认关闭（更安全）",
  },
  "en-US": {
    github: "GitHub repository",
    local: "Local ZIP / folder",
    publicRepo: "Public GitHub repository",
    publicRepoDesc: "Downloads the public source archive first, so normal analysis does not consume GitHub REST API quota.",
    privacy: "In-memory · Not persisted",
    placeholder: "owner/repository or GitHub URL",
    analyze: "Analyze repository",
    analyzing: "Analyzing",
    demo: "Open the issue demo →",
    supported: "Supports AGENTS.md, Claude, Cursor, Copilot, Gemini, Cline and Windsurf",
    failed: "Analysis failed",
    cliCopied: "CLI command copied",
    copy: "Copy",
    dropTitle: "Drop a repository ZIP here",
    dropDesc: "Or select a ZIP / entire project folder. Files stay in your browser and local analysis is unlimited.",
    selectZip: "Choose ZIP",
    selectFolder: "Choose folder",
    localLimit: "Keep archives below 100 MB when possible; use the CLI for very large repositories.",
    reading: "Reading local repository…",
    report: "Repository health report",
    openRepo: "Open repository ↗",
    defaultBranch: "Default ref",
    source: "Analysis source",
    cached: "Cached result",
    share: "Copy share link",
    exportMd: "Export Markdown",
    exportJson: "Export JSON",
    fixedZip: "Download safely fixed ZIP",
    noFix: "No safe fixes are available",
    fixedReady: "Fixed ZIP generated",
    linkCopied: "Analysis link copied",
    exported: "Report exported",
    rules: "Rule files",
    instructions: "Instructions",
    tokens: "Estimated tokens",
    avoidable: "Avoidable tokens",
    fixes: "Safe fixes",
    suppressed: "Suppressed",
    findings: "Findings",
    files: "Rule files",
    scope: "Scope graph",
    search: "Search rules, files or findings…",
    allCategories: "All categories",
    categories: { coverage: "Coverage", consistency: "Consistency", validity: "Validity", security: "Security", efficiency: "Efficiency" },
    metrics: { coverage: "Coverage", consistency: "Consistency", validity: "Validity", security: "Security", efficiency: "Context efficiency" },
    severity: { error: "Error", warning: "Warning", info: "Suggestion" },
    fixable: "Auto-fixable",
    suggestedFix: "Suggested fix",
    docs: "Open format documentation ↗",
    empty: "No matching findings",
    emptyDesc: "Adjust the filters. If every filter is empty, this repository is currently in good shape.",
    table: { file: "Rule file", tool: "Tool", scope: "Scope", instructions: "Instructions", tokens: "Tokens", lines: "Lines" },
    graphEmpty: "No instruction scopes are available yet.",
    graphHelp: "Edges represent inheritance, overlap or tool variants in the same scope.",
    rateFree: "Public archive mode: no GitHub REST API quota used",
    rateAuth: "GitHub API remaining",
    rateUnknown: "Authenticated archive used",
    localSource: "Local browser analysis",
    publicArchive: "GitHub public source archive",
    authArchive: "GitHub authenticated source archive",
    demoSource: "Built-in issue demo",
    schema: "Report schema",
    settings: "Connection settings",
    retry: "Retry",
    connectionTitle: "GitHub connection and access token",
    connectionIntro: "Public repositories usually do not require a token. Configure a free GitHub token when archive downloads are blocked, private repositories are needed, or API quota is exhausted.",
    tokenReady: "Access token detected",
    tokenMissing: "No access token configured",
    checkingConfig: "Reading configuration…",
    testConnection: "Test connection",
    testingConnection: "Testing…",
    close: "Close",
    tokenSteps: [
      "Sign in to GitHub and open Settings → Developer settings → Personal access tokens → Fine-grained tokens.",
      "Create a read-only token. Public repositories need no extra permission; for private repositories select only the required repositories and set Contents to Read-only.",
      "Open apps\web\.env.local in the project root and add GITHUB_TOKEN=your_token.",
      "Save it, stop the server with Ctrl+C, then run npm run dev or npm run preview again.",
    ],
    openTokenPage: "Open GitHub token page ↗",
    openEnv: "Copy setup command",
    envCopied: "Setup command copied",
    productionHint: "Use npm run preview to hide the development toolbar and English framework error overlay.",
    diagnostics: "Connection diagnostics",
    configured: "Configured",
    notConfigured: "Not configured",
    privateEnabled: "Private repository access is enabled and allowlisted",
    privateDisabled: "Private repository access is disabled by default (safer)",
  },
} as const;

export default function Analyzer({ locale }: { locale: Locale }) {
  const t = TEXT[locale];
  const [mode, setMode] = useState<InputMode>("github");
  const [repository, setRepository] = useState("");
  const [rawReport, setRawReport] = useState<AnalysisReport | null>(null);
  const [repoMeta, setRepoMeta] = useState<ApiSuccess["repository"] | null>(null);
  const [quota, setQuota] = useState<ApiSuccess["quota"] | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [severity, setSeverity] = useState<SeverityFilter>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<ReportTab>("findings");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [dragging, setDragging] = useState(false);
  const [localArchive, setLocalArchive] = useState<LocalArchive | null>(null);
  const [showConnectionHelp, setShowConnectionHelp] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [errorAction, setErrorAction] = useState("");
  const zipInput = useRef<HTMLInputElement>(null);
  const folderInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initialRepository = new URL(window.location.href).searchParams.get("repo");
    if (initialRepository) {
      setRepository(initialRepository);
      setMode("github");
    }
  }, []);

  useEffect(() => {
    if (!showConnectionHelp) return;
    let cancelled = false;
    setConnectionStatus(null);
    void fetch(`/api/status?locale=${encodeURIComponent(locale)}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: ConnectionStatus) => { if (!cancelled) setConnectionStatus(payload); })
      .catch(() => { if (!cancelled) setConnectionStatus({ tokenConfigured: false }); });
    return () => { cancelled = true; };
  }, [locale, showConnectionHelp]);

  const report = useMemo(() => rawReport ? localizeReportView(rawReport, locale) : null, [locale, rawReport]);
  const visibleFindings = useMemo(() => {
    if (!report) return [];
    const needle = search.trim().toLowerCase();
    return report.findings.filter((finding) => {
      if (severity !== "all" && finding.severity !== severity) return false;
      if (category !== "all" && finding.category !== category) return false;
      if (!needle) return true;
      return [finding.title, finding.message, finding.ruleId, finding.file, finding.evidence]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(needle));
    });
  }, [category, report, search, severity]);

  async function analyzeGitHub(demo = false) {
    setLoading(true);
    resetMessages();
    try {
      const cacheKey = `agentlint:report:${repository.trim().toLowerCase()}:${locale}`;
      if (!demo) {
        const cached = readCache(cacheKey);
        if (cached) {
          applyApiPayload(cached);
          return;
        }
      }
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(demo ? { demo: true, locale } : { repository, locale }),
      });
      const payload = (await response.json()) as ApiSuccess | ApiError;
      if (!response.ok || "error" in payload) {
        if ("action" in payload && payload.action) setErrorAction(payload.action);
        throw new Error("error" in payload ? payload.error : t.failed);
      }
      applyApiPayload(payload);
      if (!demo) writeCache(cacheKey, payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t.failed);
    } finally {
      setLoading(false);
    }
  }

  function applyApiPayload(payload: ApiSuccess) {
    setRawReport(payload.report);
    setRepoMeta(payload.repository);
    setQuota(payload.quota ?? null);
    setWarnings(payload.warnings ?? []);
    setLocalArchive(null);
    resetFilters();
    scrollToReport();
  }

  async function handleZip(file: File) {
    if (!file.name.toLowerCase().endsWith(".zip")) {
      setError(locale === "zh-CN" ? "请选择 .zip 格式的仓库压缩包。" : "Choose a repository archive in .zip format.");
      return;
    }
    setLoading(true);
    resetMessages();
    try {
      if (file.size > MAX_LOCAL_ARCHIVE_BYTES) throw new Error(locale === "zh-CN" ? "ZIP 超过 100 MB，请使用本地命令行工具。" : "The ZIP exceeds 100 MB; use the local CLI.");
      const zip = await JSZip.loadAsync(await file.arrayBuffer());
      const entries = Object.values(zip.files).filter((entry) => !entry.dir);
      const root = commonRoot(entries.map((entry) => entry.name));
      const files = await repositoryFilesFromZip(zip, root, locale);
      analyzeLocal(files, { zip, root, name: file.name.replace(/\.zip$/i, ""), files });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t.failed);
    } finally {
      setLoading(false);
    }
  }

  async function handleFolder(fileList: FileList | null) {
    if (!fileList?.length) return;
    setLoading(true);
    resetMessages();
    try {
      const inputFiles = Array.from(fileList);
      if (inputFiles.length > MAX_LOCAL_FILES) throw new Error(locale === "zh-CN" ? "文件数量超过 80,000，请使用本地命令行工具。" : "The folder exceeds 80,000 files; use the local CLI.");
      const totalBytes = inputFiles.reduce((sum, file) => sum + file.size, 0);
      if (totalBytes > MAX_LOCAL_FOLDER_BYTES) throw new Error(locale === "zh-CN" ? "文件夹总大小超过 500 MB，请使用本地命令行工具。" : "The folder exceeds 500 MB; use the local CLI.");
      const root = commonRoot(inputFiles.map((file) => file.webkitRelativePath || file.name));
      const zip = new JSZip();
      const files: RepositoryFile[] = [];
      for (const file of inputFiles) {
        const original = file.webkitRelativePath || file.name;
        const relative = stripRoot(original, root);
        if (!relative) continue;
        zip.file(relative, await file.arrayBuffer());
        files.push({ path: relative, content: shouldReadRepositoryFile(relative) && file.size <= 300_000 ? await file.text() : "", size: file.size });
      }
      analyzeLocal(files, { zip, root: "", name: root || "agentlint-local", files });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t.failed);
    } finally {
      setLoading(false);
    }
  }

  function analyzeLocal(files: RepositoryFile[], archive: LocalArchive) {
    const name = archive.name || "local-repository";
    const nextReport = analyzeRepository(files, { repositoryName: name, locale });
    setRawReport(nextReport);
    setRepoMeta({ fullName: name, url: "local", source: "local" });
    setQuota({ mode: "not-required", remaining: null, limit: null, resetAt: null });
    setWarnings([]);
    setLocalArchive(archive);
    resetFilters();
    scrollToReport();
  }

  async function downloadFixedZip() {
    if (!report || !localArchive) return;
    const edits = report.findings.flatMap((finding) => finding.fix?.safe ? finding.fix.edits : []);
    if (!edits.length) return flash(t.noFix);
    const cloned = await JSZip.loadAsync(await localArchive.zip.generateAsync({ type: "arraybuffer" }));
    const grouped = new Map<string, typeof edits>();
    for (const edit of edits) grouped.set(edit.file, [...(grouped.get(edit.file) ?? []), edit]);
    for (const [filePath, fileEdits] of grouped) {
      const zipPath = localArchive.root ? `${localArchive.root}/${filePath}` : filePath;
      const entry = cloned.file(zipPath) ?? cloned.file(filePath);
      if (!entry) continue;
      const content = await entry.async("string");
      const newline = content.includes("\r\n") ? "\r\n" : "\n";
      const lines = content.split(/\r?\n/);
      for (const edit of [...fileEdits].sort((a, b) => b.line - a.line)) {
        if (edit.line >= 1 && edit.line <= lines.length) lines[edit.line - 1] = edit.replacement;
      }
      cloned.file(zipPath, lines.join(newline));
    }
    const blob = await cloned.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
    downloadBlob(blob, `${slug(report.repositoryName ?? "repository")}-agentlint-fixed.zip`);
    flash(t.fixedReady);
  }

  async function shareReport() {
    if (!repoMeta || repoMeta.url === "local" || repoMeta.url === "demo") return;
    const url = new URL(window.location.href);
    url.searchParams.set("repo", repoMeta.fullName);
    await navigator.clipboard.writeText(url.toString());
    flash(t.linkCopied);
  }

  function exportReport(format: "json" | "markdown") {
    if (!report) return;
    const content = format === "json" ? JSON.stringify(report, null, 2) : renderMarkdownReport(report, locale);
    const type = format === "json" ? "application/json" : "text/markdown";
    downloadBlob(new Blob([content], { type: `${type};charset=utf-8` }), `${slug(report.repositoryName ?? "repository")}-agentlint.${format === "json" ? "json" : "md"}`);
    flash(t.exported);
  }

  function resetMessages() {
    setError("");
    setNotice("");
    setWarnings([]);
    setErrorAction("");
  }

  function resetFilters() {
    setSeverity("all");
    setCategory("all");
    setSearch("");
    setTab("findings");
  }

  function scrollToReport() {
    requestAnimationFrame(() => document.querySelector("#report")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2200);
  }

  async function testGitHubConnection() {
    setTestingConnection(true);
    try {
      const response = await fetch(`/api/status?locale=${encodeURIComponent(locale)}&test=1`, { cache: "no-store" });
      const payload = await response.json() as ConnectionStatus;
      setConnectionStatus(payload);
    } catch {
      setConnectionStatus({ tokenConfigured: false, checks: {
        github: { ok: false, message: locale === "zh-CN" ? "无法连接本地诊断接口。" : "Could not reach the local diagnostics endpoint." },
        archive: { ok: false, message: locale === "zh-CN" ? "未完成检测。" : "Not tested." },
        api: { ok: false, message: locale === "zh-CN" ? "未完成检测。" : "Not tested." },
      } });
    } finally {
      setTestingConnection(false);
    }
  }

  return (
    <>
      <div className="mode-switch" role="tablist">
        <button className={mode === "github" ? "active" : ""} onClick={() => setMode("github")}>◉ {t.github}</button>
        <button className={mode === "local" ? "active" : ""} onClick={() => setMode("local")}>⬡ {t.local}</button>
      </div>

      {mode === "github" ? (
        <div className="analyzer-card">
          <div className="analyzer-title-row">
            <div><label htmlFor="repository">{t.publicRepo}</label><p>{t.publicRepoDesc}</p></div>
            <div className="title-actions"><button className="settings-button" onClick={() => setShowConnectionHelp(true)}>⚙ {t.settings}</button><span className="privacy-pill">{t.privacy}</span></div>
          </div>
          <div className="input-row">
            <span className="input-prefix" aria-hidden="true">⌘</span>
            <input id="repository" value={repository} onChange={(event) => setRepository(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && repository.trim()) void analyzeGitHub(false); }} placeholder={t.placeholder} spellCheck={false} autoComplete="off" />
            <button onClick={() => void analyzeGitHub(false)} disabled={loading || !repository.trim()}>{loading ? <><span className="spinner" />{t.analyzing}</> : t.analyze}</button>
          </div>
          <div className="analyzer-foot"><span>{t.supported}</span><button className="text-button" onClick={() => void analyzeGitHub(true)} disabled={loading}>{t.demo}</button></div>
          {error ? <div className="error-box" role="alert"><b>{t.failed}</b><span>{error}</span>{errorAction ? <small>{errorAction}</small> : null}<div className="error-actions"><button onClick={() => void analyzeGitHub(false)}>{t.retry}</button><button onClick={() => setShowConnectionHelp(true)}>{t.settings}</button><button onClick={() => setMode("local")}>{t.local}</button></div></div> : null}
        </div>
      ) : (
        <div
          className={`drop-zone ${dragging ? "dragging" : ""}`}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => { event.preventDefault(); setDragging(false); const file = event.dataTransfer.files[0]; if (file) void handleZip(file); }}
        >
          <div className="drop-icon">⇩</div><h3>{loading ? t.reading : t.dropTitle}</h3><p>{t.dropDesc}</p>
          <div className="drop-actions">
            <button onClick={() => zipInput.current?.click()}>{t.selectZip}</button>
            <button className="secondary" onClick={() => folderInput.current?.click()}>{t.selectFolder}</button>
          </div>
          <small>{t.localLimit}</small>
          <input ref={zipInput} type="file" accept=".zip,application/zip" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleZip(file); event.currentTarget.value = ""; }} />
          <input ref={folderInput} type="file" hidden multiple {...({ webkitdirectory: "", directory: "" } as React.InputHTMLAttributes<HTMLInputElement>)} onChange={(event) => { void handleFolder(event.target.files); event.currentTarget.value = ""; }} />
          {error ? <div className="error-box" role="alert"><b>{t.failed}</b><span>{error}</span></div> : null}
        </div>
      )}


      {showConnectionHelp ? <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowConnectionHelp(false); }}><section className="connection-modal" role="dialog" aria-modal="true" aria-labelledby="connection-title"><div className="modal-heading"><div><span className="eyebrow">{t.settings}</span><h3 id="connection-title">{t.connectionTitle}</h3></div><button className="modal-close" onClick={() => setShowConnectionHelp(false)} aria-label={t.close}>×</button></div><p>{t.connectionIntro}</p><div className={`token-state ${connectionStatus?.tokenConfigured ? "ok" : ""}`}><b>{connectionStatus === null ? t.checkingConfig : connectionStatus.tokenConfigured ? t.tokenReady : t.tokenMissing}</b><span>{connectionStatus === null ? "…" : connectionStatus.tokenConfigured ? t.configured : t.notConfigured}</span>{connectionStatus ? <small>{connectionStatus.privateRepositoriesEnabled ? t.privateEnabled : t.privateDisabled}</small> : null}</div><ol className="token-steps">{t.tokenSteps.map((step) => <li key={step}>{step}</li>)}</ol><div className="modal-actions"><a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noreferrer">{t.openTokenPage}</a><button onClick={() => { void navigator.clipboard.writeText("notepad .\\apps\\web\\.env.local"); flash(t.envCopied); }}>{t.openEnv}</button><button onClick={() => void testGitHubConnection()} disabled={testingConnection}>{testingConnection ? t.testingConnection : t.testConnection}</button></div>{connectionStatus?.checks ? <div className="diagnostics"><b>{t.diagnostics}</b>{Object.entries(connectionStatus.checks).map(([key, value]) => <div key={key} className={value.ok ? "ok" : "bad"}><span>{value.ok ? "✓" : "×"}</span><p>{value.message}</p></div>)}</div> : null}<div className="production-hint">{t.productionHint}</div></section></div> : null}
      <div className="command-preview" aria-label="CLI quick start"><code><span>$</span> npx agentlint@latest check . --lang {locale}</code><button onClick={() => { void navigator.clipboard.writeText(`npx agentlint@latest check . --lang ${locale}`); flash(t.cliCopied); }}>{t.copy}</button></div>
      {notice ? <div className="toast" role="status">{notice}</div> : null}

      {report ? (
        <section id="report" className="report-section" aria-live="polite">
          <div className="report-heading">
            <div><div className="eyebrow">{t.report}</div><h2>{repoMeta?.fullName ?? report.repositoryName}</h2><div className="report-links">
              {repoMeta?.url && repoMeta.url !== "local" && repoMeta.url !== "demo" ? <a href={repoMeta.url} target="_blank" rel="noreferrer">{t.openRepo}</a> : null}
              {repoMeta?.defaultBranch ? <span>{t.defaultBranch} {repoMeta.defaultBranch}</span> : null}
              <span>{t.source}：{sourceLabel(repoMeta?.source, locale)}</span>
              {repoMeta?.cached ? <span>{t.cached}</span> : null}<span>{t.schema} {report.schemaVersion}</span>
            </div></div><Score score={report.score} grade={report.grade} />
          </div>

          <div className="quota-banner">{quota?.mode === "authenticated" ? `${t.rateAuth}：${quota.remaining ?? "?"}/${quota.limit ?? "?"}` : t.rateFree}</div>
          <div className="report-actions">
            {repoMeta?.url !== "local" && repoMeta?.url !== "demo" ? <button onClick={() => void shareReport()}>{t.share}</button> : null}
            <button onClick={() => exportReport("markdown")}>{t.exportMd}</button><button onClick={() => exportReport("json")}>{t.exportJson}</button>
            {localArchive ? <button className="accent-button" onClick={() => void downloadFixedZip()} disabled={!report.summary.fixable}>{t.fixedZip}</button> : null}
          </div>
          {warnings.map((warning) => <div className="notice" key={warning}>⚠ {warning}</div>)}

          <div className="metric-grid">{Object.entries(report.metrics).map(([name, value]) => <div className="metric" key={name}><span>{t.metrics[name as keyof typeof t.metrics]}</span><strong>{value}</strong><i><em style={{ width: `${value}%` }} /></i></div>)}</div>
          <div className="summary-grid"><SummaryStat value={report.summary.instructionFiles} label={t.rules} /><SummaryStat value={report.summary.instructions} label={t.instructions} /><SummaryStat value={formatNumber(report.summary.estimatedTokens, locale)} label={t.tokens} /><SummaryStat value={report.summary.avoidableTokens} label={t.avoidable} /><SummaryStat value={report.summary.fixable} label={t.fixes} accent /><SummaryStat value={report.summary.suppressed} label={t.suppressed} /></div>

          <div className="report-tabs" role="tablist"><button className={tab === "findings" ? "active" : ""} onClick={() => setTab("findings")}>{t.findings} <span>{report.findings.length}</span></button><button className={tab === "files" ? "active" : ""} onClick={() => setTab("files")}>{t.files} <span>{report.instructionFiles.length}</span></button><button className={tab === "scope" ? "active" : ""} onClick={() => setTab("scope")}>{t.scope} <span>{report.scopeGraph.edges.length}</span></button></div>

          {tab === "findings" ? <FindingsView report={report} visibleFindings={visibleFindings} search={search} setSearch={setSearch} severity={severity} setSeverity={setSeverity} category={category} setCategory={setCategory} locale={locale} /> : null}
          {tab === "files" ? <FilesView report={report} locale={locale} /> : null}
          {tab === "scope" ? <ScopeView report={report} locale={locale} /> : null}
        </section>
      ) : null}
    </>
  );
}

function FindingsView({ report, visibleFindings, search, setSearch, severity, setSeverity, category, setCategory, locale }: { report: AnalysisReport; visibleFindings: AnalysisReport["findings"]; search: string; setSearch: (value: string) => void; severity: SeverityFilter; setSeverity: (value: SeverityFilter) => void; category: CategoryFilter; setCategory: (value: CategoryFilter) => void; locale: Locale }) {
  const t = TEXT[locale];
  return <><div className="findings-toolbar"><div className="search-box"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.search} /></div><div className="filters">{(["all", "error", "warning", "info"] as const).map((value) => <button key={value} className={severity === value ? "active" : ""} onClick={() => setSeverity(value)}>{severityLabel(value, report, locale)}</button>)}</div></div>
    <div className="category-filters">{(["all", "coverage", "consistency", "validity", "security", "efficiency"] as const).map((value) => <button key={value} className={category === value ? "active" : ""} onClick={() => setCategory(value)}>{value === "all" ? t.allCategories : t.categories[value]}</button>)}</div>
    <div className="findings-list">{visibleFindings.length ? visibleFindings.map((finding) => <article className={`finding ${finding.severity}`} key={finding.id}><span className="finding-icon">{finding.severity === "error" ? "×" : finding.severity === "warning" ? "!" : "i"}</span><div className="finding-content"><div className="finding-top"><div><span className={`severity-tag ${finding.severity}`}>{t.severity[finding.severity]}</span><code>{finding.ruleId}</code>{finding.fix?.safe ? <span className="fixable-tag">{t.fixable}</span> : null}</div>{finding.file ? <code className="location">{finding.file}{finding.line ? `:${finding.line}` : ""}</code> : null}</div><h4>{finding.title}</h4><p>{finding.message}</p>{finding.evidence ? <blockquote>{finding.evidence}</blockquote> : null}{finding.suggestion ? <p className="fix"><b>{t.suggestedFix}</b>{finding.suggestion}</p> : null}{finding.docs ? <a className="docs-link" href={finding.docs} target="_blank" rel="noreferrer">{t.docs}</a> : null}</div></article>) : <div className="empty-state"><b>{t.empty}</b><span>{t.emptyDesc}</span></div>}</div></>;
}

function FilesView({ report, locale }: { report: AnalysisReport; locale: Locale }) {
  const t = TEXT[locale];
  return <div className="file-table-wrap"><table className="file-table"><thead><tr><th>{t.table.file}</th><th>{t.table.tool}</th><th>{t.table.scope}</th><th>{t.table.instructions}</th><th>{t.table.tokens}</th><th>{t.table.lines}</th></tr></thead><tbody>{[...report.instructionFiles].sort((a, b) => b.estimatedTokens - a.estimatedTokens).map((file) => <tr key={file.path}><td><code>{file.path}</code></td><td>{file.label}</td><td><span className="scope-chip">{file.scope}</span></td><td>{file.instructionCount}</td><td>{file.estimatedTokens}</td><td>{file.lineCount}</td></tr>)}</tbody></table></div>;
}

function ScopeView({ report, locale }: { report: AnalysisReport; locale: Locale }) {
  const t = TEXT[locale];
  if (!report.scopeGraph.nodes.length) return <div className="empty-state"><b>{t.graphEmpty}</b></div>;
  return <div className="scope-view"><p>{t.graphHelp}</p><div className="scope-network">{report.scopeGraph.nodes.map((node, index) => <div className="scope-node" key={node.id} style={{ gridColumn: (index % 3) + 1 }}><span>{node.label}</span><code>{node.path}</code><small>{node.scope} · {node.tokens} {locale === "zh-CN" ? "令牌" : "tokens"}</small><div className="edge-count">{report.scopeGraph.edges.filter((edge) => edge.from === node.id || edge.to === node.id).length}</div></div>)}</div><div className="edge-list">{report.scopeGraph.edges.map((edge, index) => { const from = report.scopeGraph.nodes.find((node) => node.id === edge.from); const to = report.scopeGraph.nodes.find((node) => node.id === edge.to); return <code key={`${edge.from}-${edge.to}-${index}`}>{from?.path} → {to?.path} ({relationLabel(edge.relation, locale)})</code>; })}</div></div>;
}

function Score({ score, grade }: { score: number; grade: string }) { return <div className="score" style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}><div><strong>{score}</strong><span>{grade}</span></div></div>; }
function SummaryStat({ value, label, accent = false }: { value: number | string; label: string; accent?: boolean }) { return <div className={accent ? "summary-stat accent" : "summary-stat"}><strong>{value}</strong><span>{label}</span></div>; }
function severityLabel(filter: SeverityFilter, report: AnalysisReport, locale: Locale): string { if (filter === "all") return `${locale === "zh-CN" ? "全部" : "All"} ${report.findings.length}`; return `${TEXT[locale].severity[filter]} ${report.findings.filter((finding) => finding.severity === filter).length}`; }
function formatNumber(value: number, locale: Locale): string { return new Intl.NumberFormat(locale, { notation: value >= 10_000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value); }
function slug(value: string): string { return value.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-").replace(/^-|-$/g, ""); }
function relationLabel(relation: string, locale: Locale): string {
  if (locale !== "zh-CN") return relation;
  return ({ inherits: "继承", overlaps: "作用域重叠", "tool-variant": "同作用域的不同工具规则" } as Record<string, string>)[relation] ?? relation;
}
function sourceLabel(source: string | undefined, locale: Locale): string { const t = TEXT[locale]; return source === "local" ? t.localSource : source === "public-archive" ? t.publicArchive : source === "authenticated-archive" ? t.authArchive : t.demoSource; }
function downloadBlob(blob: Blob, name: string) { const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); }
function commonRoot(paths: string[]): string { const roots = new Set(paths.map((value) => value.replaceAll("\\", "/").split("/")[0]).filter(Boolean)); return roots.size === 1 ? [...roots][0] ?? "" : ""; }
function stripRoot(input: string, root: string): string { const normalized = input.replaceAll("\\", "/"); return root && normalized.startsWith(`${root}/`) ? normalized.slice(root.length + 1) : normalized; }
async function repositoryFilesFromZip(zip: JSZip, root: string, locale: Locale): Promise<RepositoryFile[]> { const entries = Object.values(zip.files).filter((entry) => !entry.dir); if (entries.length > 80_000) throw new Error(locale === "zh-CN" ? "压缩包文件数量过多，请使用本地命令行工具。" : "The archive contains too many files. Use the local CLI."); const files: RepositoryFile[] = []; for (const entry of entries) { const relative = stripRoot(entry.name, root); if (!relative) continue; const content = shouldReadRepositoryFile(relative) ? await entry.async("string") : ""; files.push({ path: relative, content: new TextEncoder().encode(content).byteLength <= 300_000 ? content : "" }); } return files; }
function writeCache(key: string, payload: ApiSuccess) { try { localStorage.setItem(key, JSON.stringify({ expiresAt: Date.now() + 10 * 60 * 1000, payload })); } catch {} }
function readCache(key: string): ApiSuccess | null { try { const value = localStorage.getItem(key); if (!value) return null; const cached = JSON.parse(value) as { expiresAt: number; payload: ApiSuccess }; if (cached.expiresAt < Date.now()) { localStorage.removeItem(key); return null; } return { ...cached.payload, repository: { ...cached.payload.repository, cached: true } }; } catch { return null; } }
