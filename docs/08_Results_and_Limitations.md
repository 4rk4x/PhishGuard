# RESULTS, PERFORMANCE EVALUATION, AND LIMITATIONS

## PhishGuard: Explainable Machine Learning-Based Phishing URL Detection System

---

## 1. EXPERIMENTAL RESULTS AND EVALUATION

PhishGuard was evaluated using a project-generated synthetic URL benchmark containing 1,355 samples. The benchmark consists of manually defined benign and phishing-like URL patterns expanded through predefined templates.

The dataset was divided into training and testing partitions using an 80:20 stratified split.

### 1.1 Dataset Composition

| Dataset Property | Value |
|---|---:|
| Total samples | 1,355 |
| Benign samples | 710 |
| Phishing-like samples | 645 |
| Training samples | 1,084 |
| Testing samples | 271 |
| Number of extracted features | 20 |

The benchmark is synthetic and does not directly import records from external phishing or benign URL repositories.

### 1.2 Comparative Model Evaluation

Two supervised machine learning classifiers were evaluated:

- Random Forest Classifier
- Logistic Regression Classifier

Both models achieved the following results on the synthetic holdout test partition:

| Evaluation Metric | Random Forest | Logistic Regression |
|---|---:|---:|
| Accuracy | 100.00% | 100.00% |
| Precision | 100.00% | 100.00% |
| Recall | 100.00% | 100.00% |
| F1-Score | 100.00% | 100.00% |
| ROC-AUC | 1.0000 | 1.0000 |

### 1.3 Confusion Matrix Analysis

The confusion matrices obtained during evaluation are:

**Random Forest Classifier**

\[
\begin{bmatrix}
142 & 0\\
0 & 129
\end{bmatrix}
\]

**Logistic Regression Classifier**

\[
\begin{bmatrix}
142 & 0\\
0 & 129
\end{bmatrix}
\]

For both models:

- True Negatives (TN): 142
- False Positives (FP): 0
- False Negatives (FN): 0
- True Positives (TP): 129

These results indicate that both classifiers correctly classified all samples in this particular test partition.

**Important interpretation:** Perfect results on a synthetic holdout dataset do not establish perfect detection capability in real-world conditions. Similarities between generated URL templates may influence the measured performance. Independent testing with verified external datasets is necessary to establish practical generalization.

### 1.4 Performance and Resource Utilization

PhishGuard provides URL feature extraction and machine learning inference through its backend API.

The current project does not have a documented, controlled benchmarking experiment establishing average feature-extraction latency, inference latency, end-to-end API response time, or memory consumption.

Therefore, numerical performance claims for these measurements are not reported.

A future performance evaluation should measure:

- Average and percentile URL analysis latency.
- Model inference time.
- Backend API response time.
- Memory consumption under different workloads.
- Performance under concurrent requests.

---

## 2. SYSTEM LIMITATIONS AND ADVERSARIAL EDGE CASES

Although PhishGuard demonstrates successful classification on its synthetic benchmark, several limitations affect its applicability to real-world phishing detection.

### 2.1 Synthetic Dataset Limitations

The current benchmark is generated using project-defined URL patterns and template-based expansion.

It does not represent a comprehensive collection of independently verified real-world phishing and legitimate URLs.

Consequently, the reported evaluation metrics cannot establish how accurately the system would identify previously unseen phishing campaigns.

### 2.2 Compromised Legitimate Domains and Shared Hosting

An attacker may compromise a legitimate website or host deceptive content using an otherwise trustworthy domain.

Since PhishGuard primarily analyzes URL characteristics, it may not reliably identify malicious content hosted under a legitimate domain.

A legitimate-looking domain structure does not guarantee that the destination is safe.

### 2.3 Internationalized Domain Name (IDN) Homograph Attacks

Attackers may use visually similar Unicode characters to construct deceptive domain names.

For example, characters from Cyrillic or Greek alphabets may resemble Latin characters.

Detection of such attacks depends on appropriate internationalized domain name normalization and validation. The current system should not be considered a comprehensive IDN homograph detection solution without dedicated testing.

