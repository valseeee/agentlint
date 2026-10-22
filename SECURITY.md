# Security policy

## Reporting a vulnerability

请不要在公开 Issue 中披露可被利用的漏洞、令牌泄露或私有仓库内容。请通过 GitHub Security Advisories 的私密报告功能联系维护者，并提供：

- 受影响版本；
- 最小复现；
- 实际与预期行为；
- 可能的影响；
- 已知缓解方案。

维护者会确认报告、评估严重程度，并在修复可用后协调公开披露。

## Trust model

- 本地 CLI 只读取所分析的目录，并且不会上传文件；
- Web 版本只支持公开 GitHub 仓库，内容在请求内存中处理；
- `GITHUB_TOKEN` 仅用于服务端 GitHub API 请求，不应返回给客户端或写入日志；
- `--fix` 只应用标记为 `safe` 的确定性行级编辑；
- AgentLint 的安全 Finding 是静态启发式检查，不构成完整安全审计。
