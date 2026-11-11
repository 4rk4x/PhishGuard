@echo off
title PhishGuard Backend Service (FastAPI + ML Engine)
cd /d "%~dp0backend"

echo ========================================================
echo    PhishGuard - Starting Backend API Server (Port 8000)
echo ========================================================

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python 3.10+ from python.org and ensure "Add to PATH" is checked.
    pause
    exit /b 1
)

REM Check or create virtual environment
if not exist "venv" (
    echo [INFO] Creating Python virtual environment (venv)...
    python -m venv venv
)

echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat

echo [INFO] Checking Python dependencies...
pip install -r requirements.txt --quiet

echo [INFO] Initializing Machine Learning Engine and Database...
python -c "from app.ml.model_trainer import train_and_evaluate_models; from app.config import settings; train_and_evaluate_models(settings.MODEL_DIR)"

echo ========================================================
echo [SUCCESS] Backend ready at http://127.0.0.1:8000
echo Interactive API Documentation at http://127.0.0.1:8000/docs
echo ========================================================

python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause

