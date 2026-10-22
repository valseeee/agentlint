# 常见问题

## npm 提示找不到 package.json

你没有进入项目根目录。先运行：

```powershell
dir package.json
```

必须能看到该文件再执行 `npm ci`。

## npm 下载地址是内部地址并超时

检查：

```powershell
Select-String -Path package-lock.json -Pattern "applied-caas|internal.api"
```

正式发布包不应包含任何结果。v0.4.0 锁文件全部使用 `registry.npmjs.org`。

## `tsup` 不是命令

说明依赖没有安装成功。先执行：

```powershell
npm ci
```

看到 `added ... packages` 后再启动。

## 网页出现英文 Next.js 调试界面

你运行了开发模式 `npm run dev`。普通体验请运行：

```powershell
npm run preview
```

## GitHub 仓库分析失败

1. 检查仓库地址是否真实存在；
2. 点击“远程连接设置 → 检测连接”；
3. 尝试浏览器访问 `github.com` 和 `codeload.github.com`；
4. 公开仓库可手动下载 ZIP，再使用本地分析；
5. 自托管私有仓库可配置只读 Token。

## Token 要付费吗

不需要。个人访问令牌是免费的身份凭证，但仍受 GitHub 的接口规则和额度限制。

## 本地分析会上传源码吗

不会。本地 ZIP / 文件夹模式在浏览器中处理。

## 分数是不是项目质量的绝对评价

不是。分数是沟通和排序工具，具体问题、证据和建议更重要。

## 发现误报怎么办

先确认项目事实，然后：

- 在 `.agentlint.json` 调整规则级别；
- 使用行级抑制并写明原因；
- 提交包含最小复现的 Issue；
- 不要直接关闭整个安全类别来掩盖单个误报。
