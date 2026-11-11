# COMPREHENSIVE VIVA VOCE QUESTIONS & MODEL ANSWERS

## PhishGuard: Explainable Machine Learning-Based Phishing URL Detection System

**Academic CSE Semester Project Examination · Viva Preparation Guide**

---

# SECTION 1: MACHINE LEARNING & MATHEMATICAL FOUNDATIONS

### Q1. Why did you choose Random Forest over a single Decision Tree or Deep Neural Network?

**Answer:**

We selected Random Forest because it is an ensemble learning algorithm that combines multiple decision trees.

A single Decision Tree can be sensitive to variations in training data and may overfit. Random Forest reduces this problem by combining predictions from multiple trees trained using randomized samples and feature subsets.

We also included Logistic Regression as a baseline model to compare linear and non-linear classification approaches.

Deep learning models were not necessary for our current project because we were working with a relatively small, structured, tabular feature dataset.

**Important:** Our current evaluation does not establish that Random Forest is universally better than deep learning or other algorithms. Both models achieved 100% accuracy on our synthetic holdout benchmark.

### Q2. What is Shannon Character Entropy, and how can it help detect suspicious URLs?

**Answer:**

Shannon entropy measures the uncertainty or information content of a character distribution.

The mathematical formula is:

\[
H(X)=-\sum_{i=1}^{n}P(x_i)\log_2P(x_i)
\]

Here:
- \(X\) represents the character distribution.
- \(P(x_i)\) represents the probability of a particular character.
- \(H(X)\) represents the entropy.

A URL containing an unusual distribution of characters may have higher entropy than a URL containing familiar linguistic patterns.

For example, a randomly generated-looking hostname may contain a mixture of letters and numbers.

Entropy can therefore act as a suspiciousness indicator. However, high entropy does not prove that a URL is malicious. Legitimate domains can also contain unusual strings.

### Q3. How did you prevent data leakage during preprocessing?

**Answer:**

Data leakage happens when information from the test dataset improperly influences model training.

In our project:

1. We generate and prepare the synthetic dataset.
2. We divide the dataset into training and testing partitions using a stratified split.
3. We fit the StandardScaler using the training data for Logistic Regression.
4. We transform the test data using the scaler fitted on the training data.

Our current dataset contains:

| Partition | Samples |
|---|---:|
| Training | 1,084 |
| Testing | 271 |
| Total | 1,355 |

This prevents the scaler from learning statistical information from the test partition.

**Limitation:** A random stratified split does not necessarily prevent similar template-generated URLs from appearing in both partitions. A stronger future evaluation would use group-based or domain-based separation.

### Q4. Why is accuracy alone insufficient for evaluating phishing detection?

**Answer:**

Accuracy measures the proportion of correctly classified samples.

However, accuracy alone can be misleading, particularly when a dataset has an imbalanced class distribution.

We therefore consider several evaluation metrics:

**Accuracy**

\[
Accuracy=\frac{TP+TN}{TP+TN+FP+FN}
\]

**Precision**

\[
Precision=\frac{TP}{TP+FP}
\]

Precision measures how many predicted phishing URLs were actually phishing examples.

**Recall**

\[
Recall=\frac{TP}{TP+FN}
\]

Recall measures how many actual phishing examples were correctly identified.

**F1-score**

\[
F1=2\times\frac{Precision\times Recall}{Precision+Recall}
\]

F1-score balances precision and recall.

**ROC-AUC**

ROC-AUC measures how well a classifier separates the two classes across different classification thresholds.

Using these metrics gives a more complete understanding of classification performance.

### Q5. Explain the confusion matrix obtained during your empirical testing.

**Answer:**

Our Random Forest model produced the following confusion matrix on the synthetic holdout test set:

| Actual / Predicted | Benign | Phishing |
|---|---:|---:|
| Benign | 142 | 0 |
| Phishing | 0 | 129 |

The results are:

- True Negatives (TN): 142 — benign samples correctly classified.
- False Positives (FP): 0 — benign samples incorrectly classified as phishing.
- False Negatives (FN): 0 — phishing-like samples incorrectly classified as benign.
- True Positives (TP): 129 — phishing-like samples correctly classified.

The total test set contains 271 samples.

Both Random Forest and Logistic Regression achieved these results on the current synthetic holdout benchmark.

