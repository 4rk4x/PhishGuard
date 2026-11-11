# ACADEMIC CSE SEMESTER CAPSTONE PROJECT REPORT

# PhishGuard: An Explainable Machine Learning-Based Phishing URL Detection System

**Academic Year:** 2025–2026  
**Degree:** Bachelor of Technology in Computer Science and Engineering  
**Project Domain:** Cybersecurity and Machine Learning

---

# ABSTRACT

Phishing is a form of social engineering in which attackers use deceptive websites and URLs to trick users into revealing sensitive information, including login credentials and financial details. Traditional URL detection approaches often rely on previously identified malicious URLs, which may not cover newly created or modified phishing addresses.

This project introduces **PhishGuard**, an academic web-based phishing URL classification platform that combines lexical URL analysis, machine learning, and human-readable explanations.

The system extracts 20 lexical and structural features from submitted URLs without accessing or loading the destination website. These features are processed by supervised machine learning classifiers, including Random Forest and Logistic Regression, to estimate whether a URL resembles phishing-like patterns in the training dataset.

PhishGuard also provides a web interface for URL scanning, user authentication, personal scan history, statistical dashboards, and administrative model evaluation. Its explainability layer presents relevant URL characteristics through heuristic indicators to help users understand potentially suspicious patterns.

The project uses a synthetic benchmark containing 1,355 samples, consisting of 710 benign and 645 phishing-like examples. An 80:20 stratified train-test split was used, resulting in 1,084 training samples and 271 testing samples. Both Random Forest and Logistic Regression achieved 100% accuracy on this particular synthetic holdout test partition.

These results demonstrate the classification performance of the models on the generated benchmark. They do not establish equivalent performance on independently collected real-world phishing URLs.

The platform is implemented using React and Vite for the frontend, FastAPI for the backend, Python-based machine learning components, and SQLite for data persistence.

**Keywords:** Phishing Detection, Machine Learning, Random Forest, Logistic Regression, Explainable AI, URL Analysis, Cybersecurity.

---

# TABLE OF CONTENTS

1. Chapter 1: Introduction
2. Chapter 2: Literature Review
3. Chapter 3: System Requirements and Analysis
4. Chapter 4: System Design and Architecture
5. Chapter 5: Machine Learning and Feature Engineering
6. Chapter 6: Implementation and Security
7. Chapter 7: Experimental Results and Evaluation
8. Chapter 8: Conclusion, Limitations and Future Work
9. References

---

# CHAPTER 1: INTRODUCTION

## 1.1 Background and Motivation

The internet is widely used for communication, education, financial transactions, shopping, and information sharing. However, its widespread adoption has also increased opportunities for cybercriminal activities.

One common threat is phishing. In phishing attacks, attackers create deceptive URLs and websites that imitate legitimate services to persuade users to disclose confidential information.

A phishing URL may contain:

- Misleading domain names.
- Suspicious subdomains.
- Unusual character combinations.
- IP addresses instead of recognizable domain names.
- Deceptive keywords and URL paths.
- URL shortening services that conceal the final destination.

Traditional detection approaches frequently depend on previously identified malicious addresses. Such approaches may not immediately recognize newly generated or modified URLs.

Machine learning provides another approach by identifying patterns in URL characteristics and using those patterns to classify submitted addresses.

However, classification systems should also provide understandable information about potentially suspicious URL characteristics.

These considerations motivated the development of PhishGuard.

## 1.2 Problem Statement

The project addresses the following problems:

1. **Previously unseen URLs:** Previously recorded malicious URL lists may not contain newly generated phishing addresses.
2. **Deceptive URL structures:** Attackers may use unusual domain structures, suspicious keywords, IP addresses, and other lexical patterns.
3. **Limited interpretability:** A classification result without understandable supporting information can be difficult for users to evaluate.
4. **Lack of accessible analysis tools:** Users need a straightforward interface for submitting URLs and reviewing their analysis results.
5. **Scan record management:** Users may need to review previously submitted URLs and their associated results.

PhishGuard addresses these problems through a web-based URL classification system that combines machine learning with supplementary heuristic explanations.

