# PhishGuard 🛡️
### Explainable Machine Learning-Based Phishing URL Detection System
**Academic CSE Semester Capstone Project (2026)**  
*Developed with Python (FastAPI), React (Vite & Tailwind CSS), Scikit-Learn, and SQLite.*

---

## 📌 Abstract & Objective

Phishing attacks use deceptive URLs to trick users into revealing sensitive information, including login credentials and financial details. Traditional blacklist-based detection methods may fail to identify newly created or previously unseen malicious URLs.

**PhishGuard** is an academic phishing URL detection platform that uses machine learning and lexical URL analysis to classify submitted URLs into three categories: **Safe, Suspicious, and Phishing**.

The system extracts 20 lexical and structural URL features and uses machine learning classifiers, including Random Forest and Logistic Regression, to estimate phishing risk. It also provides an explainability layer that presents relevant URL characteristics and heuristic indicators behind each prediction.

PhishGuard includes user authentication, scan history, statistical dashboards, and an administrative model-governance portal.

The current benchmark uses a project-generated synthetic dataset. Its evaluation results demonstrate performance on that dataset and do not establish real-world detection accuracy.

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
3. **Explainable AI (XAI) Attribution:** Extracts and analyzes 20 lexical and structural URL features, including Shannon character entropy, IP address presence, subdomain depth, URL shortening indicators, hyphenation patterns, and suspicious keywords. Provides human-readable heuristic explanations to help users understand potentially suspicious URL characteristics. These indicators are supplementary explanations and are not direct mathematical attributions of the model's prediction.
4. **User Threat Dashboard:** Daily scanning frequency charts, categorical threat distribution donut chart, and frequent threat indicator bar charts rendered via Recharts.
5. **Scan History:** Permanent SQLite audit log with pagination, search, status filtering, and JSON export.
6. **Admin & Model Governance Portal:** Side-by-side comparison of **Random Forest** vs. **Logistic Regression**, interactive confusion matrix heatmaps, feature importance rankings, and one-click model pipeline retraining.
7. **Embedded Academic Portal:** Full SRS, architecture diagrams, mathematical formulations, and ER designs viewable in-browser.

---

## 📊 Empirical ML Benchmarks (Synthetic Holdout Test Split N=271)

PhishGuard was evaluated using a project-generated synthetic URL benchmark containing 1,355 samples. The dataset consists of manually defined benign and phishing-like URL patterns expanded through predefined templates.

**Dataset composition:**
- Total samples: 1,355
- Benign samples: 710
- Phishing samples: 645
- Training samples: 1,084 (80%)
- Testing samples: 271 (20%)

**Model evaluation results:**

| Metric | Random Forest | Logistic Regression |
|---|---:|---:|
| Accuracy | 100.00% | 100.00% |
| Precision | 100.00% | 100.00% |
| Recall | 100.00% | 100.00% |
| F1-Score | 100.00% | 100.00% |
| ROC-AUC | 1.0000 | 1.0000 |

**Confusion Matrices:**

- Random Forest: `[[142, 0], [0, 129]]`
- Logistic Regression: `[[142, 0], [0, 129]]`

**Important Academic Limitation:**

These results represent performance on the project's synthetic holdout dataset only. Because the dataset is generated using predefined URL patterns and templates, the reported metrics should not be interpreted as evidence of equivalent performance on real-world phishing URLs. Independent evaluation using verified external datasets is required to establish real-world generalization.

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

### Option 3: Manual Command Line Startup
**Terminal 1 (Backend):**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

---

## 🎓 Faculty Evaluation & Viva Demo Accounts

For faculty evaluation and project demonstration, PhishGuard provides pre-configured demonstration accounts and quick-login options.

**Available demonstration roles:**

- **Lead Security Auditor (Admin):** Provides access to system-wide analytics, researcher management, model evaluation, dataset provenance, and model retraining.
- **Student Researcher:** Provides access to URL scanning, personal scan history, and user-level threat analytics.

**Login Instructions:**

Use the demonstration login options available on the Login page, or use the credentials provided separately by the project team during the faculty demonstration.

**Security Note:** Demonstration credentials should not be published in public repositories. Change default passwords before deployment or public distribution.

### Quick-Test URL Samples Built into Scanner

The following URLs are illustrative test inputs for demonstrating different URL structures and detection indicators. Their classifications are produced by the PhishGuard model and should not be treated as independently verified threat intelligence.

1. `https://en.wikipedia.org/wiki/Phishing` — Standard HTTPS URL.
2. `http://192.168.1.100/paypal/login.php?cmd=update` — Direct IP address with a suspicious login path.
3. `https://appleid.apple.com.secure-update-notice.top/account` — Brand-name impersonation through a nested subdomain.
4. `http://bit.ly/34xPaypalSecurityAlert` — URL shortener example.
5. `http://google.com@phish-credentials-steal.net/auth/verify` — URL containing an `@` symbol and a deceptive hostname pattern.
---

## 📂 Project Architecture & Documentation Index
Comprehensive academic project documentation is organized in `docs/`:
- [`01_SRS_PhishGuard.md`](docs/01_SRS_PhishGuard.md) - Software Requirements Specification (IEEE 830).
- [`02_System_Architecture.md`](docs/02_System_Architecture.md) - High-level system architecture & diagrams.
- [`03_Use_Case_Diagram.md`](docs/03_Use_Case_Diagram.md) - Use case diagrams & actor workflows.
- [`04_Data_Flow_Diagrams.md`](docs/04_Data_Flow_Diagrams.md) - DFD Level 0 & Level 1 decomposition.
- [`05_Database_ER_Diagram.md`](docs/05_Database_ER_Diagram.md) - Database schema & relational ER diagram.
- [`06_Machine_Learning_Methodology.md`](docs/06_Machine_Learning_Methodology.md) - Mathematical formulations & model theory.
- [`07_Testing_Documentation.md`](docs/07_Testing_Documentation.md) - Test cases & Pytest execution logs.
- [`08_Results_and_Limitations.md`](docs/08_Results_and_Limitations.md) - Performance benchmarks & edge case limits.
- [`10_Installation_and_Execution_Guide.md`](docs/10_Installation_and_Execution_Guide.md) - Windows execution troubleshooting.
- [`11_Academic_Project_Report.md`](docs/11_Academic_Project_Report.md) - Complete University Thesis Report (8 Chapters).
- [`12_Presentation_Slides.md`](docs/12_Presentation_Slides.md) - 15 Defense slides with presenter notes.
- [`13_Viva_Questions_and_Answers.md`](docs/13_Viva_Questions_and_Answers.md) - 35 In-depth Viva Q&A covering ML, XAI, and Security.
