import os
import json
from fastapi import APIRouter, HTTPException
from app.config import settings
from app.schemas.scan import ModelMetricsResponse
from app.ml.model_trainer import train_and_evaluate_models

router = APIRouter(prefix="/api/ml", tags=["Machine Learning Metrics & Provenance"])

@router.get("/metrics", response_model=ModelMetricsResponse)
def get_ml_metrics():
    """
    Returns actual empirical evaluation metrics, comparative analysis between
    Random Forest and Logistic Regression, confusion matrices, and dataset provenance.
    Never fabricated: derived from the actual benchmark evaluation.
    """
    metrics_path = os.path.join(settings.MODEL_DIR, "metrics.json")
    if not os.path.exists(metrics_path):
        train_and_evaluate_models(settings.MODEL_DIR)

    try:
        with open(metrics_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read metrics file: {str(e)}")

    rf = data["models"]["random_forest"]
    lr = data["models"]["logistic_regression"]
    rf_m = rf["metrics"]
    lr_m = lr["metrics"]
    dataset = data["dataset"]

    return {
        "model_name": rf["name"],
        "algorithm": "Random Forest Ensemble (100 Estimators)",
        "accuracy": rf_m["accuracy"],
        "precision": rf_m["precision"],
        "recall": rf_m["recall"],
        "f1_score": rf_m["f1_score"],
        "roc_auc": rf_m["roc_auc"],
        "confusion_matrix": rf_m["confusion_matrix"],
        "dataset_name": dataset["name"],
        "dataset_license": dataset["license"],
        "dataset_citation": dataset["citation"],
        "total_samples": dataset["total_samples"],
        "training_samples": dataset["train_samples"],
        "testing_samples": dataset["test_samples"],
        "feature_importances": data["feature_importances"],
        "comparison": {
            "random_forest": {
                "name": rf["name"],
                "accuracy": rf_m["accuracy"],
                "precision": rf_m["precision"],
                "recall": rf_m["recall"],
                "f1_score": rf_m["f1_score"],
                "roc_auc": rf_m["roc_auc"],
                "confusion_matrix": rf_m["confusion_matrix"]
            },
            "logistic_regression": {
                "name": lr["name"],
                "accuracy": lr_m["accuracy"],
                "precision": lr_m["precision"],
                "recall": lr_m["recall"],
                "f1_score": lr_m["f1_score"],
                "roc_auc": lr_m["roc_auc"],
                "confusion_matrix": lr_m["confusion_matrix"]
            }
        }
    }

