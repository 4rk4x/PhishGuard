
"""
Model Trainer & Evaluation Pipeline

Trains and compares Logistic Regression and Random Forest.

Uses StratifiedGroupKFold to keep related synthetic URL
examples together during train/test evaluation.

Evaluates:
Accuracy, Precision, Recall, F1-Score, ROC-AUC,
and Confusion Matrix.

Important:
Metrics represent performance on a synthetic group-held-out
benchmark. They do not establish real-world detection accuracy.
"""

import os
import json
import joblib
import numpy as np

from datetime import datetime, timezone

from sklearn.model_selection import StratifiedGroupKFold
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix
)

from app.ml.feature_extractor import (
    FEATURE_ORDER,
    extract_features_from_url,
    vectorize_features
)

from app.ml.dataset_builder import (
    build_dataset_dataframe,
    DATASET_PROVENANCE
)


RANDOM_STATE = 42
TEST_SIZE = 0.20
NUMBER_OF_SPLITS = 5


def create_group_split(X, y, groups):
    """
    Create a stratified group train/test split.

    Each group is assigned entirely to either training
    or testing. The selected fold aims for a test size
    close to 20% and class proportions close to the
    complete dataset.
    """

    unique_groups = np.unique(groups)

    if len(unique_groups) < NUMBER_OF_SPLITS:
        raise ValueError(
            f"Only {len(unique_groups)} groups are available. "
            f"At least {NUMBER_OF_SPLITS} are required."
        )

    for class_label in np.unique(y):
        class_groups = np.unique(groups[y == class_label])

        if len(class_groups) < NUMBER_OF_SPLITS:
            raise ValueError(
                f"Class {class_label} has only "
                f"{len(class_groups)} groups. "
                f"At least {NUMBER_OF_SPLITS} are required "
                "for stratified group splitting."
            )

    splitter = StratifiedGroupKFold(
        n_splits=NUMBER_OF_SPLITS,
        shuffle=True,
        random_state=RANDOM_STATE
    )

    overall_phishing_ratio = float(np.mean(y))

    best_split = None
    best_score = float("inf")

    for train_indices, test_indices in splitter.split(
        X,
        y,
        groups
    ):
        y_train = y[train_indices]
        y_test = y[test_indices]

        if len(np.unique(y_train)) < 2:
            continue

        if len(np.unique(y_test)) < 2:
            continue

        test_ratio = len(test_indices) / len(y)

        test_phishing_ratio = float(np.mean(y_test))
        train_phishing_ratio = float(np.mean(y_train))

        score = (
            abs(test_ratio - TEST_SIZE)
            + abs(test_phishing_ratio - overall_phishing_ratio)
            + abs(train_phishing_ratio - overall_phishing_ratio)
        )

        if score < best_score:
            best_score = score
            best_split = (train_indices, test_indices)

    if best_split is None:
        raise ValueError(
            "Could not create a valid stratified group split. "
            "Inspect the dataset group distribution."
        )

    return best_split


def calculate_metrics(y_true, predictions, probabilities):
    """Calculate classification metrics with phishing as class 1."""

    return {
        "accuracy": round(
            float(accuracy_score(y_true, predictions)),
            4
        ),
        "precision": round(
            float(
                precision_score(
                    y_true,
                    predictions,
                    pos_label=1,
                    zero_division=0
                )
            ),
            4
        ),
        "recall": round(
            float(
                recall_score(
                    y_true,
                    predictions,
                    pos_label=1,
                    zero_division=0
                )
            ),
            4
        ),
        "f1_score": round(
            float(
                f1_score(
                    y_true,
                    predictions,
                    pos_label=1,
                    zero_division=0
                )
            ),
            4
        ),
        "roc_auc": round(
            float(roc_auc_score(y_true, probabilities)),
            4
        ),
        "confusion_matrix": confusion_matrix(
            y_true,
            predictions,
            labels=[0, 1]
        ).tolist()
    }


