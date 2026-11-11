# FACULTY DEFENSE & VIVA PRESENTATION SLIDES

## PhishGuard: Explainable Machine Learning-Based Phishing URL Detection System

**Capstone Project Examination · Department of Computer Science & Engineering**

---

### SLIDE 1: TITLE SLIDE

```text
================================================================================
                                PHISHGUARD
       Explainable Machine Learning-Based Phishing URL Detection System
================================================================================
Project: B.Tech Computer Science & Engineering Capstone
Academic Year: 2025–2026
Technology Stack: Python, FastAPI, Scikit-Learn, React, Tailwind CSS, SQLite
================================================================================
```

**Presenter Notes:**

"Good morning, respected faculty members. Today, we are presenting PhishGuard, a machine-learning-based phishing URL detection system. It analyzes URL characteristics, predicts potential phishing risk, and provides understandable indicators to help users interpret the result."

---

### SLIDE 2: THE PROBLEM STATEMENT

**The Challenge of Phishing URL Detection**

- Phishing URLs can imitate legitimate websites to deceive users.
- Traditional blacklist-based approaches depend on previously identified and reported malicious URLs.
- Newly created or modified phishing URLs may not immediately appear in existing blocklists.
- Machine-learning systems can identify suspicious URL patterns, but their predictions should be understandable to users.

**The Project's Motivation**

Develop a system that analyzes URL characteristics and presents both a prediction and understandable diagnostic indicators.

**Presenter Notes:**

"Phishing detection is challenging because malicious URLs can be newly created, modified, or designed to resemble legitimate websites. Our project explores how machine learning can identify suspicious URL patterns and how understandable explanations can make the output more useful."

---

### SLIDE 3: PROJECT OBJECTIVES & CORE CONTRIBUTIONS

1. **URL-Based Analysis:** Analyze submitted URLs using lexical and structural characteristics.
2. **20-Feature Engineering:** Extract URL indicators such as length, entropy, IP-address usage, subdomain structure, and suspicious keywords.
3. **Comparative ML Modeling:** Train and evaluate Random Forest and Logistic Regression models using a project-generated synthetic dataset.
4. **Interpretable Results:** Present model predictions alongside heuristic, human-readable diagnostic indicators.
5. **Full-Stack Application:** Provide user authentication, URL scanning, scan history, dashboards, and administrative features.

---

### SLIDE 4: SYSTEM ARCHITECTURE

**Presentation Layer**
- React frontend
- Vite development and build tooling
- Tailwind CSS interface
- Dashboard visualizations

**Backend and Application Layer**
- Python and FastAPI
- REST API endpoints
- User authentication and scan management
- URL feature extraction and prediction

**Machine Learning Layer**
- Scikit-Learn
- Random Forest Classifier
- Logistic Regression
- Feature preprocessing and evaluation

**Persistence Layer**
- SQLite database
- SQLAlchemy-based database interaction
- User and scan-history records

**Presenter Notes:**

"The frontend communicates with the FastAPI backend through API endpoints. The backend handles authentication, URL analysis, prediction, and database operations. The machine-learning components perform classification using extracted URL features."

---

### SLIDE 5: DATASET PROVENANCE & PREPARATION

**Dataset Name:** PhishGuard Synthetic URL Benchmark

| Dataset property | Value |
|---|---:|
| Total samples | 1,355 |
| Benign samples (label 0) | 710 |
| Phishing-like samples (label 1) | 645 |
| Training samples | 1,084 |
| Testing samples | 271 |
| Features | 20 |

**Data Generation Method**
- Manually defined benign and phishing-like URL patterns.
- Template-based expansion of URL examples.
- Examples generated using domain structures, suspicious keywords, and URL characteristics.
- Exact duplicate URLs are removed during dataset preparation.

**Important Dataset Limitation**
- The dataset is synthetic and generated within the project.
- No external dataset records are directly imported.
- It is not a verified real-world phishing or benign URL collection.
- It is not separately licensed.

**Presenter Notes:**

"An important point about our dataset is that it is project-generated synthetic data. We use manually defined URL patterns and template-based expansion. Therefore, the reported evaluation measures performance on this synthetic benchmark, not generalization to real-world phishing traffic."

---

### SLIDE 6: FEATURE ENGINEERING

The system extracts 20 lexical and structural URL features.

**Representative Features**

1. **URL Length:** Measures the total length of a submitted URL.
2. **Shannon Character Entropy:** Measures character-distribution complexity.

   \[
   H(X)=-\sum_x p(x)\log_2 p(x)
   \]

