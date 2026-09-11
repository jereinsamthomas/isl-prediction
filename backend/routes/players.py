"""
backend/routes/players.py
=========================
Player Analytics API Endpoints:
- GET /api/players/coverage
- GET /api/players/indian-vs-foreign
- GET /api/players/key-player-impact
"""

from fastapi import APIRouter
from backend.services.player_service import (
    get_data_coverage,
    get_indian_vs_foreign_analytics,
    get_key_player_absence_impact
)

router = APIRouter(prefix="/players", tags=["Players"])

@router.get("/coverage")
def player_data_coverage():
    return get_data_coverage()

@router.get("/indian-vs-foreign")
def indian_vs_foreign():
    return get_indian_vs_foreign_analytics()

@router.get("/key-player-impact")
def key_player_impact():
    return get_key_player_absence_impact()
