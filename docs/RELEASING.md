# Releasing AgentLint

## Automated local preparation

```bash
npm ci
npm run release:bundle
```

This runs tests, type checks, production builds, AgentLint self-analysis, VS Code packaging, version/secret/registry validation, npm packing and SHA-256 generation.

Generated assets are written to `release/`:

- `AgentLint-v0.4.0-source.zip`
- `agentlint-cli-v0.4.0.cjs`
- `agentlint-vscode-v0.4.0.vsix`
- npm tarballs
- `SHA256SUMS.txt`

## GitHub release

1. Update all package versions and `CHANGELOG.md`.
2. Run `npm run release:bundle` from a clean checkout.
3. Commit the standalone CLI bundle required by the composite Action.
4. Create and push an annotated tag such as `v0.4.0`.
5. Publish a GitHub Release. The release workflow rebuilds and uploads every file under `release/`.
6. After validation, move the stable major Action tag (`v0`) to the release commit.

## npm and VS Code Marketplace

The manual workflows require protected environments and secrets:

- npm: `NPM_TOKEN`
- VS Code Marketplace: `VSCE_PAT`

Never put either token in source code or workflow YAML.
