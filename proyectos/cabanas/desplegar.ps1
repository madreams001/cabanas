# ═══════════════════════════════════════════════════════════
#  DESPLEGAR — Cabañas Catamarca
#  Script integrador: minifica → commit → push GitHub → push GAS
#  Uso: .\desplegar.ps1
# ═══════════════════════════════════════════════════════════

$ErrorActionPreference = "Stop"
$projectRoot = $PSScriptRoot

Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🚀 DESPLEGAR — Cabañas Catamarca" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# ── 1. Minificar ──────────────────────────────────────────────
Write-Host "📦 Paso 1: Minificando index.html..." -ForegroundColor Yellow
Set-Location $projectRoot
node minify.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en la minificación. Abortando." -ForegroundColor Red
    exit 1
}
Write-Host ""

# ── 2. Git commit + push ─────────────────────────────────────
Write-Host "📝 Paso 2: Commiteando cambios a Git..." -ForegroundColor Yellow
Set-Location $projectRoot
git add index.html index.min.html script.html style.html index-gas.html Codigo_AppScript.gs
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    git commit -m "deploy: $timestamp"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error en el commit. Abortando." -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Commit creado." -ForegroundColor Green
} else {
    Write-Host "⚠️  No hay cambios para commitear." -ForegroundColor Magenta
}

Write-Host ""
Write-Host "📤 Paso 3: Pusheando a GitHub..." -ForegroundColor Yellow
git push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en el push a GitHub. Abortando." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Push a GitHub exitoso." -ForegroundColor Green
Write-Host ""

# ── 3. Push a Google Apps Script ──────────────────────────────
Write-Host "☁️  Paso 4: Pusheando a Google Apps Script..." -ForegroundColor Yellow
Set-Location $projectRoot
clasp push -f
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en el push a Google Apps Script." -ForegroundColor Red
    Write-Host "   ¿Configuraste clasp? Ejecutá: clasp login && clasp clone <SCRIPT_ID>" -ForegroundColor Magenta
    exit 1
}
Write-Host "✅ Push a Google Apps Script exitoso." -ForegroundColor Green
Write-Host ""

# ── Resumen ───────────────────────────────────────────────────
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✅ DESPLIEGE COMPLETADO" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Resumen:" -ForegroundColor White
Write-Host "   ✅ index.html minificado → index.min.html" -ForegroundColor Green
Write-Host "   ✅ Cambios commiteados a Git" -ForegroundColor Green
Write-Host "   ✅ Push a GitHub (GitHub Pages actualizado)" -ForegroundColor Green
Write-Host "   ✅ Push a Google Apps Script (backend actualizado)" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Recordá hacer 'Nueva implementación' en GAS si cambiaste el backend." -ForegroundColor Magenta
Write-Host ""
