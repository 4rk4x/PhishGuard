# DATA FLOW DIAGRAMS (DFD)
## PhishGuard: Explainable Machine Learning-Based Phishing URL Detection System

---

### 1. DFD LEVEL 0: CONTEXT DIAGRAM

The Context Diagram defines the external boundary of PhishGuard, illustrating data inflows and outflows between human actors and the centralized system entity.

```mermaid
flowchart TD
    Researcher(("Researcher / Student"))
    Admin(("Faculty / Auditor"))
    System["0.0 PhishGuard Detection System"]
    
    Researcher -->|1. Raw URL Input & Auth Credentials| System
    System -->|2. Risk Score, Classification, & XAI Report| Researcher
    System -->|3. Dashboard Telemetry & Historical Scans| Researcher

    Admin -->|4. Admin Credentials & Retrain Trigger| System
    System -->|5. ML Metrics, Confusion Matrix & Audit Logs| Admin
```

---

### 2. DFD LEVEL 1: FUNCTIONAL DECOMPOSITION

The Level 1 DFD decomposes process `0.0` into sub-processes: Input Sanitization, Feature Engineering, Machine Learning Inference, Explainability Attribution, and Telemetry Persistence.

```mermaid
flowchart TD
    subgraph Processes
        P1["1.0 Validate & Defang Input URL"]
        P2["2.0 Extract Heuristic Features (20 Signals)"]
        P3["3.0 Normalize & Scale Feature Vector"]
        P4["4.0 Model Inference (Random Forest)"]
        P5["5.0 Explainable AI Attribution Engine"]
        P6["6.0 Telemetry & History Logger"]
        P7["7.0 Model Governance & Retraining Engine"]
    end

    subgraph Data_Stores
        DS1[("D1: Users Registry")]
        DS2[("D2: Scans Audit Store")]
        DS3[("D3: Benchmark Dataset & Models")]
    end

    User(("Researcher / User")) -->|Raw URL| P1
    P1 -->|Defanged URL| P2
    P2 -->|Raw Numerical Vector| P3
    P3 -->|Scaled Feature Vector| P4
    
    DS3 -.->|Trained Model Pipeline| P4
    P4 -->|Phishing Probability & Class| P5
    P2 -.->|Extracted Heuristics| P5
    
    P5 -->|XAI Breakdown & Verdict| P6
    P1 -.->|Client Metadata & Defanged URL| P6
    
    P6 -->|Write Audit Record| DS2
    P6 -->|Visual Results & XAI Report| User

    Admin(("Admin / Faculty")) -->|Trigger Retrain| P7
    P7 <-->|Re-read & Re-fit Data| DS3
    P7 -->|Updated Metrics JSON| Admin
```

---

### 3. PROCESS DATA DICTIONARY

| Process ID | Name | Input Data Flows | Output Data Flows | Transformation Description |
| :--- | :--- | :--- | :--- | :--- |
| **P1.0** | Validate & Defang | Raw URL String | Defanged URL, Target Host | Verifies RFC syntax; transforms `http://` to `hxxp[://]`, replaces domain dots with `[.]`. |
| **P2.0** | Feature Extraction | Defanged URL, Host | 20-D Numerical Feature Vector | Computes character entropy, counts dots, hyphens, subdomains, checks IP format, scans keyword list. |
| **P3.0** | Normalize & Scale | 20-D Vector | Scaled Vector $\hat{X}$ | Applies trained `StandardScaler` mean and variance parameters without leakage. |
| **P4.0** | Model Inference | Scaled Vector $\hat{X}$ | Probability $P \in [0,1]$ | Passes vector across 100 decision trees to derive class vote and ensemble probability. |
| **P5.0** | XAI Attribution | Heuristics, Probability | Structured XAI List | Compares each feature against normative threshold, calculating score contribution and plain-English reasons. |
| **P6.0** | Telemetry Logger | XAI Report, User ID | Persisted Row, UI DTO | Commits transaction to SQLite `scans` table and packages JSON response for client. |
| **P7.0** | Retrain Engine | Admin Token | Metrics Summary | Executes stratified 80/20 train/test split on Tranco/PhishTank data and updates joblib artifacts. |

