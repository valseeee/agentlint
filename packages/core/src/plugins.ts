import { analyzeRepository } from "./analyzer.js";
import type { AgentLintPlugin, AnalysisReport, AnalyzeOptions, Finding, RepositoryFile } from "./types.js";

export async function analyzeRepositoryWithPlugins(
  files: RepositoryFile[],
  options: AnalyzeOptions = {},
  plugins: AgentLintPlugin[] = [],
): Promise<AnalysisReport> {
  let report = analyzeRepository(files, options);
  if (!plugins.length) return report;

  const pluginFindings: Finding[] = [];
  for (const plugin of plugins) {
    const findings = await plugin.analyze({ files, report, locale: report.locale });
    for (const finding of findings) {
      pluginFindings.push({
        ...finding,
        id: finding.id || `plugin/${plugin.name}/${finding.ruleId}/${pluginFindings.length}`,
        ruleId: finding.ruleId.startsWith("plugin/") ? finding.ruleId : `plugin/${plugin.name}/${finding.ruleId}`,
      });
    }
  }

  if (!pluginFindings.length) return report;
  const findings = [...report.findings, ...pluginFindings];
  const errors = findings.filter((finding) => finding.severity === "error").length;
  const warnings = findings.filter((finding) => finding.severity === "warning").length;
  const suggestions = findings.filter((finding) => finding.severity === "info").length;
  const penalty = pluginFindings.reduce((sum, finding) => sum + (finding.severity === "error" ? 8 : finding.severity === "warning" ? 4 : 1), 0);
  const score = Math.max(0, report.score - penalty);
  const gradeKey = score >= 90 ? "excellent" : score >= 75 ? "good" : score >= 50 ? "needs-work" : "critical";
  const grade = report.locale === "zh-CN"
    ? ({ excellent: "优秀", good: "良好", "needs-work": "需要改进", critical: "问题严重" } as const)[gradeKey]
    : ({ excellent: "Excellent", good: "Good", "needs-work": "Needs work", critical: "Critical" } as const)[gradeKey];

  report = {
    ...report,
    score,
    gradeKey,
    grade,
    findings,
    summary: { ...report.summary, errors, warnings, suggestions },
  };
  return report;
}
