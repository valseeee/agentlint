# AgentLint v0.4.0 — Release-ready toolchain

AgentLint v0.4.0 turns the project into a complete open-source release package for validating AI coding-agent instructions.

## Highlights

- Full Chinese and English web, CLI, reports, GitHub Action and VS Code experience.
- Local ZIP/folder analysis without uploads, tokens or GitHub API quota.
- Public GitHub source-archive analysis with optional authenticated fallback.
- Deterministic checks for stale scripts, paths, package managers, task targets, scope conflicts, unsafe operations and context waste.
- CLI `doctor`, `rules`, `explain`, `init`, baseline diff, SARIF and safe fixes.
- VS Code diagnostics, report export and deterministic safe fixes.
- PR comments, GitHub annotations and complete release workflows.
- Unified source ZIP, standalone CLI, VSIX, npm packages and SHA-256 checksums.
- Comprehensive Chinese and English user, development and publishing documentation.

## Privacy

Local analysis stays in the browser. The built-in analyzer does not call a model API. Remote source is processed in memory and is not persisted.

## Requirements

- Node.js 20.11+
- npm 10+
