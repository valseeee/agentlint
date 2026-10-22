# GitHub 访问令牌配置教程

GitHub Personal Access Token（个人访问令牌）可以免费创建。它不是付费 API 套餐，而是一种身份凭证。

## 什么时候需要

不需要 Token：

- 点击内置问题示例；
- 本地 ZIP；
- 本地文件夹；
- 大多数公开仓库源码归档分析。

建议配置 Token：

- 你在自己控制的本地实例中分析私有仓库；
- 公共源码归档被网络阻断，需要认证 API 回退；
- 匿名 API 额度不足；
- 连接诊断显示 GitHub API 可访问，但未认证额度很低。

## 创建 Fine-grained Token

1. 登录 GitHub。
2. 右上角头像 → `Settings`。
3. 左侧最下方 → `Developer settings`。
4. `Personal access tokens` → `Fine-grained tokens`。
5. 点击 `Generate new token`。
6. Token name 填：`AgentLint Local`。
7. Expiration 建议 30 或 90 天。
8. Resource owner 选择自己的账号。
9. Repository access：
   - 只分析公开仓库：无需额外选择私有仓库；
   - 分析私有仓库：选择 `Only select repositories`，只勾选需要的仓库。
10. Permissions → Repository permissions → `Contents: Read-only`。
11. 不要授予写入、管理、Actions 或 Secrets 权限。
12. 生成后立即复制令牌；完整令牌通常只显示一次。

官方说明：https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens

## 写入本地配置

双击：

```text
configure-github-token.bat
```

新版脚本使用隐藏输入，令牌不会回显在窗口中。需要移除时双击 `remove-github-token.bat`。

或运行：

```powershell
notepad .\apps\web\.env.local
```

写入：

```env
GITHUB_TOKEN=github_pat_你的完整令牌
```

不要加引号，不要在等号两侧加空格。

保存后重启 AgentLint：

```powershell
npm run preview
```

## 检查配置

网页点击：

```text
远程连接设置 → 检测连接
```

或命令行：

```powershell
node packages/cli/dist/index.cjs doctor . --network --lang zh-CN
```

## 安全规则

- 绝对不要把令牌发到聊天、Issue、截图或 README；
- 不要提交 `.env.local`；
- 不要把令牌写进前端代码；
- 一旦泄露，立即回到 GitHub 删除该令牌；
- 公共网站不要使用能读取你私有仓库的全局 Token 服务陌生用户；
- 长期公共集成更适合 GitHub App，而不是个人 Token。


## 私有仓库安全开关

私有仓库远程读取默认关闭。仅在可信自托管环境中同时配置：

```env
ALLOW_PRIVATE_REPOSITORIES=true
AGENTLINT_ALLOWED_REPOSITORIES=owner/private-repo
```

允许列表必须逐个写明 `owner/repository`。不要在公共站点中开放一个可读取你全部私有仓库的 Token。
