# AgentLint GitHub Action 教程

在目标仓库创建：

```text
.github/workflows/agentlint.yml
```

内容：

```yaml
name: AgentLint

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read
  pull-requests: write
  issues: write

jobs:
  lint-agent-instructions:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: valseeee/agentlint@v0
        env:
          GITHUB_TOKEN: ${{ github.token }}
        with:
          path: .
          language: zh-CN
          fail-on: error
          max-warnings: "10"
          pr-comment: "true"
          fix: "false"
```

## 输入参数

| 参数 | 默认值 | 说明 |
|---|---|---|
| `path` | `.` | 仓库内分析目录 |
| `language` | `en-US` | `zh-CN` 或 `en-US` |
| `fail-on` | `error` | `error`、`warning` 或 `never` |
| `max-warnings` | 空 | 最大警告数 |
| `config` | 空 | 额外配置文件 |
| `baseline` | 空 | 基线 JSON |
| `pr-comment` | `false` | 创建或更新 PR 评论 |
| `fix` | `false` | 在工作区应用安全修复，不会自动提交 |

## 输出

- `score`
- `grade`
- `errors`
- `warnings`
- `fixable`

## 权限说明

仅检查不评论时只需要：

```yaml
permissions:
  contents: read
```

启用 PR 评论时还需要：

```yaml
pull-requests: write
issues: write
```

`${{ github.token }}` 是 GitHub Actions 自动生成的短期令牌，不需要把个人 Token 保存成 Secret。