### 2.4 Dynamic Redirection and Cloaking

Some phishing websites use HTTP redirects, JavaScript-based navigation, or content that changes according to the visitor.

Because PhishGuard analyzes URL text and structure without loading the destination website, it cannot reliably inspect the final destination or identify all forms of dynamic redirection and cloaking.

### 2.5 URL Shorteners

URL shortening services hide the original destination behind a shortened address.

A shortened URL may exhibit suspicious characteristics, but determining its final destination generally requires redirect resolution.

The current lexical analysis approach does not establish the safety of the hidden destination.

### 2.6 Limitations of Lexical Feature Analysis

The system uses URL-based lexical and structural characteristics. These indicators may produce false positives or false negatives.

For example:

- A legitimate URL may contain suspicious keywords.
- A malicious URL may have a simple and apparently legitimate structure.
- HTTPS usage does not independently establish website legitimacy.
- URL complexity alone does not prove malicious intent.

Therefore, model predictions should be treated as risk estimates rather than definitive security verdicts.

### 2.7 Explainability Limitations

PhishGuard provides global feature-importance information and local heuristic explanations.

However, its local heuristic indicators are not direct mathematical attributions of the model's predicted probability.

They provide supplementary information about potentially suspicious URL characteristics and should not be interpreted as proof of why the classifier produced a particular prediction.

---

## 3. FUTURE WORK AND RESEARCH EXTENSIONS

Several improvements could extend the capabilities and research value of PhishGuard.

### 3.1 Evaluation Using Verified External Datasets

Future versions should incorporate independently collected and verified benign and phishing URL datasets.

Potential research sources include:

- Tranco research ranking for benign-domain research.
- PhishTank for community-reported phishing URLs.
- OpenPhish for phishing intelligence.
- Other appropriately licensed and documented research datasets.

Dataset licensing, collection dates, deduplication, and provenance should be documented before use.

### 3.2 Improved Data Leakage Prevention

Future experiments should investigate domain-aware, campaign-aware, or time-based dataset partitioning.

This would help reduce the possibility of closely related URL templates appearing in both training and testing partitions.

### 3.3 DNS and WHOIS Feature Integration

Additional domain-related information could improve detection by incorporating:

- Domain registration age.
- DNS record characteristics.
- Autonomous System Number (ASN) information.
- Domain reputation indicators.

Such features would require external data retrieval and additional validation.

### 3.4 Advanced Machine Learning and Deep Learning

Future research could investigate character-level neural networks and Transformer-based architectures for learning URL representations.

Potential approaches include:

- Character-level Convolutional Neural Networks.
- Recurrent Neural Networks.
- Transformer-based URL classification.
- Comparative evaluation against traditional machine learning models.

These approaches would require suitable datasets, computational resources, and independent evaluation.

### 3.5 Browser Extension Integration

A browser extension could provide URL risk analysis before or during navigation.

Such an extension could communicate with the PhishGuard backend or use a locally deployed detection model.

This would extend the current web-based application into a more practical browser-integrated security tool.

### 3.6 Advanced Explainability Techniques

Future versions could investigate SHAP or LIME to provide more formal model-level and individual prediction explanations.

These techniques would need to be implemented and validated against the actual trained classifiers before their results could be presented as model explanations.

---

## 4. CONCLUSION

PhishGuard demonstrates an academic implementation of a machine learning-based phishing URL classification platform.

The system combines lexical and structural URL feature extraction, Random Forest and Logistic Regression classifiers, risk estimation, heuristic explanations, user authentication, scan history, and administrative model evaluation.

Both machine learning models achieved 100% accuracy on the project's synthetic holdout benchmark of 271 samples.

However, the benchmark's synthetic nature limits the conclusions that can be drawn from these results. The current evaluation does not establish equivalent performance against real-world phishing URLs.

Future work should prioritize verified external datasets, stronger evaluation methodology, broader URL analysis, and advanced explainability techniques.

PhishGuard should therefore be understood as an academic prototype demonstrating phishing URL classification concepts rather than a fully validated production-grade phishing protection system.