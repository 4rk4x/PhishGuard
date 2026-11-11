# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
## PhishGuard: Explainable Machine Learning-Based Phishing URL Detection System
**Document Version:** 1.0.0  
**Standard:** IEEE Std 830-1998 Recommended Practice for Software Requirements Specifications  
**Department:** Computer Science & Engineering  
**Project Category:** Senior Undergraduate / Master Capstone Semester Project  

---

### 1. INTRODUCTION

#### 1.1 Purpose
The purpose of this document is to define the functional, non-functional, security, and interface requirements for **PhishGuard**, an academic-grade, explainable machine-learning-based phishing URL detection web platform. This document serves as the formal baseline for development, evaluation, and viva examination by university faculty.

#### 1.2 Scope of the System
PhishGuard is designed to ingest raw uniform resource locators (URLs), perform zero-execution heuristic analysis, extract 20 lexical, syntactic, and information-theoretic indicators, execute machine learning inference via an ensemble Random Forest model, and generate human-interpretable feature attribution (Explainable AI - XAI). The system prevents credential theft, phishing redirection, and drive-by malware hazards without establishing outbound network connections to suspect servers.

#### 1.3 Definitions, Acronyms, and Abbreviations
- **XAI:** Explainable Artificial Intelligence.
- **FQDN:** Fully Qualified Domain Name.
- **DGA:** Domain Generation Algorithm.
- **MDI:** Mean Decrease in Impurity (Gini Feature Importance).
- **ROC-AUC:** Receiver Operating Characteristic - Area Under Curve.
- **Defanged URL:** A transformed representation (e.g., `hxxps[://]domain[.]com`) rendering URLs non-executable and unclickable.
- **Zero-Execution Sandbox:** An analytical paradigm in which URL features are evaluated strictly via lexical parsing without rendering HTML, running JavaScript, or downloading external payloads.

#### 1.4 References
1. IEEE Std 830-1998: *IEEE Recommended Practice for Software Requirements Specifications*.
2. Le Pochat, V., et al. (2019). *Tranco: A Research-Oriented Top Sites Ranking Hardened Against Manipulation*. NDSS.
3. Hannousse, A., & Yahi, S. (2020). *Towards benchmark datasets for phishing websites detection*. Mendeley Data.
4. Lundberg, S. M., & Lee, S. I. (2017). *A Unified Approach to Interpreting Model Predictions*. NeurIPS.

---

### 2. OVERALL SYSTEM DESCRIPTION

#### 2.1 Product Perspective
PhishGuard operates as a self-contained, microservice-architected client-server application. It interfaces with an asynchronous FastAPI backend running scikit-learn models and an embedded SQLite transactional database, coupled with a responsive React/Vite dashboard adhering to a strict cybersecurity visual aesthetic (#101827 deep navy, #F8FAFC white, #27D17F electric green).

#### 2.2 User Classes and Characteristics
1. **Student / Academic Researcher (Standard User):**
   - Submits single or batch URLs for analysis.
   - Inspects risk score dials, confidence bounds, and XAI feature contributions.
   - Searches, filters, and exports personal historical audit telemetry.
2. **Lead Security Auditor / Faculty Examiner (Administrator):**
   - Monitors global user telemetry and aggregate system threat ratios.
   - Evaluates machine learning benchmarks (Random Forest vs. Logistic Regression).
   - Inspects live confusion matrices and ROC-AUC curves.
   - Triggers pipeline retraining on the verified benchmark dataset.

#### 2.3 Operating Environment
- **Server:** Python 3.10+, FastAPI 0.109+, Uvicorn ASGI on Windows/Linux.
- **Client:** Modern Chromium or Gecko-based browser (Chrome, Edge, Firefox).
- **Database:** SQLite 3 with foreign key enforcement.

---

### 3. SPECIFIC SYSTEM REQUIREMENTS

#### 3.1 Functional Requirements (FR)

| Req ID | Module | Description | Priority |
| :--- | :--- | :--- | :--- |
| **FR-01** | Scanner | Ingest user URLs with real-time RFC syntax validation and whitespace rejection. | High |
| **FR-02** | Security | Defang all ingested URLs immediately before storage or UI presentation. | Critical |
| **FR-03** | ML Pipeline | Extract 20 lexical, structural, and information-theoretic features in < 50ms. | High |
| **FR-04** | Inference | Run Random Forest (100 estimators) classifier and generate risk score (0-100). | High |
| **FR-05** | Explainability | Deconstruct prediction weights and assign compliance status, baseline delta, and plain-English reasons. | Critical |
| **FR-06** | History | Record scan timestamp, client IP, model used, and JSON feature snapshots into SQLite. | High |
| **FR-07** | Telemetry | Generate 7-day scanning volume, threat distribution donut charts, and top threat indicator bars. | Medium |
| **FR-08** | Auth | Register and authenticate researchers via Bcrypt password hashing and JWT bearer tokens. | High |
| **FR-09** | Admin | Display model comparison table, confusion matrices, and trigger pipeline retraining. | High |
| **FR-10** | Quick Demo | Provide 1-click preset logins and sample URL test buttons for faculty examination. | Medium |

#### 3.2 Non-Functional Requirements (NFR)

##### 3.2.1 Performance Requirements
- **NFR-01 (Inference Latency):** URL feature extraction and Random Forest inference must execute in under 100 milliseconds on commodity hardware.
- **NFR-02 (API Throughput):** The FastAPI asynchronous ASGI server must handle concurrent scanning requests with sub-second response times.

##### 3.2.2 Security Requirements
- **NFR-03 (Zero Outbound Request Execution):** Under no circumstance shall the scanner issue an HTTP GET/POST or DNS resolution request to suspect destination domains.
- **NFR-04 (Cryptographic Integrity):** User passwords must be hashed using Bcrypt with automatic salt generation. Secret keys must be managed via `.env`.
- **NFR-05 (Defanged Presentation):** UI must present URLs in non-clickable defanged strings (`hxxps[://]...`) to avoid accidental client-side activation.

##### 3.2.3 Usability & Design Constraints
- **NFR-06 (Strict Palette):** The visual design must adhere strictly to Deep Navy (`#101827`), Offwhite (`#F8FAFC`), and Electric Green (`#27D17F`), with clean semantic accents for threats.
- **NFR-07 (Explainability Usability):** Technical machine learning outputs must be mapped to plain-language explanations understandable by non-technical investigators.

---

### 4. EXTERNAL INTERFACE REQUIREMENTS
- **Web Interface:** React 18 SPA delivered via Vite over HTTP port 5173.
- **REST API:** Asynchronous OpenAPI JSON specifications over HTTP port 8000.
- **Database Engine:** SQLite 3 file-based persistent transactional store.

