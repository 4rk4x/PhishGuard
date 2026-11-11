
import json
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy import func, desc
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.scan import Scan
from app.schemas.scan import (
    ScanRequest,
    ScanResponse,
    ScanHistoryResponse,
    UserScanStats
)
from app.security import (
    defang_url,
    get_current_user_optional,
    get_current_user
)
from app.ml.predictor import predict_url

router = APIRouter(prefix="/api/scan", tags=["URL Scanner & Explainability"])


def build_security_verdict(classification: str):
    """Returns a cautious security verdict based on the model classification."""
    if classification == "phishing":
        return (
            "HIGH RISK: Phishing-like URL patterns detected",
            "Avoid visiting this URL or entering credentials."
        )

    if classification == "suspicious":
        return (
            "MODERATE RISK: Suspicious URL patterns detected",
            "Exercise caution and independently verify the domain."
        )

    return (
        "LOW RISK: No strong suspicious structural indicators detected",
        "No strong suspicious indicators were detected. This does not guarantee that the URL is safe."
    )


@router.post("/analyze", response_model=ScanResponse)
def analyze_url(
    payload: ScanRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Analyzes a submitted URL using the ML prediction pipeline,
    stores the result and returns the detection report.
    """
    url = payload.url.strip()

    try:
        prediction_result = predict_url(url)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="URL analysis failed. Please try again."
        ) from exc

    defanged = defang_url(url)
    client_ip = request.client.host if request.client else "unknown"

    new_scan = Scan(
        user_id=current_user.id if current_user else None,
        url=url,
        defanged_url=defanged,
        domain=prediction_result["domain"],
        classification=prediction_result["classification"],
        risk_score=prediction_result["risk_score"],
        confidence=prediction_result["confidence"],
        model_used=prediction_result["model_used"],
        features_snapshot=json.dumps(prediction_result["features"]),
        explanation=json.dumps(prediction_result["explanations"]),
        client_ip=client_ip,
        created_at=datetime.utcnow()
    )

    try:
        db.add(new_scan)
        db.commit()
        db.refresh(new_scan)
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to save scan result."
        ) from exc

    verdict, recommendation = build_security_verdict(
        prediction_result["classification"]
    )

    return {
        "id": new_scan.id,
        "url": url,
        "defanged_url": defanged,
        "domain": prediction_result["domain"],
        "classification": prediction_result["classification"],
        "risk_score": prediction_result["risk_score"],
        "confidence": prediction_result["confidence"],
        "model_used": prediction_result["model_used"],
        "created_at": new_scan.created_at,
        "features": prediction_result["features"],
        "explanations": prediction_result["explanations"],
        "security_verdict": prediction_result.get("security_verdict", verdict),
        "recommendation": prediction_result.get("recommendation", recommendation)
    }


@router.get("/history", response_model=ScanHistoryResponse)
def get_scan_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(15, ge=1, le=100),
    classification: Optional[str] = Query(
        None,
        description="Filter: safe, suspicious, phishing"
    ),
    search: Optional[str] = Query(None, description="Search domain or URL"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Returns paginated and searchable scan history."""

    query = db.query(Scan)

    if current_user and current_user.role != "admin":
        query = query.filter(Scan.user_id == current_user.id)

    if classification and classification.lower() != "all":
        allowed = {"safe", "suspicious", "phishing"}
        classification = classification.lower()

        if classification not in allowed:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid classification filter."
            )

        query = query.filter(Scan.classification == classification)

    if search and search.strip():
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            (Scan.url.ilike(search_filter))
            | (Scan.domain.ilike(search_filter))
            | (Scan.defanged_url.ilike(search_filter))
        )

    total = query.count()

    items = (
        query.order_by(desc(Scan.created_at))
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size
    }


@router.get("/stats/summary", response_model=UserScanStats)
def get_user_scan_stats(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Returns scan statistics for the dashboard."""

    query = db.query(Scan)

    if current_user and current_user.role != "admin":
        query = query.filter(Scan.user_id == current_user.id)

    total_scans = query.count()

    safe_scans = query.filter(
        Scan.classification == "safe"
    ).count()

    suspicious_scans = query.filter(
        Scan.classification == "suspicious"
    ).count()

    phishing_scans = query.filter(
        Scan.classification == "phishing"
    ).count()

    avg_score_result = query.with_entities(
        func.avg(Scan.risk_score)
    ).scalar()

    avg_score = (
        round(float(avg_score_result), 1)
        if avg_score_result is not None
        else 0.0
    )

    threat_ratio = round(
        ((phishing_scans + suspicious_scans) / max(1, total_scans)) * 100,
        1
    )

    now = datetime.utcnow()
    daily_activity = []

    for i in range(6, -1, -1):
        day_date = (now - timedelta(days=i)).date()

        day_scans = query.filter(
            func.date(Scan.created_at) == day_date
        ).count()

        threats_in_day = query.filter(
            func.date(Scan.created_at) == day_date,
            Scan.classification.in_(["phishing", "suspicious"])
        ).count()

        daily_activity.append({
            "date": day_date.strftime("%b %d"),
            "total_scans": day_scans,
            "threats_detected": threats_in_day
        })

    threat_distribution = [
        {"name": "Safe URLs", "value": safe_scans, "color": "#27D17F"},
        {"name": "Suspicious", "value": suspicious_scans, "color": "#F59E0B"},
        {"name": "Phishing", "value": phishing_scans, "color": "#EF4444"}
    ]

    # Real indicator counts are not currently stored separately.
    # Do not fabricate indicator statistics from classification totals.
    top_threat_indicators = []

    return {
        "total_scans": total_scans,
        "safe_scans": safe_scans,
        "suspicious_scans": suspicious_scans,
        "phishing_scans": phishing_scans,
        "avg_risk_score": avg_score,
        "threat_ratio_percent": threat_ratio,
        "daily_activity": daily_activity,
        "threat_distribution": threat_distribution,
        "top_threat_indicators": top_threat_indicators
    }


@router.get("/{scan_id}", response_model=ScanResponse)
def get_scan_detail(
    scan_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Retrieves a historical scan and its explanation."""

    scan_record = db.query(Scan).filter(
        Scan.id == scan_id
    ).first()

    if not scan_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan record not found."
        )

    if (
        current_user
        and current_user.role != "admin"
        and scan_record.user_id != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized access to this scan record."
        )

    try:
        features = (
            json.loads(scan_record.features_snapshot)
            if scan_record.features_snapshot else {}
        )

        explanations = (
            json.loads(scan_record.explanation)
            if scan_record.explanation else []
        )
    except (json.JSONDecodeError, TypeError):
        features = {}
        explanations = []

    verdict, recommendation = build_security_verdict(
        scan_record.classification
    )

    return {
        "id": scan_record.id,
        "url": scan_record.url,
        "defanged_url": scan_record.defanged_url,
        "domain": scan_record.domain or "",
        "classification": scan_record.classification,
        "risk_score": scan_record.risk_score,
        "confidence": scan_record.confidence,
        "model_used": scan_record.model_used,
        "created_at": scan_record.created_at,
        "features": features,
        "explanations": explanations,
        "security_verdict": verdict,
        "recommendation": recommendation
    }


@router.delete("/{scan_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_scan(
    scan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Deletes a scan owned by the current user or an administrator."""

    scan_record = db.query(Scan).filter(
        Scan.id == scan_id
    ).first()

    if not scan_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan record not found."
        )

    if (
        current_user.role != "admin"
        and scan_record.user_id != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized deletion request."
        )

    db.delete(scan_record)
    db.commit()

    return None
