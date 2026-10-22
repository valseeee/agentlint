# Changelog

## Unreleased

- 更新 Next.js 至 16.4.2、React / React DOM 至 19.3.1、JSZip 至 3.10.2，并同步 React 类型声明。
- 更新 GitHub Actions checkout / setup-node 至 v7。
- 新增 ZIP 解包与分析的接口回归测试。
- 暂缓开发工具批量升级：TypeScript 7 与当前声明文件构建流程不兼容，保留现有工具链。

## 0.4.0 — 2026-06-14

### 新功能

- 新增 CLI `doctor`、`rules` 与 `explain` 命令。
- VS Code 扩展新增完整语言包、报告输出、Markdown 导出与确定性安全修复。
- 网页新增内置双语使用教程页面。
- 新增统一发布产物：源码 ZIP、独立 CLI、VSIX、npm tarball 与 SHA-256。
- 新增 npm、VS Code Marketplace、CodeQL 与增强 Release 工作流。
- 新增 Windows 一键扩展安装、CLI 演示和发布构建脚本。
- 新增完整中英文用户、CLI、VS Code、GitHub、部署、开发和发布文档。
- 新增规则目录 API 与示例团队策略插件。

### 改进

- 所有包版本统一为 `0.4.0`。
- 公开发布前检查会验证版本、必需产物、内部仓库地址和疑似令牌。
- 更新架构、路线图、隐私和发布安全说明。

## 0.3.1 — 2026-06-14

- 修复浏览器扩展注入属性引起的 React 水合警告。
- 默认隐藏 Next.js 左下角开发状态按钮，并新增 `npm run preview` 正式预览模式。
- 新增全中文 GitHub 连接设置、访问令牌教程和一键连接诊断。
- 远程仓库下载增加超时、网络异常捕获和认证接口回退。
- 中文模式补齐页面标题、报告格式、作用域关系、令牌统计和错误操作提示。
- 版本升级到 `0.3.1`。

## 0.3.0 — 2026-06-14

### Added

- End-to-end `zh-CN` and `en-US` localization for the web app, findings, fixes, Markdown, JSON, SARIF, CLI and starter templates.
- Browser-local ZIP and folder analysis with no upload and no GitHub API quota.
- Downloadable ZIP containing deterministic safe fixes.
- Public GitHub source-archive mode, authenticated archive fallback and ten-minute result caching.
- Rule scope graph in the web report.
- Baseline report comparison and Markdown diff output.
- Pull Request comment creation/update from the CLI and composite Action.
- VS Code extension package with Problems diagnostics and analyze-on-save.
- Optional async plugin interface and repeatable `--plugin` CLI option.
- `locale` configuration property and bilingual README files.

### Changed

- Report schema upgraded to `1.2` with locale, grade key and scope graph data.
- CLI and package versions upgraded to `0.3.0`.
- Browser core no longer depends on Node's `path` module.

### Fixed

- Public-registry lockfile is preserved so local Windows installations do not reference an internal package mirror.
- Public repository analysis no longer normally hits the unauthenticated GitHub REST limit.

## 0.2.0

- Deterministic analyzer, CLI, web app, GitHub Action, SARIF, configuration, suppression and safe fixes.