**Important limitation:** These results do not establish perfect real-world phishing detection. The dataset is synthetic and may contain similar patterns across the training and testing partitions.

### Q6. How does Logistic Regression compare with Random Forest in this system?

**Answer:**

Logistic Regression is a linear classification algorithm. It estimates class probabilities using a weighted combination of input features.

Random Forest is an ensemble algorithm that combines multiple decision trees and can model non-linear relationships between features.

We selected both models to compare two different classification approaches.

In our current synthetic benchmark:

- Random Forest accuracy: 100%.
- Logistic Regression accuracy: 100%.

Therefore, our current results do not show an accuracy advantage for Random Forest over Logistic Regression.

We selected Random Forest as the primary prediction model in the application, while Logistic Regression provides a comparative baseline.

---

# SECTION 2: EXPLAINABLE AI (XAI) & CYBERSECURITY

### Q7. What is Explainable AI, and why is it important in cybersecurity?

**Answer:**

Explainable AI refers to techniques that make machine-learning predictions easier for humans to understand.

In cybersecurity, a prediction without understandable supporting information may be difficult for users or security analysts to interpret.

PhishGuard provides two forms of interpretation:

1. **Global feature importance:** Shows which features are influential in the trained Random Forest model.
2. **Local heuristic explanations:** Shows suspicious characteristics detected in an individual URL and provides human-readable descriptions.

For example, the application may identify IP-address usage, suspicious keywords, or unusual URL structure.

These explanations help users understand the characteristics associated with a prediction.

### Q8. What are the most important features identified by Random Forest?

**Answer:**

Random Forest provides feature-importance values based on the contribution of features to the model's decision-tree impurity reduction.

PhishGuard displays feature-importance information in its administrative dashboard.

Examples of feature categories include:

- URL length.
- IP-address usage.
- Number of subdomains.
- Suspicious keyword indicators.
- Special-character patterns.
- Character entropy.

The exact ranking and numerical importance values depend on the currently trained model.

I would not claim fixed percentages without referring to the actual model output.

**Additional point:** Feature importance indicates how useful a feature was to the trained model. It does not prove that the feature causes phishing activity.

### Q9. What is URL defanging, and why is it useful?

**Answer:**

URL defanging is the process of modifying a URL's representation so that it is less likely to be accidentally opened or clicked.

For example:

```text
Original:
http://example.com/login

Defanged:
hxxp://example[.]com/login
```

This is useful when displaying suspicious URLs in reports, dashboards, and security documentation.

However, defanging alone does not guarantee protection against every possible form of accidental execution. It is a precautionary representation technique.

### Q10. How does PhishGuard perform URL analysis without executing the destination?

**Answer:**

PhishGuard primarily performs lexical and structural analysis on the submitted URL string.

It extracts characteristics such as:

- URL length.
- Hostname structure.
- IP-address usage.
- Suspicious keywords.
- Special characters.
- Character entropy.

The classification process does not need to open the destination webpage or execute its JavaScript.

This reduces the risk associated with directly visiting potentially malicious destinations during analysis.

**Important distinction:** PhishGuard is a URL-classification prototype, not a full malware sandbox or isolated browser environment.

---

# SECTION 3: SYSTEM ARCHITECTURE & FULL-STACK DEVELOPMENT

### Q11. Explain the different layers of your system architecture.

**Answer:**

PhishGuard consists of four major logical layers.

**1. Presentation Layer**
- Developed using React.
- Provides the user interface.
- Allows users to submit URLs and view scan results.
- Displays dashboards and scan history.

**2. Backend and Application Layer**
- Developed using Python and FastAPI.
- Handles API requests.
- Manages authentication and scan operations.
- Coordinates feature extraction and model prediction.

**3. Machine Learning Layer**
- Uses Scikit-Learn.
- Extracts and processes URL features.
- Performs classification using Random Forest and Logistic Regression.
- Provides model metrics and feature-importance information.

**4. Persistence Layer**
- Uses SQLite.
- Stores user information and scan records.
- Supports retrieval of scan history and administrative information.

### Q12. How are user passwords secured in PhishGuard?

**Answer:**

Passwords should not be stored as plain text.

PhishGuard uses password hashing as part of its authentication system. The password is converted into a hash before being stored, and authentication checks the supplied password against the stored hash.

A password-hashing algorithm such as bcrypt is designed to make brute-force attacks more expensive through computational work and salting.

