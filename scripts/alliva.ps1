param(
  [ValidateSet('dev','build')][string]$Mode='dev',
  [string]$Log = "$PSScriptRoot\..\alliva-$Mode.err.log"
)

$ErrorActionPreference = 'Continue'
$PSStyle.OutputRendering = 'Ansi'

# Move to project root (one level up from scripts folder)
Set-Location "$PSScriptRoot\.."

# Install deps if missing
if (!(Test-Path .\node_modules)) {
  Write-Host "Installing dependencies..." -ForegroundColor Cyan
  npm ci 2>> $Log
}

# Helpful node flags
$env:NODE_OPTIONS = "--trace-warnings"

switch ($Mode) {
  'dev' {
    Write-Host "Starting Next.js dev server (errors -> $Log)" -ForegroundColor Green
    npm run dev 2>> $Log
  }
  'build' {
    Write-Host "Building app (errors -> $Log)" -ForegroundColor Green
    npm run build 2>> $Log
    if ($LASTEXITCODE -eq 0) {
      Write-Host "Build OK. Starting server (errors -> $Log)" -ForegroundColor Green
      npm start 2>> $Log
    } else {
      Write-Host "Build failed. See $Log" -ForegroundColor Red
      exit 1
    }
  }
}
