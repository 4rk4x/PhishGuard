import pytest
from app.ml.feature_extractor import (
    extract_features_from_url,
    calculate_shannon_entropy,
    check_ip_address,
    vectorize_features,
    FEATURE_ORDER
)

def test_ip_address_detection():
    assert check_ip_address("192.168.1.1") == 1
    assert check_ip_address("10.0.0.1:8080") == 1
    assert check_ip_address("google.com") == 0
    assert check_ip_address("chase.com") == 0

def test_shannon_entropy():
    # Regular natural language domain
    natural_entropy = calculate_shannon_entropy("google.com")
    # Highly randomized string (DGA pattern)
    random_entropy = calculate_shannon_entropy("x829df83af938e72.xyz")
    assert random_entropy > natural_entropy

def test_feature_extraction_structure():
    url = "http://paypal.com.account-update.xyz/login.php?user=test"
    features = extract_features_from_url(url)
    
    assert features["having_ip_address"] == 0
    assert features["is_https"] == 0
    assert features["prefix_suffix_hyphen"] == 1
    assert features["num_subdomains"] >= 2
    assert features["suspicious_words_count"] >= 2  # 'account' and 'login'
    
    vec = vectorize_features(features)
    assert len(vec) == len(FEATURE_ORDER)

def test_shortener_detection():
    url = "https://bit.ly/secure-paypal-verify"
    features = extract_features_from_url(url)
    assert features["is_shortened"] == 1

def test_at_symbol_detection():
    url = "http://google.com@evil-phishing-host.com/login"
    features = extract_features_from_url(url)
    assert features["having_at_symbol"] == 1

