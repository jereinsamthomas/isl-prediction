"""
backend/routes/prediction.py
============================
Prediction API Endpoints:
- POST /api/predict
- GET /api/predict/options
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from backend.services.prediction_service import prediction_service
from backend.services.data_loader import data_loader

router = APIRouter(prefix="/predict", tags=["Prediction"])

class PredictRequest(BaseModel):
    home_team: str
    away_team: str
    model: Optional[str] = "Random Forest"
    home_formation: Optional[str] = None
    away_formation: Optional[str] = None
    weather: Optional[str] = "Clear"
    pitch_condition: Optional[str] = "Good"
    match_condition: Optional[str] = "Night"
    key_player_missing_side: Optional[str] = "None"
    referee_strictness_index: Optional[float] = 0.50

@router.get("/options")
def get_prediction_options():
    return {
        "teams": data_loader.get_all_teams(),
        "formations": data_loader.formations,
        "weather_conditions": data_loader.weather_conditions,
        "pitch_conditions": data_loader.pitch_conditions,
        "match_conditions": ["Day", "Night"],
        "key_player_missing_options": ["None", "Home", "Away", "Both"],
        "available_models": [
            "Random Forest",
            "Logistic Regression",
            "K-Nearest Neighbors",
            "Decision Tree",
            "Gradient Boosting",
            "XGBoost"
        ]
    }

@router.post("")
def predict_match(req: PredictRequest):
    try:
        result = prediction_service.predict_match(req.dict())
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
