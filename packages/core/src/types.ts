export type Locale = "zh-CN" | "en-US";

export type AgentFileKind =
  | "agents"
  | "claude"
  | "claude-rule"
  | "gemini"
  | "cursor"
  | "copilot"
  | "copilot-agent"
  | "cline"
  | "windsurf"
  | "unknown";

export type FindingSeverity = "error" | "warning" | "info";
export type RuleSetting = FindingSeverity | "off";

export type FindingCategory =
  | "coverage"
  | "consistency"
  | "validity"
  | "security"
  | "efficiency";

export interface RepositoryFile {
  path: string;
  content: string;
  size?: number;
}

export interface InstructionLine {
  file: string;
  line: number;
  text: string;
  raw: string;
  normalized: string;
  inCodeFence: boolean;
}

export interface InstructionFile {
  path: string;
  kind: AgentFileKind;
  label: string;
  estimatedTokens: number;
  instructionCount: number;
  lineCount: number;
  scope: string;
}

export interface TextEdit {
  file: string;
  line: number;
  replacement: string;
}

export interface LocalizedFindingText {
  title: string;
  message: string;
  suggestion?: string;
}

export interface FindingFix {
  description: string;
  safe: boolean;
  edits: TextEdit[];
  translations?: Record<Locale, string>;
}

export interface Finding {
  id: string;
  ruleId: string;
  severity: FindingSeverity;
  category: FindingCategory;
  title: string;
  message: string;
  file?: string;
  line?: number;
  evidence?: string;
  suggestion?: string;
  fix?: FindingFix;
  docs?: string;
  translations?: Record<Locale, LocalizedFindingText>;
}

export interface ScoreMetrics {
  coverage: number;
  consistency: number;
  validity: number;
  security: number;
  efficiency: number;
}

export interface AnalysisSummary {
  filesScanned: number;
  instructionFiles: number;
  instructions: number;
  errors: number;
  warnings: number;
  suggestions: number;
  estimatedTokens: number;
  duplicateInstructions: number;
  avoidableTokens: number;
  fixable: number;
  suppressed: number;
}

export interface AgentLintConfig {
  $schema?: string;
  ignore?: string[];
  rules?: Record<string, RuleSetting>;
  maxInstructionTokens?: number;
  duplicateSimilarity?: number;
  locale?: Locale;
}

export type GradeKey = "excellent" | "good" | "needs-work" | "critical";

export interface ScopeGraphNode {
  id: string;
  path: string;
  label: string;
  scope: string;
  kind: AgentFileKind;
  tokens: number;
}

export interface ScopeGraphEdge {
  from: string;
  to: string;
  relation: "inherits" | "overlaps" | "tool-variant";
}

export interface ScopeGraph {
  nodes: ScopeGraphNode[];
  edges: ScopeGraphEdge[];
}

export interface AnalysisReport {
  schemaVersion: "1.2";
  generatedAt: string;
  repositoryName?: string;
  locale: Locale;
  score: number;
  gradeKey: GradeKey;
  grade: string;
  metrics: ScoreMetrics;
  summary: AnalysisSummary;
  instructionFiles: InstructionFile[];
  scopeGraph: ScopeGraph;
  findings: Finding[];
  config: Required<Pick<AgentLintConfig, "maxInstructionTokens" | "duplicateSimilarity">>;
}

export interface AnalyzeOptions {
  repositoryName?: string;
  config?: AgentLintConfig;
  generatedAt?: string;
  locale?: Locale;
}

export interface ReportDiff {
  scoreDelta: number;
  added: Finding[];
  resolved: Finding[];
  unchanged: Finding[];
}

export interface PluginContext {
  files: RepositoryFile[];
  report: AnalysisReport;
  locale: Locale;
}

export interface AgentLintPlugin {
  name: string;
  version?: string;
  analyze(context: PluginContext): Promise<Finding[]> | Finding[];
}
