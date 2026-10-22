/**
 * Example AgentLint plugin.
 * Run with:
 *   node packages/cli/dist/index.cjs check . --plugin ./plugins/example-team-policy.mjs
 */
export default {
  name: "example-team-policy",
  version: "1.0.0",
  async analyze({ files, locale }) {
    const hasContributing = files.some((file) => file.path.toLowerCase() === "contributing.md");
    if (hasContributing) return [];
    return [{
      id: "plugin/example-team-policy/missing-contributing",
      ruleId: "plugin/example-team-policy/missing-contributing",
      severity: "info",
      category: "coverage",
      title: locale === "zh-CN" ? "缺少贡献指南" : "Contribution guide is missing",
      message: locale === "zh-CN" ? "团队策略建议仓库提供 CONTRIBUTING.md。" : "This team policy recommends a CONTRIBUTING.md file.",
      suggestion: locale === "zh-CN" ? "添加安装、测试、提交和 Pull Request 说明。" : "Document setup, testing, commits and pull requests.",
    }];
  },
};
