# AgentLint 完整用户手册

## 1. AgentLint 是什么

AgentLint 用来检查 AI 编程助手规则文件是否仍然与真实仓库一致。它读取 `AGENTS.md`、`CLAUDE.md`、`.cursor/rules`、Copilot Instructions 等文件，并与项目中的脚本、锁文件、目录和任务目标交叉验证。

内置分析器是确定性静态分析器：

- 不需要模型 API；
- 同一份仓库输入会产生稳定结果；
- 每个问题都有规则 ID、证据、文件和行号；
- 可以在本地、CI、VS Code 和网页中使用。

## 2. 安装要求

- Node.js 20.11 或更高版本；
- npm 10 或更高版本；
- Windows、macOS 或 Linux；
- 只有远程 GitHub 分析需要网络，本地 ZIP/文件夹分析不需要 GitHub Token。

检查版本：

```powershell
node -v
npm -v
```

## 3. Windows 最简单启动方法

解压完整项目后，进入能看到 `package.json` 的项目根目录，双击：

```text
start-agentlint.bat
```

脚本会：

1. 检查 Node.js；
2. 首次运行时执行 `npm ci`；
3. 构建正式网页；
4. 打开 `http://localhost:3000`；
5. 启动正式预览模式。

停止时关闭命令窗口，或按 `Ctrl+C`。

## 4. 手动启动

```powershell
npm ci
npm run preview
```

开发者需要热更新时才使用：

```powershell
npm run dev
```

开发模式会显示 Next.js 调试工具；普通体验请使用 `npm run preview`。

## 5. 网页分析方式

### 5.1 内置问题示例

点击“查看问题示例”，无需网络，可以看到完整报告、筛选、作用域图和安全修复标记。

### 5.2 本地 ZIP

1. 选择“本地 ZIP / 文件夹”；
2. 点击“选择 ZIP”，或拖入压缩包；
3. 文件在浏览器内存中读取，不上传；
4. 可导出中文或英文 Markdown / JSON；
5. 若存在安全修复，可下载新的修复 ZIP，原文件不会被覆盖。

### 5.3 本地文件夹

1. 选择“本地 ZIP / 文件夹”；
2. 点击“选择文件夹”；
3. 浏览器会请求目录读取权限；
4. 选择项目根目录；
5. 分析过程不经过 GitHub，不受接口额度限制。

### 5.4 公开 GitHub 仓库

输入：

```text
owner/repository
```

或：

```text
https://github.com/owner/repository
```

AgentLint 优先下载公开源码归档，因此通常不消耗普通 REST API 额度。网络无法访问 GitHub 时，可改用本地 ZIP。

### 5.5 私有仓库

私有仓库只建议在你自己控制的本地或自托管实例中使用只读 `GITHUB_TOKEN`。不要在公共部署中配置一个能读取私人源码的全局 Token，除非部署访问受严格控制。

## 6. 报告怎么看

报告包含五类评分：

- 配置覆盖：是否存在规则文件、是否说明测试、构建和代码检查；
- 一致性：多个工具或作用域的要求是否矛盾；
- 有效性：脚本、任务目标和路径是否真实存在；
- 安全性：是否授权危险命令或敏感操作；
- 上下文效率：规则是否重复或过长。

问题级别：

- 错误：较高确定性且应优先修复；
- 警告：有明显风险，需要维护者判断；
- 建议：优化项，不一定阻止合并。

评分用于快速沟通，最终应阅读具体问题和证据。

## 7. 自动修复

AgentLint 只会把绝对明确、可逆或低风险的编辑标记为“安全修复”。

网页本地 ZIP 模式会生成新 ZIP；CLI 使用 `--fix` 会直接修改当前目录，因此使用前应提交或备份工作区。

```powershell
node packages/cli/dist/index.cjs check . --fix --lang zh-CN
```

## 8. 配置文件

运行：

```powershell
node packages/cli/dist/index.cjs init . --lang zh-CN
```

会创建：

```text
.agentlint.json
AGENTS.md
```

示例配置：

```json
{
  "$schema": "https://raw.githubusercontent.com/valseeee/agentlint/main/docs/agentlint.schema.json",
  "locale": "zh-CN",
  "maxInstructionTokens": 4000,
  "duplicateSimilarity": 0.88,
  "ignore": ["fixtures/**"],
  "rules": {
    "security/*": "error",
    "efficiency/near-duplicate-instruction": "info"
  }
}
```

规则可以设为 `error`、`warning`、`info` 或 `off`。

## 9. 行级抑制

仅在确认误报后使用：

```markdown
<!-- agentlint-disable-next-line validity/missing-script -->
运行 `npm run generated-command`。
```

抑制必须保留原因说明，避免把真实问题永久隐藏。

## 10. 隐私

- 本地 ZIP / 文件夹：文件留在浏览器内存；
- 远程 GitHub：源码在服务器请求内存中处理，不持久化；
- 内置分析：不调用模型服务；
- 插件：插件是本机代码，只加载可信来源；
- Token：仅放在 `.env.local` 或部署平台的加密环境变量中。


## 私有仓库安全开关

私有仓库远程读取默认关闭。仅在可信自托管环境中同时配置：

```env
ALLOW_PRIVATE_REPOSITORIES=true
AGENTLINT_ALLOWED_REPOSITORIES=owner/private-repo
```

允许列表必须逐个写明 `owner/repository`。不要在公共站点中开放一个可读取你全部私有仓库的 Token。
