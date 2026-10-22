import type { AgentLintConfig, Finding, FindingSeverity, RepositoryFile, RuleSetting } from "./types.js";

export const defaultConfig = {
  maxInstructionTokens: 4000,
  duplicateSimilarity: 0.88,
} as const;

export function parseRepositoryConfig(files: RepositoryFile[]): {
  config: AgentLintConfig;
  findings: Finding[];
} {
  const candidates = files.filter((file) => /(^|\/)\.agentlint\.json$/i.test(file.path));
  const root = candidates.find((file) => file.path === ".agentlint.json") ?? candidates[0];
  if (!root?.content.trim()) return { config: {}, findings: [] };

  try {
    const parsed = JSON.parse(root.content) as AgentLintConfig;
    const findings: Finding[] = [];
    if (parsed.maxInstructionTokens !== undefined && (!Number.isFinite(parsed.maxInstructionTokens) || parsed.maxInstructionTokens < 200)) {
      findings.push(configFinding(root.path, "maxInstructionTokens must be a number of at least 200."));
    }
    if (parsed.duplicateSimilarity !== undefined && (parsed.duplicateSimilarity < 0.5 || parsed.duplicateSimilarity > 1)) {
      findings.push(configFinding(root.path, "duplicateSimilarity must be between 0.5 and 1."));
    }
    if (parsed.rules && typeof parsed.rules !== "object") {
      findings.push(configFinding(root.path, "rules must be an object mapping rule IDs to error, warning, info or off."));
    }
    if (parsed.locale !== undefined && !["zh-CN", "en-US"].includes(parsed.locale)) {
      findings.push(configFinding(root.path, "locale must be zh-CN or en-US."));
    }
    return { config: parsed, findings };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON";
    return { config: {}, findings: [configFinding(root.path, message)] };
  }
}

export function mergeConfig(repository: AgentLintConfig, override: AgentLintConfig | undefined): AgentLintConfig {
  return {
    ...repository,
    ...override,
    ignore: override?.ignore ?? repository.ignore,
    rules: { ...(repository.rules ?? {}), ...(override?.rules ?? {}) },
  };
}

export function resolveRuleSetting(config: AgentLintConfig, ruleId: string, fallback: FindingSeverity): RuleSetting {
  const exact = config.rules?.[ruleId];
  if (exact) return exact;
  const category = ruleId.split("/", 1)[0];
  return config.rules?.[`${category}/*`] ?? config.rules?.["*"] ?? fallback;
}

function configFinding(file: string, details: string): Finding {
  return {
    id: `validity/config-invalid/${hash(details)}`,
    ruleId: "validity/config-invalid",
    severity: "error",
    category: "validity",
    title: "Invalid AgentLint configuration",
    message: details,
    file,
    suggestion: "Fix .agentlint.json or remove the invalid option.",
    translations: {
      "en-US": {
        title: "Invalid AgentLint configuration",
        message: details,
        suggestion: "Fix .agentlint.json or remove the invalid option.",
      },
      "zh-CN": {
        title: "AgentLint 配置无效",
        message: translateDetails(details),
        suggestion: "修复 .agentlint.json，或删除无效配置项。",
      },
    },
  };
}

function hash(value: string): string {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return (result >>> 0).toString(36);
}

function translateDetails(details: string): string {
  if (details.includes("maxInstructionTokens")) return "maxInstructionTokens 必须是一个不小于 200 的数字。";
  if (details.includes("duplicateSimilarity")) return "duplicateSimilarity 必须位于 0.5 到 1 之间。";
  if (details.includes("rules must")) return "rules 必须是将规则 ID 映射到 error、warning、info 或 off 的对象。";
  if (details.includes("locale must")) return "locale 必须为 zh-CN 或 en-US。";
  return `配置 JSON 无效：${details}`;
}
