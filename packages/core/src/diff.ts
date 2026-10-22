import type { AnalysisReport, ReportDiff } from "./types.js";

export function compareReports(current: AnalysisReport, baseline: AnalysisReport): ReportDiff {
  const currentById = new Map(current.findings.map((finding) => [finding.id, finding]));
  const baselineById = new Map(baseline.findings.map((finding) => [finding.id, finding]));
  return {
    scoreDelta: current.score - baseline.score,
    added: current.findings.filter((finding) => !baselineById.has(finding.id)),
    resolved: baseline.findings.filter((finding) => !currentById.has(finding.id)),
    unchanged: current.findings.filter((finding) => baselineById.has(finding.id)),
  };
}
