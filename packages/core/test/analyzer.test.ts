import { describe, expect, it } from "vitest";
import { analyzeRepository, compareReports, getRuleCatalog, getRuleDetails, renderMarkdownReport, renderSarifReport } from "../src/index.js";

const brokenFiles = [
  { path: "package.json", content: JSON.stringify({ scripts: { build: "tsc", test: "vitest" } }) },
  { path: "pnpm-lock.yaml", content: "lockfileVersion: '9.0'" },
  {
    path: "AGENTS.md",
    content: [
      "# Instructions",
      "Use TypeScript for all new source files.",
      "Run `npm run lint` before committing.",
      "Read `docs/architecture.md` before changing the core.",
      "You may run `git push --force` without asking for confirmation.",
    ].join("\n"),
  },
  { path: "CLAUDE.md", content: "# Claude\nUse TypeScript for all new source files.\nUse pnpm for dependencies." },
  { path: "src/index.ts", content: "" },
];

describe("analyzeRepository", () => {
  it("finds deterministic instruction problems", () => {
    const report = analyzeRepository(brokenFiles, { repositoryName: "demo" });
    expect(report.repositoryName).toBe("demo");
    expect(report.summary.instructionFiles).toBe(2);
    expect(report.summary.duplicateInstructions).toBeGreaterThan(0);
    expect(report.findings.some((finding) => finding.ruleId === "validity/missing-script")).toBe(true);
    expect(report.findings.some((finding) => finding.ruleId === "validity/missing-path")).toBe(true);
    expect(report.findings.some((finding) => finding.ruleId === "security/force-push")).toBe(true);
    expect(report.findings.some((finding) => finding.ruleId === "consistency/package-manager")).toBe(true);
    expect(report.summary.fixable).toBe(1);
    expect(report.score).toBeLessThan(90);
  });

  it("returns a perfect score for a small consistent repository", () => {
    const report = analyzeRepository([
      { path: "package.json", content: JSON.stringify({ scripts: { test: "vitest", build: "tsc", lint: "eslint ." } }) },
      { path: "package-lock.json", content: "{}" },
      { path: "AGENTS.md", content: "Run `npm run test`, `npm run build`, and `npm run lint` before submitting changes." },
    ]);
    expect(report.findings).toHaveLength(0);
    expect(report.score).toBe(100);
  });

  it("does not report commands that are explicitly prohibited", () => {
    const report = analyzeRepository([
      { path: "AGENTS.md", content: "Never run `git push --force`. Do not use `rm -rf /` under any circumstances." },
    ]);
    expect(report.findings.some((finding) => finding.ruleId === "security/force-push")).toBe(false);
    expect(report.findings.some((finding) => finding.ruleId === "security/destructive-shell")).toBe(false);
  });

  it("does not confuse package names or generated output with repository paths", () => {
    const report = analyzeRepository([
      {
        path: "AGENTS.md",
        content: [
          "Preserve the `@agentlint/core/browser` package export.",
          "Keep `packages/cli/dist/` generated during release builds.",
        ].join("\n"),
      },
    ]);
    expect(report.findings.some((finding) => finding.ruleId === "validity/missing-path")).toBe(false);
  });

  it("validates tool-specific frontmatter", () => {
    const report = analyzeRepository([
      { path: ".github/instructions/api.instructions.md", content: "Use validation for API inputs." },
      { path: ".github/agents/reviewer.md", content: "---\nname: reviewer\n---\nReview pull requests." },
      { path: ".cursor/rules/frontend.mdc", content: "---\nalwaysApply: sometimes\n---\nUse React." },
    ]);
    expect(report.findings.some((finding) => finding.ruleId === "validity/copilot-apply-to")).toBe(true);
    expect(report.findings.some((finding) => finding.ruleId === "validity/copilot-agent-description")).toBe(true);
    expect(report.findings.some((finding) => finding.ruleId === "validity/cursor-always-apply")).toBe(true);
  });

  it("supports config overrides and inline suppression", () => {
    const report = analyzeRepository([
      {
        path: ".agentlint.json",
        content: JSON.stringify({ rules: { "security/*": "off", "validity/missing-script": "info" } }),
      },
      { path: "package.json", content: JSON.stringify({ scripts: { test: "vitest" } }) },
      { path: "package-lock.json", content: "{}" },
      {
        path: "AGENTS.md",
        content: [
          "<!-- agentlint-disable-next-line validity/missing-script -->",
          "Run `npm run lint`.",
          "You may run `git push --force` without confirmation.",
        ].join("\n"),
      },
    ]);
    expect(report.findings.some((finding) => finding.ruleId === "security/force-push")).toBe(false);
    expect(report.findings.some((finding) => finding.ruleId === "validity/missing-script")).toBe(false);
    expect(report.summary.suppressed).toBeGreaterThanOrEqual(2);
  });

  it("understands nearest package scope in monorepos", () => {
    const report = analyzeRepository([
      { path: "package.json", content: JSON.stringify({ scripts: { test: "vitest" } }) },
      { path: "package-lock.json", content: "{}" },
      { path: "packages/app/package.json", content: JSON.stringify({ scripts: { lint: "eslint ." } }) },
      { path: "packages/app/AGENTS.md", content: "Run `npm run test` before submitting." },
    ]);
    expect(report.findings.some((finding) => finding.ruleId === "validity/script-out-of-scope")).toBe(true);
    expect(report.findings.some((finding) => finding.ruleId === "validity/missing-script")).toBe(false);
  });

  it("finds near duplicates and direct contradictions", () => {
    const report = analyzeRepository([
      { path: ".agentlint.json", content: JSON.stringify({ duplicateSimilarity: 0.6 }) },
      { path: "AGENTS.md", content: "- Always use Prettier.\n- Always use explicit return types for exported TypeScript functions." },
      { path: "CLAUDE.md", content: "- Never use Prettier.\n- Use explicit return types for every exported TypeScript function." },
    ]);
    expect(report.findings.some((finding) => finding.ruleId === "consistency/contradictory-instructions")).toBe(true);
    expect(report.findings.some((finding) => finding.ruleId === "efficiency/near-duplicate-instruction")).toBe(true);
  });

  it("emits valid SARIF", () => {
    const report = analyzeRepository(brokenFiles, { generatedAt: "2026-06-14T00:00:00.000Z" });
    const sarif = JSON.parse(renderSarifReport(report)) as { version: string; runs: Array<{ results: unknown[] }> };
    expect(sarif.version).toBe("2.1.0");
    expect(sarif.runs[0]?.results.length).toBe(report.findings.length);
  });

  it("localizes findings, grades and Markdown reports", () => {
    const report = analyzeRepository(brokenFiles, { repositoryName: "demo", locale: "zh-CN" });
    expect(report.locale).toBe("zh-CN");
    expect(report.grade).not.toMatch(/Excellent|Good|Needs work|Critical/);
    expect(report.findings.find((finding) => finding.ruleId === "validity/missing-script")?.title).toContain("不存在");
    expect(renderMarkdownReport(report, "zh-CN")).toContain("问题清单");
    expect(renderMarkdownReport(report, "en-US")).toContain("Findings");
  });

  it("builds a scope graph for instruction files", () => {
    const report = analyzeRepository([
      { path: "AGENTS.md", content: "Keep changes focused." },
      { path: "packages/app/AGENTS.md", content: "Run tests for this package." },
    ], { locale: "en-US" });
    expect(report.scopeGraph.nodes).toHaveLength(2);
    expect(report.scopeGraph.edges.some((edge) => edge.relation === "inherits")).toBe(true);
  });

  it("compares a current report against a baseline", () => {
    const baseline = analyzeRepository([{ path: "AGENTS.md", content: "Keep changes focused." }], { generatedAt: "2026-01-01T00:00:00.000Z" });
    const current = analyzeRepository(brokenFiles, { generatedAt: "2026-01-02T00:00:00.000Z" });
    const diff = compareReports(current, baseline);
    expect(diff.added.length).toBeGreaterThan(0);
    expect(diff.scoreDelta).toBeLessThan(0);
  });

  it("exposes a bilingual stable rule catalog", () => {
    const zh = getRuleCatalog("zh-CN");
    const en = getRuleCatalog("en-US");
    expect(zh.length).toBeGreaterThanOrEqual(38);
    expect(en).toHaveLength(zh.length);
    expect(getRuleDetails("security/force-push", "zh-CN")?.title).toContain("强制推送");
    expect(getRuleDetails("security/force-push", "en-US")?.title).toContain("force-push");
  });

  it("returns null for an unknown rule id", () => {
    expect(getRuleDetails("unknown/rule", "zh-CN")).toBeNull();
  });

});
