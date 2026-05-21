@echo off
title Opencode - Proyectos
color 0A

:menu
cls
echo ====================================
echo        PROYECTOS - CROMI
echo ====================================
echo.
echo  1.  Cabañas Catamarca
echo  0.  Salir
echo.
echo ====================================
choice /C 10 /N /M "  Elegi un proyecto [1-0]: "

if errorlevel 2 goto salir
if errorlevel 1 goto cabanas
goto menu

:cabanas
cls
echo ====================================
echo   Abriendo: Cabañas Catamarca
echo ====================================
echo.
cd /d C:\Users\Cromi\curso-opencode\proyectos\cabanas
start "" warp
exit

:salir
cls
echo.
echo   Chau Cromi! 👋
echo.
timeout /t 2 >nul
exit
