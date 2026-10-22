# AgentLint 开发者指南

## 安装与验证

```bash
npm ci
npm test
npm run lint
npm run build
npm run check
npm run release:check
```

## 工作区

- `packages/core`：纯分析核心；
- `packages/cli`：命令行、GitHub annotations、PR 评论；
- `apps/web`：Next.js 网页；
- `apps/vscode`：VS Code 扩展；
- `plugins`：插件示例；
- `scripts`：发布检查和打包。

## 新增规则要求

1. 稳定、可读的 `category/name` ID；
2. 基于仓库事实的确定性结果；
3. 中英文标题、说明和建议；
4. 明确证据、文件和行号；
5. 正常场景、问题场景、否定语义和抑制测试；
6. 只在修复绝对明确时提供 `safe: true`；
7. 更新 `docs/RULES.md` 与规则目录。

## 插件

```bash
agentlint check . --plugin ./plugins/example-team-policy.mjs
```

插件是本机可执行代码，只加载可信来源。
