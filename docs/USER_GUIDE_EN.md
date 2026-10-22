# AgentLint user guide

AgentLint validates AI coding-agent instruction files against the real repository. The built-in analyzer is deterministic, repeatable and does not require a model API.

## Start locally

```bash
npm ci
npm run preview
```

Open `http://localhost:3000`.

Use the issue demo without a network connection, or choose Local ZIP / folder for unlimited browser-side analysis. Public GitHub repositories are downloaded as source archives first. A token is optional for public repositories and should only be used in trusted self-hosted deployments for private repositories or API fallback.

## CLI

```bash
node packages/cli/dist/index.cjs check . --lang en-US
node packages/cli/dist/index.cjs doctor . --network
node packages/cli/dist/index.cjs rules
node packages/cli/dist/index.cjs explain security/force-push
node packages/cli/dist/index.cjs check . --fix
```

## Report categories

- Coverage
- Consistency
- Validity
- Security
- Context efficiency

Always read the evidence and suggestion behind a score. Safe fixes are deliberately limited to deterministic edits.

## Privacy

Local ZIP/folder analysis stays in the browser. Remote source is processed in memory and is not persisted. Plugins execute as local code, so only load trusted plugins.