def train_and_evaluate_models(model_dir: str = None) -> dict:
    """
    Execute the complete ML training and evaluation pipeline.
    """

    if model_dir is None:
        model_dir = os.path.join(
            os.path.dirname(__file__),
            "model_storage"
        )

    os.makedirs(model_dir, exist_ok=True)

    # --------------------------------------------------
    # 1. Build dataset
    # --------------------------------------------------

    df = build_dataset_dataframe()

    required_columns = {"url", "label", "group_id"}
    missing_columns = required_columns.difference(df.columns)

    if missing_columns:
        raise ValueError(
            f"Dataset is missing required columns: {missing_columns}"
        )

    if df.empty:
        raise ValueError("The generated dataset is empty.")

    if df["url"].isna().any():
        raise ValueError("Dataset contains missing URLs.")

    if df["group_id"].isna().any():
        raise ValueError("Dataset contains missing group IDs.")

    if (df["group_id"].astype(str).str.strip() == "").any():
        raise ValueError("Dataset contains empty group IDs.")

    urls = df["url"].tolist()
    y = df["label"].to_numpy(dtype=int)
    groups = df["group_id"].astype(str).to_numpy()

    if set(np.unique(y)) != {0, 1}:
        raise ValueError(
            "Dataset must contain both classes: 0 (benign) "
            "and 1 (phishing)."
        )

    # --------------------------------------------------
    # 2. Extract URL features
    # --------------------------------------------------

    feature_matrix = []

    for url in urls:
        feature_dict = extract_features_from_url(url)
        feature_vector = vectorize_features(feature_dict)
        feature_matrix.append(feature_vector)

    X = np.asarray(feature_matrix, dtype=float)

    if X.ndim != 2:
        raise ValueError(
            "Feature extraction did not produce a 2D matrix."
        )

    if X.shape[1] != len(FEATURE_ORDER):
        raise ValueError(
            f"Feature count mismatch: expected {len(FEATURE_ORDER)}, "
            f"received {X.shape[1]}."
        )

    if not np.isfinite(X).all():
        raise ValueError(
            "Feature matrix contains NaN or infinite values."
        )

    # --------------------------------------------------
    # 3. Stratified group train/test split
    # --------------------------------------------------

    train_indices, test_indices = create_group_split(
        X,
        y,
        groups
    )

    X_train = X[train_indices]
    X_test = X[test_indices]

    y_train = y[train_indices]
    y_test = y[test_indices]

    train_groups = set(groups[train_indices])
    test_groups = set(groups[test_indices])

    overlapping_groups = train_groups.intersection(test_groups)

    if overlapping_groups:
        raise RuntimeError(
            "Group leakage detected: training and testing "
            "contain overlapping groups."
        )

    # --------------------------------------------------
    # 4. StandardScaler for Logistic Regression
    # --------------------------------------------------

    scaler = StandardScaler()

    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # --------------------------------------------------
    # 5. Logistic Regression
    # --------------------------------------------------

    lr_model = LogisticRegression(
        max_iter=1000,
        C=1.0,
        random_state=RANDOM_STATE
    )

    lr_model.fit(X_train_scaled, y_train)

    lr_predictions = lr_model.predict(X_test_scaled)

    lr_positive_index = list(lr_model.classes_).index(1)

    lr_probabilities = lr_model.predict_proba(
        X_test_scaled
    )[:, lr_positive_index]

    lr_metrics = calculate_metrics(
        y_test,
        lr_predictions,
        lr_probabilities
    )

    # --------------------------------------------------
    # 6. Random Forest
    # --------------------------------------------------

    rf_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=14,
        min_samples_split=4,
        random_state=RANDOM_STATE,
        class_weight="balanced"
    )

    # Random Forest does not require feature scaling.
    rf_model.fit(X_train, y_train)

    rf_predictions = rf_model.predict(X_test)

    rf_positive_index = list(rf_model.classes_).index(1)

    rf_probabilities = rf_model.predict_proba(
        X_test
    )[:, rf_positive_index]

    rf_metrics = calculate_metrics(
        y_test,
        rf_predictions,
        rf_probabilities
    )

    # --------------------------------------------------
    # 7. Random Forest feature importance
    # --------------------------------------------------

    importances = rf_model.feature_importances_

    feature_rankings = []

    for index, feature_name in enumerate(FEATURE_ORDER):
        importance = float(importances[index])

        feature_rankings.append({
            "feature": feature_name,
            "importance": round(importance, 4),
            "percentage": round(importance * 100, 2)
        })

    feature_rankings.sort(
        key=lambda item: item["importance"],
        reverse=True
    )

    # --------------------------------------------------
    # 8. Evaluation report
    # --------------------------------------------------

    evaluation_report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),

        "evaluation_scope": (
            "Synthetic group-held-out benchmark. "
            "Not independent real-world validation."
        ),

        "split_strategy": {
            "method": "StratifiedGroupKFold",
            "number_of_candidate_folds": NUMBER_OF_SPLITS,
            "target_test_ratio": TEST_SIZE,
            "actual_test_ratio": round(
                len(test_indices) / len(y),
                4
            ),
            "random_state": RANDOM_STATE,
            "group_column": "group_id",
            "train_test_group_overlap": len(overlapping_groups)
        },

        "dataset": {
            "name": DATASET_PROVENANCE["dataset_name"],
            "license": DATASET_PROVENANCE["license"],
            "citation": DATASET_PROVENANCE["citation"],

            "total_samples": int(len(df)),
            "train_samples": int(len(train_indices)),
            "test_samples": int(len(test_indices)),

            "total_groups": int(len(set(groups))),
            "train_groups": int(len(train_groups)),
            "test_groups": int(len(test_groups)),

            "benign_count": int(np.sum(y == 0)),
            "phishing_count": int(np.sum(y == 1)),

            "train_benign_count": int(np.sum(y_train == 0)),
            "train_phishing_count": int(np.sum(y_train == 1)),

            "test_benign_count": int(np.sum(y_test == 0)),
            "test_phishing_count": int(np.sum(y_test == 1))
        },

        "selected_model": "Random Forest Classifier",

        "models": {
            "random_forest": {
                "name": "Random Forest Classifier",
                "hyperparameters": {
                    "n_estimators": 100,
                    "max_depth": 14,
                    "criterion": "gini",
                    "min_samples_split": 4,
                    "class_weight": "balanced",
                    "random_state": RANDOM_STATE
                },
                "metrics": rf_metrics
            },

            "logistic_regression": {
                "name": "Logistic Regression (L2 Regularized)",
                "hyperparameters": {
                    "max_iter": 1000,
                    "C": 1.0,
                    "penalty": "l2",
                    "random_state": RANDOM_STATE
                },
                "metrics": lr_metrics
            }
        },

        "feature_importances": feature_rankings
    }

    # --------------------------------------------------
    # 9. Save model artifacts
    # --------------------------------------------------

    joblib.dump(
        rf_model,
        os.path.join(model_dir, "model.joblib")
    )

    joblib.dump(
        lr_model,
        os.path.join(model_dir, "lr_model.joblib")
    )

    joblib.dump(
        scaler,
        os.path.join(model_dir, "scaler.joblib")
    )

    metrics_file = os.path.join(
        model_dir,
        "metrics.json"
    )

    with open(metrics_file, "w", encoding="utf-8") as file:
        json.dump(evaluation_report, file, indent=2)

    provenance = DATASET_PROVENANCE.copy()

    provenance["total_samples"] = int(len(df))
    provenance["benign_samples"] = int(np.sum(y == 0))
    provenance["phishing_samples"] = int(np.sum(y == 1))
    provenance["total_groups"] = int(len(set(groups)))

    provenance_file = os.path.join(
        model_dir,
        "dataset_provenance.json"
    )

    with open(provenance_file, "w", encoding="utf-8") as file:
        json.dump(provenance, file, indent=2)

    return evaluation_report


if __name__ == "__main__":
    report = train_and_evaluate_models()

    rf_accuracy = (
        report["models"]["random_forest"]["metrics"]["accuracy"] * 100
    )

    lr_accuracy = (
        report["models"]["logistic_regression"]["metrics"]["accuracy"] * 100
    )

    print("\nGroup-aware ML training completed successfully.")

    print(f"Total samples: {report['dataset']['total_samples']}")
    print(f"Training samples: {report['dataset']['train_samples']}")
    print(f"Testing samples: {report['dataset']['test_samples']}")

    print(f"Total groups: {report['dataset']['total_groups']}")
    print(f"Training groups: {report['dataset']['train_groups']}")
    print(f"Testing groups: {report['dataset']['test_groups']}")

    print(
        "Train/test group overlap: "
        f"{report['split_strategy']['train_test_group_overlap']}"
    )

    print(f"Random Forest Accuracy: {rf_accuracy:.2f}%")
    print(f"Logistic Regression Accuracy: {lr_accuracy:.2f}%")

    print(
        "\nEvaluation scope: synthetic group-held-out benchmark, "
        "not real-world validation."
    )
