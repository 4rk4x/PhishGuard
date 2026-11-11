# PhishGuard 🛡️
### Explainable Machine Learning-Based Phishing URL Detection System
**Academic CSE Semester Capstone Project (2026)**  
*Developed with Python (FastAPI), React (Vite & Tailwind CSS), Scikit-Learn, and SQLite.*

---

## 📌 Abstract & Objective
Phishing attacks represent over 80% of reported social engineering incidents. Traditional blacklist mechanisms suffer from an average detection lag of 4 to 24 hours. **PhishGuard** is an explainable machine learning platform that detects malicious and deceptive URLs in under 50 milliseconds using non-intrusive lexical and structural heuristics. 

Unlike black-box AI tools, PhishGuard features an **Explainable AI (XAI)** reasoning engine that deconstructs each prediction, explaining to security analysts and students exactly *why* a URL was classified as **Safe**, **Suspicious**, or **Phishing**.

---

## 🎨 Design Philosophy & Color Palette
PhishGuard is styled as a premium cybersecurity dashboard adhering strictly to a focused three-color palette:
- 🌌 **Deep Navy (`#101827`):** Primary canvas, deep surfaces, dark elevations.
- ⚡ **Electric Green (`#27D17F`):** Brand accent, verified safe status, cyber highlights.
- ❄️ **Crisp Offwhite (`#F8FAFC`):** High-contrast typography and clean reading surfaces.
- Semantic accents (`#EF4444` Crimson / `#F59E0B` Amber) are strictly reserved for threat severity indicators.

---

## 🚀 Key Modules
1. **Landing Page:** Interactive quick-scan bar, 4-stage pipeline explanation, and empirical benchmark highlights.
2. **URL Scanner:** Zero-execution heuristic parser with RFC validation, animated radar scanner, risk gauge dial ($0-100$), and defanged URL representation (`hxxps[://]...`).
3. **Explainable AI (XAI) Attribution:** Deconstructs 20 lexical features (Shannon character entropy, IP presence, subdomain depth, shortening redirection, hyphenation squatting, sensitive keywords) with plain-English rationales.
4. **User Threat Dashboard:** Daily scanning frequency charts, categorical threat distribution donut chart, and frequent threat indicator bar charts rendered via Recharts.
5. **Scan History:** Permanent SQLite audit log with pagination, search, status filtering, and JSON export.
6. **Admin & Model Governance Portal:** Side-by-side comparison of **Random Forest** vs. **Logistic Regression**, interactive confusion matrix heatmaps, feature importance rankings, and one-click model pipeline retraining.
7. **Embedded Academic Portal:** Full SRS, architecture diagrams, mathematical formulations, and ER designs viewable in-browser.

---

## 📊 Empirical ML Benchmarks (Holdout Test Split N=240)
*Evaluated on verified Tranco Top-1M (NDSS '19) and Mendeley/PhishTank benchmark datasets (CC BY 4.0).*

| Metric | Random Forest (Ensemble) | Logistic Regression (Baseline) | Performance Delta |
| :--- | :--- | :--- | :--- |
| **Accuracy** | **96.25%** | 89.17% | **+7.08%** |
| **Precision** | **96.64%** | 89.83% | **+6.81%** |
| **Recall** | **95.83%** | 88.33% | **+7.50%** |
| **F1-Score** | **96.23%** | 89.07% | **+7.16%** |
| **ROC-AUC** | **0.9880** | 0.9412 | **+0.0468** |
| **Confusion Matrix** | `[[116, 4], [5, 115]]` | `[[108, 12], [14, 106]]` | Significant FP/FN reduction |

---

## 🛠️ Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Recharts, Lucide React Icons.
- **Backend:** Python 3.10+, FastAPI, Uvicorn, Pydantic v2.
- **Machine Learning:** Scikit-Learn, Pandas, NumPy, Joblib.
- **Database:** SQLite 3, SQLAlchemy 2.0 ORM.
- **Security:** Bcrypt salted hashing, JWT Bearer tokens, zero-execution defanged string parsers.

---

## ⚡ Quick Start on Windows

### Option 1: Master Single-Click Launcher
Simply double-click:
```cmd
start_all.bat
```
*This launches both the FastAPI backend (port 8000) and the React Vite frontend (port 5173), then automatically opens your browser to http://localhost:5173.*

### Option 2: Individual Launch Scripts
1. **Backend:** Double-click `start_backend.bat` (Runs on `http://127.0.0.1:8000`, API Docs at `http://127.0.0.1:8000/docs`).
2. **Frontend:** Double-click `start_frontend.bat` (Runs on `http://localhost:5173`).

---

## 🎓 Faculty Evaluation & Viva Demo Accounts
- **Lead Security Auditor (Admin):**
  - Email: `admin@phishguard.ac.in`
  - Password: `Admin@PhishGuard2026!`
- **Student Researcher:**
  - Email: `student@phishguard.ac.in`
  - Password: `Student@Pass2026!`

