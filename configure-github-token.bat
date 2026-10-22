@echo off
chcp 65001 >nul
cd /d "%~dp0"
title AgentLint GitHub 访问令牌配置
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\configure-github-token.ps1"
if errorlevel 1 (
  echo.
  echo [错误] 配置未完成。
) else (
  echo.
  echo [完成] 令牌已安全写入本地配置。
)
pause
