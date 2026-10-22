import * as vscode from "vscode";
import {
  analyzeRepository,
  renderMarkdownReport,
  shouldReadRepositoryFile,
  type AnalysisReport,
  type Locale,
  type RepositoryFile,
  type TextEdit,
} from "@agentlint/core/browser";

const diagnostics = vscode.languages.createDiagnosticCollection("agentlint");
let status: vscode.StatusBarItem;
let output: vscode.OutputChannel;
let lastReport: AnalysisReport | null = null;
let lastFolder: vscode.WorkspaceFolder | null = null;

export function activate(context: vscode.ExtensionContext) {
  status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 80);
  output = vscode.window.createOutputChannel("AgentLint");
  status.command = "agentlint.analyze";
  status.text = "$(shield) AgentLint";
  status.tooltip = message("分析 AI 编程助手规则", "Analyze AI coding-agent instructions");
  status.show();

  context.subscriptions.push(diagnostics, status, output);
  context.subscriptions.push(vscode.commands.registerCommand("agentlint.analyze", () => analyzeWorkspace(true)));
  context.subscriptions.push(vscode.commands.registerCommand("agentlint.clear", clearDiagnostics));
  context.subscriptions.push(vscode.commands.registerCommand("agentlint.showReport", showReport));
  context.subscriptions.push(vscode.commands.registerCommand("agentlint.exportMarkdown", exportMarkdown));
  context.subscriptions.push(vscode.commands.registerCommand("agentlint.applySafeFixes", applySafeFixes));
  context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((document) => {
    if (!vscode.workspace.getConfiguration("agentlint").get<boolean>("analyzeOnSave", true)) return;
    if (shouldReadRepositoryFile(vscode.workspace.asRelativePath(document.uri))) void analyzeWorkspace(false);
  }));
}

export function deactivate() {
  diagnostics.dispose();
  status?.dispose();
  output?.dispose();
}

async function analyzeWorkspace(showNotification: boolean) {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) {
    void vscode.window.showWarningMessage(message("请先打开一个项目文件夹。", "Open a project folder first."));
    return null;
  }

  status.text = "$(sync~spin) AgentLint";
  status.tooltip = message("正在分析工作区…", "Analyzing workspace…");
  try {
    const maxFiles = vscode.workspace.getConfiguration("agentlint").get<number>("maxFiles", 50_000);
    const uris = await vscode.workspace.findFiles("**/*", "**/{node_modules,.git,.next,dist,build,coverage,vendor,.venv}/**", maxFiles);
    const files: RepositoryFile[] = [];
    for (const uri of uris) {
      const relative = vscode.workspace.asRelativePath(uri, false).replaceAll("\\", "/");
      let content = "";
      if (shouldReadRepositoryFile(relative)) {
        try {
          content = new TextDecoder().decode(await vscode.workspace.fs.readFile(uri));
        } catch {
          content = "";
        }
      }
      files.push({ path: relative, content });
    }

    const locale = resolveLocale();
    const report = analyzeRepository(files, { repositoryName: folder.name, locale });
    lastReport = report;
    lastFolder = folder;
    publishDiagnostics(report, folder);
    writeOutput(report, locale);

    status.text = `$(shield) AgentLint ${report.score}/100`;
    status.tooltip = locale === "zh-CN"
      ? `${report.summary.errors} 个错误，${report.summary.warnings} 个警告，${report.summary.fixable} 个可安全修复项`
      : `${report.summary.errors} errors, ${report.summary.warnings} warnings, ${report.summary.fixable} safe fixes`;

    if (showNotification) {
      const show = message("查看报告", "Show report");
      const fix = message("应用安全修复", "Apply safe fixes");
      const choice = await vscode.window.showInformationMessage(
        locale === "zh-CN"
          ? `AgentLint 完成：${report.score}/100，共发现 ${report.findings.length} 个问题。`
          : `AgentLint complete: ${report.score}/100 with ${report.findings.length} findings.`,
        show,
        ...(report.summary.fixable > 0 ? [fix] : []),
      );
      if (choice === show) showReport();
      if (choice === fix) await applySafeFixes();
    }
    return report;
  } catch (error) {
    status.text = "$(error) AgentLint";
    const details = error instanceof Error ? error.message : String(error);
    output.appendLine(details);
    void vscode.window.showErrorMessage(message(`AgentLint 分析失败：${details}`, `AgentLint failed: ${details}`));
    return null;
  }
}