## 1.3 Project Objectives

The primary objective is to design and implement an academic phishing URL detection platform.

The specific objectives are:

- Develop a web interface for submitting URLs for analysis.
- Extract 20 lexical and structural URL features.
- Implement Random Forest and Logistic Regression classifiers.
- Estimate phishing risk using machine learning predictions.
- Provide human-readable heuristic explanations.
- Implement user registration and authentication.
- Maintain individual scan histories.
- Provide statistical dashboards for reviewing scan activity.
- Develop an administrative portal for system monitoring and model evaluation.
- Evaluate the classifiers using a documented synthetic benchmark.

## 1.4 Scope and Boundaries

PhishGuard focuses on the analysis of submitted URL strings.

The system:

- Examines URL text and structural characteristics.
- Uses trained machine learning classifiers.
- Generates classification results and risk estimates.
- Displays supplementary heuristic explanations.
- Maintains user-related scan records.
- Provides administrative statistics and model evaluation information.

The system does not currently provide:

- Guaranteed detection of all real-world phishing attacks.
- Live website content inspection.
- Comprehensive DNS or WHOIS reputation analysis.
- Automatic browser-level navigation blocking.
- Guaranteed detection of dynamic redirects or cloaking.
- Independently verified threat-intelligence classification.

PhishGuard is an academic prototype and should not be considered a replacement for commercial security infrastructure.

---

# CHAPTER 2: LITERATURE REVIEW

## 2.1 Blacklist-Based Detection Approaches

Blacklist-based detection systems compare submitted URLs or domains against collections of previously identified malicious addresses.

These approaches can be useful when a malicious URL has already been identified and recorded.

However, previously unseen URLs may not be present in existing lists. Modified URLs and newly registered domains may also require additional investigation.

This creates an opportunity for classification approaches that examine the characteristics of a URL rather than relying exclusively on previously recorded addresses.

## 2.2 Machine Learning in Malicious URL Detection

Machine learning has been investigated for identifying malicious websites and URLs through patterns in their lexical, structural, and host-related characteristics.

Ma et al. (2009) explored the use of machine learning techniques for detecting malicious websites from suspicious URLs.

Traditional classification algorithms such as Logistic Regression and Random Forest can be used to learn relationships between extracted features and class labels.

In PhishGuard, these algorithms are implemented and evaluated using a project-generated synthetic URL benchmark.

## 2.3 Explainability in Cybersecurity

Machine learning predictions may be difficult to interpret when users are provided only with a classification label or numerical score.

Explainability techniques aim to make model outputs easier to understand.

Lundberg and Lee (2017) introduced SHAP, a framework for interpreting model predictions through feature attribution.

PhishGuard adopts a simpler approach by presenting global Random Forest feature-importance information alongside local heuristic explanations based on URL characteristics.

The local heuristic explanations are supplementary indicators and are not direct mathematical attributions of the model's predicted probability.

## 2.4 Research Gap and Project Motivation

The project focuses on combining several components within one academic application:

- Lexical and structural URL analysis.
- Traditional supervised machine learning.
- Human-readable heuristic explanations.
- User authentication and scan history.
- Administrative monitoring and model evaluation.

The main contribution is an integrated demonstration platform rather than a claim of developing a new state-of-the-art phishing detection algorithm.

---

# CHAPTER 3: SYSTEM REQUIREMENTS AND ANALYSIS

## 3.1 Software Requirements

The project uses the following technologies:

| Component | Technology |
|---|---|
| Frontend | React |
| Frontend development and build | Vite |
| Backend framework | FastAPI |
| Programming language | Python |
| Machine learning | Scikit-learn |
| Data processing | Python data-processing libraries |
| Database | SQLite |
| Database interaction | SQLAlchemy |
| API communication | REST API |
| Development environment | Visual Studio Code / Antigravity |

Exact dependency versions are maintained in the project's package and Python dependency files.

## 3.2 Functional Requirements

The main functional requirements include:

**1. User Authentication**
- User registration.
- User login.
- Authentication-based access to protected features.
- User logout.

