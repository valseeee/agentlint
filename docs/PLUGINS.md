# AgentLint plugins

AgentLint v0.3 adds an optional asynchronous plugin layer. The deterministic built-in analyzer always runs first; plugins can append organization-specific findings.

```js
export default {
  name: "team-policy",
  version: "1.0.0",
  async analyze({ files, report, locale }) {
    return [];
  }
};
```

Run it with:

```bash
agentlint check . --plugin ./plugins/team-policy.mjs
```

A plugin receives virtual repository files, the completed base report and the selected locale. It returns ordinary AgentLint findings. Prefixes are automatically normalized to `plugin/<name>/...`.

## 中文说明

插件用于补充团队自己的规则或可选语义分析。内置确定性检查始终先运行，因此即使插件或模型服务不可用，AgentLint 的基础检查仍然可用。
