"""
backend/services/analytics.py
=============================
Provides league-wide analytics:
- KPI Overview
- Goals per season
- Outcome distribution
- Tactical formation performance
- Weather & Pitch influence
- Referee strictness analysis
- Set-piece effectiveness
"""

import pandas as pd
import numpy as np
from .data_loader import data_loader

def get_overview_kpis():
    df = data_loader.matches_df
    total_matches = len(df)
    total_goals = int(df["Home_Goals"].sum() + df["Away_Goals"].sum())
    avg_goals = round(total_goals / total_matches, 2)

    home_wins = int((df["Match_Result"] == "Home_Win").sum())
    draws = int((df["Match_Result"] == "Draw").sum())
    away_wins = int((df["Match_Result"] == "Away_Win").sum())

    home_win_pct = round(home_wins / total_matches * 100, 1)
    draw_pct = round(draws / total_matches * 100, 1)
    away_win_pct = round(away_wins / total_matches * 100, 1)
    home_advantage_diff = round(home_win_pct - away_win_pct, 1)

    # Result distribution
    result_dist = [
        {"name": "Home Win", "value": home_wins, "percentage": home_win_pct, "color": "#10b981"},
        {"name": "Draw", "value": draws, "percentage": draw_pct, "color": "#f59e0b"},
        {"name": "Away Win", "value": away_wins, "percentage": away_win_pct, "color": "#06b6d4"}
    ]

    # Goals per season
    seasons_data = []
    for s, grp in df.groupby("Season"):
        sg = int(grp["Home_Goals"].sum() + grp["Away_Goals"].sum())
        sm = len(grp)
        seasons_data.append({
            "season": s,
            "matches": sm,
            "total_goals": sg,
            "avg_goals": round(sg / sm, 2),
            "home_wins": int((grp["Match_Result"] == "Home_Win").sum()),
            "away_wins": int((grp["Match_Result"] == "Away_Win").sum()),
            "draws": int((grp["Match_Result"] == "Draw").sum())
        })
    seasons_data.sort(key=lambda x: x["season"])

    return {
        "total_matches": total_matches,
        "total_teams": len(data_loader.get_all_teams()),
        "total_seasons": len(data_loader.get_seasons()),
        "total_goals": total_goals,
        "avg_goals_per_match": avg_goals,
        "home_win_pct": home_win_pct,
        "draw_pct": draw_pct,
        "away_win_pct": away_win_pct,
        "home_advantage_differential": home_advantage_diff,
        "result_distribution": result_dist,
        "seasons_trend": seasons_data
    }

def get_tactical_analytics():
    df = data_loader.matches_df
    # Combine Home and Away formations to measure overall formation performance
    records = []
    
    for f in data_loader.formations:
        home_f = df[df["Home_Formation"] == f]
        away_f = df[df["Away_Formation"] == f]
        
        matches_used = len(home_f) + len(away_f)
        if matches_used == 0:
            continue
            
        wins = int((home_f["Match_Result"] == "Home_Win").sum() + (away_f["Match_Result"] == "Away_Win").sum())
        draws = int((home_f["Match_Result"] == "Draw").sum() + (away_f["Match_Result"] == "Draw").sum())
        losses = int((home_f["Match_Result"] == "Away_Win").sum() + (away_f["Match_Result"] == "Home_Win").sum())
        
        gf = int(home_f["Home_Goals"].sum() + away_f["Away_Goals"].sum())
        ga = int(home_f["Away_Goals"].sum() + away_f["Home_Goals"].sum())
        
        records.append({
            "formation": f,
            "matches_used": matches_used,
            "wins": wins,
            "draws": draws,
            "losses": losses,
            "win_rate": round(wins / matches_used * 100, 1),
            "draw_rate": round(draws / matches_used * 100, 1),
            "loss_rate": round(losses / matches_used * 100, 1),
            "goals_scored": gf,
            "goals_conceded": ga,
            "avg_goals_scored": round(gf / matches_used, 2),
            "avg_goals_conceded": round(ga / matches_used, 2)
        })

    records.sort(key=lambda x: x["win_rate"], reverse=True)
    return records