**2. URL Scanning**
- Accept URL submissions.
- Perform URL validation and feature extraction.
- Generate machine learning predictions.
- Display classification results and risk estimates.

**3. Explainability**
- Present relevant URL characteristics.
- Display heuristic indicators.
- Provide global model feature-importance information.

**4. Scan History**
- Store scan records.
- Display personal scan history.
- Open individual scan details.

**5. Statistical Dashboard**
- Present scan statistics.
- Display relevant risk and classification information.

**6. Administrative Portal**
- Display system-wide statistics.
- Review registered users.
- Review model evaluation information.
- Access model retraining functionality.

## 3.3 Non-Functional Requirements

The system is designed around the following non-functional requirements:

- **Usability:** Provide a clear and accessible web interface.
- **Maintainability:** Separate frontend, backend, machine learning, and database responsibilities.
- **Reliability:** Validate inputs and handle application errors.
- **Security:** Protect authenticated endpoints and user-specific records.
- **Performance:** Provide responsive URL analysis through the backend API.
- **Interpretability:** Present supplementary explanations alongside classification results.

Specific latency and resource-consumption guarantees are not claimed because controlled benchmarks have not been documented.

## 3.4 Feasibility Study

### Technical Feasibility

The project uses established open-source technologies, including React, FastAPI, Python, Scikit-learn, and SQLite.

These technologies provide the required functionality for developing a web-based machine learning application.

### Economic Feasibility

The project primarily uses open-source development tools and libraries. Therefore, a basic development environment can be established without requiring expensive commercial software licenses.

### Operational Feasibility

The application provides a browser-based interface through which users can submit URLs and review analysis results.

Its authentication and scan-history features support individual user workflows.

---

# CHAPTER 4: SYSTEM DESIGN AND ARCHITECTURE

## 4.1 System Architecture

PhishGuard follows a modular client-server architecture.

The major components are:

**1. Presentation Layer**

The React frontend provides the user interface for authentication, URL scanning, scan history, dashboards, and administrative functions.

**2. Application Layer**

The FastAPI backend exposes REST API endpoints and manages application workflows, request validation, authentication, and database operations.

**3. Machine Learning Layer**

The Python machine learning modules perform URL feature extraction, model prediction, risk estimation, and supporting explanation generation.

**4. Persistence Layer**

The SQLite database stores application records, including user and scan-related information.

## 4.2 Application Data Flow

The URL analysis workflow can be summarized as follows:

1. The user submits a URL through the frontend.
2. The frontend sends the request to the backend API.
3. The backend validates and processes the submitted URL.
4. The feature extraction module generates the URL feature vector.
5. The trained classification model generates a prediction.
6. The application calculates and formats the risk estimate.
7. The explanation layer generates supplementary heuristic indicators.
8. The result is returned to the frontend.
9. The scan record is stored according to the application's authentication and persistence workflow.
10. The frontend displays the analysis result.

## 4.3 Database Design

PhishGuard uses SQLite for persistent application data.

The database supports user-related information and URL scan records.

The application uses database models and SQLAlchemy-based database operations to manage stored records.

User-related scan histories are associated with their respective authenticated accounts. Anonymous scan records may also contribute to system-wide statistics.

## 4.4 API Architecture

The backend exposes API endpoints for authentication, URL scanning, history management, administration, and machine learning evaluation.

Major API route groups include:

| Route | Purpose |
|---|---|
| `/api/auth/register` | User registration |
| `/api/auth/login` | User authentication |
| `/api/auth/me` | Retrieve authenticated user information |
| `/api/auth/quick-demo-login` | Demonstration login |
| `/api/scan/analyze` | Analyze submitted URLs |
| `/api/scan/history` | Retrieve scan history |
| `/api/scan/{scan_id}` | Retrieve an individual scan |
| `/api/scan/stats/summary` | Retrieve scan statistics |
| `/api/admin/overview` | Administrative overview |
| `/api/admin/users` | Registered user information |
| `/api/admin/retrain` | Model retraining operation |
| `/api/ml/metrics` | Machine learning evaluation metrics |

---

# CHAPTER 5: MACHINE LEARNING AND FEATURE ENGINEERING

