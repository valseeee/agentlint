$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$target = Join-Path $root "apps\web\.env.local"

Write-Host "AgentLint GitHub 访问令牌配置" -ForegroundColor Cyan
Write-Host "令牌不会显示在屏幕上。按 Ctrl+C 可取消。"
$secure = Read-Host "请粘贴只读 GitHub Token" -AsSecureString
$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
try {
  $token = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
} finally {
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
}

if ([string]::IsNullOrWhiteSpace($token)) {
  throw "没有输入令牌。"
}
if (-not ($token.StartsWith("github_pat_") -or $token.StartsWith("ghp_"))) {
  Write-Warning "令牌格式不像常见 GitHub Token，请确认没有复制错误。"
}

$content = @"
# AgentLint 本地配置。不要提交此文件。
GITHUB_TOKEN=$token
ALLOW_PRIVATE_REPOSITORIES=false
AGENTLINT_ALLOWED_REPOSITORIES=
REMOTE_ANALYSIS_RATE_LIMIT=12
"@
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $target) | Out-Null
[IO.File]::WriteAllText($target, $content, [Text.UTF8Encoding]::new($false))
Write-Host "配置已保存到 apps\web\.env.local。" -ForegroundColor Green
Write-Host "请重新启动 AgentLint。"
