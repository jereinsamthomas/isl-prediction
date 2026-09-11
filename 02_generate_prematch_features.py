"""
02_generate_prematch_features.py
================================
Strict Pre-Match Feature Generator (Data Leakage Protected)
Calculates all pre-match historical rolling metrics (Form, H2H, Goal Diff,
Rest Days, Home/Away Win Rates) strictly using matches occurring BEFORE each match date.
"""

import os
import pandas as pd
import numpy as np

PROCESSED_DIR = os.path.join("backend", "data", "processed")
RAW_CACHE = os.path.join(PROCESSED_DIR, "match_dataset_raw.csv")

def generate_prematch_features():
    print("=" * 65)
    print("ISL FOOTBALL INTELLIGENCE - PRE-MATCH FEATURE GENERATION")
    print("=" * 65)
    
    if os.path.exists(RAW_CACHE):
        df = pd.read_csv(RAW_CACHE)
    else:
        raw_excel = os.path.join("backend", "data", "raw", "ISL_2015_2024_dataset.xlsx")
        df = pd.read_excel(raw_excel, sheet_name="Match_Dataset", header=1)
    
    # Sort chronologically by date
    df["Match_Date"] = pd.to_datetime(df["Match_Date"])
    df = df.sort_values(["Match_Date", "Match_ID"]).reset_index(drop=True)
    
    # Handle Key_Player_Missing_Side
    df["Key_Player_Missing_Side"] = df["Key_Player_Missing_Side"].fillna("None")

    print(f"Processing {len(df)} matches chronologically (no future data leakage)...")

    # Track team match history for rolling calculations
    team_history = {}  # team -> list of {date, was_home, opponent, result, gf, ga, pts}
    h2h_history = {}   # (team1, team2) -> list of {date, home_team, result, gf_home, ga_home}

    # Features to compute for each match row
    calc_home_recent_form5 = []
    calc_away_recent_form5 = []
    calc_home_recent_form10 = []
    calc_away_recent_form10 = []
    calc_home_historical_win_rate = []
    calc_away_historical_win_rate = []
    calc_home_home_win_rate = []
    calc_away_away_win_rate = []
    calc_home_rolling_gd = []
    calc_away_rolling_gd = []
    calc_h2h_home_win_rate = []
    calc_h2h_draw_rate = []
    calc_h2h_away_win_rate = []
    calc_home_days_rest = []
    calc_away_days_rest = []

    for idx, row in df.iterrows():
        m_date = row["Match_Date"]
        home = row["Home_Team"]
        away = row["Away_Team"]

        # Helper for a single team's prior matches
        def get_team_prior_stats(team, is_home_perspective=True):
            history = team_history.get(team, [])
            if not history:
                return {
                    "form5": 7.5,  # default neutral mid-point (out of 15)
                    "form10": 15.0, # default neutral mid-point (out of 30)
                    "win_rate": 0.35,
                    "venue_win_rate": 0.40 if is_home_perspective else 0.30,
                    "rolling_gd": 0.0,
                    "days_rest": 7
                }
            
            # Form last 5
            last5 = history[-5:]
            pts5 = sum(m["pts"] for m in last5)
            # Form last 10
            last10 = history[-10:]
            pts10 = sum(m["pts"] for m in last10)

            # Overall historical win rate
            wins = sum(1 for m in history if m["result"] == "W")
            win_rate = wins / len(history)

            # Venue specific (Home matches for home team, Away matches for away team)
            venue_matches = [m for m in history if m["was_home"] == is_home_perspective]
            if venue_matches:
                venue_wins = sum(1 for m in venue_matches if m["result"] == "W")
                venue_win_rate = venue_wins / len(venue_matches)
            else:
                venue_win_rate = 0.40 if is_home_perspective else 0.30

            # Rolling GD (last 10)
            gd_last10 = sum(m["gf"] - m["ga"] for m in last10)

            # Rest days
            last_date = history[-1]["date"]
            days_rest = min(max((m_date - last_date).days, 1), 30)

            return {
                "form5": pts5,
                "form10": pts10,
                "win_rate": round(win_rate, 4),
                "venue_win_rate": round(venue_win_rate, 4),
                "rolling_gd": round(gd_last10 / max(len(last10), 1), 2),
                "days_rest": days_rest
            }

        # Head-to-Head prior history
        h2h_key = tuple(sorted([home, away]))
        h2h_list = h2h_history.get(h2h_key, [])
        if h2h_list:
            home_wins = sum(1 for m in h2h_list if (m["home_team"] == home and m["result"] == "Home_Win") or (m["home_team"] == away and m["result"] == "Away_Win"))
            draws = sum(1 for m in h2h_list if m["result"] == "Draw")
            away_wins = sum(1 for m in h2h_list if (m["home_team"] == home and m["result"] == "Away_Win") or (m["home_team"] == away and m["result"] == "Home_Win"))
            total_h2h = len(h2h_list)
            h2h_h_rate = round(home_wins / total_h2h, 4)
            h2h_d_rate = round(draws / total_h2h, 4)
            h2h_a_rate = round(away_wins / total_h2h, 4)
        else:
            h2h_h_rate = 0.40
            h2h_d_rate = 0.28
            h2h_a_rate = 0.32

        h_stats = get_team_prior_stats(home, is_home_perspective=True)
        a_stats = get_team_prior_stats(away, is_home_perspective=False)

        calc_home_recent_form5.append(h_stats["form5"])
        calc_away_recent_form5.append(a_stats["form5"])
        calc_home_recent_form10.append(h_stats["form10"])
        calc_away_recent_form10.append(a_stats["form10"])
        calc_home_historical_win_rate.append(h_stats["win_rate"])
        calc_away_historical_win_rate.append(a_stats["win_rate"])
        calc_home_home_win_rate.append(h_stats["venue_win_rate"])
        calc_away_away_win_rate.append(a_stats["venue_win_rate"])
        calc_home_rolling_gd.append(h_stats["rolling_gd"])
        calc_away_rolling_gd.append(a_stats["rolling_gd"])
        calc_h2h_home_win_rate.append(h2h_h_rate)
        calc_h2h_draw_rate.append(h2h_d_rate)
        calc_h2h_away_win_rate.append(h2h_a_rate)
        calc_home_days_rest.append(h_stats["days_rest"])
        calc_away_days_rest.append(a_stats["days_rest"])

        # NOW, update historical state for subsequent matches
        res = row["Match_Result"]
        hg = row["Home_Goals"]
        ag = row["Away_Goals"]

        if res == "Home_Win":
            h_pts, a_pts = 3, 0
            h_res, a_res = "W", "L"
        elif res == "Away_Win":
            h_pts, a_pts = 0, 3
            h_res, a_res = "L", "W"
        else:
            h_pts, a_pts = 1, 1
            h_res, a_res = "D", "D"

        if home not in team_history:
            team_history[home] = []
        team_history[home].append({"date": m_date, "was_home": True, "opponent": away, "result": h_res, "gf": hg, "ga": ag, "pts": h_pts})

        if away not in team_history:
            team_history[away] = []
        team_history[away].append({"date": m_date, "was_home": False, "opponent": home, "result": a_res, "gf": ag, "ga": hg, "pts": a_pts})

        if h2h_key not in h2h_history:
            h2h_history[h2h_key] = []
        h2h_history[h2h_key].append({"date": m_date, "home_team": home, "away_team": away, "result": res, "gf_home": hg, "ga_home": ag})

    # Add engineered pre-match columns to df
    df["Calculated_Home_Recent_Form_Pts"] = calc_home_recent_form5
    df["Calculated_Away_Recent_Form_Pts"] = calc_away_recent_form5
    df["Calculated_Home_Recent_Form10_Pts"] = calc_home_recent_form10
    df["Calculated_Away_Recent_Form10_Pts"] = calc_away_recent_form10
    df["Home_Historical_Win_Rate"] = calc_home_historical_win_rate
    df["Away_Historical_Win_Rate"] = calc_away_historical_win_rate
    df["Home_Venue_Win_Rate"] = calc_home_home_win_rate
    df["Away_Venue_Win_Rate"] = calc_away_away_win_rate
    df["Home_Rolling_Goal_Diff"] = calc_home_rolling_gd
    df["Away_Rolling_Goal_Diff"] = calc_away_rolling_gd
    df["H2H_Prior_Home_Win_Rate"] = calc_h2h_home_win_rate
    df["H2H_Prior_Draw_Rate"] = calc_h2h_draw_rate
    df["H2H_Prior_Away_Win_Rate"] = calc_h2h_away_win_rate
    df["Home_Days_Rest"] = calc_home_days_rest
    df["Away_Days_Rest"] = calc_away_days_rest

    out_file = os.path.join(PROCESSED_DIR, "prematch_engineered_features.csv")
    df.to_csv(out_file, index=False)
    print(f"Generated pre-match engineered features -> {out_file}")
    print("=" * 65)
    print("SUCCESS: 02_generate_prematch_features completed.")
    print("=" * 65)
    return df

if __name__ == "__main__":
    generate_prematch_features()
