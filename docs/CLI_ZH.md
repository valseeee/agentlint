# AgentLint CLI 中文手册

## 基本分析

```powershell
node packages/cli/dist/index.cjs check . --lang zh-CN
```

发布 npm 包后：

```powershell
npx agentlint@latest check . --lang zh-CN
```

## 命令

### check

```powershell
agentlint check [目录]
```

常用参数：

| 参数 | 作用 |
|---|---|
| `--lang zh-CN` | 中文输出 |
| `--format pretty` | 终端彩色文本 |
| `--format markdown` | Markdown 报告 |
| `--format json` | JSON 报告 |
| `--format sarif` | SARIF 2.1.0 |
| `--format github` | GitHub annotations |
| `--output 文件` | 写入文件 |
| `--fail-on error` | 有错误时退出码为 1 |
| `--fail-on warning` | 有错误或警告时退出码为 1 |
| `--fail-on never` | 永不因问题退出失败 |
| `--max-warnings 数量` | 警告超过阈值时失败 |
| `--fix` | 应用确定性安全修复 |
| `--config 文件` | 合并额外配置 |
| `--rule 规则=级别` | 临时覆盖规则级别 |
| `--plugin 模块` | 加载可信插件 |
| `--baseline 文件` | 与旧报告比较 |
| `--save-baseline 文件` | 保存当前基线 |
| `--diff-output 文件` | 保存差异 Markdown |
| `--pr-comment` | 在 GitHub Action 中更新 PR 评论 |

### doctor

检查 Node.js、目录读取、Token 配置和可选 GitHub 网络：

```powershell
agentlint doctor . --network --lang zh-CN
```

### rules

```powershell
agentlint rules --lang zh-CN
agentlint rules security --lang zh-CN
agentlint rules --json
```

### explain

```powershell
agentlint explain security/force-push --lang zh-CN
```

### init

```powershell
agentlint init . --lang zh-CN
```

创建 `.agentlint.json` 和安全的 `AGENTS.md` 模板。

## 退出码

- `0`：成功，并且没有达到失败阈值；
- `1`：分析成功，但发现达到阈值的问题；
- `2`：运行失败，例如配置、文件或插件错误。

## 基线示例

```powershell
agentlint check . --format json --save-baseline .agentlint-baseline.json --fail-on never
agentlint check . --baseline .agentlint-baseline.json --diff-output agentlint-diff.md
```
