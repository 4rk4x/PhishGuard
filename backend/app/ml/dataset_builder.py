
"""
Dataset Builder & Provenance Generator

Builds a project-generated synthetic benchmark dataset
of benign and phishing-like URLs.

Related URLs are assigned a shared group_id so that
the model trainer can keep related examples together
during train/test splitting.

No external URL records are directly imported or downloaded.
"""

import os
import json
import ipaddress
from urllib.parse import urlparse

import pandas as pd


DATASET_PROVENANCE = {
    "dataset_name": "PhishGuard Synthetic URL Benchmark",
    "version": "1.1.0",
    "license": "Not separately licensed",
    "citation": (
        "No external dataset records are directly imported. "
        "The benchmark is generated using project-defined URL patterns."
    ),
    "description": (
        "A project-generated synthetic benchmark containing "
        "benign and phishing-like URL patterns for academic "
        "experimentation. The dataset is not a verified "
        "real-world phishing or benign URL collection."
    ),
    "data_type": "Synthetic",
    "external_data_imported": False,
    "generation_method": (
        "Manually defined URL patterns and template-based expansion"
    ),
    "grouping_method": (
        "Benign examples are grouped by normalized hostname. "
        "Phishing examples are grouped by detected brand or "
        "attack-pattern host."
    ),
    "target_column": "label",
    "group_column": "group_id",
    "classes": {
        "0": "Legitimate / Benign (synthetic examples)",
        "1": "Malicious / Phishing (synthetic examples)"
    },
    "feature_count": 20,
    "created_at": "2026-03-01T00:00:00Z"
}


# Representative benign URL patterns across various sectors.
BENIGN_URLS = [
    "https://www.google.com/search?q=machine+learning+tutorial",
    "https://en.wikipedia.org/wiki/Phishing",
    "https://github.com/torvalds/linux",
    "https://stackoverflow.com/questions/11227809/why-is-processing-a-sorted-array-faster",
    "https://www.amazon.com/dp/B08N5WRWNW",
    "https://www.nytimes.com/section/technology",
    "https://www.microsoft.com/en-us/software-download/windows11",
    "https://www.apple.com/macbook-pro/",
    "https://www.mit.edu/research/",
    "https://stanford.edu/academics/",
    "https://www.nature.com/articles/nature14539",
    "https://arxiv.org/abs/1706.03762",
    "https://www.netflix.com/browse",
    "https://www.linkedin.com/feed/",
    "https://twitter.com/explore",
    "https://www.reddit.com/r/MachineLearning/",
    "https://www.bbc.com/news/world",
    "https://www.cnn.com/world",
    "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    "https://pypi.org/project/scikit-learn/",
    "https://fastapi.tiangolo.com/tutorial/",
    "https://react.dev/learn",
    "https://tailwindcss.com/docs/installation",
    "https://www.kaggle.com/competitions",
    "https://chase.com/personal/banking",
    "https://www.bankofamerica.com/smallbusiness/",
    "https://www.wellsfargo.com/help/",
    "https://paypal.com/us/home",
    "https://stripe.com/docs/api",
    "https://cloud.google.com/compute/docs",
    "https://aws.amazon.com/ec2/",
    "https://azure.microsoft.com/en-us/solutions/",
    "https://gitlab.com/explore",
    "https://hub.docker.com/_/python",
    "https://news.ycombinator.com/",
    "https://medium.com/topic/cybersecurity",
    "https://www.cdc.gov/flu/index.htm",
    "https://www.nih.gov/health-information",
    "https://www.who.int/emergencies/situations",
    "https://europa.eu/european-union/index_en",
    "https://www.un.org/en/about-us",
    "https://www.coursera.org/learn/machine-learning",
    "https://www.edx.org/course/cs50s-introduction-to-computer-science",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://www.spotify.com/us/premium/",
    "https://vimeo.com/channels/staffpicks",
    "https://www.adobe.com/creativecloud.html",
    "https://www.dropbox.com/business",
    "https://slack.com/features",
    "https://zoom.us/pricing",
    "https://www.salesforce.com/products/crm/",
    "https://hubspot.com/products/marketing",
    "https://www.atlassian.com/software/jira",
    "https://www.notion.so/product",
    "https://www.figma.com/design/",
    "https://www.canva.com/templates/",
    "https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/",
    "https://www.cisa.gov/resources-tools",
    "https://nvd.nist.gov/vuln/detail/CVE-2021-44228",
    "https://owasp.org/www-project-top-ten/",
    "https://www.eff.org/issues/privacy",
    "https://www.gnu.org/licenses/gpl-3.0.en.html",
    "https://httpd.apache.org/docs/2.4/",
    "https://nginx.org/en/docs/",
    "https://www.postgresql.org/docs/current/",
    "https://www.mongodb.com/docs/",
    "https://redis.io/docs/about/",
    "https://www.elastic.co/guide/index.html",
    "https://kubernetes.io/docs/home/",
    "https://prometheus.io/docs/introduction/overview/"
]