## 5.1 Dataset Provenance

PhishGuard uses a project-generated synthetic benchmark named:

**PhishGuard Synthetic URL Benchmark**

The dataset is created using manually defined benign and phishing-like URL patterns expanded through predefined templates.

No records are directly imported from external threat-intelligence repositories.

| Dataset Property | Value |
|---|---:|
| Dataset type | Synthetic |
| External data imported | No |
| License | Not separately licensed |
| Total samples | 1,355 |
| Benign samples | 710 |
| Phishing-like samples | 645 |
| Training samples | 1,084 |
| Testing samples | 271 |
| Feature count | 20 |

The generated dataset is intended for controlled academic experimentation. It is not a collection of independently verified real-world malicious and legitimate URLs.

## 5.2 Feature Engineering

The feature extraction module calculates 20 lexical and structural characteristics from submitted URLs.

Examples of relevant feature categories include:

1. Character entropy.
2. IP address indicators.
3. Subdomain structure.
4. URL length and character composition.
5. Digit concentration.
6. Special-character patterns.
7. Suspicious keyword indicators.
8. URL shortening indicators.
9. Domain and path characteristics.
10. Protocol-related characteristics.

The exact feature definitions and extraction logic are implemented in the project's `feature_extractor.py` module.

### Shannon Character Entropy

Character entropy measures the distribution of characters in a string.

\[
H(X)=-\sum_{i=1}^{n}P(x_i)\log_2P(x_i)
\]

Where \(P(x_i)\) represents the relative frequency of character \(x_i\).

Entropy is one supplementary feature and cannot independently determine whether a URL is malicious.

### Subdomain Depth

A simplified representation of subdomain depth is:

\[
\text{SubdomainDepth}=\max(0,|Parts(Domain)|-2)
\]

Where `Parts(Domain)` represents the dot-separated domain components after applicable prefix handling.

### Digit Concentration Ratio

The proportion of numerical characters in a URL can be represented as:

\[
\text{DigitRatio}=
\frac{\sum_{j=1}^{L}\mathbb{I}(c_j\in[0,9])}{L}
\]

Where \(L\) is the URL character length.

These mathematical expressions describe representative feature concepts. The implementation in the source code remains the authoritative definition of each extracted feature.

## 5.3 Classification Algorithms

PhishGuard evaluates two supervised classification algorithms.

### Logistic Regression

Logistic Regression estimates the probability of the positive class using the sigmoid function:

\[
P(y=1|\mathbf{x})=
\frac{1}{1+e^{-(\mathbf{w}^{T}\mathbf{x}+b)}}
\]

It is used as a linear classification baseline.

The implementation uses feature standardization and L2 regularization as part of its training process.

### Random Forest

Random Forest combines multiple decision trees to generate a classification result.

Its probability estimate can be represented as:

\[
\hat{P}(y=1|\mathbf{x})=
\frac{1}{B}\sum_{b=1}^{B}P_b(y=1|\mathbf{x})
\]

Where \(B\) is the number of decision trees.

Random Forest can model non-linear relationships between extracted URL features.

## 5.4 Training and Testing Methodology

The benchmark is divided using an 80:20 stratified random split.

- Training: 1,084 samples.
- Testing: 271 samples.

For Logistic Regression, the StandardScaler transformation is fitted only on training data and subsequently applied to testing data.

Random Forest is trained using the extracted feature values without requiring standardization.

The evaluation uses the testing partition to calculate classification metrics.

The random holdout split does not guarantee that related URL templates are separated between training and testing data. Therefore, the evaluation results must be interpreted within the limitations of the synthetic benchmark.

---

# CHAPTER 6: IMPLEMENTATION AND SECURITY

## 6.1 Backend Implementation

The backend is implemented using FastAPI.

It handles:

- API request processing.
- User authentication.
- URL analysis requests.
- Machine learning inference.
- Scan-history operations.
- Statistical information.
- Administrative operations.

FastAPI provides a structured API interface and automatically generated interactive API documentation.

## 6.2 Frontend Implementation

The frontend is developed using React and Vite.

