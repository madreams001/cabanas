# ═══════════════════════════════════════════════════════════
#  DESPLEGAR — Cabañas Catamarca
#  Minifica → commit → push a GitHub (master)
#  El GitHub Action sync master→main + deploy a Pages es automático
#  Uso: .\desplegar.ps1
# ═══════════════════════════════════════════════════════════

$ErrorActionPreference = "Stop"
$projectRoot = $PSScriptRoot

Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🚀 DESPLEGAR — Cabañas Catamarca" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# ── 1. Build + Minificar ──────────────────────────────────────
Write-Host "📦 Paso 1: Build (src/ → index.html) + minificar..." -ForegroundColor Yellow
Set-Location $projectRoot
node build.js && node unificar.js && node minify.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en la minificación. Abortando." -ForegroundColor Red
    exit 1
}
Write-Host ""

# ── 2. Git commit ─────────────────────────────────────────────
Write-Host "📝 Paso 2: Commiteando cambios a Git..." -ForegroundColor Yellow
Set-Location $projectRoot
git add index.html index.min.html minis/index.html script.html style.html index-gas.html Codigo_AppScript.gs build.js unificar.js minify.js src/
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

# ── 3. Push a GitHub (master) ─────────────────────────────────
Write-Host "📤 Paso 3: Pusheando a GitHub (master)..." -ForegroundColor Yellow
git push origin master
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en el push a GitHub. Abortando." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Push a master exitoso." -ForegroundColor Green
Write-Host "   ⏳ GitHub Action sync master→main + deploy a Pages" -ForegroundColor Yellow
Write-Host "   ✅ La app se actualiza sola en: https://madreams001.github.io/cabanas/" -ForegroundColor Green
Write-Host ""

# ── 4. Push a Google Apps Script ──────────────────────────────
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
Write-Host "   ✅ src/ → index.html (build.js inlines CSS/JS)" -ForegroundColor Green
Write-Host "   ✅ index.html minificado → minis/index.html + index.min.html" -ForegroundColor Green
Write-Host "   ✅ Cambios commiteados a Git" -ForegroundColor Green
Write-Host "   ✅ Push a master (→ GitHub Action sync master→main automatic)" -ForegroundColor Green
Write-Host "   ✅ Push a Google Apps Script (backend actualizado)" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Backend modificado? Recordá hacer 'Nueva implementación' en GAS." -ForegroundColor Magenta
Write-Host "⚠️  Frontend: no necesitas hacer nada, el GitHub Action deploya solo." -ForegroundColor Magenta
Write-Host ""
