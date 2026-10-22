#!/usr/bin/env node
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { Command } from "commander";
import {
  analyzeRepositoryWithPlugins,
  compareReports,
  getRuleCatalog,
  getRuleDetails,
  readConfigFile,
  renderDiffMarkdown,
  renderGitHubAnnotations,
  renderMarkdownReport,
  renderPrettyReport,
  renderSarifReport,
  scanLocalRepository,
  type AgentLintConfig,
  type AgentLintPlugin,
  type AnalysisReport,
  type FindingSeverity,
  type Locale,
  type TextEdit,
} from "@agentlint/core";

const defaultLocale: Locale = /^(zh|cn)/i.test(process.env.AGENTLINT_LANG ?? process.env.LANG ?? "") ? "zh-CN" : "en-US";
const program = new Command();
program.name("agentlint").description("Lint AI coding-agent instruction files / 检查 AI 编程助手指令文件").version("0.4.0");

program.command("check [directory]", { isDefault: true })
  .description("analyze a repository / 分析仓库")
  .option("-f, --format <format>", "pretty, json, markdown, sarif or github", "pretty")
  .option("-o, --output <file>", "write output to a file / 写入文件")
  .option("--lang <locale>", "zh-CN or en-US", defaultLocale)
  .option("--fail-on <level>", "error, warning or never", "error")
  .option("--max-warnings <count>", "fail when warnings exceed this count", parseInteger)
  .option("--config <file>", "merge an additional JSON configuration file")
  .option("--rule <rule=severity>", "override a rule; repeatable", collect, [])
  .option("--plugin <module>", "load an optional analysis plugin; repeatable", collect, [])
  .option("--baseline <file>", "compare against a previous JSON report")
  .option("--save-baseline <file>", "write the current JSON report as a baseline")
  .option("--diff-output <file>", "write baseline differences as Markdown")
  .option("--pr-comment", "create or update a Pull Request summary comment", false)
  .option("--fix", "apply deterministic safe fixes before reporting", false)
  .action(async (directory = ".", options: CheckOptions) => {
    const locale = normalizeLocale(options.lang);
    try {
      const absolute = path.resolve(directory);
      let overrideConfig = options.config ? await readConfigFile(options.config) : {};
      overrideConfig = mergeCliRules(overrideConfig, options.rule, locale);
      const plugins = await loadPlugins(options.plugin);

      let files = await scanLocalRepository(absolute, overrideConfig.ignore ?? []);
      let report = await analyzeRepositoryWithPlugins(files, { repositoryName: path.basename(absolute), config: overrideConfig, locale }, plugins);

      if (options.fix) {
        const applied = await applySafeFixes(absolute, report);
        process.stderr.write(applied > 0
          ? (locale === "zh-CN" ? `AgentLint 已应用 ${applied} 个安全修复。\n` : `AgentLint applied ${applied} safe fix${applied === 1 ? "" : "es"}.\n`)
          : (locale === "zh-CN" ? "AgentLint 没有发现可安全自动修复的问题。\n" : "AgentLint found no safe automatic fixes to apply.\n"));
        if (applied > 0) {
          files = await scanLocalRepository(absolute, overrideConfig.ignore ?? []);
          report = await analyzeRepositoryWithPlugins(files, { repositoryName: path.basename(absolute), config: overrideConfig, locale }, plugins);
        }
      }

      const output = formatReport(options.format, report, locale);
      if (options.output) {
        const outputPath = path.resolve(options.output);
        await mkdir(path.dirname(outputPath), { recursive: true });
        await writeFile(outputPath, output.endsWith("\n") ? output : `${output}\n`, "utf8");
        process.stdout.write(locale === "zh-CN" ? `AgentLint 报告已写入 ${outputPath}\n` : `AgentLint report written to ${outputPath}\n`);
      } else if (output) process.stdout.write(output.endsWith("\n") ? output : `${output}\n`);

      let diffMarkdown = "";
      if (options.baseline) {
        const baseline = JSON.parse(await readFile(path.resolve(options.baseline), "utf8")) as AnalysisReport;
        const diff = compareReports(report, baseline);
        diffMarkdown = renderDiffMarkdown(diff, locale);
        if (options.diffOutput) {
          const diffPath = path.resolve(options.diffOutput);
          await mkdir(path.dirname(diffPath), { recursive: true });
          await writeFile(diffPath, diffMarkdown, "utf8");
        } else process.stderr.write(`\n${diffMarkdown}\n`);
      }
      if (options.saveBaseline) {
        const baselinePath = path.resolve(options.saveBaseline);
        await mkdir(path.dirname(baselinePath), { recursive: true });
        await writeFile(baselinePath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
      }

      if (options.format === "github" || process.env.GITHUB_ACTIONS === "true") await writeGitHubMetadata(report, locale);
      if (options.prComment) await upsertPullRequestComment(report, diffMarkdown, locale);
      process.exitCode = shouldFail(options.failOn, report, options.maxWarnings, locale) ? 1 : 0;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      process.stderr.write(locale === "zh-CN" ? `AgentLint 执行失败：${message}\n` : `AgentLint failed: ${message}\n`);
      process.exitCode = 2;
    }
  });

program.command("init [directory]")
  .description("create starter files / 创建起始文件")
  .option("--lang <locale>", "zh-CN or en-US", defaultLocale)
  .option("--force", "overwrite existing starter files", false)
  .action(async (directory = ".", options: { force: boolean; lang: string }) => {
    const locale = normalizeLocale(options.lang);
    try {
      const absolute = path.resolve(directory);
      await mkdir(absolute, { recursive: true });
      const created: string[] = [];
      created.push(...await createIfMissing(path.join(absolute, ".agentlint.json"), starterConfig(locale), options.force));
      created.push(...await createIfMissing(path.join(absolute, "AGENTS.md"), starterAgents(locale), options.force));
      if (created.length) process.stdout.write(`${locale === "zh-CN" ? "已创建" : "Created"}:\n${created.map((file) => `  ${file}`).join("\n")}\n`);
      else process.stdout.write(locale === "zh-CN" ? "没有修改：起始文件已存在；使用 --force 可覆盖。\n" : "Nothing changed. Starter files already exist; use --force to overwrite them.\n");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      process.stderr.write(locale === "zh-CN" ? `AgentLint 初始化失败：${message}\n` : `AgentLint init failed: ${message}\n`);
      process.exitCode = 2;
    }
  });


program.command("rules [query]")
  .description("list built-in rules / 列出内置规则")
  .option("--lang <locale>", "zh-CN or en-US", defaultLocale)
  .option("--json", "output JSON / 输出 JSON", false)
  .action((query = "", options: { lang: string; json: boolean }) => {
    const locale = normalizeLocale(options.lang);
    const keyword = query.trim().toLowerCase();
    const rules = getRuleCatalog(locale).filter((rule) => !keyword || [rule.id, rule.title, rule.description, rule.category].some((value) => value.toLowerCase().includes(keyword)));
    if (options.json) {
      process.stdout.write(`${JSON.stringify(rules, null, 2)}\n`);
      return;
    }
    if (!rules.length) {
      process.stdout.write(locale === "zh-CN" ? "没有找到匹配的规则。\n" : "No matching rules found.\n");
      return;
    }
    for (const rule of rules) {
      process.stdout.write(`${rule.id}\n  ${rule.title}\n  ${locale === "zh-CN" ? "默认级别" : "Default"}: ${rule.defaultSeverity} · ${locale === "zh-CN" ? "类别" : "Category"}: ${rule.category}\n  ${rule.description}\n\n`);
    }
  });

program.command("explain <ruleId>")
  .description("explain one rule / 解释单条规则")
  .option("--lang <locale>", "zh-CN or en-US", defaultLocale)
  .action((ruleId: string, options: { lang: string }) => {
    const locale = normalizeLocale(options.lang);
    const rule = getRuleDetails(ruleId, locale);
    if (!rule) {
      process.stderr.write(locale === "zh-CN" ? `未知规则：${ruleId}\n可运行 agentlint rules 查看完整列表。\n` : `Unknown rule: ${ruleId}\nRun agentlint rules to see the full catalog.\n`);
      process.exitCode = 1;
      return;
    }
    process.stdout.write(`${rule.id}\n${"=".repeat(rule.id.length)}\n${rule.title}\n\n${rule.description}\n\n${locale === "zh-CN" ? "默认级别" : "Default severity"}: ${rule.defaultSeverity}\n${locale === "zh-CN" ? "类别" : "Category"}: ${rule.category}\n${locale === "zh-CN" ? "文档" : "Docs"}: docs/RULES.md#${rule.id.replace("/", "")}\n`);
  });

program.command("doctor [directory]")
  .description("check the local environment / 检查本地运行环境")
  .option("--lang <locale>", "zh-CN or en-US", defaultLocale)
  .option("--network", "also test GitHub connectivity / 同时检测 GitHub 网络", false)
  .action(async (directory = ".", options: { lang: string; network: boolean }) => {
    const locale = normalizeLocale(options.lang);
    const root = path.resolve(directory);
    const results: Array<{ ok: boolean; label: string; details: string }> = [];
    const nodeMajor = Number(process.versions.node.split(".")[0]);
    results.push({ ok: nodeMajor >= 20, label: locale === "zh-CN" ? "Node.js 版本" : "Node.js version", details: process.versions.node });
    try {
      await access(path.join(root, "package.json"));
      results.push({ ok: true, label: locale === "zh-CN" ? "项目目录" : "Project directory", details: root });
    } catch {
      results.push({ ok: false, label: locale === "zh-CN" ? "项目目录" : "Project directory", details: locale === "zh-CN" ? "没有找到 package.json（分析普通仓库时不一定需要）" : "package.json not found (not required for every repository)" });
    }
    try {
      const files = await scanLocalRepository(root, []);
      results.push({ ok: files.length > 0, label: locale === "zh-CN" ? "仓库读取" : "Repository scan", details: locale === "zh-CN" ? `发现 ${files.length} 个文件条目` : `${files.length} file entries found` });
    } catch (error) {
      results.push({ ok: false, label: locale === "zh-CN" ? "仓库读取" : "Repository scan", details: error instanceof Error ? error.message : String(error) });
    }
    const envPath = path.join(root, "apps", "web", ".env.local");
    try {
      const env = await readFile(envPath, "utf8");
      const configured = /^GITHUB_TOKEN=\S+/m.test(env) && !/replace_me|你的/.test(env);
      results.push({ ok: configured, label: locale === "zh-CN" ? "GitHub 访问令牌" : "GitHub token", details: configured ? (locale === "zh-CN" ? "已配置（内容不会显示）" : "Configured (value hidden)") : (locale === "zh-CN" ? "未配置；公开仓库和本地分析仍可使用" : "Not configured; public and local analysis still work") });
    } catch {
      results.push({ ok: true, label: locale === "zh-CN" ? "GitHub 访问令牌" : "GitHub token", details: locale === "zh-CN" ? "未配置；这是可选项" : "Not configured; this is optional" });
    }
    if (options.network) {
      try {
        const response = await fetch("https://github.com", { method: "HEAD", signal: AbortSignal.timeout(8_000) });
        results.push({ ok: response.ok || response.status < 500, label: locale === "zh-CN" ? "GitHub 网络" : "GitHub network", details: `HTTP ${response.status}` });
      } catch (error) {
        results.push({ ok: false, label: locale === "zh-CN" ? "GitHub 网络" : "GitHub network", details: error instanceof Error ? error.message : String(error) });
      }
    }
    process.stdout.write(`${locale === "zh-CN" ? "AgentLint 环境检查" : "AgentLint doctor"}\n${"=".repeat(28)}\n`);
    for (const result of results) process.stdout.write(`${result.ok ? "✓" : "✗"} ${result.label}: ${result.details}\n`);
    if (results.some((result) => !result.ok && !result.label.includes("令牌") && !result.label.includes("token"))) process.exitCode = 1;
  });

void program.parseAsync(process.argv).catch((error: unknown) => {
  process.stderr.write(`AgentLint failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 2;
});

interface CheckOptions { format: string; output?: string; lang: string; failOn: string; maxWarnings?: number; config?: string; rule: string[]; plugin: string[]; baseline?: string; saveBaseline?: string; diffOutput?: string; prComment: boolean; fix: boolean; }

function normalizeLocale(value: string): Locale { return /^zh/i.test(value) ? "zh-CN" : "en-US"; }
function formatReport(format: string, report: AnalysisReport, locale: Locale): string {
  if (format === "json") return JSON.stringify(report, null, 2);
  if (format === "markdown" || format === "md") return renderMarkdownReport(report, locale);
  if (format === "sarif") return renderSarifReport(report, locale);
  if (format === "github") return renderGitHubAnnotations(report, locale);
  if (format !== "pretty") throw new Error(locale === "zh-CN" ? `未知格式“${format}”。可用 pretty、json、markdown、sarif 或 github。` : `Unknown format “${format}”. Use pretty, json, markdown, sarif or github.`);
  return renderPrettyReport(report, locale);
}
function shouldFail(level: string, report: AnalysisReport, maxWarnings: number | undefined, locale: Locale): boolean {
  if (maxWarnings !== undefined && report.summary.warnings > maxWarnings) return true;
  const severities = report.findings.map((finding) => finding.severity);
  if (level === "never") return false;
  if (level === "warning") return severities.some((severity) => severity === "error" || severity === "warning");
  if (level === "error") return severities.includes("error");
  throw new Error(locale === "zh-CN" ? `未知 --fail-on 级别“${level}”。可用 error、warning 或 never。` : `Unknown --fail-on level “${level}”. Use error, warning or never.`);
}
function collect(value: string, previous: string[]): string[] { return [...previous, value]; }
function parseInteger(value: string): number { const parsed = Number.parseInt(value, 10); if (!Number.isFinite(parsed) || parsed < 0) throw new Error("--max-warnings must be a non-negative integer."); return parsed; }
function mergeCliRules(config: AgentLintConfig, values: string[], locale: Locale): AgentLintConfig { const rules = { ...(config.rules ?? {}) }; for (const value of values) { const separator = value.lastIndexOf("="); if (separator <= 0) throw new Error(locale === "zh-CN" ? `无效 --rule“${value}”，请使用 rule-id=error|warning|info|off。` : `Invalid --rule “${value}”.`); const ruleId = value.slice(0, separator); const severity = value.slice(separator + 1) as FindingSeverity | "off"; if (!["error", "warning", "info", "off"].includes(severity)) throw new Error(`Invalid severity “${severity}” for ${ruleId}.`); rules[ruleId] = severity; } return { ...config, rules, locale }; }
async function loadPlugins(modules: string[]): Promise<AgentLintPlugin[]> { const plugins: AgentLintPlugin[] = []; for (const modulePath of modules) { const resolved = modulePath.startsWith(".") || modulePath.startsWith("/") ? pathToFileURL(path.resolve(modulePath)).href : modulePath; const imported = await import(resolved) as { default?: AgentLintPlugin; plugin?: AgentLintPlugin }; const plugin = imported.default ?? imported.plugin; if (!plugin?.name || typeof plugin.analyze !== "function") throw new Error(`Invalid AgentLint plugin: ${modulePath}`); plugins.push(plugin); } return plugins; }
async function applySafeFixes(root: string, report: AnalysisReport): Promise<number> { const edits = report.findings.flatMap((finding) => finding.fix?.safe ? finding.fix.edits : []); const grouped = new Map<string, TextEdit[]>(); for (const edit of edits) { const existing = grouped.get(edit.file) ?? []; if (!existing.some((item) => item.line === edit.line && item.replacement === edit.replacement)) existing.push(edit); grouped.set(edit.file, existing); } let applied = 0; for (const [relativeFile, fileEdits] of grouped) { const absoluteFile = path.resolve(root, relativeFile); if (!absoluteFile.startsWith(`${path.resolve(root)}${path.sep}`) && absoluteFile !== path.resolve(root)) continue; const content = await readFile(absoluteFile, "utf8"); const newline = content.includes("\r\n") ? "\r\n" : "\n"; const lines = content.split(/\r?\n/); for (const edit of [...fileEdits].sort((a, b) => b.line - a.line)) { if (edit.line < 1 || edit.line > lines.length || lines[edit.line - 1] === edit.replacement) continue; lines[edit.line - 1] = edit.replacement; applied += 1; } await writeFile(absoluteFile, lines.join(newline), "utf8"); } return applied; }
async function writeGitHubMetadata(report: AnalysisReport, locale: Locale): Promise<void> { if (process.env.GITHUB_STEP_SUMMARY) await writeFile(process.env.GITHUB_STEP_SUMMARY, renderMarkdownReport(report, locale), { encoding: "utf8", flag: "a" }); if (process.env.GITHUB_OUTPUT) await writeFile(process.env.GITHUB_OUTPUT, [`score=${report.score}`, `grade=${report.grade}`, `errors=${report.summary.errors}`, `warnings=${report.summary.warnings}`, `suggestions=${report.summary.suggestions}`, `fixable=${report.summary.fixable}`].join("\n") + "\n", { encoding: "utf8", flag: "a" }); }
async function upsertPullRequestComment(report: AnalysisReport, diffMarkdown: string, locale: Locale) { const token = process.env.GITHUB_TOKEN; const repository = process.env.GITHUB_REPOSITORY; const eventPath = process.env.GITHUB_EVENT_PATH; if (!token || !repository || !eventPath) throw new Error(locale === "zh-CN" ? "PR 评论需要 GITHUB_TOKEN、GITHUB_REPOSITORY 和 GITHUB_EVENT_PATH。" : "PR comments require GITHUB_TOKEN, GITHUB_REPOSITORY and GITHUB_EVENT_PATH."); const event = JSON.parse(await readFile(eventPath, "utf8")) as { pull_request?: { number?: number } }; const number = event.pull_request?.number; if (!number) return; const marker = "<!-- agentlint-report -->"; const body = `${marker}\n${renderMarkdownReport(report, locale)}${diffMarkdown ? `\n${diffMarkdown}` : ""}`.slice(0, 60_000); const headers = { accept: "application/vnd.github+json", authorization: `Bearer ${token}`, "content-type": "application/json", "user-agent": "agentlint-action/0.4", "x-github-api-version": "2022-11-28" }; const list = await fetch(`https://api.github.com/repos/${repository}/issues/${number}/comments?per_page=100`, { headers }); if (!list.ok) throw new Error(`GitHub comments API returned ${list.status}`); const comments = await list.json() as Array<{ id: number; body?: string }>; const existing = comments.find((comment) => comment.body?.includes(marker)); const url = existing ? `https://api.github.com/repos/${repository}/issues/comments/${existing.id}` : `https://api.github.com/repos/${repository}/issues/${number}/comments`; const response = await fetch(url, { method: existing ? "PATCH" : "POST", headers, body: JSON.stringify({ body }) }); if (!response.ok) throw new Error(`GitHub comment write returned ${response.status}`); }
async function createIfMissing(filePath: string, content: string, force: boolean): Promise<string[]> { if (!force) { try { await access(filePath); return []; } catch {} } await writeFile(filePath, content, "utf8"); return [filePath]; }
function starterConfig(locale: Locale) { return `${JSON.stringify({ $schema: "https://raw.githubusercontent.com/valseeee/agentlint/main/docs/agentlint.schema.json", locale, maxInstructionTokens: 4000, duplicateSimilarity: 0.88, ignore: ["fixtures/**"], rules: { "security/*": "error", "efficiency/near-duplicate-instruction": "info" } }, null, 2)}\n`; }
function starterAgents(locale: Locale) { return locale === "zh-CN" ? `# 仓库指令\n\n## 安装\n\n- 使用仓库锁文件指定的包管理器安装依赖。\n\n## 验证\n\n- 提交修改前运行仓库的 lint、测试和构建命令。\n- 优先运行最小相关测试；修改共享或高风险代码后再运行完整测试。\n\n## 协作约定\n\n- 保持修改聚焦，并遵循现有架构与命名规范。\n- 未经明确确认，不得泄露密钥、修改生产数据、改写远程 Git 历史或执行破坏性操作。\n- 行为或公共 API 发生变化时更新文档。\n` : `# Repository instructions\n\n## Setup\n\n- Install dependencies with the package manager indicated by the repository lockfile.\n\n## Validation\n\n- Run the repository's lint, test and build commands before submitting changes.\n- Prefer the smallest relevant test first, then run the full suite for shared or high-risk code.\n\n## Working agreements\n\n- Keep changes focused and follow the existing architecture and naming conventions.\n- Never expose secrets, modify production data, rewrite remote Git history or perform destructive operations without explicit confirmation.\n- Update documentation when behavior or public APIs change.\n`; }
