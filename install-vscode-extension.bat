@echo off
chcp 65001 >nul
cd /d "%~dp0"
title AgentLint VS Code 扩展安装器

where code >nul 2>nul
if errorlevel 1 (
  echo [错误] 没有找到 VS Code 命令行工具 code。
  echo 请打开 VS Code，进入扩展页面，选择“从 VSIX 安装”。
  pause
  exit /b 1
)

if not exist release\agentlint-vscode-v0.4.0.vsix (
  echo [提示] 尚未找到 release\agentlint-vscode-v0.4.0.vsix，正在构建扩展……
  call npm ci --no-audit --no-fund
  if errorlevel 1 goto fail
  call npm run release:bundle
  if errorlevel 1 goto fail
)

code --install-extension release\agentlint-vscode-v0.4.0.vsix --force
if errorlevel 1 goto fail

echo [完成] AgentLint VS Code 扩展已安装。
echo 请重新加载 VS Code，然后按 Ctrl+Shift+P 运行“AgentLint：分析工作区”。
pause
exit /b 0

:fail
echo [错误] 安装失败，请查看上方信息。
pause
exit /b 1
