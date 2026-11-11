# MACHINE LEARNING METHODOLOGY & MATHEMATICAL FORMULATIONS

## PhishGuard: Explainable Machine Learning-Based Phishing URL Detection System

---

## 1. DATASET PROVENANCE & BENCHMARKING

### 1.1 Dataset Provenance and Composition

PhishGuard uses a project-generated synthetic URL benchmark for academic experimentation. The dataset is created using manually defined URL patterns and template-based expansion. It does not directly import records from external threat-intelligence repositories.

**Dataset characteristics:**

| Property | Description |
|---|---|
| Dataset name | PhishGuard Synthetic URL Benchmark |
| Data type | Synthetic |
| External data imported | No |
| License | Not separately licensed |
| Generation method | Manually defined URL patterns and template-based expansion |
| Total samples | 1,355 |
| Benign samples (y = 0) | 710 |
| Phishing-like samples (y = 1) | 645 |
| Extracted features | 20 lexical and structural URL features |

The benchmark contains illustrative benign and phishing-like URL patterns designed to support controlled model development and evaluation. These examples are not independently verified real-world URLs or confirmed threat-intelligence records.

### 1.2 Dataset Partitioning and Preprocessing

The dataset is divided into training and testing partitions using stratified random sampling:

- **Training partition:** 80% (1,084 samples)
- **Testing partition:** 20% (271 samples)

Stratification preserves the approximate class distribution across both partitions.

For Logistic Regression, `StandardScaler` is fitted exclusively on the training features. The fitted transformation is then applied to the testing features to avoid using test-set statistics during training.

Random Forest is trained using the extracted feature values without requiring feature standardization.

**Evaluation limitation:** The random holdout split evaluates performance on this project-generated synthetic benchmark. It does not establish generalization to independently collected, real-world phishing URLs. Template similarity between samples may also influence the measured performance.

---

## 2. FEATURE ENGINEERING & MATHEMATICAL SPECIFICATIONS

PhishGuard extracts 20 lexical and structural features directly from submitted URLs without initiating network requests. These features describe URL characteristics that may be associated with phishing activity.

### 2.1 Information-Theoretic Feature: Shannon Character Entropy

Character entropy measures the distribution and variability of characters in a string. It is calculated using:

\[
H(X)=-\sum_{i=1}^{n}P(x_i)\log_2P(x_i)
\]

Where:

- \(n\) represents the number of unique characters.
- \(P(x_i)\) represents the relative frequency of character \(x_i\).
- The calculation is performed on the target string used by the feature extractor.

Higher entropy can indicate less predictable character distributions. However, entropy alone cannot reliably distinguish legitimate domains from malicious domains. Its interpretation depends on the URL and other extracted features.

### 2.2 Structural Feature: Subdomain Nesting Depth

Subdomain depth measures the number of nested domain components. A simplified mathematical representation is:

\[
\text{SubdomainDepth}=\max(0,|Parts(Domain)|-2)
\]

Here, \(Parts(Domain)\) represents the dot-separated domain components after applicable prefix handling.

Deeply nested domains may be used in deceptive URLs. However, subdomain depth alone is not proof of malicious activity.

### 2.3 Syntactic Feature: Digit Concentration Ratio

Digit concentration measures the proportion of numerical characters in a URL:

\[
\text{DigitRatio}=
\frac{\sum_{j=1}^{L}\mathbb{I}(c_j\in[0,9])}{L}
\]

Where:

- \(L\) is the total URL character length.
- \(c_j\) is the character at position \(j\).
- \(\mathbb{I}\) is an indicator function that returns 1 when the condition is true and 0 otherwise.

### 2.4 Lexical Keyword Heuristic

Phishing URLs may contain words associated with account access, verification, payments, or security alerts.

PhishGuard uses keyword-based URL indicators to identify potentially suspicious terms. A simplified representation is:

\[
\text{KeywordScore}=\sum_{k\in\mathcal{K}}\mathbb{I}(k\subseteq URL)
\]

Where \(\mathcal{K}\) represents the keyword set implemented in the feature extraction module.

These lexical indicators are supplementary signals. A legitimate URL may contain suspicious-looking words, and a phishing URL may not contain any predefined keyword.

### 2.5 Feature Engineering Limitations

The extracted features are based on URL text and structure rather than live website content. The system does not establish website ownership, inspect page content, verify certificates, or independently confirm whether a URL is malicious.

---

## 3. MODEL TRAINING & COMPARATIVE ANALYSIS

PhishGuard uses two supervised machine learning classifiers to estimate whether a submitted URL resembles the phishing-like patterns represented in its training dataset.

### 3.1 Logistic Regression

Logistic Regression is used as a linear classification baseline. It estimates the probability of the positive class using a sigmoid function:

\[
P(y=1|\mathbf{x})=\sigma(\mathbf{w}^{T}\mathbf{x}+b)
\]

Where:

\[
\sigma(z)=\frac{1}{1+e^{-z}}
\]