The application provides separate user-facing and administrative interfaces.

Major frontend components include:

- Landing page.
- Registration and login pages.
- URL scanning interface.
- Scan result presentation.
- Personal scan history.
- Individual scan detail views.
- User dashboard.
- Administrative dashboard.

The frontend communicates with the backend through API requests.

## 6.3 URL Analysis and Non-Execution Approach

PhishGuard focuses on analyzing the submitted URL string rather than visiting the destination website.

This approach avoids requiring the application to load potentially malicious webpages during its URL feature extraction and classification workflow.

The system examines URL characteristics and uses the extracted feature vector for machine learning inference.

This design reduces exposure associated with loading untrusted destinations. However, it does not guarantee complete protection against every possible security risk in the application environment.

## 6.4 Explainable AI and Heuristic Reason Engine

The application provides two complementary forms of interpretability.

**Global Feature Importance**

The Random Forest model provides impurity-based feature-importance information.

This helps identify features that contribute to the model's overall tree-based classification process.

**Local Heuristic Explanations**

For individual URL scans, the application presents human-readable indicators based on extracted URL characteristics and predefined heuristic rules.

These may include suspicious keywords, IP address usage, subdomain structure, unusual URL patterns, and other indicators.

The local explanations are supplementary heuristic descriptions. They are not direct mathematical feature attributions of the model's predicted probability and should not be confused with SHAP or LIME.

## 6.5 Authentication and Data Persistence

PhishGuard includes user registration and login functionality.

Authenticated users can access their own scan history, while administrative functionality provides system-wide monitoring capabilities.

SQLite provides persistent storage for application records.

Access to protected application features is managed through the backend authentication system.

---

# CHAPTER 7: EXPERIMENTAL RESULTS AND EVALUATION

## 7.1 Evaluation Dataset

The classifiers were evaluated using the synthetic holdout test partition.

| Property | Value |
|---|---:|
| Total dataset samples | 1,355 |
| Training samples | 1,084 |
| Testing samples | 271 |
| Benign samples in test set | 142 |
| Phishing-like samples in test set | 129 |

## 7.2 Evaluation Metrics

The following standard classification metrics were used.

**Accuracy**

\[
Accuracy=\frac{TP+TN}{TP+TN+FP+FN}
\]

**Precision**

\[
Precision=\frac{TP}{TP+FP}
\]

**Recall**

\[
Recall=\frac{TP}{TP+FN}
\]

**F1-Score**

\[
F1=2\times\frac{Precision\times Recall}{Precision+Recall}
\]

**ROC-AUC**

The Area Under the Receiver Operating Characteristic Curve measures the model's ability to distinguish between positive and negative classes across classification thresholds.

## 7.3 Comparative Model Results

The evaluation results are:

| Metric | Random Forest | Logistic Regression |
|---|---:|---:|
| Accuracy | 100.00% | 100.00% |
| Precision | 100.00% | 100.00% |
| Recall | 100.00% | 100.00% |
| F1-Score | 100.00% | 100.00% |
| ROC-AUC | 1.0000 | 1.0000 |

Both models achieved identical performance on the current synthetic holdout test partition.

## 7.4 Confusion Matrix Analysis

**Random Forest**

\[
\begin{bmatrix}
142 & 0\\
0 & 129
\end{bmatrix}
\]

**Logistic Regression**

\[
\begin{bmatrix}
142 & 0\\
0 & 129
\end{bmatrix}
\]

Both models correctly classified all 271 test samples in this evaluation.

## 7.5 Feature Importance

Random Forest provides impurity-based feature-importance values that can be presented through the administrative dashboard.

These values indicate relative global feature importance within the trained model.

They should not be interpreted as causal relationships or as explanations of individual predictions.

## 7.6 System Testing

The application was subjected to functional and integration testing.

The confirmed testing results include:

- Backend automated tests: 14 passed.
- Frontend production build: successful.
- User registration: tested successfully.
- User login and logout: tested successfully.
- URL scanning: tested successfully.
- Scan-history persistence: tested successfully.
- Individual scan details: tested successfully.
- Administrative dashboard: tested successfully.
- Model evaluation information: displayed successfully.
- Administrative model retraining: tested successfully.

