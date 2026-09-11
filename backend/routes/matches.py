"""
backend/routes/matches.py
=========================
Matches and H2H API Endpoints:
- GET /api/matches
- GET /api/matches/h2h/{team1}/{team2}
"""

from fastapi import APIRouter, Query
from backend.services.data_loader import data_loader

router = APIRouter(prefix="/matches", tags=["Matches"])

@router.get("")
def list_matches(
    season: str = Query(None, description="Filter by season"),
    team: str = Query(None, description="Filter by team"),
    result: str = Query(None, description="Filter by result"),
    limit: int = Query(50, ge=1, le=1100),
    offset: int = Query(0, ge=0)
):
    return data_loader.get_all_matches(season=season, team=team, result=result, limit=limit, offset=offset)

@router.get("/h2h/{team1}/{team2}")
def head_to_head(team1: str, team2: str):
    return data_loader.get_h2h(team1, team2)
