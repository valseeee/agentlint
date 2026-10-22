@echo off
chcp 65001 >nul
cd /d "%~dp0"
title AgentLint CLI 中文演示
if not exist node_modules call npm ci --no-audit --no-fund
call npm run build -w @agentlint/core
call npm run build -w agentlint
node packages\cli\dist\index.cjs doctor . --lang zh-CN
node packages\cli\dist\index.cjs check examples\demo-repo --lang zh-CN --fail-on never
pause
