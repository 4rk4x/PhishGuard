import os
import json
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.scan import Scan
from app.security import get_password_hash, defang_url
from app.ml.model_trainer import train_and_evaluate_models
from app.routers import auth, scan, admin, ml_metrics

def seed_initial_data(db: Session):
    """Seeds default academic accounts and benchmark demo scans if empty."""
    # 1. Seed Admin User
    admin_user = db.query(User).filter(User.email == settings.DEFAULT_ADMIN_EMAIL).first()
    if not admin_user:
        admin_user = User(
            email=settings.DEFAULT_ADMIN_EMAIL,
            full_name="Prof. Lead Security Auditor",
            hashed_password=get_password_hash(settings.DEFAULT_ADMIN_PASSWORD),
            role="admin",
            is_active=True
        )
        db.add(admin_user)

    # 2. Seed Student Researcher User
    student_user = db.query(User).filter(User.email == settings.DEFAULT_USER_EMAIL).first()
    if not student_user:
        student_user = User(
            email=settings.DEFAULT_USER_EMAIL,
            full_name="CSE Research Student",
            hashed_password=get_password_hash(settings.DEFAULT_USER_PASSWORD),
            role="user",
            is_active=True
        )
        db.add(student_user)

    db.commit()

    # 3. Seed Initial Realistic Scans for rich initial telemetry if database is fresh
    if db.query(Scan).count() == 0:
        seed_scans = [
            {
                "url": "https://www.nature.com/articles/nature14539",
                "classification": "safe",
                "risk_score": 4.2,
                "confidence": 98.5,
                "domain": "nature.com",
                "features": {"url_length": 45, "is_https": 1, "num_subdomains": 0, "having_ip_address": 0},
                "days_ago": 6
            },
            {
                "url": "http://192.168.1.100/paypal/login.php?cmd=update",
                "classification": "phishing",
                "risk_score": 96.8,
                "confidence": 97.4,
                "domain": "192.168.1.100",
                "features": {"url_length": 52, "is_https": 0, "num_subdomains": 0, "having_ip_address": 1, "suspicious_words_count": 2},
                "days_ago": 5
            },
            {
                "url": "https://chase.com.security-alert-resolve.club/verify.asp",
                "classification": "phishing",
                "risk_score": 91.5,
                "confidence": 94.2,
                "domain": "chase.com.security-alert-resolve.club",
                "features": {"url_length": 57, "is_https": 1, "num_subdomains": 2, "having_ip_address": 0, "suspicious_words_count": 2},
                "days_ago": 4
            },
            {
                "url": "http://bit.ly/34xPaypalSecurityAlert",
                "classification": "suspicious",
                "risk_score": 64.0,
                "confidence": 82.0,
                "domain": "bit.ly",
                "features": {"url_length": 35, "is_https": 0, "num_subdomains": 0, "is_shortened": 1},
                "days_ago": 3
            },
            {
                "url": "https://en.wikipedia.org/wiki/Phishing",
                "classification": "safe",
                "risk_score": 6.8,
                "confidence": 96.1,
                "domain": "en.wikipedia.org",
                "features": {"url_length": 38, "is_https": 1, "num_subdomains": 1, "having_ip_address": 0},
                "days_ago": 2
            },
            {
                "url": "http://netflix-subscription-renew-billing.com/update",
                "classification": "phishing",
                "risk_score": 88.4,
                "confidence": 93.0,
                "domain": "netflix-subscription-renew-billing.com",
                "features": {"url_length": 53, "is_https": 0, "num_subdomains": 0, "prefix_suffix_hyphen": 1, "suspicious_words_count": 2},
                "days_ago": 1
            },
            {
                "url": "https://github.com/torvalds/linux",
                "classification": "safe",
                "risk_score": 3.5,
                "confidence": 99.0,
                "domain": "github.com",
                "features": {"url_length": 33, "is_https": 1, "num_subdomains": 0, "having_ip_address": 0},
                "days_ago": 0
            }
        ]

        now = datetime.utcnow()
        for s in seed_scans:
            scan_time = now - timedelta(days=s["days_ago"], hours=2)
            db.add(Scan(
                user_id=student_user.id if student_user else None,
                url=s["url"],
                defanged_url=defang_url(s["url"]),
                domain=s["domain"],
                classification=s["classification"],
                risk_score=s["risk_score"],
                confidence=s["confidence"],
                model_used="Random Forest Classifier (Ensemble)",
                features_snapshot=json.dumps(s["features"]),
                explanation=json.dumps([
                    {
                        "feature_key": "protocol",
                        "feature_name": "Protocol Analysis",
                        "value": "Checked",
                        "baseline_threshold": "HTTPS",
                        "status": "PHISHING" if s["classification"] == "phishing" else "SAFE",
                        "impact_level": "High" if s["classification"] == "phishing" else "None",
                        "score_contribution": 15.0 if s["classification"] == "phishing" else -5.0,
                        "explanation": "Initial benchmark baseline classification audit."
                    }
                ]),
                client_ip="127.0.0.1",
                created_at=scan_time
            ))
        db.commit()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler: creates tables, trains ML model if missing, seeds accounts."""
    # 1. Initialize DB tables
    Base.metadata.create_all(bind=engine)

    # 2. Check and initialize model artifacts
    metrics_file = os.path.join(settings.MODEL_DIR, "metrics.json")
    if not os.path.exists(metrics_file):
        print("[PhishGuard] Model artifacts not found. Initiating ML benchmark training pipeline...")
        train_and_evaluate_models(settings.MODEL_DIR)
        print("[PhishGuard] ML model training and evaluation completed.")

    # 3. Seed accounts & demo scans
    db = SessionLocal()
    try:
        seed_initial_data(db)
    finally:
        db.close()

    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Explainable Machine Learning-Based Phishing URL Detection System (CSE Academic Project)",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for Vite React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth.router)
app.include_router(scan.router)
app.include_router(admin.router)
app.include_router(ml_metrics.router)

@app.get("/")
def root():
    return {
        "project": "PhishGuard",
        "description": "Explainable Machine Learning-Based Phishing URL Detection System",
        "status": "operational",
        "version": "1.0.0",
        "documentation": "/docs",
        "api_endpoints": {
            "auth": "/api/auth",
            "scan": "/api/scan",
            "admin": "/api/admin",
            "ml_metrics": "/api/ml/metrics"
        }
    }

@app.get("/health")
def healthcheck():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)