These tests demonstrate that the principal application workflows operate in the development environment.

## 7.7 Experimental Limitations

The reported classification results are limited to the synthetic benchmark.

Template-based generation may introduce similarities between training and testing samples. Therefore, perfect holdout metrics should not be interpreted as proof of equivalent real-world phishing detection performance.

The current project also does not report controlled latency or memory benchmarks.

Independent evaluation using verified external datasets is necessary to establish real-world generalization.

---

# CHAPTER 8: CONCLUSION, LIMITATIONS AND FUTURE WORK

## 8.1 Conclusion

PhishGuard demonstrates the development of an integrated machine learning-based phishing URL classification platform.

The project combines URL feature extraction, supervised classification, heuristic explanations, authentication, scan-history management, statistical dashboards, and administrative model evaluation.

Random Forest and Logistic Regression both achieved 100% accuracy on the project's 271-sample synthetic holdout test partition.

The system also demonstrates how machine learning functionality can be integrated into a full-stack web application.

The results are limited to the generated benchmark and do not establish real-world phishing detection accuracy.

Overall, PhishGuard serves as an academic demonstration of machine learning, URL analysis, explainability, backend API development, and frontend application integration.

## 8.2 Limitations

The major limitations are:

1. **Synthetic dataset:** The current benchmark is generated using project-defined URL patterns rather than verified external URL collections.
2. **Generalization:** Performance on synthetic data does not establish performance on previously unseen real-world phishing campaigns.
3. **Potential template similarity:** Similar generated patterns may appear in both training and testing partitions.
4. **URL-only analysis:** The system does not inspect the live content of the destination website.
5. **Limited threat intelligence:** The current implementation does not provide comprehensive DNS, WHOIS, or domain reputation analysis.
6. **Heuristic explanations:** Local explanations are rule-based indicators rather than direct model-probability attributions.
7. **Performance benchmarking:** Controlled latency and memory measurements have not been documented.

## 8.3 Future Work

Potential future improvements include:

**1. Verified External Datasets**

Integrate independently collected and verified phishing and benign URL datasets with appropriate licensing and documented provenance.

**2. Improved Dataset Splitting**

Use domain-aware, campaign-aware, or time-based validation to reduce similarities between training and testing samples.

**3. DNS and WHOIS Analysis**

Incorporate domain registration age, DNS records, and reputation information.

**4. Advanced Machine Learning**

Investigate character-level neural networks and Transformer-based models for URL classification.

**5. Advanced Explainability**

Implement and validate SHAP or LIME for formal local model explanations.

**6. Browser Extension**

Develop a browser extension to provide URL risk analysis during navigation.

**7. Performance Evaluation**

Conduct controlled experiments measuring inference latency, API response time, memory consumption, and concurrent request handling.

---

# REFERENCES

1. Ma, J., Saul, L. K., Savage, S., and Voelker, G. M. (2009). *Beyond Blacklists: Learning to Detect Malicious Web Sites from Suspicious URLs*. Proceedings of the ACM SIGKDD International Conference on Knowledge Discovery and Data Mining.

2. Lundberg, S. M., and Lee, S. I. (2017). *A Unified Approach to Interpreting Model Predictions*. Advances in Neural Information Processing Systems.

3. Pedregosa, F., et al. (2011). *Scikit-learn: Machine Learning in Python*. Journal of Machine Learning Research, 12, 2825–2830.

4. McKinney, W. (2010). *Data Structures for Statistical Computing in Python*. Proceedings of the Python in Science Conference.

5. FastAPI Documentation. *FastAPI: Modern, Fast Web Framework for Building APIs with Python*. https://fastapi.tiangolo.com/

6. React Documentation. *React: The Library for Web and Native User Interfaces*. https://react.dev/

7. SQLite Documentation. *SQLite: A Self-Contained, Serverless, Zero-Configuration Database Engine*. https://www.sqlite.org/docs.html

8. IEEE. (1998). *IEEE Std 830-1998: IEEE Recommended Practice for Software Requirements Specifications*.