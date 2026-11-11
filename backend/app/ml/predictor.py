
"""
PhishGuard URL Predictor
Performs Random Forest inference and generates rule-based explanations.

Important:
- The model score is uncalibrated, not a verified real-world probability.
- Explanations are manually defined heuristics, not actual Random Forest
  feature attributions such as SHAP values.
"""

import os
from typing import Any, Dict, List

import joblib
import numpy as np

from app.config import settings
from app.ml.feature_extractor import (
    FEATURE_ORDER,
    extract_features_from_url,
    vectorize_features,
)
from app.ml.model_trainer import train_and_evaluate_models


_MODEL = None
_MODEL_MTIME = None


def get_or_load_model():
    """Load the persisted Random Forest model, training if it is missing."""
    global _MODEL, _MODEL_MTIME

    model_dir = settings.MODEL_DIR
    model_path = os.path.join(model_dir, "model.joblib")

    if not os.path.exists(model_path):
        os.makedirs(model_dir, exist_ok=True)
        train_and_evaluate_models(model_dir)

    if not os.path.exists(model_path):
        raise FileNotFoundError(
            "The trained model was not found after training."
        )

    current_mtime = os.path.getmtime(model_path)

    if _MODEL is None or _MODEL_MTIME != current_mtime:
        _MODEL = joblib.load(model_path)
        _MODEL_MTIME = current_mtime

    if not hasattr(_MODEL, "predict_proba"):
        raise TypeError("The loaded model does not support predict_proba().")

    if not hasattr(_MODEL, "classes_"):
        raise TypeError("The loaded model does not expose its trained classes.")

    return _MODEL


