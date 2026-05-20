@echo off
chcp 65001 >nul
title Opencode - Cabañas Catamarca

cd /d "C:\Users\Cromi\curso-opencode"

echo.
echo ========================================
echo   Opencode - Cabañas Catamarca
echo ========================================
echo.
echo Cargando sesiones...
echo.

:: Listar sesiones
opencode session list 2>nul
echo.
echo ========================================
echo.
echo [1] Nueva sesion
echo [2] Ultima sesion
echo [3] Elegir por ID
echo [4] Salir
echo.
set /p opcion="Elegi una opcion (1-4): "

if "%opcion%"=="1" (
    echo.
    echo Iniciando nueva sesion...
    opencode
    exit /b
)

if "%opcion%"=="2" (
    echo.
    echo Continuando ultima sesion...
    opencode -c
    exit /b
)

if "%opcion%"=="3" (
    echo.
    set /p session_id="Pega el ID de la sesion: "
    echo.
    echo Iniciando sesion...
    opencode -s %session_id%
    exit /b
)

if "%opcion%"=="4" (
    echo.
    echo Hasta luego!
    timeout /t 1 >nul
    exit /b
)

echo Opcion no valida.
timeout /t 2 >nul
