import { dirname } from "./path.js";
import type { AgentFileKind, Locale, RepositoryFile } from "./types.js";

export const normalizeRepositoryPath = (inputPath: string) =>
  inputPath.replaceAll("\\", "/").replace(/^\.\//, "").replace(/\/{2,}/g, "/");

export function detectInstructionKind(inputPath: string): AgentFileKind | null {
  const filePath = normalizeRepositoryPath(inputPath);

  if (/(^|\/)AGENTS\.md$/i.test(filePath)) return "agents";
  if (/(^|\/)\.claude\/rules\/.+\.md$/i.test(filePath)) return "claude-rule";
  if (/(^|\/)(?:\.claude\/)?CLAUDE(?:\.local)?\.md$/i.test(filePath)) return "claude";
  if (/(^|\/)GEMINI\.md$/i.test(filePath)) return "gemini";
  if (/(^|\/)\.cursorrules$/i.test(filePath)) return "cursor";
  if (/(^|\/)\.cursor\/rules\/.+\.(?:md|mdc)$/i.test(filePath)) return "cursor";
  if (/(^|\/)\.github\/copilot-instructions\.md$/i.test(filePath)) return "copilot";
  if (/(^|\/)\.github\/instructions\/.+\.instructions\.md$/i.test(filePath)) return "copilot";
  if (/(^|\/)\.github\/agents\/.+\.md$/i.test(filePath)) return "copilot-agent";
  if (/(^|\/)\.clinerules(?:\/.*\.md)?$/i.test(filePath)) return "cline";
  if (/(^|\/)\.windsurfrules$/i.test(filePath)) return "windsurf";
  if (/(^|\/)\.windsurf\/rules\/.+\.md$/i.test(filePath)) return "windsurf";

  return null;
}

export function instructionLabel(kind: AgentFileKind, locale: Locale = "en-US"): string {
  const labels: Record<AgentFileKind, [string, string]> = {
    agents: ["AGENTS.md", "AGENTS.md"],
    claude: ["Claude Code", "Claude Code"],
    "claude-rule": ["Claude scoped rule", "Claude 作用域规则"],
    gemini: ["Gemini CLI", "Gemini CLI"],
    cursor: ["Cursor Rules", "Cursor 规则"],
    copilot: ["GitHub Copilot", "GitHub Copilot"],
    "copilot-agent": ["Copilot custom agent", "Copilot 自定义助手"],
    cline: ["Cline", "Cline"],
    windsurf: ["Windsurf", "Windsurf"],
    unknown: ["Unknown", "未知"],
  };
  return labels[kind][locale === "zh-CN" ? 1 : 0];
}

export function instructionScope(inputPath: string, locale: Locale = "en-US"): string {
  const filePath = normalizeRepositoryPath(inputPath);
  const kind = detectInstructionKind(filePath);
  const directory = dirname(filePath);
  const zh = locale === "zh-CN";

  if (kind === "agents" || kind === "claude" || kind === "gemini") {
    return directory === "." ? (zh ? "整个仓库" : "repository") : `${directory}/**`;
  }
  if (kind === "claude-rule") return zh ? "frontmatter 路径或整个仓库" : "frontmatter paths or repository";
  if (kind === "cursor") return zh ? "规则元数据定义" : "rule metadata";
  if (kind === "copilot") return filePath.includes("/.github/instructions/") || filePath.startsWith(".github/instructions/")
    ? (zh ? "applyTo 匹配范围" : "applyTo glob")
    : (zh ? "整个仓库" : "repository");
  if (kind === "copilot-agent") return zh ? "自定义 Agent" : "custom agent";
  return directory === "." ? (zh ? "整个仓库" : "repository") : `${directory}/**`;
}

export function isInstructionFile(inputPath: string): boolean {
  return detectInstructionKind(inputPath) !== null;
}

export function isConfigurationFile(inputPath: string): boolean {
  const filePath = normalizeRepositoryPath(inputPath);
  return /(^|\/)\.agentlint\.json$/i.test(filePath);
}

export function shouldReadRepositoryFile(inputPath: string): boolean {
  const filePath = normalizeRepositoryPath(inputPath);
  return (
    isInstructionFile(filePath) ||
    isConfigurationFile(filePath) ||
    /(^|\/)package\.json$/i.test(filePath) ||
    /(^|\/)(?:pnpm-lock\.yaml|package-lock\.json|npm-shrinkwrap\.json|yarn\.lock|bun\.lockb?|uv\.lock|pyproject\.toml|Cargo\.toml|go\.mod|Makefile|Justfile|Taskfile\.ya?ml)$/i.test(filePath)
  );
}

export function sortRepositoryFiles(files: RepositoryFile[]): RepositoryFile[] {
  return [...files].sort((a, b) => normalizeRepositoryPath(a.path).localeCompare(normalizeRepositoryPath(b.path)));
}