3. **Subdomain Structure:** Examines the number of subdomains in a hostname.
4. **Digit Ratio:** Measures the proportion of numeric characters.
5. **IP Address Usage:** Detects URLs using IP addresses as hosts.
6. **Suspicious Keywords:** Identifies selected terms associated with credential requests or urgency.
7. **Special Character Indicators:** Examines characters such as `@` and hyphens.
8. **URL Shortener Indicator:** Identifies recognized URL-shortening services.

**Example**

`http://192.168.1.100/paypal/login.php`

This example contains an IP-address host and a path containing a recognizable brand name and login-related term. These are indicators for analysis, not proof that a URL is malicious.

**Presenter Notes:**

"Feature engineering converts a URL into numerical values that machine-learning algorithms can process. These features describe the URL's structure and lexical patterns. No single feature is sufficient to establish that a website is malicious."

---

### SLIDE 7: MACHINE LEARNING MODEL SELECTION

**Model 1: Logistic Regression**
- Used as a linear classification baseline.
- Estimates the probability of a URL belonging to a particular class.
- Provides a comparison against a non-linear model.

**Model 2: Random Forest Classifier**
- Uses an ensemble of decision trees.
- Can capture non-linear relationships among URL features.
- Selected as the primary prediction model in the application.

**Training and Evaluation**
- Stratified train/test split.
- Training data: 1,084 samples.
- Holdout test data: 271 samples.
- StandardScaler preprocessing is used for Logistic Regression.

**Presenter Notes:**

"We selected two different classification approaches to compare a linear baseline with an ensemble-based model. Both models were evaluated using the same synthetic benchmark and holdout split."

---

### SLIDE 8: EMPIRICAL BENCHMARK EVALUATION

**Holdout Test Results — Synthetic Benchmark (N = 271)**

| Metric | Random Forest | Logistic Regression |
|---|---:|---:|
| Accuracy | 100% | 100% |
| Precision | 100% | 100% |
| Recall | 100% | 100% |
| F1-score | 100% | 100% |

**Interpretation**
- Both models classified all samples in the current synthetic holdout test set correctly.
- The results demonstrate performance on the generated benchmark.
- They do not establish 100% accuracy on real-world phishing URLs.
- Similarity between generated training and testing patterns may limit the strength of the evaluation.

**Presenter Notes:**

"Both models achieved 100% on the current synthetic holdout benchmark. However, we do not interpret this as proof of perfect real-world phishing detection. The generated dataset may contain recurring patterns across training and testing samples, and evaluation on independently collected real-world data is necessary."

---

### SLIDE 9: CONFUSION MATRIX

**Random Forest — Holdout Test Set (N = 271)**

| Actual / Predicted | Benign | Phishing |
|---|---:|---:|
| Benign | 142 | 0 |
| Phishing | 0 | 129 |

**Classification Summary**
- True Negatives: 142
- False Positives: 0
- False Negatives: 0
- True Positives: 129

**Logistic Regression**

The current evaluation also reports a confusion matrix of:

| Actual / Predicted | Benign | Phishing |
|---|---:|---:|
| Benign | 142 | 0 |
| Phishing | 0 | 129 |

**Important:** These confusion matrices describe the synthetic test set only.

**Presenter Notes:**

"The confusion matrices show that both models classified all 271 holdout samples correctly. This is a result of the current synthetic benchmark and should not be interpreted as a guarantee that the application will never make an incorrect prediction."

---

### SLIDE 10: FEATURE IMPORTANCE

**Random Forest Feature Importance**

The Random Forest model provides feature-importance information based on its fitted decision trees.

The application presents feature-importance rankings to help users understand which extracted features were influential in the trained model.

**Examples of Feature Categories**
- URL length and structure
- IP-address usage
- Subdomain characteristics
- Suspicious keyword indicators
- Special-character patterns
- Character entropy

**Interpretation**
- Feature importance is a model-level measure.
- It does not prove that a feature causes phishing.
- Importance values depend on the generated dataset and trained model.
- Exact rankings and percentages should be taken from the current model output.

**Presenter Notes:**

"Feature importance helps us inspect the model at a global level. We avoid presenting fixed percentages in this slide because those values should be taken from the actual trained model rather than assumed or manually estimated."

---

### SLIDE 11: EXPLAINABILITY & DIAGNOSTIC INDICATORS

**Two Different Types of Interpretation**

**1. Global Model Interpretation**
- Displays feature-importance information from the Random Forest model.
- Helps identify features that influenced the model across the dataset.

**2. Local Heuristic Explanation**
- Presents URL characteristics detected in an individual scan.
- Displays human-readable risk indicators and diagnostic descriptions.
- Helps users understand why certain URL characteristics are suspicious.

