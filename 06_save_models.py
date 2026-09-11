"""
06_save_models.py
=================
Verifies and packages all trained model binaries, scalers, encoders,
and evaluation metadata in backend/models for production deployment.
"""

import os
import joblib
import json

MODELS_DIR = os.path.join("backend", "models")

def verify_and_save():
    print("=" * 65)
    print("ISL FOOTBALL INTELLIGENCE - MODEL PACKAGING & SERIALIZATION CHECK")
    print("=" * 65)

    expected_files = [
        "logistic_regression.pkl",
        "random_forest.pkl",
        "decision_tree.pkl",
        "k_nearest_neighbors.pkl",
        "gradient_boosting.pkl",
        "xgboost.pkl",
        "scaler.pkl",
        "encoders.pkl",
        "metadata.json"
    ]

    missing = [f for f in expected_files if not os.path.exists(os.path.join(MODELS_DIR, f))]
    if missing:
        print(f"Missing files detected: {missing}. Triggering 04_train_models.py...")
        from importlib import import_module
        train_mod = import_module("04_train_models")
        train_mod.train_and_evaluate_all()

    print("\nVerified Production Model Artifacts:")
    for f in expected_files:
        fpath = os.path.join(MODELS_DIR, f)
        size_kb = os.path.getsize(fpath) / 1024
        print(f"  [OK] {f:<26} ({size_kb:>8.2f} KB)")

    # Test-load models to ensure no corruption
    print("\nTesting Deserialization Integrity...")
    for model_name in ["random_forest", "logistic_regression", "xgboost"]:
        fpath = os.path.join(MODELS_DIR, f"{model_name}.pkl")
        m = joblib.load(fpath)
        print(f"  Successfully loaded {model_name} (Type: {type(m).__name__})")

    print("\n" + "=" * 65)
    print("SUCCESS: 06_save_models completed. All models verified.")
    print("=" * 65)

if __name__ == "__main__":
    verify_and_save()
