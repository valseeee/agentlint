# 本地安装与网络排错

本项目的 `package-lock.json` 只使用公共 npm 仓库 `https://registry.npmjs.org/`。

正常安装：

```powershell
npm ci
npm run preview
```

如果长时间没有下载进度：

```powershell
npm config get registry
npm ping
npm cache verify
npm ci --no-audit --no-fund --loglevel verbose
```

中国大陆网络访问公共 npm 较慢时，可以临时切换镜像：

```powershell
npm config set registry https://registry.npmmirror.com
npm ci --no-audit --no-fund
```

准备发布或生成锁文件时，再切回官方仓库：

```powershell
npm config set registry https://registry.npmjs.org/
```

如果出现 `tsup 不是内部或外部命令`，说明 `npm ci` 尚未成功完成。不要直接运行启动命令。

更多问题见 `docs/FAQ_ZH.md`。
