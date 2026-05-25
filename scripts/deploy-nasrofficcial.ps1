# Deploy Qurtaba School ERP to nasrofficcial-8156s-projects ONLY
# Prerequisite: vercel login (use the nasrofficcial Vercel account)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

$Scope = "nasrofficcial-8156s-projects"
$ProjectName = "qurtaba-academy-of-excellence-bela"

Write-Host "Checking Vercel scope: $Scope"
npx vercel whoami --scope $Scope
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Not logged into $Scope"
    Write-Host "Run: npx vercel login"
    Write-Host "Sign in with the account that owns: https://vercel.com/nasrofficcial-8156s-projects"
    exit 1
}

if (Test-Path .vercel) {
    Remove-Item -Recurse -Force .vercel
    Write-Host "Removed previous .vercel link"
}

Write-Host "Linking project..."
npx vercel link --yes --project $ProjectName --scope $Scope

Write-Host "Setting environment variables..."
$mongo = (Get-Content .env.local | Where-Object { $_ -match '^MONGODB_URI=' }) -replace '^MONGODB_URI=',''
$jwt = (Get-Content .env.local | Where-Object { $_ -match '^JWT_SECRET=' }) -replace '^JWT_SECRET=',''
$api = '/api'

foreach ($env in @('production','preview','development')) {
    $mongo | npx vercel env add MONGODB_URI $env --force
    $jwt | npx vercel env add JWT_SECRET $env --force
    $api | npx vercel env add NEXT_PUBLIC_API_URL $env --force
}

Write-Host "Deploying to production..."
npx vercel deploy --prod --scope $Scope --yes

Write-Host ""
Write-Host "Run post-deploy checks:"
Write-Host "  node scripts/production-verify.mjs https://YOUR-DEPLOYMENT-URL"