function publishDiagnostics(report: AnalysisReport, folder: vscode.WorkspaceFolder) {
  diagnostics.clear();
  for (const finding of report.findings) {
    if (!finding.file) continue;
    const uri = vscode.Uri.joinPath(folder.uri, ...finding.file.split("/"));
    const line = Math.max(0, (finding.line ?? 1) - 1);
    const diagnostic = new vscode.Diagnostic(
      new vscode.Range(line, 0, line, 200),
      `${finding.title}: ${finding.message}${finding.suggestion ? `\n${message("建议", "Suggestion")}: ${finding.suggestion}` : ""}`,
      finding.severity === "error"
        ? vscode.DiagnosticSeverity.Error
        : finding.severity === "warning"
          ? vscode.DiagnosticSeverity.Warning
          : vscode.DiagnosticSeverity.Information,
    );
    diagnostic.source = "AgentLint";
    diagnostic.code = { value: finding.ruleId, target: vscode.Uri.parse("https://github.com/valseeee/agentlint/blob/main/docs/RULES.md") };
    diagnostics.set(uri, [...(diagnostics.get(uri) ?? []), diagnostic]);
  }
}

function writeOutput(report: AnalysisReport, locale: Locale) {
  output.clear();
  output.appendLine(renderMarkdownReport(report, locale));
}

function showReport() {
  if (!lastReport) {
    void vscode.window.showInformationMessage(message("还没有分析报告，请先运行“AgentLint：分析工作区”。", "No report yet. Run AgentLint: Analyze Workspace first."));
    return;
  }
  output.show(true);
}

async function exportMarkdown() {
  if (!lastReport) await analyzeWorkspace(false);
  if (!lastReport || !lastFolder) return;
  const locale = resolveLocale();
  const target = await vscode.window.showSaveDialog({
    defaultUri: vscode.Uri.joinPath(lastFolder.uri, "agentlint-report.md"),
    filters: { Markdown: ["md"] },
    saveLabel: message("保存报告", "Save report"),
  });
  if (!target) return;
  await vscode.workspace.fs.writeFile(target, new TextEncoder().encode(renderMarkdownReport(lastReport, locale)));
  void vscode.window.showInformationMessage(message(`报告已保存：${target.fsPath}`, `Report saved: ${target.fsPath}`));
}

async function applySafeFixes() {
  if (!lastReport) await analyzeWorkspace(false);
  if (!lastReport || !lastFolder) return;
  const edits = lastReport.findings.flatMap((finding) => finding.fix?.safe ? finding.fix.edits : []);
  if (!edits.length) {
    void vscode.window.showInformationMessage(message("没有可安全自动修复的问题。", "No safe automatic fixes are available."));
    return;
  }
  const answer = await vscode.window.showWarningMessage(
    message(`即将应用 ${edits.length} 个确定性安全修复。是否继续？`, `Apply ${edits.length} deterministic safe fixes?`),
    { modal: true },
    message("继续", "Continue"),
  );
  if (!answer) return;

  const workspaceEdit = new vscode.WorkspaceEdit();
  const grouped = new Map<string, TextEdit[]>();
  for (const edit of edits) {
    const list = grouped.get(edit.file) ?? [];
    if (!list.some((existing) => existing.line === edit.line && existing.replacement === edit.replacement)) list.push(edit);
    grouped.set(edit.file, list);
  }
  for (const [relative, fileEdits] of grouped) {
    const uri = vscode.Uri.joinPath(lastFolder.uri, ...relative.split("/"));
    let document: vscode.TextDocument;
    try {
      document = await vscode.workspace.openTextDocument(uri);
    } catch {
      continue;
    }
    for (const edit of fileEdits) {
      const lineIndex = edit.line - 1;
      if (lineIndex < 0 || lineIndex >= document.lineCount) continue;
      workspaceEdit.replace(uri, document.lineAt(lineIndex).range, edit.replacement);
    }
  }
  const applied = await vscode.workspace.applyEdit(workspaceEdit);
  if (!applied) {
    void vscode.window.showErrorMessage(message("无法应用安全修复。", "Could not apply safe fixes."));
    return;
  }
  await vscode.workspace.saveAll(false);
  void vscode.window.showInformationMessage(message("安全修复已应用，正在重新分析。", "Safe fixes applied. Re-analyzing."));
  await analyzeWorkspace(false);
}

function clearDiagnostics() {
  diagnostics.clear();
  lastReport = null;
  lastFolder = null;
  status.text = "$(shield) AgentLint";
  status.tooltip = message("分析 AI 编程助手规则", "Analyze AI coding-agent instructions");
  output.clear();
}

function resolveLocale(): Locale {
  const setting = vscode.workspace.getConfiguration("agentlint").get<string>("locale", "auto");
  if (setting === "zh-CN" || setting === "en-US") return setting;
  return vscode.env.language.toLowerCase().startsWith("zh") ? "zh-CN" : "en-US";
}

function message(zh: string, en: string): string {
  return resolveLocale() === "zh-CN" ? zh : en;
}
