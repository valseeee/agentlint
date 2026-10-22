# AgentLint VS Code extension

Install the `.vsix` from the Extensions view using **Install from VSIX**, or run:

```bash
code --install-extension release/agentlint-vscode-v0.4.0.vsix
```

Commands:

- AgentLint: Analyze Workspace
- AgentLint: Clear Diagnostics
- AgentLint: Show Report
- AgentLint: Export Markdown Report
- AgentLint: Apply Safe Fixes

Package the extension with:

```bash
npm run build:vscode
npm run package -w agentlint-vscode
```

Marketplace publishing documentation: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
