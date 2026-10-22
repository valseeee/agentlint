"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@agentlint/core/browser";
import Analyzer from "./Analyzer";

const COPY = {
  "zh-CN": {
    navFeatures: "能力", navFormats: "格式", navGuide: "使用教程", badge: "确定性 · 本地优先 · 开源",
    title1: "让 AI 编程规则，", title2: "真正可靠。",
    intro: "AgentLint 是面向 AI 编程助手指令文件的静态分析器。它检查冲突、失效命令、错误作用域、安全风险和上下文浪费，不需要模型接口。",
    why: "为什么选择 AgentLint", sectionTitle: "不是又一个规则生成器。", sectionCopy: "生成规则很容易，持续保证规则仍然正确才是难点。",
    features: [
      ["真实仓库验证", "交叉检查 package.json、锁文件、Makefile、路径和规则作用域，而不是只分析文字表面。"],
      ["安全策略扫描", "识别强推、危险删除、跳过校验、关闭 TLS、泄露密钥和生产数据写入，同时理解“禁止执行”的否定语义。"],
      ["上下文预算", "估算上下文令牌数，检查精确重复与近似重复，帮助把始终加载的说明拆成更小的作用域规则。"],
      ["本地无限分析", "拖入 ZIP 或选择整个项目文件夹，所有内容都留在浏览器中，不受 GitHub 接口次数限制。"],
      ["合并请求与基线差异", "命令行工具和 GitHub 自动化检查可以比较基线报告，只在合并请求中突出新增问题和已解决问题。"],
      ["编辑器与插件", "附带 VS Code 扩展和可选插件接口，可接入团队自己的语义检查器。"],
    ],
    oneEngine: "一个引擎，覆盖所有编程助手", formatsTitle: "覆盖主流规则生态", formatsCopy: "同一份分析核心同时服务网页、命令行工具、GitHub 自动化检查和 VS Code 扩展。",
    footer: "MIT 开源许可证 · 本地分析不会上传文件；远程公开仓库优先使用源码归档，不消耗普通接口额度。",
  },
  "en-US": {
    navFeatures: "Features", navFormats: "Formats", navGuide: "Guide", badge: "Deterministic · Local-first · Open source",
    title1: "Make AI coding rules", title2: "actually reliable.",
    intro: "AgentLint is a static analyzer for AI coding-agent instruction files. It checks conflicts, stale commands, incorrect scopes, security risks and context waste without requiring a model API.",
    why: "Why AgentLint", sectionTitle: "Not another rule generator.", sectionCopy: "Generating rules is easy. Keeping them correct as a repository evolves is the hard part.",
    features: [
      ["Repository-grounded validation", "Cross-check package.json, lockfiles, Makefile targets, paths and rule scopes instead of only reading prose."],
      ["Safety policy scanning", "Detect force pushes, destructive deletion, skipped validation, disabled TLS, secret exposure and production writes while understanding explicit prohibitions."],
      ["Context budget", "Estimate tokens and find exact or near duplicates so always-loaded guidance can be split into smaller scoped rules."],
      ["Unlimited local analysis", "Drop a ZIP or select a project folder. Everything stays in the browser and GitHub API quota is not involved."],
      ["PR and baseline diffs", "The CLI and GitHub Action can compare a baseline report and highlight only new and resolved findings in pull requests."],
      ["Editor and plugin ready", "Includes a VS Code extension package and an optional plugin API for organization-specific semantic checks."],
    ],
    oneEngine: "One engine, every agent", formatsTitle: "The mainstream rule ecosystem", formatsCopy: "One analysis core powers the web app, CLI, GitHub Action and VS Code extension.",
    footer: "MIT License · Local analysis never uploads files; public remote repositories use source archives first and avoid REST API quota.",
  },
} as const;

export default function Home() {
  const [locale, setLocale] = useState<Locale>("zh-CN");
  const c = COPY[locale];
  useEffect(() => {
    const saved = localStorage.getItem("agentlint:locale") as Locale | null;
    if (saved === "zh-CN" || saved === "en-US") setLocale(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = locale === "zh-CN" ? "AgentLint — AI 编程规则体检" : "AgentLint — AI coding rules health check";
    const description = locale === "zh-CN"
      ? "检查 AI 编程助手规则中的冲突、失效命令、安全风险和上下文浪费。"
      : "Check AI coding-agent rules for conflicts, stale commands, security risks and context waste.";
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    localStorage.setItem("agentlint:locale", locale);
  }, [locale]);

  return <main>
    <header className="site-header shell"><a className="brand" href="#top" aria-label={locale === "zh-CN" ? "AgentLint 首页" : "AgentLint home"}><span className="brand-mark">A</span><span>AgentLint</span><em>v0.4.0</em></a><nav><a href="#features">{c.navFeatures}</a><a href="#formats">{c.navFormats}</a><a href="/guide">{c.navGuide}</a><div className="language-switch" aria-label={locale === "zh-CN" ? "语言" : "Language"}><button className={locale === "zh-CN" ? "active" : ""} onClick={() => setLocale("zh-CN")}>中文</button><button className={locale === "en-US" ? "active" : ""} onClick={() => setLocale("en-US")}>EN</button></div><a className="github-link" href="https://github.com/valseeee/agentlint" target="_blank" rel="noreferrer">{locale === "zh-CN" ? "项目仓库 ↗" : "GitHub ↗"}</a></nav></header>

    <section id="top" className="hero shell"><div className="hero-badge"><span /> {c.badge}</div><h1>{c.title1}<br /><span>{c.title2}</span></h1><p className="hero-copy">{c.intro}</p><Analyzer locale={locale} /></section>

    <section id="features" className="section shell"><div className="section-heading"><span>{c.why}</span><h2>{c.sectionTitle}</h2><p>{c.sectionCopy}</p></div><div className="feature-grid">{c.features.map(([title, text], index) => <article key={title}><b>{String(index + 1).padStart(2, "0")}</b><h3>{title}</h3><p>{text}</p></article>)}</div></section>

    <section id="formats" className="formats-section shell"><div><span className="eyebrow">{c.oneEngine}</span><h2>{c.formatsTitle}</h2><p>{c.formatsCopy}</p></div><div className="format-cloud">{(locale === "zh-CN"
      ? ["AGENTS.md", "CLAUDE.md", ".claude/rules", "GEMINI.md", ".cursor/rules", "Copilot 指令", "Copilot 自定义助手", "Cline 规则", "Windsurf 规则"]
      : ["AGENTS.md", "CLAUDE.md", ".claude/rules", "GEMINI.md", ".cursor/rules", "Copilot instructions", "Copilot agents", "Cline rules", "Windsurf rules"]
    ).map((name) => <span key={name}>{name}</span>)}</div></section>

    <footer className="shell footer"><div className="brand"><span className="brand-mark">A</span><span>AgentLint</span></div><p>{c.footer}</p></footer>
  </main>;
}
