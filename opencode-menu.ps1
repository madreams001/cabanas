# Opencode Menu - Se ejecuta DENTRO de Warp
# Muestra sesiones y lanza opencode

$ErrorActionPreference = 'SilentlyContinue'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$WORK_DIR = "C:\Users\Cromi\curso-opencode"
Set-Location $WORK_DIR

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Opencode - Cabañas Catamarca" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Cargando sesiones..." -ForegroundColor Yellow
Write-Host ""

# Listar sesiones
opencode session list 2>$null

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  [1] Nueva sesion" -ForegroundColor Green
Write-Host "  [2] Ultima sesion" -ForegroundColor Green
Write-Host "  [3] Elegir sesion por ID" -ForegroundColor Green
Write-Host "  [4] Salir" -ForegroundColor Green
Write-Host ""

$opcion = Read-Host "Elegi una opcion (1-4)"

switch ($opcion) {
    "1" {
        Write-Host ""
        Write-Host "Iniciando nueva sesion..." -ForegroundColor Yellow
        Write-Host ""
        opencode
    }
    "2" {
        Write-Host ""
        Write-Host "Continuando ultima sesion..." -ForegroundColor Yellow
        Write-Host ""
        opencode -c
    }
    "3" {
        Write-Host ""
        $session_id = Read-Host "Pega el ID de la sesion"
        Write-Host ""
        Write-Host "Iniciando sesion..." -ForegroundColor Yellow
        Write-Host ""
        opencode -s $session_id
    }
    "4" {
        Write-Host ""
        Write-Host "Hasta luego!" -ForegroundColor Yellow
        Start-Sleep -Seconds 1
        exit
    }
    default {
        Write-Host ""
        Write-Host "Opcion no valida." -ForegroundColor Red
        Start-Sleep -Seconds 2
        exit
    }
}
