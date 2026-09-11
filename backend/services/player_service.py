"""
backend/services/player_service.py
==================================
Provides Indian vs Foreign player contribution analytics across:
- Attack (Goals, Big chances created, Big chances missed)
- Defence (Clearances & Tackles, Interception success rates)
- Creativity (Big chances created, Player ratings)
- Market Value (Squad valuations, foreign vs Indian player ratio)
Also provides key player absence impact analysis and transparent data coverage disclosure.
"""

import pandas as pd
import numpy as np
from .data_loader import data_loader

def get_data_coverage():
    return {
        "individual_player_roster_data": "Unavailable in current dataset",
        "aggregate_player_group_data": "Available (Match-level Indian vs Foreign metrics across all 1,100 matches)",
        "tracked_dimensions": [
            "Indian Player Rating Average (0-10)",
            "Foreign Player Rating Average (0-10)",
            "Indian Goal Contribution (Goals + Assists)",
            "Foreign Goal Contribution (Goals + Assists)",
            "Clearances and Tackles by Indian Players",
            "Clearances and Tackles by Foreign Players",
            "Big Chances Created by Indian Players",
            "Big Chances Created by Foreign Players",
            "Big Chances Missed by Indian Players",
            "Big Chances Missed by Foreign Players",
            "Indian Interception Rate (%)",
            "Foreign Interception Rate (%)",
            "Squad Market Value & Foreign Player Market Value (INR Crore)",
            "Foreign Player Ratio in Starting XI"
        ],
        "message": "Player-level individual names and roster profiles are not present in the historical dataset. Real aggregate Indian vs. Foreign squad contributions are strictly tracked and visualized below."
    }

