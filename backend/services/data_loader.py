"""
backend/services/data_loader.py
===============================
Provides fast in-memory access and querying of the ISL matches dataset.
"""

import os
import pandas as pd
import numpy as np

PROCESSED_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "processed")
RAW_MATCHES_CSV = os.path.join(PROCESSED_DIR, "match_dataset_raw.csv")
PREMATCH_CSV = os.path.join(PROCESSED_DIR, "prematch_engineered_features.csv")

class DataLoader:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DataLoader, cls).__new__(cls)
            cls._instance._load_data()
        return cls._instance

    def _load_data(self):
        # Fallback creation if not present
        if not os.path.exists(RAW_MATCHES_CSV) or not os.path.exists(PREMATCH_CSV):
            from importlib import import_module
            import sys
            root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            if root_dir not in sys.path:
                sys.path.insert(0, root_dir)
            val_mod = import_module("01_validate_dataset")
            val_mod.validate_dataset()
            gen_mod = import_module("02_generate_prematch_features")
            gen_mod.generate_prematch_features()

        self.matches_df = pd.read_csv(RAW_MATCHES_CSV)
        self.prematch_df = pd.read_csv(PREMATCH_CSV)
        self.matches_df["Match_Date"] = pd.to_datetime(self.matches_df["Match_Date"])
        self.prematch_df["Match_Date"] = pd.to_datetime(self.prematch_df["Match_Date"])
        
        # Unique list of teams sorted
        self.teams = sorted(self.matches_df["Home_Team"].unique().tolist())
        self.seasons = sorted(self.matches_df["Season"].unique().tolist())
        self.formations = sorted(self.matches_df["Home_Formation"].unique().tolist())
        self.weather_conditions = sorted(self.matches_df["Weather_Condition"].unique().tolist())
        self.pitch_conditions = sorted(self.matches_df["Pitch_Condition"].unique().tolist())

    def get_all_teams(self):
        return self.teams

    def get_seasons(self):
        return self.seasons

    def get_all_matches(self, season=None, team=None, result=None, limit=100, offset=0):
        df = self.matches_df.copy()
        if season:
            df = df[df["Season"] == season]
        if team:
            df = df[(df["Home_Team"] == team) | (df["Away_Team"] == team)]
        if result:
            df = df[df["Match_Result"] == result]
        
        total_count = len(df)
        df = df.sort_values("Match_Date", ascending=False)
        paginated = df.iloc[offset:offset+limit]
        
        records = []
        for _, row in paginated.iterrows():
            records.append({
                "match_id": row["Match_ID"],
                "season": row["Season"],
                "date": str(row["Match_Date"])[:10],
                "home_team": row["Home_Team"],
                "away_team": row["Away_Team"],
                "venue_city": row["Venue_City"],
                "home_goals": int(row["Home_Goals"]),
                "away_goals": int(row["Away_Goals"]),
                "result": row["Match_Result"],
                "home_formation": row["Home_Formation"],
                "away_formation": row["Away_Formation"],
                "weather": row["Weather_Condition"],
                "pitch": row["Pitch_Condition"],
                "home_possession": float(row["Home_Possession_Pct"]),
                "away_possession": float(row["Away_Possession_Pct"]),
            })
        return {"total": total_count, "matches": records}

    def get_h2h(self, team1, team2):
        df = self.matches_df[
            ((self.matches_df["Home_Team"] == team1) & (self.matches_df["Away_Team"] == team2)) |
            ((self.matches_df["Home_Team"] == team2) & (self.matches_df["Away_Team"] == team1))
        ].sort_values("Match_Date", ascending=False)

        total = len(df)
        if total == 0:
            return {
                "team1": team1, "team2": team2, "total_meetings": 0,
                "team1_wins": 0, "draws": 0, "team2_wins": 0,
                "team1_goals": 0, "team2_goals": 0,
                "recent_meetings": []
            }

        t1_wins = 0
        t2_wins = 0
        draws = 0
        t1_goals = 0
        t2_goals = 0
        meetings = []

        for _, r in df.iterrows():
            is_t1_home = r["Home_Team"] == team1
            hg = int(r["Home_Goals"])
            ag = int(r["Away_Goals"])
            res = r["Match_Result"]

            if is_t1_home:
                t1_goals += hg
                t2_goals += ag
                if res == "Home_Win":
                    t1_wins += 1
                elif res == "Away_Win":
                    t2_wins += 1
                else:
                    draws += 1
            else:
                t1_goals += ag
                t2_goals += hg
                if res == "Home_Win":
                    t2_wins += 1
                elif res == "Away_Win":
                    t1_wins += 1
                else:
                    draws += 1

            meetings.append({
                "match_id": r["Match_ID"],
                "season": r["Season"],
                "date": str(r["Match_Date"])[:10],
                "home_team": r["Home_Team"],
                "away_team": r["Away_Team"],
                "score": f"{hg} - {ag}",
                "result": res
            })

        return {
            "team1": team1,
            "team2": team2,
            "total_meetings": total,
            "team1_wins": t1_wins,
            "draws": draws,
            "team2_wins": t2_wins,
            "team1_win_pct": round(t1_wins / total * 100, 1),
            "draw_pct": round(draws / total * 100, 1),
            "team2_win_pct": round(t2_wins / total * 100, 1),
            "team1_goals": t1_goals,
            "team2_goals": t2_goals,
            "avg_goals_per_game": round((t1_goals + t2_goals) / total, 2),
            "recent_meetings": meetings[:10]
        }

    def get_team_latest_profile(self, team):
        # Look in prematch_df for the latest row containing team
        home_m = self.prematch_df[self.prematch_df["Home_Team"] == team]
        away_m = self.prematch_df[self.prematch_df["Away_Team"] == team]
        
        if len(home_m) > 0 and (len(away_m) == 0 or home_m.iloc[-1]["Match_Date"] >= away_m.iloc[-1]["Match_Date"]):
            latest = home_m.iloc[-1]
            is_home = True
        elif len(away_m) > 0:
            latest = away_m.iloc[-1]
            is_home = False
        else:
            return None

        prefix = "Home_" if is_home else "Away_"
        return {
            "team": team,
            "formation": latest[f"{prefix}Formation"],
            "indian_rating": float(latest[f"{prefix}Indian_Player_Rating_Avg"]),
            "foreign_rating": float(latest[f"{prefix}Foreign_Player_Rating_Avg"]),
            "market_value_cr": float(latest[f"{prefix}Squad_Market_Value_Cr"]),
            "foreign_market_value_cr": float(latest[f"{prefix}Foreign_Player_Market_Value_Cr"]),
            "clearances_tackles_foreign": float(latest[f"{prefix}Foreign_Clearances_Tackles"]),
            "clearances_tackles_indian": float(latest[f"{prefix}Indian_Clearances_Tackles"]),
            "big_chances_created_foreign": float(latest[f"{prefix}Foreign_Big_Chances_Created"]),
            "big_chances_created_indian": float(latest[f"{prefix}Indian_Big_Chances_Created"]),
            "big_chances_missed_foreign": float(latest[f"{prefix}Foreign_Big_Chances_Missed"]),
            "big_chances_missed_indian": float(latest[f"{prefix}Indian_Big_Chances_Missed"]),
            "interception_rate_foreign": float(latest[f"{prefix}Foreign_Interception_Rate"]),
            "interception_rate_indian": float(latest[f"{prefix}Indian_Interception_Rate"]),
            "injury_count": float(latest[f"{prefix}Injury_Count"]),
            "fatigue_index": float(latest[f"{prefix}Fatigue_Index"]),
            "chemistry_score": float(latest[f"{prefix}Team_Chemistry_Score"]),
            "recent_form_pts": float(latest[f"{prefix}Recent_Form_Pts"]),
            "set_piece_conversion_pct": float(latest[f"{prefix}Set_Piece_Conversion_Pct"]),
            "foreign_player_ratio": float(latest[f"{prefix}Foreign_Player_Ratio"]),
            "historical_win_rate": float(latest[f"{prefix}Historical_Win_Rate"]) if f"{prefix}Historical_Win_Rate" in latest else 0.40,
            "venue_win_rate": float(latest[f"{prefix}Venue_Win_Rate"]) if f"{prefix}Venue_Win_Rate" in latest else 0.45,
            "days_rest": float(latest[f"{prefix}Days_Rest"]) if f"{prefix}Days_Rest" in latest else 6.0
        }

data_loader = DataLoader()