def generate_expanded_benign():
    """Generate benign-like URL variants from predefined domains."""

    samples = list(BENIGN_URLS)

    subpaths = [
        "docs", "api", "about", "contact", "support",
        "explore", "articles", "guide", "faq", "terms"
    ]

    categories = [
        "tech", "science", "finance", "education",
        "security", "community", "releases", "v1", "v2"
    ]

    base_domains = [
        "https://www.nytimes.com",
        "https://www.stanford.edu",
        "https://www.berkeley.edu",
        "https://www.ox.ac.uk",
        "https://www.cam.ac.uk",
        "https://www.harvard.edu",
        "https://www.mit.edu",
        "https://www.imperial.ac.uk",
        "https://www.princeton.edu",
        "https://www.columbia.edu",
        "https://www.cornell.edu",
        "https://www.yale.edu",
        "https://www.caltech.edu",
        "https://www.ucla.edu",
        "https://www.washington.edu",
        "https://www.ieee.org",
        "https://www.acm.org",
        "https://www.usenix.org",
        "https://www.sciencedirect.com",
        "https://springer.com",
        "https://wiley.com",
        "https://www.reuters.com",
        "https://www.bloomberg.com",
        "https://www.ft.com",
        "https://www.theguardian.com",
        "https://www.nationalgeographic.com",
        "https://www.scientificamerican.com",
        "https://www.weather.gov",
        "https://www.nasa.gov",
        "https://www.esa.int",
        "https://www.nih.gov",
        "https://www.who.int"
    ]

    for domain in base_domains:
        for path in subpaths[:5]:
            for category in categories[:4]:
                samples.append(
                    f"{domain}/{path}/{category}?page=1&sort=date"
                )

    return samples


# Representative phishing-like URL patterns.
PHISHING_URLS = [
    # IP address instead of domain
    "http://192.168.1.100/paypal/login.php?cmd=update",
    "http://185.220.101.5/bankofamerica/secure-login/auth.html",
    "http://103.251.167.20/netflix-account-suspended/verify.php",
    "http://45.142.182.12/apple-id/verification/signin.html",
    "http://91.240.118.172/chase-online/card-validation.asp",
    "http://217.182.175.8/wellsfargo/secure-portal/index.php",

    # Subdomain brand spoofing
    "http://paypal.com.account-verification-service.xyz/login.html",
    "https://appleid.apple.com.secure-update-notice.top/account",
    "http://netflix.com.billing-payment-update.info/login.php",
    "https://chase.com.security-alert-resolve.club/verify.asp",
    "http://microsoft.com.account-protection-centre.win/signin",
    "https://amazon.com.customer-support-order-verify.site/auth",
    "http://bankofamerica.com.sign-on-validation.live/portal",
    "https://wellsfargo.com.id-confirmation-portal.online/app",

    # Prefix-suffix hyphenated brand squatting
    "https://secure-login-paypal-verify.com/cgi-bin/webscr",
    "http://apple-id-verify-account-now.com/identity/signin",
    "https://netflix-subscription-renew-billing.com/update",
    "http://chase-bank-security-center-update.com/online/banking",
    "https://amazon-security-suspension-appeals.com/ap/signin",
    "http://microsoft-outlook-credential-confirm.com/owa",
    "https://google-drive-shared-secure-document.com/view/d1838",
    "http://wellsfargo-banking-alert-protection.com/auth/login",
    "https://binance-wallet-security-restore.com/kyc-verification",
    "http://metamask-seed-phrase-recovery-portal.com/vault",
    "https://coinbase-account-locked-resolve.com/auth/step2",

    # URL shortening redirection masking attacks
    "http://bit.ly/34xPaypalSecurityAlert",
    "http://tinyurl.com/apple-billing-update-urgent",
    "http://t.co/chase-unusual-activity-verify",
    "http://is.gd/netflix-payment-declined-retry",
    "http://ow.ly/bank-security-notice-immediate",
    "http://cutt.ly/wellsfargo-identity-confirm",
    "http://rebrand.ly/amazon-refund-request-form",

    # '@' credential injection trick
    "http://legit-news.com@evil-phishing-host.com/login.html",
    "https://google.com@phish-credentials-steal.net/auth/verify",
    "http://bank.com@malicious-harvest-box.org/secure/login",
    "https://paypal.com@192.168.1.15/webscr/login.php",

    # High entropy / DGA / obfuscated paths
    "http://x829df83-security-check-portal-login.xyz/verify/user?id=93821038103&token=af938e",
    "https://a92-f02-verification-service-auth.top/account/confirm?h=839d8e72f91a0b3",
    "http://secure-839210-appleid-support.info/owa/login.aspx?auth=redirect_now",
    "https://srv93-account-renew-center.club/billing/notice?customer_id=92813"
]


