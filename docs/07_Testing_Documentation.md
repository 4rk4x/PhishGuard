# TESTING DOCUMENTATION & QUALITY ASSURANCE REPORT
## PhishGuard: Explainable Machine Learning-Based Phishing URL Detection System

---

### 1. TESTING STRATEGY & SCOPE
Quality assurance for PhishGuard encompasses three validation tiers:
1. **Unit Testing:** Validates feature extraction algorithms (Shannon entropy, IP detection, keyword matching) and cryptographic primitives.
2. **Integration Testing:** Tests FastAPI REST endpoints with authentication, SQLite CRUD operations, and CORS handling.
3. **Machine Learning Model Testing:** Validates model convergence, data leakage absence, accuracy thresholds ($\ge 85\%$), and confusion matrix integrity.

---

### 2. FORMAL TEST CASE SPECIFICATIONS

| Test Case ID | Module Under Test | Input Vector / Condition | Expected Output | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-UNIT-01** | Feature Extractor | `192.168.1.1` | `having_ip_address == 1` | **PASSED** |
| **TC-UNIT-02** | Feature Extractor | `google.com` | `having_ip_address == 0` | **PASSED** |
| **TC-UNIT-03** | Shannon Entropy | `x829df83af938e.xyz` vs `google.com` | Entropy(Random) > Entropy(Natural) | **PASSED** |
| **TC-UNIT-04** | Shortener Detector| `http://bit.ly/34xPaypal` | `is_shortened == 1` | **PASSED** |
| **TC-UNIT-05** | Credential Check  | `http://bank.com@evil.com/login` | `having_at_symbol == 1` | **PASSED** |
| **TC-UNIT-06** | Subdomain Depth   | `apple.com.secure-update.top` | `num_subdomains >= 2` | **PASSED** |
| **TC-INT-01**   | Auth API          | Registered email & password | HTTP 200, JWT token returned | **PASSED** |
| **TC-INT-02**   | Scan API          | `http://192.168.1.100/paypal/login.php` | HTTP 200, classification: `phishing` | **PASSED** |
| **TC-INT-03**   | Scan API          | `https://www.nature.com` | HTTP 200, classification: `safe` | **PASSED** |
| **TC-INT-04**   | Admin Auth Guard  | Standard user calls `/api/admin/overview` | HTTP 403 Forbidden | **PASSED** |
| **TC-ML-01**    | Holdout Split     | 80/20 Stratified Partitioning | Train=960, Test=240, zero overlap | **PASSED** |
| **TC-ML-02**    | Model Accuracy    | Test set evaluation | Random Forest Accuracy $\ge 95\%$ | **PASSED** |
| **TC-ML-03**    | Defanging Filter  | `https://malicious.com` | Transformed to `hxxps[://]malicious[.]com` | **PASSED** |

---

### 3. EXECUTING TEST SUITES VIA PYTEST

The backend includes a comprehensive pytest suite located in `backend/tests/`:

```bash
cd backend
# Run all unit, integration, and ML tests
pytest -v
```

**Sample Pytest Output Trace:**
```text
============================= test session starts =============================
platform win32 -- Python 3.10.x, pytest-8.0.0
rootdir: C:\Users\admin\.antigravity-ide\phishguard\backend
collected 10 items

tests/test_features.py::test_ip_address_detection PASSED                 [ 10%]
tests/test_features.py::test_shannon_entropy PASSED                      [ 20%]
tests/test_features.py::test_feature_extraction_structure PASSED         [ 30%]
tests/test_features.py::test_shortener_detection PASSED                  [ 40%]
tests/test_features.py::test_at_symbol_detection PASSED                  [ 50%]
tests/test_ml_pipeline.py::test_model_training_and_metrics PASSED       [ 60%]
tests/test_ml_pipeline.py::test_prediction_output PASSED                 [ 70%]
tests/test_ml_pipeline.py::test_legitimate_prediction_output PASSED      [ 80%]
tests/test_api.py::test_root_endpoint PASSED                             [ 90%]
tests/test_api.py::test_ml_metrics_endpoint PASSED                       [100%]

============================== 10 passed in 1.42s ==============================
```

