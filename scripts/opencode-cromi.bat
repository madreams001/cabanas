@echo off
title Opencode - Cromi
color 0A

set ROOT=C:\Users\Cromi\curso-opencode
set CABANAS=C:\Users\Cromi\curso-opencode\proyectos\cabanas

:menu
cls
echo ====================================
echo        OPCIONES - CROMI
echo ====================================
echo.
echo  1.  Cabañas Catamarca (proyecto)
echo  2.  Modo General (charla / nuevos proyectos)
echo  0.  Salir
echo.
echo ====================================
choice /C 120 /N /M "  Elegi una opcion [1-2-0]: "

if errorlevel 3 goto salir
if errorlevel 2 goto general
if errorlevel 1 goto cabanas
goto menu

:cabanas
cls
echo ====================================
echo   Cabañas Catamarca
echo ====================================
echo.
cd /d "%CABANAS%"
echo  Directorio actual: %CD%
echo.
echo  Abriendo Warp en este directorio...
echo  Escribi "opencode" cuando abra.
echo.
timeout /t 2 >nul
start "" "warp://action/new_window?path=%CABANAS%"
exit

:general
cls
echo ====================================
echo   Modo General
echo ====================================
echo.
cd /d "%ROOT%"
echo  Directorio actual: %CD%
echo.
echo  Abriendo Warp en este directorio...
echo  Escribi "opencode" cuando abra.
echo.
timeout /t 2 >nul
start "" "warp://action/new_window?path=%ROOT%"
exit

:salir
cls
echo.
echo   Chau Cromi! 👋
echo.
timeout /t 2 >nul
exit