Here, \(\mathbf{x}\) represents the extracted feature vector, \(\mathbf{w}\) represents the learned coefficients, and \(b\) is the intercept.

The model uses L2 regularization to reduce excessive coefficient magnitudes. Feature standardization is performed using parameters learned exclusively from the training partition.

### 3.2 Random Forest Classifier

Random Forest is an ensemble learning algorithm that combines predictions from multiple decision trees.

For a classification problem, the estimated probability of the positive class can be represented as:

\[
\hat{P}(y=1|\mathbf{x})=
\frac{1}{B}\sum_{b=1}^{B}P_b(y=1|\mathbf{x})
\]

Where \(B\) represents the number of decision trees and \(P_b\) represents the probability estimate from an individual tree.

Decision-tree splits are selected using impurity-based criteria. One commonly used criterion is Gini impurity:

\[
I_G(t)=1-\sum_{k=0}^{1}p_k^2
\]

Where \(p_k\) is the proportion of class \(k\) at node \(t\).

The actual number of estimators and other hyperparameters are determined by the project's model-training implementation.

### 3.3 Empirical Benchmark Comparison

The models were evaluated on the 271-sample synthetic holdout test partition.

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

**Interpretation and Limitation:**

Both classifiers achieved perfect classification on this particular synthetic holdout split. These results demonstrate performance on the generated benchmark only. They must not be interpreted as evidence of 100% accuracy on real-world phishing URLs.

The use of predefined URL patterns and template-based expansion may introduce similarities between training and testing samples. Independent evaluation using verified external datasets and more rigorous separation of related URL patterns is necessary to establish real-world generalization.

---

## 4. EXPLAINABLE AI (XAI) ARCHITECTURE

PhishGuard includes an explainability layer to help users understand relevant URL characteristics associated with a model prediction.

### 4.1 Global Feature Importance

The Random Forest model provides feature-importance values based on reductions in impurity across its decision trees.

These values indicate the relative contribution of individual features to the model's overall tree-based decisions.

Feature importance is a global measure. It does not prove that a particular feature caused an individual URL to be classified as phishing.

### 4.2 Local Heuristic Explanations

For an individual URL, PhishGuard presents human-readable explanations based on extracted URL features and predefined heuristic rules.

Depending on the URL characteristics, these explanations may include:

- Presence of an IP address.
- Suspicious keywords.
- Unusual URL structure.
- Subdomain nesting.
- URL shortening indicators.
- Special-character patterns.

The explanation layer communicates potentially suspicious characteristics through status indicators, severity labels, and descriptive messages.

**Important distinction:** These local explanations are heuristic indicators. They are not SHAP values, LIME explanations, or mathematically derived feature attributions of the model's predicted probability. Their purpose is to improve interpretability, not to claim causal explanations of the model's decision.

---

## 5. PREDICTION AND RISK ESTIMATION

PhishGuard uses the trained classification model to estimate the likelihood that a submitted URL belongs to the phishing-like class represented in the training dataset.

The Random Forest model's positive-class probability is converted into a percentage-based risk score:

\[
\text{RiskScore}=P(y=1|\mathbf{x})\times100
\]

The resulting score is used by the application to communicate the model's estimated phishing risk.

The application also presents a classification label and supplementary heuristic indicators to help users understand suspicious URL characteristics.

**Important:** The risk score is a model-derived estimate based on the training benchmark. It is not a verified probability that a website is malicious, and it should not be treated as a substitute for independent security verification.

---

## 6. EXPERIMENTAL LIMITATIONS AND FUTURE IMPROVEMENTS

The current experimental setup has several limitations:

1. **Synthetic dataset:** The benchmark is generated from project-defined URL patterns rather than independently verified real-world URL collections.
2. **Limited generalization evidence:** High test-set performance does not establish equivalent performance against previously unseen real-world phishing campaigns.
3. **Potential template similarity:** Related URL patterns may appear across training and testing partitions, potentially influencing evaluation results.
4. **Lexical analysis:** The system examines URL structure and text without analyzing live webpage content or independently verifying domain reputation.
5. **Heuristic explanations:** Local explanations are rule-based indicators and should not be interpreted as direct mathematical attributions of model predictions.
6. **Changing threat landscape:** Phishing techniques evolve continuously, so a model trained on a fixed benchmark may not recognize new attack patterns.

Future work should include evaluation on independently collected and verified datasets, domain-aware or time-based data splitting, broader feature validation, and more rigorous local explainability techniques.

---

## 7. CONCLUSION

This methodology describes the dataset generation, feature extraction, machine learning models, evaluation process, and explainability architecture used in PhishGuard.

The system demonstrates an integrated approach to phishing-like URL classification using lexical analysis, supervised machine learning, and human-readable heuristic explanations.

The current experimental results show that both Random Forest and Logistic Regression achieved perfect performance on the project's synthetic holdout benchmark. However, these findings are limited to the generated dataset and do not establish real-world detection accuracy.

Further evaluation with independent, verified datasets is necessary before making claims about practical deployment or real-world phishing detection performance.