def get_weather_pitch_analytics():
    df = data_loader.matches_df

    # Weather
    weather_stats = []
    for w in data_loader.weather_conditions:
        grp = df[df["Weather_Condition"] == w]
        cnt = len(grp)
        if cnt == 0:
            continue
        hw = (grp["Match_Result"] == "Home_Win").sum()
        dr = (grp["Match_Result"] == "Draw").sum()
        aw = (grp["Match_Result"] == "Away_Win").sum()
        tg = grp["Home_Goals"].sum() + grp["Away_Goals"].sum()
        weather_stats.append({
            "weather": w,
            "matches": cnt,
            "home_win_pct": round(hw / cnt * 100, 1),
            "draw_pct": round(dr / cnt * 100, 1),
            "away_win_pct": round(aw / cnt * 100, 1),
            "avg_goals": round(tg / cnt, 2)
        })

    # Pitch
    pitch_stats = []
    for p in data_loader.pitch_conditions:
        grp = df[df["Pitch_Condition"] == p]
        cnt = len(grp)
        if cnt == 0:
            continue
        hw = (grp["Match_Result"] == "Home_Win").sum()
        dr = (grp["Match_Result"] == "Draw").sum()
        aw = (grp["Match_Result"] == "Away_Win").sum()
        tg = grp["Home_Goals"].sum() + grp["Away_Goals"].sum()
        pitch_stats.append({
            "pitch_condition": p,
            "matches": cnt,
            "home_win_pct": round(hw / cnt * 100, 1),
            "draw_pct": round(dr / cnt * 100, 1),
            "away_win_pct": round(aw / cnt * 100, 1),
            "avg_goals": round(tg / cnt, 2)
        })

    # Match Condition (Day vs Night)
    match_cond_stats = []
    for mc in ["Day", "Night"]:
        grp = df[df["Match_Condition"] == mc]
        cnt = len(grp)
        if cnt > 0:
            tg = grp["Home_Goals"].sum() + grp["Away_Goals"].sum()
            match_cond_stats.append({
                "condition": mc,
                "matches": cnt,
                "home_win_pct": round((grp["Match_Result"] == "Home_Win").sum() / cnt * 100, 1),
                "draw_pct": round((grp["Match_Result"] == "Draw").sum() / cnt * 100, 1),
                "away_win_pct": round((grp["Match_Result"] == "Away_Win").sum() / cnt * 100, 1),
                "avg_goals": round(tg / cnt, 2)
            })

    return {
        "weather_impact": weather_stats,
        "pitch_impact": pitch_stats,
        "kickoff_condition_impact": match_cond_stats
    }

def get_referee_analytics():
    df = data_loader.matches_df
    # Referee strictness index buckets
    # Index is 0.0 - 1.0 (or 0-10)
    strictness = df["Referee_Strictness_Index"]
    
    low_strict = df[strictness < 0.4]
    med_strict = df[(strictness >= 0.4) & (strictness <= 0.7)]
    high_strict = df[strictness > 0.7]

    def summarize_ref_bucket(bucket_df, label):
        cnt = len(bucket_df)
        if cnt == 0:
            return {"tier": label, "matches": 0, "avg_yellows": 0, "avg_reds": 0, "home_win_pct": 0}
        total_yc = bucket_df["Home_Yellow_Cards"].sum() + bucket_df["Away_Yellow_Cards"].sum()
        total_rc = bucket_df["Home_Red_Cards"].sum() + bucket_df["Away_Red_Cards"].sum()
        hw = (bucket_df["Match_Result"] == "Home_Win").sum()
        return {
            "tier": label,
            "matches": cnt,
            "avg_yellows": round(total_yc / cnt, 2),
            "avg_reds": round(total_rc / cnt, 2),
            "home_win_pct": round(hw / cnt * 100, 1)
        }

    tiers = [
        summarize_ref_bucket(low_strict, "Lenient (< 0.40)"),
        summarize_ref_bucket(med_strict, "Standard (0.40 - 0.70)"),
        summarize_ref_bucket(high_strict, "Strict (> 0.70)")
    ]

    total_yc = int(df["Home_Yellow_Cards"].sum() + df["Away_Yellow_Cards"].sum())
    total_rc = int(df["Home_Red_Cards"].sum() + df["Away_Red_Cards"].sum())

    return {
        "overall": {
            "total_yellow_cards": total_yc,
            "total_red_cards": total_rc,
            "avg_yellow_cards_per_match": round(total_yc / len(df), 2),
            "avg_red_cards_per_match": round(total_rc / len(df), 2)
        },
        "strictness_tiers": tiers,
        "methodology_note": "Referee strictness index is derived from disciplinary actions per game. Statistics reflect historical associations rather than direct causation."
    }

def get_set_piece_analytics():
    df = data_loader.matches_df
    avg_home_sp = round(float(df["Home_Set_Piece_Conversion_Pct"].mean()), 1)
    avg_away_sp = round(float(df["Away_Set_Piece_Conversion_Pct"].mean()), 1)
    avg_home_corners = round(float(df["Home_Corners"].mean()), 1)
    avg_away_corners = round(float(df["Away_Corners"].mean()), 1)

    return {
        "home_avg_set_piece_conversion_pct": avg_home_sp,
        "away_avg_set_piece_conversion_pct": avg_away_sp,
        "home_avg_corners": avg_home_corners,
        "away_avg_corners": avg_away_corners
    }
