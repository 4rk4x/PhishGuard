# INSTALLATION AND EXECUTION GUIDE (WINDOWS)
## PhishGuard: Explainable Machine Learning-Based Phishing URL Detection System

---

### 1. PREREQUISITES
Ensure your Windows development machine has the following software installed:
1. **Python 3.10, 3.11, or 3.12** from [python.org](https://www.python.org/downloads/).
   - ⚠️ **Important:** During installation, ensure the checkbox **"Add Python to PATH"** is selected.
2. **Node.js 18.x or 20.x LTS** from [nodejs.org](https://nodejs.org/).
   - Includes `npm` package manager.
3. **Modern Web Browser:** Google Chrome, Microsoft Edge, or Mozilla Firefox.

---

### 2. DIRECTORY STRUCTURE CONFIRMATION
Ensure your project directory contains the following layout:
```text
phishguard/
├── backend/
│   ├── app/
│   ├── tests/
│   ├── requirements.txt
│   └── run_trainer.py
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── docs/
├── start_all.bat
├── start_backend.bat
└── start_frontend.bat
```

---

### 3. ONE-CLICK LAUNCH METHOD (RECOMMENDED)

Double-click the master launcher in Windows File Explorer:
```cmd
start_all.bat
```
This batch automation performs the following steps:
1. Spawns a dedicated console window running `start_backend.bat`.
2. Creates the Python virtual environment (`backend/venv`) if not present.
3. Installs backend dependencies (`fastapi`, `uvicorn`, `scikit-learn`, `pandas`, `sqlalchemy`, etc.).
4. Trains and evaluates the benchmark machine learning models and serializes joblib artifacts.
5. Seeds administrative and student accounts into `phishguard.db`.
6. Spawns a second console window running `start_frontend.bat`.
7. Installs frontend npm modules (`react`, `vite`, `tailwindcss`, `recharts`, `lucide-react`).
8. Launches the Vite development server on `http://localhost:5173`.
9. Automatically opens your default web browser to the application dashboard.

---

### 4. MANUAL INSTALLATION & STARTUP

If executing through PowerShell or Windows Command Prompt:

#### Terminal 1: Backend Setup & Execution
```powershell
cd phishguard\backend

# 1. Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate

# 2. Upgrade pip and install requirements
pip install --upgrade pip
pip install -r requirements.txt

# 3. Optional: Run manual ML training pipeline
python run_trainer.py

# 4. Start FastAPI server with live reloading
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- **Backend API:** `http://127.0.0.1:8000`
- **Swagger Interactive API Documentation:** `http://127.0.0.1:8000/docs`

#### Terminal 2: Frontend Setup & Execution
```powershell
cd phishguard\frontend

# 1. Install npm dependencies
npm install

# 2. Launch Vite dev server
npm run dev
```
- **Frontend Dashboard:** `http://localhost:5173`

---

### 5. COMMON TROUBLESHOOTING & SOLUTIONS

| Issue / Error | Root Cause | Solution |
| :--- | :--- | :--- |
| `'python' is not recognized as an internal or external command` | Python was installed without checking "Add Python to PATH". | Re-run Python installer, choose "Modify", and check "Add Python to PATH". |
| `pip install fails with wheel build errors` | Outdated pip or missing C++ compiler for native modules. | Run `python -m pip install --upgrade pip setuptools wheel`. Pre-built wheels for scikit-learn and pandas will download cleanly. |
| `Port 8000 or 5173 already in use` | Another process is holding the port. | In PowerShell run: `Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess \| Stop-Process` |
| `CORS Error in Browser Console` | Backend is not running or origin mismatch. | Ensure backend is running on `http://127.0.0.1:8000`. The Vite server automatically proxies `/api` to port 8000. |
| `Database Locked` | Concurrent write lock in SQLite. | The SQLite engine is configured with `connect_args={"check_same_thread": False}`. Close any external database browser (e.g. DB Browser for SQLite) holding exclusive locks. |

