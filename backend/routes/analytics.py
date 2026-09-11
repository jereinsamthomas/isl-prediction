"""
backend/routes/analytics.py
===========================
League Analytics API Endpoints:
- GET /api/analytics/overview
- GET /api/analytics/tactics
- GET /api/analytics/weather-pitch
- GET /api/analytics/referees
- GET /api/analytics/set-pieces
"""

from fastapi import APIRouter
from backend.services.analytics import (
    get_overview_kpis,
    get_tactical_analytics,
    get_weather_pitch_analytics,
    get_referee_analytics,
    get_set_piece_analytics
)

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview")
def overview():
    return get_overview_kpis()

@router.get("/tactics")
def tactics():
    return get_tactical_analytics()

@router.get("/weather-pitch")
def weather_pitch():
    return get_weather_pitch_analytics()

@router.get("/referees")
def referees():
    return get_referee_analytics()

@router.get("/set-pieces")
def set_pieces():
    return get_set_piece_analytics()
