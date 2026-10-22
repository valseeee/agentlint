<div align="center">

# AgentLint

**让 AI 编程规则真正可靠。**

对 `AGENTS.md`、`CLAUDE.md`、Cursor Rules、GitHub Copilot Instructions、Gemini、Cline 与 Windsurf 规则进行确定性静态分析。

[English](README.en.md) · [使用教程](docs/USER_GUIDE_ZH.md) · [规则目录](docs/RULES.md) · [路线图](ROADMAP.md)

</div>

## 为什么需要 AgentLint

AI 编程助手的规则会随着仓库演进而失效：脚本改名、路径删除、包管理器迁移、同一规则被复制到多个工具、危险命令被默认授权。AgentLint 不负责“生成更多规则”，而是持续验证现有规则是否仍然正确、安全、清晰且节省上下文。

## 核心能力

- **真实仓库交叉验证**：检查 `package.json`、锁文件、Makefile、Justfile、路径和 monorepo 作用域。
- **安全规则扫描**：识别强推、危险删除、跳过验证、关闭 TLS、泄露密钥和生产数据修改，并理解“禁止执行”的否定语义。
- **重复与冲突分析**：发现完全重复、近似重复和常见直接矛盾。
- **上下文预算**：估算规则令牌数、可减少令牌数和过大的始终加载文件。
- **全中文 / English**：网页、CLI、报告、GitHub Action 和 VS Code 扩展均支持中英文。
- **本地优先**：ZIP 与文件夹在浏览器本地分析，不上传、不需要 Token、不限次数。
- **完整工具链**：网页、CLI、GitHub Action、PR 评论、SARIF、基线差异、插件系统与 VS Code 扩展。

## 30 秒体验

### Windows 用户

1. 安装 Node.js 20.11 或更高版本。
2. 解压项目。
3. 双击 `start-agentlint.bat`。
4. 浏览器打开 `http://localhost:3000`。
5. 点击“查看问题示例”，或选择“本地 ZIP / 文件夹”。

### 命令行

```bash
npm ci
npm run preview
```

打开：`http://localhost:3000`

## CLI

```bash
# 分析当前仓库
node packages/cli/dist/index.cjs check . --lang zh-CN

# 检查环境和 GitHub 网络
node packages/cli/dist/index.cjs doctor . --network --lang zh-CN

# 查看全部规则
node packages/cli/dist/index.cjs rules --lang zh-CN

# 解释某条规则
node packages/cli/dist/index.cjs explain security/force-push --lang zh-CN

# 应用确定性安全修复
node packages/cli/dist/index.cjs check . --fix --lang zh-CN

# 输出 Markdown / JSON / SARIF
node packages/cli/dist/index.cjs check . --format markdown --output agentlint-report.md --lang zh-CN
node packages/cli/dist/index.cjs check . --format json --output agentlint-report.json --fail-on never
node packages/cli/dist/index.cjs check . --format sarif --output agentlint.sarif --fail-on never
```

发布 npm 包后，用户可使用：

```bash
npx agentlint@latest check . --lang zh-CN
```

## GitHub Action

```yaml
name: AgentLint
on: [pull_request]

permissions:
  contents: read
  pull-requests: write
  issues: write

jobs:
  agentlint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: valseeee/agentlint@v0
        env:
          GITHUB_TOKEN: ${{ github.token }}
        with:
          language: zh-CN
          fail-on: error
          pr-comment: "true"
```

## VS Code 扩展

发布前可从 Release 资产或本项目 `release/` 目录下载 `.vsix`：

1. VS Code → 扩展。
2. 右上角 `...` → “从 VSIX 安装”。
3. 选择 `agentlint-vscode-v0.4.0.vsix`。
4. `Ctrl+Shift+P` → “AgentLint：分析工作区”。

扩展还支持查看报告、导出 Markdown、保存时自动分析和应用确定性安全修复。

## GitHub Token

- **本地 ZIP / 文件夹**：完全不需要 Token。
- **公开 GitHub 仓库**：通常不需要 Token，优先下载公开源码归档。
- **自托管私有仓库、接口回退或额度不足**：可以配置免费的只读 Token。

详细步骤见：[GitHub 访问令牌配置教程](docs/GITHUB_TOKEN_SETUP_ZH.md)。

> 不要把 Token 写进源码、截图、Issue 或提交记录。`.env.local` 已在 `.gitignore` 中忽略。

## 文档

| 文档 | 用途 |
|---|---|
| [完整用户手册](docs/USER_GUIDE_ZH.md) | 网页、本地分析、报告、修复与隐私 |
| [GitHub Token 教程](docs/GITHUB_TOKEN_SETUP_ZH.md) | 创建最小权限令牌并安全配置 |
| [GitHub 发布教程](docs/GITHUB_PUBLISH_ZH.md) | 从本地源码到仓库、Release 和稳定标签 |
| [VS Code 扩展教程](docs/VSCODE_EXTENSION_ZH.md) | 安装、使用、打包和 Marketplace 发布 |
| [CLI 手册](docs/CLI_ZH.md) | 所有命令、退出码和 CI 用法 |
| [GitHub Action 手册](docs/GITHUB_ACTION_ZH.md) | PR 评论、基线和权限配置 |
| [部署教程](docs/DEPLOYMENT_ZH.md) | 本地、Vercel 与自托管部署 |
| [npm 发布教程](docs/NPM_PUBLISH_ZH.md) | 发布 CLI 与 core 包 |
| [GitHub 仓库设置](docs/GITHUB_REPOSITORY_SETTINGS_ZH.md) | About、Topics、安全与分支保护 |
| [开发者指南](docs/DEVELOPMENT_ZH.md) | 架构、测试、规则与插件开发 |
| [常见问题](docs/FAQ_ZH.md) | 网络、npm、Token、误报和 Windows 问题 |
| [发布检查清单](docs/RELEASE_CHECKLIST_ZH.md) | 发版前逐项核对 |

## 项目结构

```text
apps/web            Next.js 网页端
apps/vscode         VS Code 扩展
packages/core       确定性分析核心
packages/cli        CLI 与 GitHub Action 可执行文件
plugins             插件示例
docs                中英文使用与发布文档
scripts             发布检查和产物打包脚本
examples/demo-repo  故意包含问题的演示仓库
```

## 开发

```bash
npm ci
npm test
npm run lint
npm run build
npm run check
npm run release:check
```

创建统一发布包：

```bash
npm run release:bundle
```

产物位于 `release/`。

## 隐私与安全

- 浏览器本地 ZIP / 文件夹分析不会上传文件。
- 远程仓库分析在服务器内存中完成，不持久化源码。
- 内置分析器不调用模型 API。
- 插件在本机以代码方式运行，仅加载可信插件。
- 对外部署时，不建议使用一个拥有私有仓库权限的全局 Token 服务不受信任用户。

## License

MIT