**Viva preparation note:** If asked about the exact hashing library or configuration, refer to the actual authentication implementation rather than guessing.

### Q13. How does JWT authentication work in your application?

**Answer:**

JWT stands for JSON Web Token.

It is a token-based authentication mechanism used to identify an authenticated user when accessing protected API endpoints.

The general workflow is:

1. A user submits login credentials.
2. The backend verifies the credentials.
3. The backend generates an authentication token.
4. The frontend uses the token when making authenticated API requests.
5. The backend validates the token before granting access to protected endpoints.

PhishGuard uses authentication to manage access to user-specific functionality, such as scan history, and administrative functionality.

**Viva preparation note:** Be ready to identify the actual token algorithm, expiration configuration, secret-key handling, and frontend storage method from the source code. Do not guess these values.

### Q14. Why did you choose SQLite instead of PostgreSQL or MySQL?

**Answer:**

We selected SQLite because it is lightweight, serverless, and easy to configure.

It stores the database in a local file and does not require a separate database server.

For an academic prototype and demonstration, SQLite offers several advantages:

- Simple setup.
- Low resource requirements.
- Relational data storage.
- Transaction support.
- Easy local development.

PostgreSQL or MySQL would be more suitable options for a larger production deployment requiring greater concurrency and database-management capabilities.

### Q15. What is CORS, and why is it required?

**Answer:**

CORS stands for Cross-Origin Resource Sharing.

Browsers apply security restrictions when a frontend application attempts to communicate with a backend hosted on a different origin.

For example:

- Frontend: `http://localhost:5173`
- Backend: `http://127.0.0.1:8000`

These are different origins.

FastAPI provides CORSMiddleware to configure which frontend origins are allowed to communicate with the backend.

This enables the frontend and backend to work together during local development.

---

# SECTION 4: TESTING, LIMITATIONS & ADVANCED CONCEPTS

### Q16. How does PhishGuard handle shortened URLs such as bit.ly?

**Answer:**

A shortened URL hides the original destination behind a redirect service.

Because PhishGuard performs URL-string analysis without following redirects, it cannot determine the final destination through its current scanning workflow.

The application can identify recognized shortening services as suspicious indicators.

However, identifying a shortener does not prove that its destination is malicious.

Following redirects could be considered as a future feature, but it would require additional security controls and a carefully designed network-isolation strategy.

### Q17. What are the main limitations of lexical URL analysis?

**Answer:**

There are several important limitations.

**1. Compromised Legitimate Domains**

An attacker may compromise a legitimate domain and host malicious content there.

The domain itself may look trustworthy even though a particular page is malicious.

**2. Internationalized Domain Name (IDN) Attacks**

Attackers can use visually similar Unicode characters to imitate legitimate domain names.

For example, a Cyrillic character may look similar to a Latin character.

**3. Dynamic and Cloaked Content**

Some phishing websites change their behavior based on the visitor, device, or browser.

A URL-only system cannot inspect all such behavior without additional webpage analysis.

**4. Shortened URLs**

The original destination is hidden unless the redirect chain is resolved.

**5. Dataset Generalization**

Our current benchmark is synthetic. It may not represent the diversity of URLs encountered in real-world phishing campaigns.

These limitations indicate why further evaluation and additional detection signals are necessary.

### Q18. What is the purpose of the `/api/admin/retrain` endpoint?

**Answer:**

The administrative retraining endpoint allows an authorized administrator to trigger the machine-learning retraining workflow.

The purpose of retraining is to update the models using the project's available training dataset and refresh the associated evaluation information.

The project includes Random Forest and Logistic Regression models.

Retraining is useful for demonstrating the model-training pipeline and comparing model performance.

**Important:** Retraining on the same synthetic dataset does not automatically improve real-world detection capability. It also does not establish that the system has learned new real-world phishing behavior.

### Q19. Why did you choose this color palette for the interface?

**Answer:**

The interface uses a limited color palette to maintain visual consistency and readability.

- **Deep Navy (`#101827`):** Provides a dark visual foundation.
- **Off-white (`#F8FAFC`):** Provides contrast for text and interface elements.
- **Electric Green (`#27D17F`):** Acts as a visual accent.

Threat-related interface elements can use semantic colors to distinguish different states.

The main objective is to create a clear and consistent interface rather than relying on decorative elements.

### Q20. What are three possible future improvements for PhishGuard?

**Answer:**