def get_indian_vs_foreign_analytics():
    df = data_loader.matches_df

    # Attack Totals
    h_ind_goals = df["Home_Indian_Goal_Contribution"].sum()
    h_for_goals = df["Home_Foreign_Goal_Contribution"].sum()
    a_ind_goals = df["Away_Indian_Goal_Contribution"].sum()
    a_for_goals = df["Away_Foreign_Goal_Contribution"].sum()

    total_ind_goals = int(h_ind_goals + a_ind_goals)
    total_for_goals = int(h_for_goals + a_for_goals)
    total_goals = total_ind_goals + total_for_goals

    # Big Chances
    h_ind_bcc = df["Home_Indian_Big_Chances_Created"].sum()
    h_for_bcc = df["Home_Foreign_Big_Chances_Created"].sum()
    a_ind_bcc = df["Away_Indian_Big_Chances_Created"].sum()
    a_for_bcc = df["Away_Foreign_Big_Chances_Created"].sum()
    total_ind_bcc = int(h_ind_bcc + a_ind_bcc)
    total_for_bcc = int(h_for_bcc + a_for_bcc)

    h_ind_bcm = df["Home_Indian_Big_Chances_Missed"].sum()
    h_for_bcm = df["Home_Foreign_Big_Chances_Missed"].sum()
    a_ind_bcm = df["Away_Indian_Big_Chances_Missed"].sum()
    a_for_bcm = df["Away_Foreign_Big_Chances_Missed"].sum()
    total_ind_bcm = int(h_ind_bcm + a_ind_bcm)
    total_for_bcm = int(h_for_bcm + a_for_bcm)

    # Defence (Clearances + Tackles)
    total_ind_ct = int(df["Home_Indian_Clearances_Tackles"].sum() + df["Away_Indian_Clearances_Tackles"].sum())
    total_for_ct = int(df["Home_Foreign_Clearances_Tackles"].sum() + df["Away_Foreign_Clearances_Tackles"].sum())

    # Interception Rates (Averages)
    avg_ind_int_rate = round(float((df["Home_Indian_Interception_Rate"].mean() + df["Away_Indian_Interception_Rate"].mean()) / 2), 1)
    avg_for_int_rate = round(float((df["Home_Foreign_Interception_Rate"].mean() + df["Away_Foreign_Interception_Rate"].mean()) / 2), 1)

    # Ratings
    avg_ind_rating = round(float((df["Home_Indian_Player_Rating_Avg"].mean() + df["Away_Indian_Player_Rating_Avg"].mean()) / 2), 2)
    avg_for_rating = round(float((df["Home_Foreign_Player_Rating_Avg"].mean() + df["Away_Foreign_Player_Rating_Avg"].mean()) / 2), 2)

    # Market Value
    total_squad_mv = float(df["Home_Squad_Market_Value_Cr"].mean() + df["Away_Squad_Market_Value_Cr"].mean()) / 2
    total_foreign_mv = float(df["Home_Foreign_Player_Market_Value_Cr"].mean() + df["Away_Foreign_Player_Market_Value_Cr"].mean()) / 2
    total_indian_mv = max(total_squad_mv - total_foreign_mv, 0.0)

    # Percentages
    ind_goal_pct = round(total_ind_goals / total_goals * 100, 1) if total_goals > 0 else 0
    for_goal_pct = round(total_for_goals / total_goals * 100, 1) if total_goals > 0 else 0

    ind_ct_pct = round(total_ind_ct / (total_ind_ct + total_for_ct) * 100, 1)
    for_ct_pct = round(total_for_ct / (total_ind_ct + total_for_ct) * 100, 1)

    # Big Chance conversion (Goals / BCC)
    ind_conversion = round(total_ind_goals / max(total_ind_bcc, 1) * 100, 1)
    for_conversion = round(total_for_goals / max(total_for_bcc, 1) * 100, 1)

    return {
        "attack": {
            "indian_goals": total_ind_goals,
            "foreign_goals": total_for_goals,
            "indian_goal_pct": ind_goal_pct,
            "foreign_goal_pct": for_goal_pct,
            "indian_big_chances_created": total_ind_bcc,
            "foreign_big_chances_created": total_for_bcc,
            "indian_big_chances_missed": total_ind_bcm,
            "foreign_big_chances_missed": total_for_bcm,
            "indian_conversion_rate": ind_conversion,
            "foreign_conversion_rate": for_conversion
        },
        "defence": {
            "indian_clearances_tackles": total_ind_ct,
            "foreign_clearances_tackles": total_for_ct,
            "indian_clearances_tackles_pct": ind_ct_pct,
            "foreign_clearances_tackles_pct": for_ct_pct,
            "indian_avg_interception_rate": avg_ind_int_rate,
            "foreign_avg_interception_rate": avg_for_int_rate
        },
        "ratings_creativity": {
            "indian_avg_rating": avg_ind_rating,
            "foreign_avg_rating": avg_for_rating,
            "rating_gap": round(avg_for_rating - avg_ind_rating, 2)
        },
        "market_value": {
            "avg_squad_market_value_cr": round(total_squad_mv, 1),
            "foreign_market_value_cr": round(total_foreign_mv, 1),
            "indian_market_value_cr": round(total_indian_mv, 1),
            "foreign_market_share_pct": round(total_foreign_mv / total_squad_mv * 100, 1) if total_squad_mv > 0 else 0,
            "indian_market_share_pct": round(total_indian_mv / total_squad_mv * 100, 1) if total_squad_mv > 0 else 0
        }
    }

def get_key_player_absence_impact():
    df = data_loader.matches_df
    # Key_Player_Missing_Side breakdown
    counts = df["Key_Player_Missing_Side"].fillna("None").value_counts().to_dict()
    
    # Calculate win rate when Home key player missing vs when Away key player missing
    home_missing = df[df["Key_Player_Missing_Side"] == "Home"]
    away_missing = df[df["Key_Player_Missing_Side"] == "Away"]
    none_missing = df[df["Key_Player_Missing_Side"].isin(["None", None, np.nan])]

    h_win_rate_when_home_missing = round((home_missing["Match_Result"] == "Home_Win").sum() / max(len(home_missing), 1) * 100, 1)
    h_win_rate_when_away_missing = round((away_missing["Match_Result"] == "Home_Win").sum() / max(len(away_missing), 1) * 100, 1)
    h_win_rate_normal = round((none_missing["Match_Result"] == "Home_Win").sum() / max(len(none_missing), 1) * 100, 1)

    return {
        "missing_distribution": counts,
        "impact_summary": {
            "home_win_rate_normal": h_win_rate_normal,
            "home_win_rate_when_home_key_missing": h_win_rate_when_home_missing,
            "home_win_rate_when_away_key_missing": h_win_rate_when_away_missing,
            "impact_drop_pct": round(h_win_rate_normal - h_win_rate_when_home_missing, 1)
        }
    }