def explain_features(features: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Generate rule-based explanations from extracted URL features.

    score_contribution contains heuristic points. These are NOT actual
    Random Forest feature contributions.
    """
    explanations = []

    def add(
        feature_key,
        feature_name,
        value,
        baseline_threshold,
        status,
        impact_level,
        score_contribution,
        explanation,
    ):
        explanations.append({
            "feature_key": feature_key,
            "feature_name": feature_name,
            "value": value,
            "baseline_threshold": baseline_threshold,
            "status": status,
            "impact_level": impact_level,
            "score_contribution": float(score_contribution),
            "explanation": explanation,
        })

    # 1. Direct IP address usage
    if features["having_ip_address"] == 1:
        add(
            "having_ip_address",
            "Direct IP Address Usage",
            "IP address detected",
            "A recognizable domain name",
            "SUSPICIOUS",
            "High",
            25,
            "The URL uses an IP address instead of a conventional domain "
            "name. This can occur in phishing campaigns, although some "
            "legitimate technical services also use direct IP addresses.",
        )
    else:
        add(
            "having_ip_address",
            "Direct IP Address Usage",
            "No direct IP address detected",
            "A recognizable domain name",
            "SAFE",
            "None",
            0,
            "No direct IP address was detected. This alone does not establish "
            "that the URL or website is legitimate.",
        )

    # 2. URL shortening service
    if features["is_shortened"] == 1:
        add(
            "is_shortened",
            "URL Shortener Detection",
            "Shortening service indicator detected",
            "Direct destination URL",
            "SUSPICIOUS",
            "High",
            18,
            "The URL matches a recognized URL-shortening pattern. Shortened "
            "links can conceal the final destination and should be inspected "
            "before opening.",
        )
    else:
        add(
            "is_shortened",
            "URL Shortener Detection",
            "No shortening service indicator detected",
            "Direct destination URL",
            "SAFE",
            "None",
            0,
            "No recognized URL-shortening indicator was detected. This does "
            "not verify the destination website.",
        )

    # 3. At symbol
    if features["having_at_symbol"] == 1:
        add(
            "having_at_symbol",
            "At-Symbol URL Structure",
            f"Present ({features['count_at']} occurrence(s))",
            "No @ symbol in URL",
            "SUSPICIOUS",
            "High",
            22,
            "The URL contains an @ symbol. In URL user-information syntax, "
            "the host is specified after the @ symbol. This structure can "
            "be abused to make a misleading URL appear trustworthy.",
        )

    # 4. Hyphen in domain
    if features["prefix_suffix_hyphen"] == 1:
        add(
            "prefix_suffix_hyphen",
            "Domain Hyphenation",
            f"Hyphen detected in {features['domain']}",
            "No domain hyphen",
            "SUSPICIOUS",
            "Moderate",
            14,
            "The domain contains a hyphen. Hyphens can appear in legitimate "
            "domains, but attackers may also use them in lookalike or "
            "brand-impersonation domains.",
        )
    else:
        add(
            "prefix_suffix_hyphen",
            "Domain Hyphenation",
            "No domain hyphen detected",
            "No domain hyphen",
            "SAFE",
            "None",
            0,
            "No hyphen was detected in the domain. This is not proof that "
            "the domain is legitimate.",
        )

    # 5. Subdomain depth
    subdomains = features["num_subdomains"]

    if subdomains >= 2:
        add(
            "num_subdomains",
            "Subdomain Depth",
            f"{subdomains} subdomains",
            "A simple domain structure",
            "SUSPICIOUS",
            "High",
            15,
            f"The URL contains {subdomains} subdomains. Deeply nested "
            "subdomains can be used to make a misleading URL appear "
            "associated with another organization.",
        )
    elif subdomains == 1:
        add(
            "num_subdomains",
            "Subdomain Depth",
            "1 subdomain",
            "A simple domain structure",
            "SAFE",
            "Low",
            0,
            "One subdomain was detected. Subdomains are common in legitimate "
            "websites, so this feature alone is not a threat indicator.",
        )
    else:
        add(
            "num_subdomains",
            "Subdomain Depth",
            "No subdomains detected",
            "A simple domain structure",
            "SAFE",
            "None",
            0,
            "No subdomains were detected. A simple domain structure does "
            "not guarantee that a website is safe.",
        )

    # 6. Suspicious keywords
    keyword_count = features["suspicious_words_count"]

    if keyword_count > 0:
        add(
            "suspicious_words_count",
            "Suspicious URL Keywords",
            f"{keyword_count} keyword indicator(s)",
            "No suspicious keywords",
            "SUSPICIOUS",
            "High" if keyword_count > 1 else "Moderate",
            min(20, keyword_count * 8),
            "The URL contains words commonly associated with credential "
            "requests or social-engineering lures, such as login, verify, "
            "secure, account, or banking. These words can also appear in "
            "legitimate URLs.",
        )
    else:
        add(
            "suspicious_words_count",
            "Suspicious URL Keywords",
            "No suspicious keywords detected",
            "No suspicious keywords",
            "SAFE",
            "None",
            0,
            "No keywords from the configured suspicious-word list were "
            "detected. This does not rule out phishing.",
        )

    # 7. Domain character entropy
    entropy = features["shannon_entropy"]

    if entropy > 4.2:
        add(
            "shannon_entropy",
            "Domain Character Entropy",
            f"{entropy:.2f} bits",
            "Lower domain character randomness",
            "SUSPICIOUS",
            "Moderate",
            10,
            "The domain has relatively high character entropy, indicating "
            "a less predictable character distribution. This can occur in "
            "generated or obfuscated domains, but is not conclusive evidence "
            "of malicious activity.",
        )
    else:
        add(
            "shannon_entropy",
            "Domain Character Entropy",
            f"{entropy:.2f} bits",
            "Lower domain character randomness",
            "SAFE",
            "None",
            0,
            "The domain did not exceed the configured entropy threshold. "
            "Low entropy does not establish that a domain is trustworthy.",
        )

    # 8. HTTPS protocol
    if features["is_https"] == 0:
        add(
            "is_https",
            "HTTPS Protocol",
            "HTTP or non-HTTPS URL",
            "HTTPS protocol",
            "SUSPICIOUS",
            "Moderate",
            12,
            "The URL does not use HTTPS according to the extracted protocol "
            "feature. HTTPS protects data in transit, but its absence alone "
            "does not prove phishing.",
        )
    else:
        add(
            "is_https",
            "HTTPS Protocol",
            "HTTPS detected",
            "HTTPS protocol",
            "SAFE",
            "None",
            0,
            "The URL uses HTTPS. Encryption protects data in transit, but "
            "phishing websites can also use HTTPS. A certificate does not "
            "prove that a website is legitimate.",
        )

    # 9. URL length
    url_length = features["url_length"]

    if url_length > 75:
        add(
            "url_length",
            "URL Length",
            f"{url_length} characters",
            "75 characters or fewer",
            "SUSPICIOUS",
            "Moderate",
            8,
            "The URL is relatively long. Long URLs can contain deeply nested "
            "paths or parameters that make the destination harder to inspect.",
        )
    elif url_length > 54:
        add(
            "url_length",
            "URL Length",
            f"{url_length} characters",
            "75 characters or fewer",
            "SUSPICIOUS",
            "Low",
            2,
            "The URL is moderately long. Length alone is not sufficient to "
            "determine whether a URL is malicious.",
        )
    else:
        add(
            "url_length",
            "URL Length",
            f"{url_length} characters",
            "75 characters or fewer",
            "SAFE",
            "None",
            0,
            "The URL is within the configured length range. Short URLs can "
            "also be malicious.",
        )

    # 10. Double slash in URL path
    if features["double_slash_redirect"] == 1:
        add(
            "double_slash_redirect",
            "Embedded Double Slash",
            "Additional // pattern detected",
            "No additional // pattern after the protocol",
            "SUSPICIOUS",
            "Moderate",
            16,
            "An additional double-slash pattern was detected after the "
            "protocol portion of the URL. This may be used in confusing "
            "URL structures, but does not independently prove an open "
            "redirect or phishing attack.",
        )

    return explanations


def predict_url(url: str) -> Dict[str, Any]:
    """Extract URL features, run Random Forest inference, and return results."""

    features = extract_features_from_url(url)
    vector = vectorize_features(features)

    # The extractor returns 20 numerical features in FEATURE_ORDER.
    # The features dictionary has one additional non-numeric 'domain' key.
    if len(vector) != len(FEATURE_ORDER):
        raise ValueError(
            f"Feature vector length mismatch: expected {len(FEATURE_ORDER)}, "
            f"received {len(vector)}."
        )

    vector_array = np.asarray(vector, dtype=float).reshape(1, -1)

    if not np.isfinite(vector_array).all():
        raise ValueError("Feature vector contains invalid numeric values.")

    model = get_or_load_model()

    expected_features = getattr(model, "n_features_in_", None)

    if expected_features is not None and vector_array.shape[1] != expected_features:
        raise ValueError(
            f"Model expects {expected_features} features, but the extractor "
            f"provided {vector_array.shape[1]}."
        )

    probabilities = model.predict_proba(vector_array)[0]
    classes = list(model.classes_)

    # Find the probability belonging to phishing class 1.
    if 1 not in classes:
        raise ValueError(
            f"Phishing class 1 is missing from the model. "
            f"Available classes: {classes}"
        )

    phishing_index = classes.index(1)
    phishing_score = float(probabilities[phishing_index])

    # Uncalibrated model score, not verified real-world probability.
    risk_score = round(phishing_score * 100, 1)

    if risk_score >= 70:
        classification = "phishing"
        verdict = "HIGH RISK: Phishing-like URL patterns detected"
        recommendation = (
            "Avoid opening this URL or entering credentials. Verify the "
            "destination independently using the organization's official "
            "website or another trusted channel."
        )
    elif risk_score >= 40:
        classification = "suspicious"
        verdict = "MODERATE RISK: Suspicious URL patterns detected"
        recommendation = (
            "Treat this URL with caution. Verify the domain and destination "
            "before opening it or providing personal information."
        )
    else:
        classification = "safe"
        verdict = "LOW MODEL SCORE: No strong phishing pattern detected"
        recommendation = (
            "The model detected relatively few phishing-like patterns. "
            "This is not a guarantee that the URL or website is safe. "
            "Check the domain independently before entering sensitive data."
        )

    # Highest class score, not calibrated confidence or real-world reliability.
    model_score_strength = round(float(np.max(probabilities)) * 100, 1)

    explanations = explain_features(features)

    return {
        "url": url,
        "domain": features.get("domain", ""),
        "classification": classification,
        "risk_score": risk_score,
        "confidence": model_score_strength,
        "model_used": "Random Forest Classifier",
        "features": features,
        "explanations": explanations,
        "security_verdict": verdict,
        "recommendation": recommendation,
        "explanation_method": (
            "Rule-based heuristic indicators. The listed heuristic points "
            "are not actual Random Forest feature contributions."
        ),
        "score_interpretation": (
            "Uncalibrated model score from the synthetic group-held-out "
            "benchmark; not a verified real-world phishing probability."
        ),
    }
