# Contributing to AgentLint

Thanks for helping improve AgentLint.

## Development

```bash
npm install
npm run lint
npm test
npm run build
npm run check
npm run dev
```

Node.js 20.11 or newer is required.

## Adding a lint rule

1. Add a deterministic check in `packages/core/src/analyzer.ts`, or split a larger rule family into a focused module.
2. Assign a stable public rule ID such as `validity/missing-script`.
3. Return a category, default severity, evidence, source location and actionable suggestion.
4. Mark a fix as `safe` only when it cannot change the author's intent.
5. Add a focused fixture and regression test in `packages/core/test`.
6. Update `docs/RULES.md` and the changelog.
7. Run the full validation sequence above.

## False positives

AgentLint favors deterministic, explainable checks. New heuristics should:

- recognize common negation and safety wording;
- respect file scope and the nearest package boundary;
- avoid requiring a model or network connection;
- provide an opt-out through `.agentlint.json`, `--rule`, or an inline suppression comment.

Include before-and-after examples in the pull request when a rule changes matching behavior.

## Pull requests

Keep each pull request focused. Explain compatibility considerations, false-positive trade-offs and any changes to report schema or stable rule IDs. Do not commit `.next`, coverage output or local environment files. The bundled `packages/cli/dist/index.cjs` is the exception because the composite GitHub Action needs it at runtime.