def generate_expanded_phishing():
    """Generate phishing-like URL variants from predefined templates."""

    samples = list(PHISHING_URLS)

    brands = [
        "paypal", "chase", "netflix", "appleid", "amazon",
        "wellsfargo", "bankofamerica", "binance", "metamask",
        "microsoft", "outlook"
    ]

    keywords = [
        "login", "verify-account", "security-alert",
        "billing-update", "confirm-identity", "unlock-account",
        "recovery-center", "wallet-restore"
    ]

    bad_tlds = [
        ".xyz", ".top", ".club", ".win", ".live",
        ".site", ".online", ".work", ".link", ".click"
    ]

    for brand in brands:
        for keyword in keywords[:5]:
            for tld in bad_tlds[:5]:
                samples.append(
                    f"http://{brand}-{keyword}-portal-service{tld}"
                    f"/secure/auth/login.php?user_token=92849102"
                )

                samples.append(
                    f"http://192.168.{len(brand)}.{len(keyword)}"
                    f"/{brand}/{keyword}/index.html"
                )

                samples.append(
                    f"http://{brand}.com.{keyword}-protection-verify{tld}"
                    f"/session/start?ref=email_notice"
                )

    return samples


def _normalise_hostname(url):
    """Extract a normalized hostname from a URL."""

    candidate = url.strip()

    if "://" not in candidate:
        candidate = "https://" + candidate

    try:
        hostname = urlparse(candidate).hostname or "unknown"
    except ValueError:
        hostname = "unknown"

    hostname = hostname.lower().strip(".")
    if hostname.startswith("www."):
        hostname = hostname[4:]

    return hostname or "unknown"


def _get_group_id(url, label):
    """
    Assign related synthetic URLs to the same group.

    Benign:
        Group by normalized hostname.

    Phishing:
        Group by detected brand where possible.
        Otherwise group by attack-pattern host/category.
    """

    raw_url = url.strip()
    lower_url = raw_url.lower()
    hostname = _normalise_hostname(raw_url)

    if label == 0:
        return f"benign_domain:{hostname}"

    brands = [
        "bankofamerica",
        "wellsfargo",
        "metamask",
        "microsoft",
        "netflix",
        "paypal",
        "binance",
        "amazon",
        "appleid",
        "outlook",
        "chase",
        "google",
        "coinbase"
    ]

    # Keep URLs involving the same brand together.
    for brand in brands:
        if brand in lower_url:
            return f"phishing_brand:{brand}"

    # Group remaining examples by attack-pattern category.
    try:
        parsed = urlparse(
            raw_url if "://" in raw_url else "https://" + raw_url
        )
        host = parsed.hostname or hostname
    except ValueError:
        host = hostname

    try:
        ipaddress.ip_address(host)
        return "phishing_pattern:ip_address"
    except ValueError:
        pass

    if "@" in raw_url:
        return "phishing_pattern:at_symbol"

    shortener_hosts = {
        "bit.ly",
        "tinyurl.com",
        "t.co",
        "is.gd",
        "ow.ly",
        "cutt.ly",
        "rebrand.ly"
    }

    if hostname in shortener_hosts:
        return "phishing_pattern:url_shortener"

    return f"phishing_host:{hostname}"


def build_dataset_dataframe() -> pd.DataFrame:
    """
    Build a deduplicated synthetic dataset.

    Returns:
        DataFrame containing url, label, and group_id.
    """

    benign = generate_expanded_benign()
    phishing = generate_expanded_phishing()

    data = []
    seen = set()

    for url in benign:
        cleaned_url = url.strip()

        if cleaned_url and cleaned_url not in seen:
            seen.add(cleaned_url)
            data.append({
                "url": cleaned_url,
                "label": 0,
                "group_id": _get_group_id(cleaned_url, 0)
            })

    for url in phishing:
        cleaned_url = url.strip()

        if cleaned_url and cleaned_url not in seen:
            seen.add(cleaned_url)
            data.append({
                "url": cleaned_url,
                "label": 1,
                "group_id": _get_group_id(cleaned_url, 1)
            })

    df = pd.DataFrame(data)

    df = df.sample(
        frac=1.0,
        random_state=42
    ).reset_index(drop=True)

    return df


def save_benchmark_data(output_dir: str):
    """Generate and save the CSV dataset and provenance JSON."""

    os.makedirs(output_dir, exist_ok=True)

    df = build_dataset_dataframe()

    csv_path = os.path.join(
        output_dir,
        "phishing_dataset.csv"
    )
    df.to_csv(csv_path, index=False)

    provenance = DATASET_PROVENANCE.copy()
    provenance["total_samples"] = len(df)
    provenance["benign_samples"] = int((df["label"] == 0).sum())
    provenance["phishing_samples"] = int((df["label"] == 1).sum())
    provenance["total_groups"] = int(df["group_id"].nunique())

    provenance_path = os.path.join(
        output_dir,
        "dataset_provenance.json"
    )

    with open(provenance_path, "w", encoding="utf-8") as file:
        json.dump(provenance, file, indent=2)

    return csv_path, provenance_path, len(df)


if __name__ == "__main__":
    storage_dir = os.path.join(
        os.path.dirname(__file__),
        "model_storage"
    )

    csv_path, provenance_path, count = save_benchmark_data(storage_dir)

    print(f"Dataset generated: {count} samples")
    print(f"CSV: {csv_path}")
    print(f"Provenance: {provenance_path}")
