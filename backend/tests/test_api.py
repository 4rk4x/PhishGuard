
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["project"] == "PhishGuard"
    assert data["status"] == "operational"


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_ml_metrics_endpoint():
    response = client.get("/api/ml/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "accuracy" in data
    assert "confusion_matrix" in data
    assert "comparison" in data
    assert data["accuracy"] > 0.85


def test_url_scan_api():
    payload = {"url": "http://192.168.1.100/paypal/login.php?update=1"}
    response = client.post("/api/scan/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["classification"] in ["suspicious", "phishing"]
    assert "risk_score" in data
    assert "defanged_url" in data
    assert "explanations" in data


def test_quick_demo_login_is_disabled():
    response = client.post("/api/auth/quick-demo-login?role=user")
    assert response.status_code == 404
    assert response.json()["detail"] == "Demo login is disabled."


def test_scan_stats_summary():
    response = client.get("/api/scan/stats/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_scans" in data
    assert "daily_activity" in data
