import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import JSZip from "jszip";

const root = process.cwd();
const releaseDir = path.join(root, "release");
const version = JSON.parse(await readFile(path.join(root, "package.json"), "utf8")).version;
await rm(releaseDir, { recursive: true, force: true });
await mkdir(releaseDir, { recursive: true });

const excludeDirs = new Set([".git", "node_modules", ".next", "release", ".turbo", "coverage"]);
const excludeFiles = new Set(["apps/web/.env.local"]);
const zip = new JSZip();
async function addDirectory(directory) {
  for (const name of await readdir(directory)) {
    if (excludeDirs.has(name)) continue;
    const absolute = path.join(directory, name);
    const relative = path.relative(root, absolute).replaceAll("\\", "/");
    if (excludeFiles.has(relative)) continue;
    const info = await stat(absolute);
    if (info.isDirectory()) await addDirectory(absolute);
    else zip.file(`AgentLint-v${version}/${relative}`, await readFile(absolute));
  }
}
await addDirectory(root);
const sourceName = `AgentLint-v${version}-source.zip`;
await writeFile(path.join(releaseDir, sourceName), await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 9 } }));

const cliSource = path.join(root, "packages/cli/dist/index.cjs");
const cliName = `agentlint-cli-v${version}.cjs`;
await copyFile(cliSource, path.join(releaseDir, cliName));

const vscodeDirectory = path.join(root, "apps/vscode");
const vscodeFiles = (await readdir(vscodeDirectory)).filter((name) => name.endsWith(".vsix")).sort();
if (!vscodeFiles.length) throw new Error("No VSIX found. Run npm run package -w agentlint-vscode first.");
const vscodeName = `agentlint-vscode-v${version}.vsix`;
await copyFile(path.join(vscodeDirectory, vscodeFiles.at(-1)), path.join(releaseDir, vscodeName));

const packDir = path.join(releaseDir, "npm");
await mkdir(packDir, { recursive: true });
const { execFileSync } = await import("node:child_process");
execFileSync(process.platform === "win32" ? "npm.cmd" : "npm", ["pack", "-w", "@agentlint/core", "--pack-destination", packDir], { stdio: "inherit" });
execFileSync(process.platform === "win32" ? "npm.cmd" : "npm", ["pack", "-w", "agentlint", "--pack-destination", packDir], { stdio: "inherit" });

const files = [];
async function collect(directory) {
  for (const name of await readdir(directory)) {
    const full = path.join(directory, name);
    const info = await stat(full);
    if (info.isDirectory()) await collect(full);
    else files.push(full);
  }
}
await collect(releaseDir);
const lines = [];
for (const full of files.sort()) {
  if (path.basename(full) === "SHA256SUMS.txt") continue;
  const digest = createHash("sha256").update(await readFile(full)).digest("hex");
  lines.push(`${digest}  ${path.relative(releaseDir, full).replaceAll("\\", "/")}`);
}
await writeFile(path.join(releaseDir, "SHA256SUMS.txt"), `${lines.join("\n")}\n`, "utf8");
console.log(`Release bundle created in ${releaseDir}`);
for (const line of lines) console.log(`  ${line.split("  ")[1]}`);
