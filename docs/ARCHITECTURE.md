# AgentLint architecture

## Core principle

The built-in analyzer is deterministic, repository-grounded and model-free. All entry points convert their input into the same virtual file structure:

```ts
interface RepositoryFile {
  path: string;
  content: string;
  size?: number;
}
```

Pipeline:

```text
virtual repository files
        ↓
path normalization and instruction discovery
        ↓
frontmatter and instruction extraction
        ↓
repository facts: scripts, lockfiles, task targets and paths
        ↓
deterministic coverage, consistency, validity, security and efficiency rules
        ↓
configuration overrides and inline suppression
        ↓
score, findings, scope graph and output renderers
```

## Packages

### `@agentlint/core`

Pure analysis, localization, rule catalog, diffing, configuration and renderers. `@agentlint/core/browser` excludes filesystem-only code for web and VS Code bundles.

### `agentlint` CLI

Local scanning, safe text edits, exit codes, SARIF, GitHub annotations, Job Summary, baseline comparison, PR comments, plugins and helper commands (`doctor`, `rules`, `explain`, `init`). The bundled `packages/cli/dist/index.cjs` is committed because the composite GitHub Action executes it directly.

### `@agentlint/web`

- Local ZIP/folder analysis happens in the browser.
- Public repositories are fetched as source archives by a server route.
- An optional server-side token enables trusted self-hosted private-repository access or API fallback.
- Reports are cached in process memory for a short period; source is not persisted.

### `agentlint-vscode`

Enumerates the workspace, runs the browser-safe core, publishes diagnostics, displays and exports reports, and applies only fixes explicitly marked safe.

## Finding identity

Each finding has a stable `ruleId`, location-sensitive `id`, severity, category, evidence, suggestion, localization and optional safe `TextEdit`.

## Scoring

Five sub-scores cover coverage, consistency, validity, security and efficiency. The score is a communication aid, not a substitute for reviewing individual evidence.

## Plugin boundary

Plugins run after the built-in analyzer and may append findings. They execute as local code and must be trusted. Built-in checks remain available when plugins or external semantic services are unavailable.
