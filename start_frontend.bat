@echo off
title PhishGuard Frontend (React + Vite Dashboard)
cd /d "%~dp0frontend"

echo ========================================================
echo    PhishGuard - Starting React Frontend (Port 5173)
echo ========================================================

REM Check if Node is available
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Check node_modules
if not exist "node_modules" (
    echo [INFO] Installing frontend npm packages (React, Vite, Tailwind, Recharts)...
    call npm install
)

echo ========================================================
echo [SUCCESS] Launching Vite Dev Server...
echo Frontend will run at http://localhost:5173
echo ========================================================

call npm run dev
pause

