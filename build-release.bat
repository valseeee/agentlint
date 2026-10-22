@echo off
chcp 65001 >nul
cd /d "%~dp0"
title AgentLint 发布包构建

echo 正在安装依赖并执行完整验收……
call npm ci --no-audit --no-fund
if errorlevel 1 goto fail
call npm run release:bundle
if errorlevel 1 goto fail

echo.
echo [完成] 所有发布文件已生成到 release 文件夹。
explorer release
pause
exit /b 0

:fail
echo [错误] 发布包构建失败，请查看上方日志。
pause
exit /b 1
