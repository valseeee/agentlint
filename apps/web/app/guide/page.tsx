"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@agentlint/core/browser";

const COPY = {
  "zh-CN": {
    title: "AgentLint 使用教程",
    intro: "从本地体验到 GitHub 发布的完整操作路线。所有分析默认使用确定性静态规则，不需要模型接口。",
    back: "← 返回首页",
    sections: [
      ["1. 最快体验", ["回到首页并点击“查看问题示例”，无需联网。", "选择“本地 ZIP / 文件夹”可以不限次数分析自己的项目。", "输入公开 GitHub 仓库地址可以下载源码归档后分析。"]],
      ["2. 本地 ZIP / 文件夹", ["ZIP：点击“选择 ZIP”或把压缩包拖入页面。", "文件夹：点击“选择文件夹”，浏览器会在本地读取所需配置。", "本地文件不会上传；修复功能生成新的 ZIP，不覆盖原项目。"]],
      ["3. GitHub 访问令牌", ["公开仓库通常不需要令牌。", "自托管分析私有仓库、网络回退或接口额度不足时，在 apps/web/.env.local 中配置 GITHUB_TOKEN。", "令牌只需要读取权限，不要授予写入权限，也不要提交 .env.local。"]],
      ["4. 命令行工具", ["构建后运行：node packages/cli/dist/index.cjs check . --lang zh-CN", "环境检查：node packages/cli/dist/index.cjs doctor . --network --lang zh-CN", "查看规则：node packages/cli/dist/index.cjs rules --lang zh-CN", "安全修复：node packages/cli/dist/index.cjs check . --fix --lang zh-CN"]],
      ["5. VS Code 扩展", ["在扩展页面右上角菜单选择“从 VSIX 安装”。", "安装 release/agentlint-vscode-v0.4.0.vsix。", "按 Ctrl+Shift+P，运行“AgentLint：分析工作区”。", "还可以查看报告、导出 Markdown 或应用确定性安全修复。"]],
      ["6. 发布前检查", ["运行 npm ci、npm test、npm run lint、npm run build。", "运行 npm run release:check，确认版本、锁文件和产物。", "确认 .env.local、访问令牌、node_modules 和构建缓存没有提交。"]],
    ],
    docs: "更完整的教程位于仓库 docs/ 目录：用户手册、令牌配置、GitHub 发布、VS Code 扩展、部署、命令行、GitHub Action 和常见问题。",
  },
  "en-US": {
    title: "AgentLint user guide",
    intro: "A practical path from local evaluation to a GitHub release. The built-in analyzer is deterministic and does not require a model API.",
    back: "← Back home",
    sections: [
      ["1. Fastest evaluation", ["Open the issue demo from the home page; no network is required.", "Use Local ZIP / folder for unlimited analysis of your own projects.", "Enter a public GitHub repository to download and analyze its source archive."]],
      ["2. Local ZIP / folder", ["Choose or drop a ZIP archive.", "Choose a folder to read the required configuration in the browser.", "Local files are not uploaded; fixes create a new ZIP instead of overwriting the source."]],
      ["3. GitHub access token", ["Public repositories usually need no token.", "For self-hosted private-repository access, fallback or API quota, set GITHUB_TOKEN in apps/web/.env.local.", "Use read-only access and never commit .env.local."]],
      ["4. CLI", ["Analyze: node packages/cli/dist/index.cjs check . --lang en-US", "Doctor: node packages/cli/dist/index.cjs doctor . --network", "Rules: node packages/cli/dist/index.cjs rules", "Safe fixes: node packages/cli/dist/index.cjs check . --fix"]],
      ["5. VS Code extension", ["Choose Install from VSIX in the Extensions view.", "Install release/agentlint-vscode-v0.4.0.vsix.", "Run AgentLint: Analyze Workspace from the Command Palette.", "Show, export or safely fix findings from the extension commands."]],
      ["6. Pre-release checks", ["Run npm ci, npm test, npm run lint and npm run build.", "Run npm run release:check to validate versions, lockfile and artifacts.", "Never commit .env.local, tokens, node_modules or build caches."]],
    ],
    docs: "The repository docs/ directory contains the complete user guide, token setup, GitHub publishing, VS Code extension, deployment, CLI, GitHub Action and FAQ documentation.",
  },
} as const;

export default function GuidePage() {
  const [locale, setLocale] = useState<Locale>("zh-CN");
  useEffect(() => {
    const value = localStorage.getItem("agentlint:locale");
    if (value === "zh-CN" || value === "en-US") setLocale(value);
  }, []);
  const c = COPY[locale];
  return <main className="guide-page shell">
    <div className="guide-top"><a href="/">{c.back}</a><div className="language-switch"><button className={locale === "zh-CN" ? "active" : ""} onClick={() => { setLocale("zh-CN"); localStorage.setItem("agentlint:locale", "zh-CN"); }}>中文</button><button className={locale === "en-US" ? "active" : ""} onClick={() => { setLocale("en-US"); localStorage.setItem("agentlint:locale", "en-US"); }}>EN</button></div></div>
    <header className="guide-hero"><span>AgentLint v0.4.0</span><h1>{c.title}</h1><p>{c.intro}</p></header>
    <div className="guide-grid">{c.sections.map(([title, items]) => <section key={title}><h2>{title}</h2><ol>{items.map((item) => <li key={item}>{item}</li>)}</ol></section>)}</div>
    <aside className="guide-note">{c.docs}</aside>
  </main>;
}
