<div align="center">

# AgentLint

**Make AI coding rules actually reliable.**

Deterministic static analysis for `AGENTS.md`, `CLAUDE.md`, Cursor Rules, GitHub Copilot Instructions, Gemini, Cline and Windsurf instructions.

[中文](README.md) · [User guide](docs/USER_GUIDE_EN.md) · [Rule catalog](docs/RULES.md) · [Roadmap](ROADMAP.md)

</div>

## Why AgentLint

Instruction files drift as repositories evolve: scripts are renamed, paths disappear, package managers change, guidance is copied across tools, and unsafe commands become silently authorized. AgentLint validates existing rules against the real repository instead of generating more prose.

## Highlights

- Repository-grounded validation of scripts, lockfiles, task targets, paths and monorepo scopes.
- Safety checks for force pushes, destructive deletion, skipped validation, disabled TLS, secret exposure and production writes.
- Exact duplicates, near duplicates and common direct contradictions.
- Context budget and avoidable-token estimates.
- Full Chinese and English UI, CLI, reports, Action output and VS Code experience.
- Local-first ZIP/folder analysis without uploads, tokens or quotas.
- Web app, CLI, GitHub Action, PR comments, SARIF, baseline diffs, plugins and VS Code extension.

## Quick start

```bash
npm ci
npm run preview
```

Open `http://localhost:3000`.

```bash
node packages/cli/dist/index.cjs check . --lang en-US
node packages/cli/dist/index.cjs doctor . --network
node packages/cli/dist/index.cjs rules
```

## GitHub Action

```yaml
- uses: valseeee/agentlint@v0
  env:
    GITHUB_TOKEN: ${{ github.token }}
  with:
    language: en-US
    fail-on: error
    pr-comment: "true"
```

## Documentation

- [User guide](docs/USER_GUIDE_EN.md)
- [GitHub publishing](docs/GITHUB_PUBLISH_EN.md)
- [CLI reference](docs/CLI_EN.md)
- [VS Code extension](docs/VSCODE_EXTENSION_EN.md)
- [Chinese documentation index](docs/README_ZH.md)

## Privacy

Local ZIP/folder analysis stays in the browser. Remote repository source is processed in memory and is not persisted. The built-in analyzer does not call a model API. Only load plugins you trust.

## License

MIT
