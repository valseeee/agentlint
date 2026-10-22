import { readFile } from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import { shouldReadRepositoryFile } from "./discovery.js";
import type { AgentLintConfig, RepositoryFile } from "./types.js";

const ignored = [
  "**/.git/**",
  "**/node_modules/**",
  "**/.next/**",
  "**/dist/**",
  "**/coverage/**",
  "**/.turbo/**",
  "**/vendor/**",
  "**/.venv/**",
  "**/target/**",
];

export async function scanLocalRepository(rootDirectory: string, additionalIgnores: string[] = []): Promise<RepositoryFile[]> {
  const absoluteRoot = path.resolve(rootDirectory);
  const projectIgnores = await readIgnoreFiles(absoluteRoot);
  const paths = await fg("**/*", {
    cwd: absoluteRoot,
    onlyFiles: true,
    dot: true,
    unique: true,
    followSymbolicLinks: false,
    ignore: [...ignored, ...projectIgnores, ...additionalIgnores],
  });

  return Promise.all(
    paths.map(async (relativePath): Promise<RepositoryFile> => {
      const normalized = relativePath.replaceAll("\\", "/");
      if (!shouldReadRepositoryFile(normalized)) return { path: normalized, content: "" };
      try {
        const content = await readFile(path.join(absoluteRoot, relativePath), "utf8");
        return { path: normalized, content, size: Buffer.byteLength(content) };
      } catch {
        return { path: normalized, content: "" };
      }
    }),
  );
}

export async function readConfigFile(filePath: string): Promise<AgentLintConfig> {
  const content = await readFile(path.resolve(filePath), "utf8");
  return JSON.parse(content) as AgentLintConfig;
}

async function readIgnoreFiles(rootDirectory: string): Promise<string[]> {
  const patterns = new Set<string>();
  for (const filename of [".agentlintignore"]) {
    try {
      const content = await readFile(path.join(rootDirectory, filename), "utf8");
      for (const line of content.split(/\r?\n/)) {
        const value = line.trim();
        if (value && !value.startsWith("#")) patterns.add(value);
      }
    } catch {
      // Optional ignore file.
    }
  }

  try {
    const config = JSON.parse(await readFile(path.join(rootDirectory, ".agentlint.json"), "utf8")) as AgentLintConfig;
    for (const value of config.ignore ?? []) if (value.trim()) patterns.add(value.trim());
  } catch {
    // Invalid config is reported by the analyzer; scanning continues.
  }
  return [...patterns];
}
