@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 删除 AgentLint GitHub 访问令牌
if exist apps\web\.env.local (
  del /q apps\web\.env.local
  echo [完成] 已删除 apps\web\.env.local。
) else (
  echo 没有找到本地令牌配置。
)
pause
