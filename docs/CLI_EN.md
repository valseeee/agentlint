# AgentLint CLI

```bash
agentlint check . --lang en-US
agentlint doctor . --network
agentlint rules
agentlint explain security/force-push
agentlint init .
```

Outputs: `pretty`, `markdown`, `json`, `sarif`, `github`.

Exit codes: `0` success, `1` configured finding threshold reached, `2` execution failure.
