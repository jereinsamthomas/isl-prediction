"""
backend/services/prediction_service.py
======================================
Production Match Prediction Engine with Probability Distributions,
Confidence Scoring, and Feature Influence Explanations.
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from .data_loader import data_loader

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")

class PredictionService:
    def __init__(self):
        self.scaler = None
        self.encoders = None
        self.metadata = None
        self.models = {}
        self._load_artifacts()

    def _load_artifacts(self):
        scaler_path = os.path.join(MODELS_DIR, "scaler.pkl")
        encoders_path = os.path.join(MODELS_DIR, "encoders.pkl")
        meta_path = os.path.join(MODELS_DIR, "metadata.json")

        if not os.path.exists(scaler_path) or not os.path.exists(encoders_path):
            import sys
            root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            if root_dir not in sys.path:
                sys.path.insert(0, root_dir)
            from importlib import import_module
            train_mod = import_module("04_train_models")
            train_mod.train_and_evaluate_all()

        self.scaler = joblib.load(scaler_path)
        self.encoders = joblib.load(encoders_path)
        with open(meta_path, "r", encoding="utf-8") as f:
            self.metadata = json.load(f)

        model_names = [
            "logistic_regression", "random_forest", "decision_tree",
            "k_nearest_neighbors", "gradient_boosting", "xgboost"
        ]
        for name in model_names:
            p = os.path.join(MODELS_DIR, f"{name}.pkl")
            if os.path.exists(p):
                self.models[name] = joblib.load(p)

    def predict_match(self, payload: dict):
        home_team = payload.get("home_team")
        away_team = payload.get("away_team")
        model_choice = payload.get("model", "Random Forest")

        if not home_team or not away_team:
            raise ValueError("Both home_team and away_team must be provided.")
        if home_team == away_team:
            raise ValueError("Home team and Away team cannot be identical.")

        # Get latest profiles for both teams
        h_prof = data_loader.get_team_latest_profile(home_team)
        a_prof = data_loader.get_team_latest_profile(away_team)

        if not h_prof or not a_prof:
            raise ValueError(f"Team profile data not found for {home_team} or {away_team}")

        # Override with user inputs if supplied
        home_formation = payload.get("home_formation") or h_prof["formation"]
        away_formation = payload.get("away_formation") or a_prof["formation"]
        weather = payload.get("weather") or "Clear"
        pitch = payload.get("pitch_condition") or "Good"
        match_cond = payload.get("match_condition") or "Night"
        key_missing = payload.get("key_player_missing_side") or "None"
        ref_strict = float(payload.get("referee_strictness_index", 0.50))

        # Build feature map
        features = {
            "Home_Formation": home_formation,
            "Away_Formation": away_formation,
            "Weather_Condition": weather,
            "Pitch_Condition": pitch,
            "Match_Condition": match_cond,
            "Key_Player_Missing_Side": key_missing,
            "Home_Indian_Player_Rating_Avg": h_prof["indian_rating"],
            "Home_Foreign_Player_Rating_Avg": h_prof["foreign_rating"],
            "Away_Indian_Player_Rating_Avg": a_prof["indian_rating"],
            "Away_Foreign_Player_Rating_Avg": a_prof["foreign_rating"],
            "Home_Squad_Market_Value_Cr": h_prof["market_value_cr"],
            "Home_Foreign_Player_Market_Value_Cr": h_prof["foreign_market_value_cr"],
            "Away_Squad_Market_Value_Cr": a_prof["market_value_cr"],
            "Away_Foreign_Player_Market_Value_Cr": a_prof["foreign_market_value_cr"],
            "Home_Foreign_Clearances_Tackles": h_prof["clearances_tackles_foreign"],
            "Home_Indian_Clearances_Tackles": h_prof["clearances_tackles_indian"],
            "Away_Foreign_Clearances_Tackles": a_prof["clearances_tackles_foreign"],
            "Away_Indian_Clearances_Tackles": a_prof["clearances_tackles_indian"],
            "Home_Foreign_Big_Chances_Created": h_prof["big_chances_created_foreign"],
            "Home_Indian_Big_Chances_Created": h_prof["big_chances_created_indian"],
            "Away_Foreign_Big_Chances_Created": a_prof["big_chances_created_foreign"],
            "Away_Indian_Big_Chances_Created": a_prof["big_chances_created_indian"],
            "Home_Foreign_Big_Chances_Missed": h_prof["big_chances_missed_foreign"],
            "Home_Indian_Big_Chances_Missed": h_prof["big_chances_missed_indian"],
            "Away_Foreign_Big_Chances_Missed": a_prof["big_chances_missed_foreign"],
            "Away_Indian_Big_Chances_Missed": a_prof["big_chances_missed_indian"],
            "Home_Foreign_Interception_Rate": h_prof["interception_rate_foreign"],
            "Home_Indian_Interception_Rate": h_prof["interception_rate_indian"],
            "Away_Foreign_Interception_Rate": a_prof["interception_rate_foreign"],
            "Away_Indian_Interception_Rate": a_prof["interception_rate_indian"],
            "Home_Injury_Count": h_prof["injury_count"],
            "Away_Injury_Count": a_prof["injury_count"],
            "Home_Fatigue_Index": h_prof["fatigue_index"],
            "Away_Fatigue_Index": a_prof["fatigue_index"],
            "Home_Team_Chemistry_Score": h_prof["chemistry_score"],
            "Away_Team_Chemistry_Score": a_prof["chemistry_score"],
            "H2H_Home_Wins_Last5": 2.0,
            "H2H_Away_Wins_Last5": 1.0,
            "Referee_Strictness_Index": ref_strict,
            "Home_Recent_Form_Pts": h_prof["recent_form_pts"],
            "Away_Recent_Form_Pts": a_prof["recent_form_pts"],
            "Home_Set_Piece_Conversion_Pct": h_prof["set_piece_conversion_pct"],
            "Away_Set_Piece_Conversion_Pct": a_prof["set_piece_conversion_pct"],
            "Home_Foreign_Player_Ratio": h_prof["foreign_player_ratio"],
            "Away_Foreign_Player_Ratio": a_prof["foreign_player_ratio"],
        }

        # Query H2H between the two teams if available
        h2h_data = data_loader.get_h2h(home_team, away_team)
        if h2h_data["total_meetings"] > 0:
            features["H2H_Home_Wins_Last5"] = min(h2h_data["team1_wins"], 5)
            features["H2H_Away_Wins_Last5"] = min(h2h_data["team2_wins"], 5)
            features["H2H_Prior_Home_Win_Rate"] = h2h_data["team1_win_pct"] / 100.0
            features["H2H_Prior_Draw_Rate"] = h2h_data["draw_pct"] / 100.0
            features["H2H_Prior_Away_Win_Rate"] = h2h_data["team2_win_pct"] / 100.0
        else:
            features["H2H_Prior_Home_Win_Rate"] = 0.40
            features["H2H_Prior_Draw_Rate"] = 0.28
            features["H2H_Prior_Away_Win_Rate"] = 0.32

        # Differentials
        eps = 1e-5
        features["Market_Value_Difference"] = features["Home_Squad_Market_Value_Cr"] - features["Away_Squad_Market_Value_Cr"]
        features["Market_Value_Ratio"] = features["Home_Squad_Market_Value_Cr"] / (features["Away_Squad_Market_Value_Cr"] + eps)
        features["Foreign_Market_Value_Difference"] = features["Home_Foreign_Player_Market_Value_Cr"] - features["Away_Foreign_Player_Market_Value_Cr"]
        home_ind_mv = features["Home_Squad_Market_Value_Cr"] - features["Home_Foreign_Player_Market_Value_Cr"]
        away_ind_mv = features["Away_Squad_Market_Value_Cr"] - features["Away_Foreign_Player_Market_Value_Cr"]
        features["Indian_Market_Value_Difference"] = home_ind_mv - away_ind_mv

        features["Indian_Rating_Difference"] = features["Home_Indian_Player_Rating_Avg"] - features["Away_Indian_Player_Rating_Avg"]
        features["Foreign_Rating_Difference"] = features["Home_Foreign_Player_Rating_Avg"] - features["Away_Foreign_Player_Rating_Avg"]
        features["Overall_Rating_Difference"] = (features["Home_Indian_Player_Rating_Avg"] + features["Home_Foreign_Player_Rating_Avg"]) / 2 - \
                                               (features["Away_Indian_Player_Rating_Avg"] + features["Away_Foreign_Player_Rating_Avg"]) / 2

        features["Fatigue_Difference"] = features["Home_Fatigue_Index"] - features["Away_Fatigue_Index"]
        features["Chemistry_Difference"] = features["Home_Team_Chemistry_Score"] - features["Away_Team_Chemistry_Score"]
        features["Form_Difference"] = features["Home_Recent_Form_Pts"] - features["Away_Recent_Form_Pts"]
        features["H2H_Wins_Difference"] = features["H2H_Home_Wins_Last5"] - features["H2H_Away_Wins_Last5"]
        features["Set_Piece_Conversion_Diff"] = features["Home_Set_Piece_Conversion_Pct"] - features["Away_Set_Piece_Conversion_Pct"]
        features["Foreign_Player_Ratio_Diff"] = features["Home_Foreign_Player_Ratio"] - features["Away_Foreign_Player_Ratio"]
        features["Injury_Count_Diff"] = features["Home_Injury_Count"] - features["Away_Injury_Count"]

        features["Clearance_Tackle_Foreign_Diff"] = features["Home_Foreign_Clearances_Tackles"] - features["Away_Foreign_Clearances_Tackles"]
        features["Clearance_Tackle_Indian_Diff"] = features["Home_Indian_Clearances_Tackles"] - features["Away_Indian_Clearances_Tackles"]
        features["Big_Chance_Created_Foreign_Diff"] = features["Home_Foreign_Big_Chances_Created"] - features["Away_Foreign_Big_Chances_Created"]
        features["Big_Chance_Created_Indian_Diff"] = features["Home_Indian_Big_Chances_Created"] - features["Away_Indian_Big_Chances_Created"]
        features["Big_Chance_Missed_Foreign_Diff"] = features["Home_Foreign_Big_Chances_Missed"] - features["Away_Foreign_Big_Chances_Missed"]
        features["Big_Chance_Missed_Indian_Diff"] = features["Home_Indian_Big_Chances_Missed"] - features["Away_Indian_Big_Chances_Missed"]
        features["Interception_Rate_Foreign_Diff"] = features["Home_Foreign_Interception_Rate"] - features["Away_Foreign_Interception_Rate"]
        features["Interception_Rate_Indian_Diff"] = features["Home_Indian_Interception_Rate"] - features["Away_Indian_Interception_Rate"]

        features["Home_Historical_Win_Rate"] = h_prof["historical_win_rate"]
        features["Away_Historical_Win_Rate"] = a_prof["historical_win_rate"]
        features["Historical_Win_Rate_Diff"] = features["Home_Historical_Win_Rate"] - features["Away_Historical_Win_Rate"]
        features["Home_Venue_Win_Rate"] = h_prof["venue_win_rate"]
        features["Away_Venue_Win_Rate"] = a_prof["venue_win_rate"]

        features["Home_Rolling_Goal_Diff"] = 0.3
        features["Away_Rolling_Goal_Diff"] = -0.1
        features["Rolling_Goal_Diff_Differential"] = 0.4

        features["Home_Days_Rest"] = h_prof["days_rest"]
        features["Away_Days_Rest"] = a_prof["days_rest"]
        features["Days_Rest_Diff"] = features["Home_Days_Rest"] - features["Away_Days_Rest"]

        # Prepare model input
        row_df = pd.DataFrame([features])
        cat_cols = ["Home_Formation", "Away_Formation", "Weather_Condition", "Pitch_Condition", "Match_Condition", "Key_Player_Missing_Side"]
        for c in cat_cols:
            le = self.encoders[c]
            val = str(row_df[c].iloc[0])
            row_df[c] = le.transform([val])[0] if val in le.classes_ else 0

        expected_cols = self.metadata["feature_columns"]
        row_df = row_df[expected_cols]
        row_scaled = pd.DataFrame(self.scaler.transform(row_df), columns=expected_cols)

        # Select model
        key = model_choice.lower().replace(" ", "_").replace("-", "_")
        if key not in self.models:
            key = "random_forest"
            model_choice = "Random Forest"
        active_model = self.models[key]

        # Calculate prediction probabilities
        probs = active_model.predict_proba(row_scaled)[0]
        target_classes = self.metadata["target_classes"]  # ['Away_Win', 'Draw', 'Home_Win']
        prob_dict = {cls: round(float(p) * 100, 1) for cls, p in zip(target_classes, probs)}

        home_prob = prob_dict.get("Home_Win", 0.0)
        draw_prob = prob_dict.get("Draw", 0.0)
        away_prob = prob_dict.get("Away_Win", 0.0)

        pred_idx = int(np.argmax(probs))
        predicted_class = target_classes[pred_idx]
        confidence = round(float(probs[pred_idx]) * 100, 1)
        
        result_label = "Home Win" if predicted_class == "Home_Win" else ("Away Win" if predicted_class == "Away_Win" else "Draw")

        # Dynamic Explanations
        positives = []
        negatives = []

        # Form
        if features["Form_Difference"] > 0:
            positives.append(f"Stronger recent form (+{features['Form_Difference']:.0f} pts differential in last 5 matches)")
        elif features["Form_Difference"] < 0:
            negatives.append(f"Opponent has superior recent form ({features['Form_Difference']:.0f} pts differential)")

        # Market value
        if features["Market_Value_Difference"] > 2.0:
            positives.append(f"Squad market valuation advantage (+₹{features['Market_Value_Difference']:.1f} Cr differential)")
        elif features["Market_Value_Difference"] < -2.0:
            negatives.append(f"Lower squad market valuation (-₹{abs(features['Market_Value_Difference']):.1f} Cr differential)")

        # Home Advantage
        if features["Home_Venue_Win_Rate"] >= 0.40:
            positives.append(f"Home ground advantage ({features['Home_Venue_Win_Rate']*100:.1f}% historical home win rate)")

        # Foreign Rating
        if features["Foreign_Rating_Difference"] > 0.2:
            positives.append("Higher foreign player technical rating index")
        elif features["Foreign_Rating_Difference"] < -0.2:
            negatives.append("Opponent has higher foreign player rating index")

        # Fatigue & Rest
        if features["Days_Rest_Diff"] > 2:
            positives.append(f"Better rest schedule (+{features['Days_Rest_Diff']:.0f} more rest days than opponent)")
        elif features["Days_Rest_Diff"] < -2:
            negatives.append(f"Congested schedule ({abs(features['Days_Rest_Diff']):.0f} fewer rest days)")

        # Key Missing
        if key_missing == "Home":
            negatives.append("Key player absent from home team lineup")
        elif key_missing == "Away":
            positives.append("Key player missing from away team lineup")

        # Top feature importance weights for explanation
        rf_top = self.metadata.get("feature_importance_rf", [])[:8]

        return {
            "prediction": result_label,
            "home_win_probability": home_prob,
            "draw_probability": draw_prob,
            "away_win_probability": away_prob,
            "model_used": model_choice,
            "confidence": confidence,
            "home_team": home_team,
            "away_team": away_team,
            "key_influencing_factors": {
                "positive": positives,
                "negative": negatives
            },
            "top_features": rf_top,
            "prematch_summary": {
                "home_formation": home_formation,
                "away_formation": away_formation,
                "home_market_value_cr": features["Home_Squad_Market_Value_Cr"],
                "away_market_value_cr": features["Away_Squad_Market_Value_Cr"],
                "home_recent_form_pts": features["Home_Recent_Form_Pts"],
                "away_recent_form_pts": features["Away_Recent_Form_Pts"],
                "weather": weather,
                "pitch": pitch,
                "referee_strictness": ref_strict
            }
        }

prediction_service = PredictionService()
