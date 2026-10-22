# AgentLint 部署教程

## 1. 本地正式预览

```powershell
npm ci
npm run preview
```

## 2. Vercel

1. 把仓库发布到 GitHub。
2. 登录 Vercel，选择 `Add New Project`。
3. 导入 AgentLint 仓库。
4. Root Directory 保持仓库根目录。
5. Build Command 使用：

```text
npm run build:web
```

6. Framework Preset 选择 Next.js。
7. 不分析私有仓库时无需设置 Token。
8. 如需自托管私有仓库访问，在 Vercel Environment Variables 中设置 `GITHUB_TOKEN`，但必须限制站点访问，避免陌生人利用该 Token 读取私人源码。

## 3. 自托管服务器

```bash
npm ci
npm run build:web
npm run start
```

建议使用反向代理、HTTPS、进程管理器和请求大小限制。

## 4. 公共部署安全建议

- 不使用带私有仓库读取权限的全局 Token；
- 限制上传大小和请求频率；
- 不记录仓库源码或 Token；
- 定期更新依赖；
- 本地分析模式应作为首选；
- 对公共服务添加隐私说明和滥用防护。


## 私有仓库安全开关

私有仓库远程读取默认关闭。仅在可信自托管环境中同时配置：

```env
ALLOW_PRIVATE_REPOSITORIES=true
AGENTLINT_ALLOWED_REPOSITORIES=owner/private-repo
```

允许列表必须逐个写明 `owner/repository`。不要在公共站点中开放一个可读取你全部私有仓库的 Token。

## 5. 环境变量

```env
# 可选只读令牌
GITHUB_TOKEN=

# 私有仓库默认关闭；仅可信自托管环境使用
ALLOW_PRIVATE_REPOSITORIES=false
AGENTLINT_ALLOWED_REPOSITORIES=owner/private-repo

# 每个客户端 IP 每分钟允许的远程分析次数；本地分析不受影响
REMOTE_ANALYSIS_RATE_LIMIT=12
```
