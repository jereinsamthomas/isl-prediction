"""
backend/routes/teams.py
=======================
Teams API Endpoints:
- GET /api/teams
- GET /api/teams/{team_name}
"""

from fastapi import APIRouter, HTTPException
from backend.services.team_service import get_teams_overview, get_team_detail

router = APIRouter(prefix="/teams", tags=["Teams"])

@router.get("")
def list_teams():
    return get_teams_overview()

@router.get("/{team_name}")
def team_details(team_name: str):
    detail = get_team_detail(team_name)
    if not detail:
        raise HTTPException(status_code=404, detail=f"Team '{team_name}' not found.")
    return detail
