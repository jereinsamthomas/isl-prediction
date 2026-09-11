"""
backend/routes/models.py
========================
Machine Learning Model Comparison & Metrics API Endpoints:
- GET /api/models/comparison
- GET /api/models/feature-importance
- POST /api/models/train
"""

import os
import json
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/models", tags=["ML Models"])
MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
META_PATH = os.path.join(MODELS_DIR, "metadata.json")

@router.get("/comparison")
def get_model_comparison():
    if not os.path.exists(META_PATH):
        raise HTTPException(status_code=404, detail="Model metadata not found. Train models first.")
    with open(META_PATH, "r", encoding="utf-8") as f:
        meta = json.load(f)
    return {
        "random_split": meta.get("random_split", {}),
        "temporal_split": meta.get("temporal_split", {}),
        "paper_benchmarks": meta.get("paper_benchmarks", {}),
        "best_model": meta.get("best_model", {}),
        "target_classes": meta.get("target_classes", [])
    }

@router.get("/feature-importance")
def get_feature_importance():
    if not os.path.exists(META_PATH):
        raise HTTPException(status_code=404, detail="Model metadata not found.")
    with open(META_PATH, "r", encoding="utf-8") as f:
        meta = json.load(f)
    return {
        "features": meta.get("feature_importance_rf", [])
    }

@router.post("/train")
def retrain_models():
    try:
        import sys
        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        if root_dir not in sys.path:
            sys.path.insert(0, root_dir)
        from importlib import import_module
        train_mod = import_module("04_train_models")
        results = train_mod.train_and_evaluate_all()
        return {
            "status": "success",
            "message": "Models retrained successfully",
            "best_model": results.get("best_model")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retraining failed: {str(e)}")
