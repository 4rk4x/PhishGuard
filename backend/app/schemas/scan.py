
from datetime import datetime
from typing import List, Dict, Any, Optional

from pydantic import BaseModel, Field, field_validator


class ScanRequest(BaseModel):
    url: str = Field(
        ...,
        min_length=3,
        max_length=2048,
        description="URL to analyze"
    )

    @field_validator("url")
    @classmethod
    def validate_url_syntax(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("URL cannot be empty")

        if any(character.isspace() for character in value):
            raise ValueError("URL cannot contain whitespace characters")

        return value


class FeatureExplanationItem(BaseModel):
    feature_key: str
    feature_name: str
    value: Any
    baseline_threshold: str
    status: str
    impact_level: str
    score_contribution: float
    explanation: str


class ScanResponse(BaseModel):
    id: Optional[int] = None
    url: str
    defanged_url: str
    domain: str
    classification: str
    risk_score: float = Field(..., ge=0, le=100)
    confidence: float = Field(..., ge=0, le=100)
    model_used: str
    created_at: datetime
    features: Dict[str, Any]
    explanations: List[FeatureExplanationItem]
    security_verdict: str
    recommendation: str


class ScanHistoryItem(BaseModel):
    id: int
    url: str
    defanged_url: str
    domain: Optional[str] = None
    classification: str
    risk_score: float
    confidence: float
    model_used: str
    created_at: datetime

    class Config:
        from_attributes = True


class ScanHistoryResponse(BaseModel):
    items: List[ScanHistoryItem]
    total: int
    page: int
    page_size: int


class UserScanStats(BaseModel):
    total_scans: int
    safe_scans: int
    suspicious_scans: int
    phishing_scans: int
    avg_risk_score: float
    threat_ratio_percent: float
    daily_activity: List[Dict[str, Any]]
    threat_distribution: List[Dict[str, Any]]
    top_threat_indicators: List[Dict[str, Any]]


class AdminOverviewStats(BaseModel):
    total_users: int
    total_scans: int
    threat_detection_rate: float
    safe_count: int
    suspicious_count: int
    phishing_count: int
    active_model: str
    model_accuracy: float
    recent_system_activity: List[Dict[str, Any]]


class ModelMetricsResponse(BaseModel):
    model_name: str
    algorithm: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
    confusion_matrix: List[List[int]]
    dataset_name: str
    dataset_license: str
    dataset_citation: str
    total_samples: int
    training_samples: int
    testing_samples: int
    feature_importances: List[Dict[str, Any]]
    comparison: Dict[str, Any]