There are several possible extensions.

**1. Real-World Dataset Evaluation**

Evaluate the system using independently collected and verified benign and phishing URL datasets.

This would provide a stronger understanding of real-world generalization.

**2. Improved Feature Engineering**

Add more robust URL normalization, IDN handling, domain-reputation information, and contextual indicators.

**3. Advanced Explainability**

Integrate validated explainability techniques such as SHAP or LIME to provide more rigorous local model explanations.

**Additional Future Direction:** A browser extension could integrate URL analysis into a user's browsing workflow, subject to appropriate privacy and security controls.

---

# SECTION 5: ADDITIONAL RAPID-FIRE VIVA QUESTIONS

### Q21. What is phishing?

**Answer:**

Phishing is a form of social engineering in which attackers impersonate legitimate entities to deceive users into revealing sensitive information or performing harmful actions.

### Q22. What is the difference between a benign URL and a phishing URL?

**Answer:**

A benign URL refers to a legitimate web resource, while a phishing URL is designed or used to deceive users.

However, the appearance of a URL alone does not always establish its actual intent.

### Q23. What is supervised learning?

**Answer:**

Supervised learning is a machine-learning approach in which a model learns from labeled examples.

In our project, the dataset contains two labels:

- 0: Benign.
- 1: Phishing-like.

The model learns patterns from the labeled training examples and predicts labels for new inputs.

### Q24. What is the difference between training data and testing data?

**Answer:**

Training data is used to fit the machine-learning model.

Testing data is kept separate during training and is used to evaluate how the model performs on unseen samples from the evaluation split.

### Q25. What is overfitting?

**Answer:**

Overfitting occurs when a model learns the training data too specifically, including patterns that may not generalize to new data.

A model can perform extremely well on training data but poorly on genuinely independent data.

### Q26. What is a false positive?

**Answer:**

A false positive occurs when a benign URL is incorrectly classified as phishing.

This can cause unnecessary warnings or inconvenience for legitimate users.

### Q27. What is a false negative?

**Answer:**

A false negative occurs when a phishing URL is incorrectly classified as benign.

This is a serious detection failure because a potentially harmful URL may not receive an appropriate warning.

### Q28. What is a feature vector?

**Answer:**

A feature vector is a numerical representation of an input containing the values of its extracted features.

In PhishGuard, a submitted URL is converted into a vector of 20 lexical and structural features.

### Q29. What is a REST API?

**Answer:**

A REST API is an interface that allows different software components to communicate through HTTP-based requests and responses.

PhishGuard uses API endpoints to connect its React frontend with the FastAPI backend.

### Q30. What is the main contribution of your project?

**Answer:**

The main contribution is the development of a full-stack URL-classification prototype that combines machine-learning-based predictions, URL feature extraction, heuristic diagnostic explanations, user authentication, scan history, and administrative model-management functionality.

It also provides an experimental comparison of Random Forest and Logistic Regression using a project-generated synthetic benchmark.

---

# FINAL VIVA PREPARATION: FACTS YOU MUST REMEMBER

| Project detail | Correct value |
|---|---|
| Project name | PhishGuard |
| Classification type | Binary classification |
| Number of features | 20 |
| Dataset type | Synthetic |
| Total samples | 1,355 |
| Benign samples | 710 |
| Phishing-like samples | 645 |
| Training samples | 1,084 |
| Testing samples | 271 |
| Primary model | Random Forest |
| Baseline model | Logistic Regression |
| Random Forest test accuracy | 100% |
| Logistic Regression test accuracy | 100% |
| Backend | Python + FastAPI |
| Frontend | React + Vite |
| Database | SQLite |
| ML library | Scikit-Learn |
| Local explanation method | Heuristic indicators |
| Global feature interpretation | Random Forest feature importance |

## Five Questions You Must Be Able to Answer Confidently

1. Why is your dataset synthetic, and what does that mean for your results?
2. How does a URL become a 20-feature numerical vector?
3. What is the difference between Random Forest and Logistic Regression?
4. What is the difference between global feature importance and local heuristic explanations?
5. Why does 100% test accuracy on your synthetic benchmark not prove 100% real-world detection accuracy?

**Final advice:** Understand the implementation rather than memorizing impressive-sounding claims. If you do not know a particular implementation detail, explain what the system actually does and acknowledge what has not been verified. That is more defensible than inventing an answer.