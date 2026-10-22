@echo off
chcp 65001 >nul
cd /d "%~dp0"
title AgentLint v0.4.0 正式预览

set PORT=3000
:check_port
netstat -ano | findstr /R /C:":%PORT% .*LISTENING" >nul 2>nul
if not errorlevel 1 (
  set /a PORT+=1
  goto check_port
)

echo ========================================
echo AgentLint v0.4.0 正式预览启动器
echo ========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [错误] 没有检测到 Node.js。
  echo 请安装 Node.js 20.11 或更高版本，然后重新运行。
  pause
  exit /b 1
)

for /f "tokens=1 delims=." %%v in ('node -p "process.versions.node"') do set NODE_MAJOR=%%v
if %NODE_MAJOR% LSS 20 (
  echo [错误] 当前 Node.js 版本过低：
  node -v
  echo 请安装 Node.js 20.11 或更高版本。
  pause
  exit /b 1
)

if not exist package.json (
  echo [错误] 当前目录中没有 package.json。
  echo 请从完整项目根目录运行本文件。
  pause
  exit /b 1
)

if not exist node_modules (
  echo [1/3] 首次运行，正在安装依赖……
  call npm ci --no-audit --no-fund
  if errorlevel 1 goto install_failed
) else (
  echo [1/3] 已检测到依赖，跳过安装。
)

echo [2/3] 正在构建正式版本……
call npm run build:web
if errorlevel 1 goto build_failed

echo [3/3] 正在启动：http://localhost:%PORT%
echo 本窗口必须保持开启；按 Ctrl+C 可停止。
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:%PORT%"
call npm run start -w @agentlint/web -- -p %PORT%
exit /b %errorlevel%

:install_failed
echo.
echo [错误] 依赖安装失败。
echo 请检查网络，并确认 package-lock.json 使用 registry.npmjs.org。
echo 详细排错见 docs\FAQ_ZH.md。
pause
exit /b 1

:build_failed
echo.
echo [错误] 正式版本构建失败。
echo 请运行 npm run doctor 或查看上方错误。
pause
exit /b 1
