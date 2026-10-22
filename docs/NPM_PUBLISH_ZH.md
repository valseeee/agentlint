# 发布 AgentLint CLI 到 npm

发布后，用户可以直接运行：

```bash
npx agentlint@latest check . --lang zh-CN
```

## 1. 创建 npm 账号

访问：https://www.npmjs.com/signup

完成邮箱验证，并建议开启双重验证。

## 2. 确认包名是否可用

```powershell
npm view agentlint
npm view @agentlint/core
```

如果包名已经被其他人占用，需要修改 `packages/cli/package.json` 与相关文档。作用域包 `@agentlint/core` 还要求你拥有 npm 上的 `agentlint` 组织或作用域。

## 3. 本地检查

```powershell
npm ci
npm run test:all
npm run release:check
npm pack -w @agentlint/core --dry-run
npm pack -w agentlint --dry-run
```

## 4. 登录并发布

先发布核心包：

```powershell
npm login
npm publish -w @agentlint/core --access public
```

再发布 CLI：

```powershell
npm publish -w agentlint --access public
```

每个版本号只能发布一次。发布失败后，如果包已经存在，需要升级版本号。

## 5. 使用 GitHub Actions 发布

仓库已包含 `.github/workflows/publish-npm.yml`。在 GitHub 仓库：

1. Settings → Environments → 新建 `npm` 环境；
2. Settings → Secrets and variables → Actions；
3. 添加 `NPM_TOKEN`；
4. Actions → `Publish npm packages` → Run workflow。

令牌只放在 GitHub Secret 中，不要写进 YAML。

## 6. 发布后验证

```powershell
npx agentlint@0.4.0 --version
npx agentlint@0.4.0 rules --lang zh-CN
npx agentlint@0.4.0 check . --lang zh-CN
```
