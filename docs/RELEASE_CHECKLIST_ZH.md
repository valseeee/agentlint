# AgentLint 发布检查清单

## 版本与文档

- [ ] 根目录、core、CLI、web、VS Code 版本一致；
- [ ] CHANGELOG 已更新；
- [ ] README 中的命令和版本号正确；
- [ ] 路线图已更新；
- [ ] 中英文文档均可访问。

## 安全

- [ ] 没有 `.env.local`；
- [ ] 没有真实 `github_pat_`、`ghp_` 或其他密钥；
- [ ] package-lock 没有内部仓库地址；
- [ ] 私有仓库 Token 未配置到公共部署；
- [ ] 插件示例不访问网络或敏感数据。

## 测试

```bash
npm ci
npm test
npm run lint
npm run build
npm run check
npm run release:check
npm run release:bundle
```

- [ ] 核心测试通过；
- [ ] Next.js 构建通过；
- [ ] CLI 独立文件可运行；
- [ ] VSIX 可安装；
- [ ] 内置 Demo 可分析；
- [ ] 本地 ZIP / 文件夹可分析；
- [ ] 中文和 English 切换正常；
- [ ] `doctor`、`rules`、`explain` 可运行。

## GitHub

- [ ] CI 通过；
- [ ] Release 资产包含源码 ZIP、CLI、VSIX、npm tgz、SHA256；
- [ ] Release notes 完整；
- [ ] 稳定 `v0` 标签只指向已验证版本；
- [ ] Issues、Discussions、Topics、About 和社交预览图已配置。
