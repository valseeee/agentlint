# AgentLint contributor instructions

## Development

- Use TypeScript for all production code.
- Install dependencies with `npm install`.
- Run `npm run lint`, `npm test` and `npm run build` before opening a pull request.
- Run `npm run check` after editing any Agent instruction file.

## Analyzer design

- Keep the core analyzer deterministic: model APIs must remain optional.
- Give every rule a stable ID, evidence, severity and actionable suggestion.
- Add a focused fixture and regression test for every new lint rule.
- Prefer conservative checks that avoid false positives over broad heuristic matches.

## Safety and compatibility

- Never log repository file contents, environment variables or access tokens.
- Do not perform network access from the core analyzer package.
- Preserve the browser-safe core export used by the web application.
- Keep the bundled CLI artifact updated because the composite GitHub Action executes it directly.
