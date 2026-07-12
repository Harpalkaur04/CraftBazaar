@echo off
title CRAFT BAZAAR - Backend Server
color 0A
echo.
echo  ================================================
echo   CRAFT BAZAAR - Starting Backend Server
echo  ================================================
echo.

cd /d "%~dp0backend"

echo  Checking dependencies...
if not exist "node_modules" (
    echo  node_modules not found. Running npm install first...
    call npm install
)

echo.
echo  Starting server on http://localhost:5000
echo.
echo  Keep this window open while using the website.
echo  Press Ctrl+C to stop the server.
echo.
echo  ------------------------------------------------
echo.

node server.js

echo.
echo  Server stopped.
pause
