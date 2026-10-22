import { dirname, extname, joinPath, normalizePath } from "./path.js";
import type { InstructionLine, RepositoryFile } from "./types.js";

export interface ParsedFrontmatter {
  hasFrontmatter: boolean;
  closed: boolean;
  data: Record<string, string | string[]>;
  bodyStartLine: number;
}

export function estimateTokens(text: string): number {
  if (!text) return 0;
  const withoutComments = text.replace(/<!--[^]*?-->/g, "");
  const latin = (withoutComments.match(/[\u0000-\u00ff]/g) ?? []).length;
  const nonLatin = withoutComments.length - latin;
  return Math.ceil(latin / 4 + nonLatin / 1.8);
}

export function normalizeInstruction(text: string): string {
  return text
    .toLowerCase()
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[[^\]]+\]\([^\)]+\)/g, "")
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseFrontmatter(content: string): ParsedFrontmatter {
  const lines = content.split(/\r?\n/);
  if (lines[0]?.trim() !== "---") {
    return { hasFrontmatter: false, closed: true, data: {}, bodyStartLine: 1 };
  }

  const end = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (end < 0) return { hasFrontmatter: true, closed: false, data: {}, bodyStartLine: lines.length + 1 };

  const data: Record<string, string | string[]> = {};
  let arrayKey: string | null = null;
  for (const raw of lines.slice(1, end)) {
    const arrayItem = raw.match(/^\s*-\s+["']?(.+?)["']?\s*$/);
    if (arrayItem?.[1] && arrayKey) {
      const values = Array.isArray(data[arrayKey]) ? data[arrayKey] as string[] : [];
      values.push(arrayItem[1]);
      data[arrayKey] = values;
      continue;
    }
    const property = raw.match(/^\s*([\w-]+)\s*:\s*(.*?)\s*$/);
    if (!property?.[1]) continue;
    const key = property[1];
    const value = (property[2] ?? "").replace(/^['"]|['"]$/g, "");
    if (!value) {
      data[key] = [];
      arrayKey = key;
    } else {
      data[key] = value;
      arrayKey = null;
    }
  }

  return { hasFrontmatter: true, closed: true, data, bodyStartLine: end + 2 };
}

export function extractInstructionLines(file: RepositoryFile): InstructionLine[] {
  const originalLines = file.content.split(/\r?\n/);
  const frontmatter = parseFrontmatter(file.content);
  const output: InstructionLine[] = [];
  let inCodeFence = false;
  let inHtmlComment = false;

  originalLines.forEach((raw, index) => {
    const lineNumber = index + 1;
    if (frontmatter.hasFrontmatter && lineNumber < frontmatter.bodyStartLine) return;

    const trimmed = raw.trim();
    if (inHtmlComment) {
      if (trimmed.includes("-->")) inHtmlComment = false;
      return;
    }
    if (trimmed.includes("<!--")) {
      if (!trimmed.includes("-->")) inHtmlComment = true;
      return;
    }

    if (/^```|^~~~/.test(trimmed)) {
      inCodeFence = !inCodeFence;
      return;
    }
    if (!trimmed || /^#{1,6}\s+/.test(trimmed)) return;

    const cleaned = inCodeFence
      ? trimmed
      : trimmed
          .replace(/^[-*+]\s+/, "")
          .replace(/^\d+[.)]\s+/, "")
          .replace(/^>\s*/, "")
          .trim();
    const normalized = normalizeInstruction(cleaned);
    if (normalized.length < 4) return;

    output.push({
      file: file.path,
      line: lineNumber,
      text: cleaned,
      raw,
      normalized,
      inCodeFence,
    });
  });

  return output;
}

export function repositoryPathExists(allPaths: Set<string>, reference: string, fromFile: string): boolean {
  let candidate = reference.trim().replace(/[),.;:]+$/, "").replace(/^['"`]|['"`]$/g, "");
  if (!candidate || /^(?:https?:|mailto:|#|~\/|\/)/i.test(candidate)) return true;
  if (/[!*?{}[\]]/.test(candidate)) return true;

  candidate = candidate.split("#", 1)[0] ?? candidate;
  candidate = candidate.replace(/^@/, "").replace(/^\.\//, "");
  const fromDir = dirname(fromFile);
  const rawCandidates = [candidate, joinPath(fromDir, candidate)];
  const candidates = new Set<string>();
  for (const value of rawCandidates) {
    const normalized = normalizePath(value).replace(/^(?:\.\.\/)+/, "");
    candidates.add(normalized);
    if (!extname(normalized)) candidates.add(`${normalized}.md`);
  }

  for (const value of candidates) {
    if (allPaths.has(value)) return true;
    const prefix = value.replace(/\/$/, "") + "/";
    for (const existing of allPaths) {
      if (existing.startsWith(prefix)) return true;
    }
  }
  return false;
}

export function extractPathReferences(text: string): string[] {
  const found = new Set<string>();
  for (const match of text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    if (match[1]) found.add(match[1]);
  }
  for (const match of text.matchAll(/`([^`]+)`/g)) {
    const value = match[1]?.trim();
    if (value && looksLikeRepositoryPath(value)) found.add(value);
  }
  for (const match of text.matchAll(/(?:^|\s)(@[\w@./{}*?-]+)/g)) {
    const raw = match[1];
    const value = raw?.slice(1);
    const isImportPath = value && (/^\.{1,2}\//.test(value) || /\.(?:md|json|ya?ml|toml)$/i.test(value));
    if (raw && value && isImportPath && looksLikeRepositoryPath(value)) found.add(raw);
  }
  for (const match of text.matchAll(/(?:^|\s)((?:\.\.?\/)?(?:[\w@.-]+\/)+[\w@.{}*?-]+\/?)/g)) {
    const value = match[1]?.trim();
    if (value && looksLikeRepositoryPath(value)) found.add(value);
  }
  return [...found].slice(0, 20);
}

export function jaccardSimilarity(left: string, right: string): number {
  const a = new Set(normalizeInstruction(left).split(" ").filter((token) => token.length > 2));
  const b = new Set(normalizeInstruction(right).split(" ").filter((token) => token.length > 2));
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection += 1;
  return intersection / (a.size + b.size - intersection);
}

function looksLikeRepositoryPath(value: string): boolean {
  if (/\s/.test(value) || /^(?:https?:|git@|[\w-]+@\d)/i.test(value)) return false;
  if (/^@[A-Za-z0-9_.-]+\//.test(value)) return false;
  if (/(?:^|\/)(?:node_modules|dist|coverage|\.next|\.turbo|vendor|target)(?:\/|$)/i.test(value)) return false;
  if (/^(?:npm|pnpm|yarn|bun|git|node|npx|python|pytest|make|cargo|go)\b/i.test(value)) return false;
  return value.includes("/") || /^(?:README|AGENTS|CLAUDE|GEMINI)$/i.test(value) || /\.(?:md|json|ya?ml|toml|ts|tsx|js|jsx|py|go|rs|java|css|scss|html)$/i.test(value);
}
