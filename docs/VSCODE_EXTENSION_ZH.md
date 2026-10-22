# AgentLint VS Code 扩展教程

## 一、从 VSIX 安装

1. 打开 VS Code。
2. 点击左侧“扩展”。
3. 点击扩展面板右上角 `...`。
4. 选择“从 VSIX 安装”。
5. 选择 `agentlint-vscode-v0.4.0.vsix`。
6. 安装完成后重新加载 VS Code。

也可以在项目根目录双击：

```text
install-vscode-extension.bat
```

或执行：

```powershell
code --install-extension .\release\agentlint-vscode-v0.4.0.vsix
```

## 二、使用命令

按 `Ctrl+Shift+P` 打开命令面板：

- `AgentLint：分析工作区`
- `AgentLint：清除诊断`
- `AgentLint：查看报告`
- `AgentLint：导出 Markdown 报告`
- `AgentLint：应用安全修复`

分析结果会出现在：

- 编辑器波浪线；
- “问题”面板；
- 左下角状态栏分数；
- AgentLint 输出面板。

## 三、设置

打开 VS Code 设置，搜索 `AgentLint`：

- `agentlint.locale`：`auto`、`zh-CN` 或 `en-US`；
- `agentlint.analyzeOnSave`：保存规则文件时自动分析；
- `agentlint.maxFiles`：最多枚举的工作区文件数。

中文 VS Code 默认自动使用中文。也可以在 `.vscode/settings.json` 中写：

```json
{
  "agentlint.locale": "zh-CN",
  "agentlint.analyzeOnSave": true,
  "agentlint.maxFiles": 50000
}
```

## 四、打包扩展

```powershell
npm ci
npm run build:vscode
npm run package -w agentlint-vscode
```

生成 `.vsix` 文件后，运行统一发布打包：

```powershell
npm run release:bundle
```

## 五、发布到 VS Code Marketplace

1. 创建 Azure DevOps 组织和 Marketplace Publisher。
2. Publisher ID 必须与 `apps/vscode/package.json` 中的 `publisher` 一致。
3. 如果你创建的 Publisher 不是 `valseeee`，先修改该字段。
4. 安装并登录 `vsce`，或在 Marketplace Publisher 管理页面手动上传 VSIX。
5. 发布前检查 README、版本号、License 和仓库地址。

官方教程：https://code.visualstudio.com/api/working-with-extensions/publishing-extension

> Marketplace 发布使用的是 Azure DevOps / Marketplace 发布凭证，不是 AgentLint 网页使用的 GitHub Token，两者不要混淆。
