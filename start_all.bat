@echo off
title PhishGuard Master Launcher
cd /d "%~dp0"

echo ========================================================
echo    PhishGuard - Unified Master Academic Launcher
echo    Explainable Machine Learning Phishing URL Detection
echo ========================================================
echo.

echo [1/2] Launching Backend Server in dedicated terminal...
start "PhishGuard Backend (FastAPI)" cmd /c "start_backend.bat"

echo [2/2] Waiting 4 seconds for API initialization...
timeout /t 4 /nobreak >nul

echo [2/2] Launching Frontend Development Server in dedicated terminal...
start "PhishGuard Frontend (React + Vite)" cmd /c "start_frontend.bat"

echo.
echo ========================================================
echo All services launched!
echo Access the system at: http://localhost:5173
echo Backend API Docs at: http://127.0.0.1:8000/docs
echo ========================================================
echo.

timeout /t 3 /nobreak >nul
start http://localhost:5173