**Important Technical Distinction**
- Local explanations are heuristic indicators.
- They are not SHAP or LIME explanations.
- They are not direct mathematical attributions of the model's predicted probability.
- Individual explanation impacts do not necessarily sum to the model's risk score.

**Presenter Notes:**

"Our application provides two forms of interpretability. The first is global feature importance from the trained Random Forest. The second is a local heuristic explanation that describes suspicious characteristics of an individual URL. These local explanations are not direct SHAP or LIME attributions."

---

### SLIDE 12: APPLICATION SECURITY & URL ANALYSIS

**URL Analysis**
- The application extracts features from the submitted URL.
- The prediction workflow analyzes URL characteristics.
- The scanner does not need to open the submitted destination webpage to perform its lexical and structural analysis.

**Authentication**
- User registration and login.
- Password hashing.
- JWT-based authentication.
- Protected application endpoints.

**Data Management**
- User-specific scan history.
- Stored scan results.
- Administrative access to system-level information.

**Security Scope**
- The application is a URL-classification prototype.
- It is not a browser isolation system or malware sandbox.
- Its classification result should not be treated as a guarantee of website safety.

---

### SLIDE 13: LIVE APPLICATION DEMONSTRATION

**Demonstration Workflow**

1. **Landing Page:** Introduce the application and URL scanning interface.
2. **User Authentication:** Demonstrate login and registration.
3. **URL Scanner:** Submit a sample URL and view its classification.
4. **Diagnostic Breakdown:** Inspect extracted URL indicators and heuristic explanations.
5. **Scan History:** View previously submitted URLs and their results.
6. **User Dashboard:** Review scanning statistics and history.
7. **Admin Portal:** Demonstrate model metrics, feature importance, user information, and retraining functionality.

**Suggested Demonstration Inputs**

- `https://www.google.com`
- `http://192.168.1.100/paypal/login`

These are illustrative test inputs, not independently verified threat-intelligence examples.

**Presenter Notes:**

"During the demonstration, we will show the complete workflow, starting from authentication and URL submission to prediction, diagnostic interpretation, scan history, and the administrative dashboard."

---

### SLIDE 14: SYSTEM LIMITATIONS

**1. Synthetic Dataset**
- The current benchmark is generated from manually defined patterns.
- It does not represent the full diversity of real-world phishing URLs.
- Future improvement: evaluate on independently collected and verified datasets.

**2. Compromised Legitimate Domains**
- A legitimate domain can host malicious content.
- URL-level lexical analysis may not identify every such case.
- Future improvement: incorporate additional contextual and reputation signals.

**3. Internationalized Domain Name Attacks**
- Visually similar Unicode characters can be used to imitate legitimate domains.
- Future improvement: strengthen IDN and Punycode normalization and analysis.

**4. Shortened URLs**
- The destination of a shortened URL may not be visible from its original string.
- The system can identify recognized shorteners but does not establish the final destination through redirect resolution.

**5. Heuristic Explanation Limitations**
- Local explanations are rule-based indicators.
- They are not exact model-probability attributions.
- Future improvement: integrate validated explanation methods such as SHAP or LIME.

---

### SLIDE 15: CONCLUSION & FUTURE WORK

**Conclusion**

PhishGuard is a full-stack phishing URL classification prototype that combines:

- 20 URL-based lexical and structural features.
- Random Forest and Logistic Regression classification.
- A project-generated synthetic benchmark.
- Global model feature-importance information.
- Local heuristic diagnostic explanations.
- User authentication, scan history, dashboards, and administrative functionality.

**Current Evaluation**
- Synthetic benchmark size: 1,355 samples.
- Holdout test size: 271 samples.
- Random Forest accuracy: 100%.
- Logistic Regression accuracy: 100%.

These results are limited to the synthetic benchmark and do not establish real-world detection accuracy.

**Future Work**
- Evaluation using independently collected real-world datasets.
- Stronger train/test separation to reduce pattern leakage.
- Improved IDN and URL normalization.
- Additional domain reputation and contextual signals.
- Validated local explanation techniques.
- Browser extension integration.

**Thank You**

"We welcome your questions."

---

### FINAL PRESENTATION REMINDER

Before the defense:

- Use the actual application for screenshots.
- Use current model metrics and confusion matrices.
- Do not claim real-world accuracy of 100%.
- Do not claim the dataset was imported from external repositories.
- Do not claim that local heuristic explanations are SHAP/LIME attributions.
- Do not quote unmeasured inference latency or unsupported model hyperparameters.
- Be prepared to explain why synthetic benchmark results may not generalize to real-world phishing URLs.