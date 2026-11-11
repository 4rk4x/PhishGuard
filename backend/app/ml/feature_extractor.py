
import re
import math
import ipaddress
from urllib.parse import urlparse
from typing import Dict, Any, List


SHORTENING_SERVICES = {
    "bit.ly", "tinyurl.com", "goo.gl", "t.co", "ow.ly", "is.gd",
    "buff.ly", "adf.ly", "bit.do", "tiny.cc", "rebrand.ly", "cutt.ly",
    "shorte.st", "bc.vc", "snipurl.com", "bl.ink", "lnkd.in", "rb.gy"
}

SUSPICIOUS_KEYWORDS = [
    "login", "signin", "verify", "verification", "account", "banking",
    "secure", "security", "update", "wallet", "paypal", "appleid",
    "support", "confirm", "recovery", "password", "auth", "credential",
    "billing", "invoice", "validate", "suspended", "urgent"
]

COMMON_TLDS = {
    "com", "org", "net", "edu", "gov", "mil", "io", "co", "ai",
    "uk", "ca", "de", "fr", "in", "au", "app", "dev"
}

FEATURE_ORDER = [
    "url_length",
    "having_ip_address",
    "num_subdomains",
    "is_https",
    "having_at_symbol",
    "double_slash_redirect",
    "prefix_suffix_hyphen",
    "is_shortened",
    "count_dots",
    "count_hyphens",
    "count_at",
    "count_question",
    "count_percent",
    "count_digits",
    "digit_ratio",
    "suspicious_words_count",
    "shannon_entropy",
    "path_length",
    "num_query_params",
    "tld_in_subdomain"
]


def calculate_shannon_entropy(text: str) -> float:
    """Calculate Shannon character entropy."""
    if not text:
        return 0.0

    probabilities = [
        text.count(character) / len(text)
        for character in dict.fromkeys(text)
    ]

    entropy = -sum(
        probability * math.log2(probability)
        for probability in probabilities
    )

    return round(entropy, 4)


def check_ip_address(domain: str) -> int:
    """
    Detect IPv4 and IPv6 addresses, optionally including a port.

    Examples:
        192.168.1.1       -> 1
        10.0.0.1:8080     -> 1
        2001:db8::1       -> 1
        [2001:db8::1]     -> 1
        [2001:db8::1]:80  -> 1
        example.com       -> 0
    """
    if not domain:
        return 0

    candidate = str(domain).strip()

    # Handle bracketed IPv6 addresses, optionally with a port.
    if candidate.startswith("["):
        closing_bracket = candidate.find("]")

        if closing_bracket == -1:
            return 0

        candidate = candidate[1:closing_bracket]

    else:
        # Strip a port only when there is exactly one colon.
        # This avoids breaking unbracketed IPv6 addresses.
        if candidate.count(":") == 1:
            host, possible_port = candidate.rsplit(":", 1)

            if possible_port.isdigit():
                candidate = host

    try:
        ipaddress.ip_address(candidate)
        return 1
    except ValueError:
        return 0


def _get_hostname(parsed) -> str:
    """Extract a normalized hostname without credentials or port numbers."""
    try:
        hostname = parsed.hostname
    except ValueError:
        hostname = None

    if not hostname:
        return ""

    return hostname.lower().rstrip(".")


def _count_subdomains(hostname: str, is_ip: int) -> int:
    """
    Count subdomains using a last-two-label approximation.
    IP addresses are never treated as domains.
    """
    if not hostname or is_ip:
        return 0

    parts = hostname.split(".")

    if parts and parts[0] == "www":
        parts = parts[1:]

    return max(0, len(parts) - 2)


def _is_shortened_domain(hostname: str) -> int:
    """Match known shortening services by hostname boundaries."""
    if not hostname:
        return 0

    for service in SHORTENING_SERVICES:
        if hostname == service or hostname.endswith("." + service):
            return 1

    return 0


def extract_features_from_url(url: str) -> Dict[str, Any]:
    """
    Extract 20 lexical, syntactic and structural URL features.

    Returns 20 numerical features plus the normalized hostname.
    """
    raw_url = str(url).strip()

    has_explicit_scheme = raw_url.lower().startswith(
        ("http://", "https://")
    )

    full_url = (
        raw_url
        if has_explicit_scheme
        else "https://" + raw_url
    )

    parsed = urlparse(full_url)

    domain = _get_hostname(parsed)
    path = parsed.path
    query = parsed.query

    # 1. Overall URL length
    url_length = len(raw_url)

    # 2. IP address presence
    having_ip = check_ip_address(domain)

    # 3. Subdomain count
    num_subdomains = _count_subdomains(domain, having_ip)

    # 4. HTTPS usage
    is_https = 1 if raw_url.lower().startswith("https://") else 0

    # 5. @ symbol
    having_at = 1 if "@" in raw_url else 0

    # 6. Double slash redirect
    double_slash = 1 if raw_url.rfind("//") > 7 else 0

    # 7. Domain hyphenation
    prefix_suffix_hyphen = 1 if "-" in domain else 0

    # 8. URL shortening service
    is_shortened = _is_shortened_domain(domain)

    # 9-13. Character counts
    count_dots = raw_url.count(".")
    count_hyphens = raw_url.count("-")
    count_at = raw_url.count("@")
    count_question = raw_url.count("?")
    count_percent = raw_url.count("%")

    # 14-15. Digit analysis
    digit_chars = sum(character.isdigit() for character in raw_url)

    digit_ratio = round(
        digit_chars / max(1, url_length),
        4
    )

    # 16. Suspicious keyword count
    url_lower = raw_url.lower()

    suspicious_count = sum(
        1 for keyword in SUSPICIOUS_KEYWORDS
        if keyword in url_lower
    )

    # 17. Shannon entropy
    entropy = calculate_shannon_entropy(
        domain if domain else raw_url
    )

    # 18. Path length
    path_length = len(path)

    # 19. Query parameter count
    query_params_count = (
        len(query.split("&")) if query else 0
    )

    # 20. TLD inside subdomain
    tld_spoofing = 0

    if domain and not having_ip:
        parts = domain.split(".")

        if len(parts) > 2:
            for subdomain in parts[:-2]:
                if subdomain in COMMON_TLDS:
                    tld_spoofing = 1
                    break

    features = {
        "url_length": url_length,
        "having_ip_address": having_ip,
        "num_subdomains": num_subdomains,
        "is_https": is_https,
        "having_at_symbol": having_at,
        "double_slash_redirect": double_slash,
        "prefix_suffix_hyphen": prefix_suffix_hyphen,
        "is_shortened": is_shortened,
        "count_dots": count_dots,
        "count_hyphens": count_hyphens,
        "count_at": count_at,
        "count_question": count_question,
        "count_percent": count_percent,
        "count_digits": digit_chars,
        "digit_ratio": digit_ratio,
        "suspicious_words_count": suspicious_count,
        "shannon_entropy": entropy,
        "path_length": path_length,
        "num_query_params": query_params_count,
        "tld_in_subdomain": tld_spoofing,
        "domain": domain
    }

    return features


def vectorize_features(features: Dict[str, Any]) -> List[float]:
    """Convert the 20 numerical features into model input order."""
    return [
        float(features[key])
        for key in FEATURE_ORDER
    ]
