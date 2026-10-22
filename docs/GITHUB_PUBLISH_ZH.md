# 把 AgentLint 发布到 GitHub：逐步教程

## 一、发布前准备

1. 注册并登录 GitHub。
2. 安装 Git：https://git-scm.com/downloads
3. 可选安装 GitHub Desktop：https://desktop.github.com/
4. 在项目根目录运行：

```powershell
npm ci
npm run test:all
npm run release:check
npm run release:bundle
```

5. 确认 `.env.local`、Token、`node_modules`、`.next` 没有进入发布内容。

## 二、最适合新手：使用 GitHub Desktop

1. 打开 GitHub Desktop 并登录。
2. `File` → `Add local repository`。
3. 选择 AgentLint 项目根目录。
4. 如果提示不是 Git 仓库，选择创建仓库。
5. Repository name 填 `agentlint`。
6. Description 可填：

```text
Deterministic static analysis for AGENTS.md, CLAUDE.md, Cursor Rules and other AI coding-agent instructions.
```

7. 保持 MIT License 文件不变。
8. 点击 `Publish repository`。
9. 取消“Keep this code private”，发布为公开仓库。
10. 发布后打开仓库页面检查 README 是否正常显示。

GitHub 官方说明：https://docs.github.com/en/desktop/adding-and-cloning-repositories/adding-an-existing-project-to-github-using-github-desktop

## 三、使用命令行发布

先在 GitHub 网站创建一个空仓库：

- 名称：`agentlint`
- Public
- 不要勾选自动生成 README、License 或 .gitignore

然后在项目根目录执行：

```powershell
git init
git add .
git commit -m "feat: release AgentLint v0.4.0"
git branch -M main
git remote add origin https://github.com/你的用户名/agentlint.git
git push -u origin main
```

GitHub 已不接受账号密码作为 Git HTTPS 推送密码。推荐使用 GitHub Desktop、Git Credential Manager 或 GitHub CLI 登录，不要把个人 Token 写进命令历史。

官方说明：https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository

## 四、发布第一个 Release

1. 先在本地生成发布产物：

```powershell
npm run release:bundle
```

2. 在 GitHub 仓库右侧点击 `Releases`。
3. 点击 `Draft a new release`。
4. Tag 填 `v0.4.0`，目标分支选 `main`。
5. Release title 填 `AgentLint v0.4.0`。
6. 从 `release/` 上传：
   - `AgentLint-v0.4.0-source.zip`
   - `agentlint-vscode-v0.4.0.vsix`
   - `agentlint-cli-v0.4.0.cjs`
   - npm `.tgz` 包
   - `SHA256SUMS.txt`
7. 粘贴 CHANGELOG 中 v0.4.0 的说明。
8. 先保存草稿并核对下载文件，确认后发布。

官方说明：https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository

## 五、创建稳定 Action 标签

GitHub Action 用户通常引用 `@v0`。确认 v0.4.0 工作流通过后：

```powershell
git tag -a v0.4.0 -m "AgentLint v0.4.0"
git push origin v0.4.0
git tag -f v0 v0.4.0
git push origin v0 --force
```

只在经过测试的稳定版本上移动 `v0` 标签。

## 六、仓库设置建议

- About：填写简介、网站和 Topics；
- Topics：`agentlint`、`agents-md`、`claude-code`、`cursor`、`github-copilot`、`ai-agents`、`linter`；
- 启用 Issues 和 Discussions；
- 默认分支保护：要求 CI 通过后合并；
- 开启 Dependabot 与 Secret scanning；
- 添加仓库社交预览图；
- README 首屏放一句话价值、GIF/截图、安装命令和 Demo。

## 七、重要提醒

发布前务必搜索：

```powershell
git grep -n "github_pat_"
git grep -n "GITHUB_TOKEN="
```

任何真实令牌都不能出现。GitHub 的 push protection 可能阻止包含已知密钥的提交，但不能依赖它代替人工检查。
