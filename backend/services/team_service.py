"""
backend/services/team_service.py
================================
Calculates team-specific analytics, records, home vs away differential,
recent form streaks, and multi-attribute performance radar data.
"""

import pandas as pd
import numpy as np
from .data_loader import data_loader

def get_teams_overview():
    df = data_loader.matches_df
    teams = data_loader.get_all_teams()
    summaries = []

    for team in teams:
        home_m = df[df["Home_Team"] == team]
        away_m = df[df["Away_Team"] == team]
        total_matches = len(home_m) + len(away_m)

        if total_matches == 0:
            continue

        h_wins = (home_m["Match_Result"] == "Home_Win").sum()
        h_draws = (home_m["Match_Result"] == "Draw").sum()
        h_losses = (home_m["Match_Result"] == "Away_Win").sum()

        a_wins = (away_m["Match_Result"] == "Away_Win").sum()
        a_draws = (away_m["Match_Result"] == "Draw").sum()
        a_losses = (away_m["Match_Result"] == "Home_Win").sum()

        wins = h_wins + a_wins
        draws = h_draws + a_draws
        losses = h_losses + a_losses

        gf = home_m["Home_Goals"].sum() + away_m["Away_Goals"].sum()
        ga = home_m["Away_Goals"].sum() + away_m["Home_Goals"].sum()
        gd = gf - ga

        # Clean sheets
        cs_h = (home_m["Away_Goals"] == 0).sum()
        cs_a = (away_m["Home_Goals"] == 0).sum()
        clean_sheets = cs_h + cs_a

        # Recent form streak (last 5 matches)
        all_team_matches = df[(df["Home_Team"] == team) | (df["Away_Team"] == team)].sort_values("Match_Date")
        last5 = all_team_matches.tail(5)
        streak = []
        for _, m in last5.iterrows():
            if m["Home_Team"] == team:
                res = "W" if m["Match_Result"] == "Home_Win" else ("D" if m["Match_Result"] == "Draw" else "L")
            else:
                res = "W" if m["Match_Result"] == "Away_Win" else ("D" if m["Match_Result"] == "Draw" else "L")
            streak.append(res)

        win_pct = round(wins / total_matches * 100, 1)
        h_win_pct = round(h_wins / len(home_m) * 100, 1) if len(home_m) > 0 else 0.0
        a_win_pct = round(a_wins / len(away_m) * 100, 1) if len(away_m) > 0 else 0.0

        summaries.append({
            "team": team,
            "matches": total_matches,
            "wins": int(wins),
            "draws": int(draws),
            "losses": int(losses),
            "win_rate": win_pct,
            "home_win_rate": h_win_pct,
            "away_win_rate": a_win_pct,
            "home_away_diff": round(h_win_pct - a_win_pct, 1),
            "goals_scored": int(gf),
            "goals_conceded": int(ga),
            "goal_diff": int(gd),
            "clean_sheets": int(clean_sheets),
            "clean_sheet_pct": round(clean_sheets / total_matches * 100, 1),
            "form_streak": streak,
            "points": int(wins * 3 + draws)
        })

    # Sort by points descending
    summaries.sort(key=lambda x: x["points"], reverse=True)
    return summaries

def get_team_detail(team_name):
    df = data_loader.matches_df
    home_m = df[df["Home_Team"] == team_name]
    away_m = df[df["Away_Team"] == team_name]

    if len(home_m) + len(away_m) == 0:
        return None

    # Overall stats
    overview = [t for t in get_teams_overview() if t["team"] == team_name]
    base = overview[0] if overview else {}

    # Tactical formations used
    all_formations = pd.concat([home_m["Home_Formation"], away_m["Away_Formation"]]).value_counts().to_dict()

    # Average metrics
    avg_possession = round((home_m["Home_Possession_Pct"].sum() + away_m["Away_Possession_Pct"].sum()) / (len(home_m) + len(away_m)), 1)
    avg_shots_target = round((home_m["Home_Shots_On_Target"].sum() + away_m["Away_Shots_On_Target"].sum()) / (len(home_m) + len(away_m)), 1)
    avg_corners = round((home_m["Home_Corners"].sum() + away_m["Away_Corners"].sum()) / (len(home_m) + len(away_m)), 1)
    avg_yellow_cards = round((home_m["Home_Yellow_Cards"].sum() + away_m["Away_Yellow_Cards"].sum()) / (len(home_m) + len(away_m)), 1)
    avg_red_cards = round((home_m["Home_Red_Cards"].sum() + away_m["Away_Red_Cards"].sum()) / (len(home_m) + len(away_m)), 2)

    # Radar metrics (normalized 0-100 scale for sports visualization)
    radar_data = [
        {"metric": "Attack (Goals/Game)", "value": min(round((base.get("goals_scored", 0) / max(base.get("matches", 1), 1)) * 40, 1), 100)},
        {"metric": "Possession Control", "value": round(avg_possession, 1)},
        {"metric": "Defensive Solidity", "value": max(round(100 - (base.get("goals_conceded", 0) / max(base.get("matches", 1), 1)) * 40, 1), 10)},
        {"metric": "Home Dominance", "value": base.get("home_win_rate", 50)},
        {"metric": "Shot Accuracy", "value": min(round(avg_shots_target * 16, 1), 100)},
        {"metric": "Discipline Index", "value": max(round(100 - avg_yellow_cards * 20 - avg_red_cards * 50, 1), 10)}
    ]

    # Recent 10 matches list
    team_matches = df[(df["Home_Team"] == team_name) | (df["Away_Team"] == team_name)].sort_values("Match_Date", ascending=False).head(10)
    match_list = []
    for _, m in team_matches.iterrows():
        is_home = m["Home_Team"] == team_name
        opp = m["Away_Team"] if is_home else m["Home_Team"]
        res = m["Match_Result"]
        if is_home:
            outcome = "Win" if res == "Home_Win" else ("Draw" if res == "Draw" else "Loss")
        else:
            outcome = "Win" if res == "Away_Win" else ("Draw" if res == "Draw" else "Loss")

        match_list.append({
            "match_id": m["Match_ID"],
            "date": str(m["Match_Date"])[:10],
            "season": m["Season"],
            "is_home": is_home,
            "opponent": opp,
            "score": f"{m['Home_Goals']} - {m['Away_Goals']}",
            "outcome": outcome,
            "venue": m["Venue_City"]
        })

    return {
        "overview": base,
        "tactical_formations": all_formations,
        "averages": {
            "possession_pct": avg_possession,
            "shots_on_target": avg_shots_target,
            "corners": avg_corners,
            "yellow_cards": avg_yellow_cards,
            "red_cards": avg_red_cards
        },
        "radar_profile": radar_data,
        "recent_matches": match_list
    }
