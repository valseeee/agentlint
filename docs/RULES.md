# AgentLint rules

规则 ID 是稳定的公开接口，可以在 `.agentlint.json`、`--rule` 和 HTML 抑制注释中使用。

## Coverage

| Rule ID | Default | Description |
|---|---|---|
| `coverage/no-instruction-files` | warning | 没有发现任何受支持的 Agent 规则文件 |
| `coverage/empty-instruction-file` | warning | 规则文件没有可用指令 |
| `coverage/no-test-guidance` | info | 仓库有测试脚本，但规则没有测试说明 |
| `coverage/no-build-guidance` | info | 仓库有构建或类型检查脚本，但规则没有说明 |
| `coverage/no-lint-guidance` | info | 仓库有 lint/format 脚本，但规则没有说明 |
| `coverage/cursor-legacy-format` | info | 使用旧版 `.cursorrules` |
| `coverage/windsurf-legacy-format` | info | 使用旧版 `.windsurfrules` |
| `coverage/cursor-activation` | warning | Cursor 规则没有清晰激活方式 |

## Consistency

| Rule ID | Default | Description |
|---|---|---|
| `consistency/multiple-package-managers` | warning | 同一目录作用域出现多个包管理器声明 |
| `consistency/package-manager` | warning | 指令使用的包管理器与最近的锁文件或 `packageManager` 不同 |
| `consistency/contradictory-instructions` | warning | 常见工具或风格存在直接相反的要求 |

## Validity

| Rule ID | Default | Description |
|---|---|---|
| `validity/config-invalid` | error | `.agentlint.json` 无法解析或选项无效 |
| `validity/frontmatter-unclosed` | error | YAML frontmatter 没有关闭 |
| `validity/cursor-frontmatter` | warning | Cursor MDC 缺少 frontmatter |
| `validity/cursor-always-apply` | error | Cursor `alwaysApply` 不是布尔值 |
| `validity/copilot-apply-to` | error | Copilot path-specific instruction 缺少 `applyTo` |
| `validity/copilot-agent-description` | error | Copilot custom agent 缺少 `description` |
| `validity/missing-script` | error | 指令引用不存在的 package script |
| `validity/script-out-of-scope` | warning | script 存在，但不在最近的 package 作用域 |
| `validity/missing-task-target` | error | Makefile/Justfile target 不存在 |
| `validity/missing-path` | warning | 指令引用不存在的仓库路径 |

## Security

| Rule ID | Default | Description |
|---|---|---|
| `security/force-push` | error | 无条件 `git push --force` |
| `security/force-with-lease` | warning | `--force-with-lease` 未要求确认 |
| `security/destructive-shell` | error | 广泛的递归删除命令 |
| `security/pipe-to-shell` | error | 将远程下载内容直接 pipe 给 shell |
| `security/hard-reset` | warning | `git reset --hard` 可能丢失工作 |
| `security/no-verify` | warning | 绕过 Git 或发布 hooks |
| `security/chmod-777` | warning | 创建 world-writable 权限 |
| `security/tls-disabled` | warning | 关闭 TLS 证书校验 |
| `security/broad-sudo` | warning | 允许宽泛的提权操作 |
| `security/no-confirmation` | warning | 要求 Agent 不询问用户确认 |
| `security/production-data` | error | 允许修改生产数据 |
| `security/secret-exposure` | error | 允许输出、提交或上传密钥 |
| `security/skip-validation` | warning | 明确跳过测试、lint 或类型检查 |

安全规则会识别常见否定表达。例如 “Never run `git push --force`” 不会触发 `security/force-push`。

## Efficiency

| Rule ID | Default | Description |
|---|---|---|
| `efficiency/file-too-large` | warning | 单个规则文件超过配置的 Token 预算 |
| `efficiency/claude-line-count` | info | CLAUDE.md 超过 200 行 |
| `efficiency/duplicate-instruction` | warning | 多个规则文件中出现完全相同的指令 |
| `efficiency/near-duplicate-instruction` | info | 多个规则文件中出现高度相似的指令 |

## Severity overrides

```json
{
  "rules": {
    "security/*": "error",
    "security/force-with-lease": "off",
    "efficiency/near-duplicate-instruction": "warning"
  }
}
```

优先级：精确规则 ID > 类别通配符 > `*` > 默认级别。
