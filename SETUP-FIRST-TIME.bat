@echo off
title CRAFT BAZAAR - First Time Setup
color 0B
echo.
echo  ================================================
echo   CRAFT BAZAAR - First Time Setup
echo   This installs all required dependencies
echo  ================================================
echo.

cd /d "%~dp0backend"

echo  Installing backend dependencies...
call npm install

if %errorlevel% neq 0 (
    echo.
    echo  [ERROR] npm install failed.
    echo  Make sure Node.js is installed: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo.
echo  ================================================
echo   Setup complete!
echo.
echo   Next step: Double-click START-BACKEND.bat
echo              then open frontend/index.html
echo  ================================================
echo.
pause
