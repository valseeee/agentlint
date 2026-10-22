import { access, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const manifests = [
  "package.json",
  "packages/core/package.json",
  "packages/cli/package.json",
  "apps/web/package.json",
  "apps/vscode/package.json",
];
const required = [
  "README.md",
  "README.en.md",
  "ROADMAP.md",
  "docs/USER_GUIDE_ZH.md",
  "docs/GITHUB_TOKEN_SETUP_ZH.md",
  "docs/GITHUB_PUBLISH_ZH.md",
  "docs/VSCODE_EXTENSION_ZH.md",
  "docs/CLI_ZH.md",
  "docs/GITHUB_ACTION_ZH.md",
  "docs/DEPLOYMENT_ZH.md",
  "docs/FAQ_ZH.md",
  "packages/cli/dist/index.cjs",
  "packages/core/dist/index.js",
  "apps/vscode/dist/extension.js",
];

const errors = [];
const versions = new Map();
for (const relative of manifests) {
  const data = JSON.parse(await readFile(path.join(root, relative), "utf8"));
  versions.set(relative, data.version);
}
const uniqueVersions = new Set(versions.values());
if (uniqueVersions.size !== 1) errors.push(`Version mismatch: ${JSON.stringify(Object.fromEntries(versions))}`);

for (const relative of required) {
  try { await access(path.join(root, relative)); }
  catch { errors.push(`Missing required file: ${relative}`); }
}

const lock = await readFile(path.join(root, "package-lock.json"), "utf8");
for (const forbidden of ["packages.applied-caas", "internal.api.openai.org", "artifactory/api/npm/npm-public"]) {
  if (lock.includes(forbidden)) errors.push(`package-lock.json contains forbidden internal registry text: ${forbidden}`);
}

const secretPatterns = [/github_pat_[A-Za-z0-9_]{20,}/g, /ghp_[A-Za-z0-9]{20,}/g];
const ignoredDirectories = new Set([".git", "node_modules", ".next", "release"]);
async function walk(directory) {
  for (const name of await readdir(directory)) {
    if (ignoredDirectories.has(name)) continue;
    const full = path.join(directory, name);
    const info = await stat(full);
    if (info.isDirectory()) await walk(full);
    else if (info.size <= 2_000_000 && !/\.(png|jpg|jpeg|gif|zip|vsix|tgz|ico)$/i.test(name)) {
      const text = await readFile(full, "utf8").catch(() => "");
      for (const pattern of secretPatterns) if (pattern.test(text)) errors.push(`Possible token in ${path.relative(root, full)}`);
    }
  }
}
await walk(root);

const version = [...uniqueVersions][0] ?? "unknown";
if (errors.length) {
  console.error(`AgentLint release check failed (${errors.length} problem${errors.length === 1 ? "" : "s"}):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}
console.log(`AgentLint v${version} release check passed.`);
console.log(`Verified ${required.length} required artifacts and ${manifests.length} synchronized manifests.`);
