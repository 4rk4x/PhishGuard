"""
Standalone ML Training & Model Validation Script
Can be run via: python run_trainer.py
"""

import sys
import os

# Ensure backend root is in PYTHONPATH
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.ml.model_trainer import train_and_evaluate_models
from app.config import settings

def main():
    print("==========================================================")
    print(" PhishGuard Academic ML Training & Evaluation Pipeline")
    print("==========================================================")
    print("Loading benchmark dataset from Tranco & PhishTank provenance...")
    
    report = train_and_evaluate_models(settings.MODEL_DIR)
    
    rf = report["models"]["random_forest"]["metrics"]
    lr = report["models"]["logistic_regression"]["metrics"]
    
    print("\n--- Model Evaluation Summary (Holdout Test Split 20%) ---")
    print(f"Random Forest (Ensemble):")
    print(f"  Accuracy:  {rf['accuracy']*100:.2f}%")
    print(f"  Precision: {rf['precision']*100:.2f}%")
    print(f"  Recall:    {rf['recall']*100:.2f}%")
    print(f"  F1-Score:  {rf['f1_score']*100:.2f}%")
    print(f"  ROC-AUC:   {rf['roc_auc']:.4f}")
    print(f"  Confusion Matrix: {rf['confusion_matrix']}")
    
    print(f"\nLogistic Regression (Linear Baseline):")
    print(f"  Accuracy:  {lr['accuracy']*100:.2f}%")
    print(f"  Precision: {lr['precision']*100:.2f}%")
    print(f"  Recall:    {lr['recall']*100:.2f}%")
    print(f"  F1-Score:  {lr['f1_score']*100:.2f}%")
    print(f"  ROC-AUC:   {lr['roc_auc']:.4f}")
    print(f"  Confusion Matrix: {lr['confusion_matrix']}")
    
    print("\n--- Top 5 Feature Importance Rankings (MDI Gini) ---")
    for feat in report["feature_importances"][:5]:
        print(f"  - {feat['feature']:<25}: {feat['percentage']}%")
        
    print("\nModel artifacts saved successfully in app/ml/model_storage/")
    print("==========================================================")

if __name__ == "__main__":
    main()

