"""
07_test_prediction.py
=====================
End-to-End Prediction Test & Explanation Pipeline
Simulates an upcoming fixture prediction with multi-class probabilities,
confidence score, and key influencing factors.
"""

import os
import joblib
import json
import pandas as pd
import numpy as np

MODELS_DIR = os.path.join("backend", "models")
PROCESSED_DIR = os.path.join("backend", "data", "processed")

def test_prediction(home_team="Mumbai City FC", away_team="Kerala Blasters", model_choice="Random Forest"):
    print("=" * 65)
    print("ISL FOOTBALL INTELLIGENCE - MATCH PREDICTION TEST")
    print("=" * 65)

    # 1. Load trained artifacts
    scaler = joblib.load(os.path.join(MODELS_DIR, "scaler.pkl"))
    encoders = joblib.load(os.path.join(MODELS_DIR, "encoders.pkl"))
    with open(os.path.join(MODELS_DIR, "metadata.json"), "r", encoding="utf-8") as f:
        meta = json.load(f)

    safe_name = model_choice.lower().replace(" ", "_").replace("-", "_")
    model_path = os.path.join(MODELS_DIR, f"{safe_name}.pkl")
    if not os.path.exists(model_path):
        model_path = os.path.join(MODELS_DIR, "random_forest.pkl")
        model_choice = "Random Forest"
    model = joblib.load(model_path)

    # 2. Extract recent statistics for both teams from historical data
    matches_csv = os.path.join(PROCESSED_DIR, "prematch_engineered_features.csv")
    df = pd.read_csv(matches_csv)

    home_matches = df[df["Home_Team"] == home_team]
    away_matches = df[df["Away_Team"] == away_team]

    if len(home_matches) == 0 or len(away_matches) == 0:
        print(f"Error: Could not find team historical records for {home_team} vs {away_team}")
        return

    # Use the most recent match profiles as pre-match baseline
    h_profile = home_matches.iloc[-1]
    a_profile = away_matches.iloc[-1]

    # Construct input feature dictionary
    features = {
        "Home_Formation": h_profile["Home_Formation"],
        "Away_Formation": a_profile["Away_Formation"],
        "Weather_Condition": "Clear",
        "Pitch_Condition": "Good",
        "Match_Condition": "Night",
        "Key_Player_Missing_Side": "None",
        "Home_Indian_Player_Rating_Avg": float(h_profile["Home_Indian_Player_Rating_Avg"]),
        "Home_Foreign_Player_Rating_Avg": float(h_profile["Home_Foreign_Player_Rating_Avg"]),
        "Away_Indian_Player_Rating_Avg": float(a_profile["Away_Indian_Player_Rating_Avg"]),
        "Away_Foreign_Player_Rating_Avg": float(a_profile["Away_Foreign_Player_Rating_Avg"]),
        "Home_Squad_Market_Value_Cr": float(h_profile["Home_Squad_Market_Value_Cr"]),
        "Home_Foreign_Player_Market_Value_Cr": float(h_profile["Home_Foreign_Player_Market_Value_Cr"]),
        "Away_Squad_Market_Value_Cr": float(a_profile["Away_Squad_Market_Value_Cr"]),
        "Away_Foreign_Player_Market_Value_Cr": float(a_profile["Away_Foreign_Player_Market_Value_Cr"]),
        "Home_Foreign_Clearances_Tackles": float(h_profile["Home_Foreign_Clearances_Tackles"]),
        "Home_Indian_Clearances_Tackles": float(h_profile["Home_Indian_Clearances_Tackles"]),
        "Away_Foreign_Clearances_Tackles": float(a_profile["Away_Foreign_Clearances_Tackles"]),
        "Away_Indian_Clearances_Tackles": float(a_profile["Away_Indian_Clearances_Tackles"]),
        "Home_Foreign_Big_Chances_Created": float(h_profile["Home_Foreign_Big_Chances_Created"]),
        "Home_Indian_Big_Chances_Created": float(h_profile["Home_Indian_Big_Chances_Created"]),
        "Away_Foreign_Big_Chances_Created": float(a_profile["Away_Foreign_Big_Chances_Created"]),
        "Away_Indian_Big_Chances_Created": float(a_profile["Away_Indian_Big_Chances_Created"]),
        "Home_Foreign_Big_Chances_Missed": float(h_profile["Home_Foreign_Big_Chances_Missed"]),
        "Home_Indian_Big_Chances_Missed": float(h_profile["Home_Indian_Big_Chances_Missed"]),
        "Away_Foreign_Big_Chances_Missed": float(a_profile["Away_Foreign_Big_Chances_Missed"]),
        "Away_Indian_Big_Chances_Missed": float(a_profile["Away_Indian_Big_Chances_Missed"]),
        "Home_Foreign_Interception_Rate": float(h_profile["Home_Foreign_Interception_Rate"]),
        "Home_Indian_Interception_Rate": float(h_profile["Home_Indian_Interception_Rate"]),
        "Away_Foreign_Interception_Rate": float(a_profile["Away_Foreign_Interception_Rate"]),
        "Away_Indian_Interception_Rate": float(a_profile["Away_Indian_Interception_Rate"]),
        "Home_Injury_Count": float(h_profile["Home_Injury_Count"]),
        "Away_Injury_Count": float(a_profile["Away_Injury_Count"]),
        "Home_Fatigue_Index": float(h_profile["Home_Fatigue_Index"]),
        "Away_Fatigue_Index": float(a_profile["Away_Fatigue_Index"]),
        "Home_Team_Chemistry_Score": float(h_profile["Home_Team_Chemistry_Score"]),
        "Away_Team_Chemistry_Score": float(a_profile["Away_Team_Chemistry_Score"]),
        "H2H_Home_Wins_Last5": float(h_profile["H2H_Home_Wins_Last5"]),
        "H2H_Away_Wins_Last5": float(h_profile["H2H_Away_Wins_Last5"]),
        "Referee_Strictness_Index": 0.50,
        "Home_Recent_Form_Pts": float(h_profile["Home_Recent_Form_Pts"]),
        "Away_Recent_Form_Pts": float(a_profile["Away_Recent_Form_Pts"]),
        "Home_Set_Piece_Conversion_Pct": float(h_profile["Home_Set_Piece_Conversion_Pct"]),
        "Away_Set_Piece_Conversion_Pct": float(a_profile["Away_Set_Piece_Conversion_Pct"]),
        "Home_Foreign_Player_Ratio": float(h_profile["Home_Foreign_Player_Ratio"]),
        "Away_Foreign_Player_Ratio": float(a_profile["Away_Foreign_Player_Ratio"]),
    }

    # Mathematical Differentials
    eps = 1e-5
    features["Market_Value_Difference"] = features["Home_Squad_Market_Value_Cr"] - features["Away_Squad_Market_Value_Cr"]
    features["Market_Value_Ratio"] = features["Home_Squad_Market_Value_Cr"] / (features["Away_Squad_Market_Value_Cr"] + eps)
    features["Foreign_Market_Value_Difference"] = features["Home_Foreign_Player_Market_Value_Cr"] - features["Away_Foreign_Player_Market_Value_Cr"]
    home_indian_mv = features["Home_Squad_Market_Value_Cr"] - features["Home_Foreign_Player_Market_Value_Cr"]
    away_indian_mv = features["Away_Squad_Market_Value_Cr"] - features["Away_Foreign_Player_Market_Value_Cr"]
    features["Indian_Market_Value_Difference"] = home_indian_mv - away_indian_mv

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

    features["Home_Historical_Win_Rate"] = float(h_profile.get("Home_Historical_Win_Rate", 0.45))
    features["Away_Historical_Win_Rate"] = float(a_profile.get("Away_Historical_Win_Rate", 0.35))
    features["Historical_Win_Rate_Diff"] = features["Home_Historical_Win_Rate"] - features["Away_Historical_Win_Rate"]
    features["Home_Venue_Win_Rate"] = float(h_profile.get("Home_Venue_Win_Rate", 0.50))
    features["Away_Venue_Win_Rate"] = float(a_profile.get("Away_Venue_Win_Rate", 0.30))

    features["Home_Rolling_Goal_Diff"] = float(h_profile.get("Home_Rolling_Goal_Diff", 0.4))
    features["Away_Rolling_Goal_Diff"] = float(a_profile.get("Away_Rolling_Goal_Diff", -0.2))
    features["Rolling_Goal_Diff_Differential"] = features["Home_Rolling_Goal_Diff"] - features["Away_Rolling_Goal_Diff"]

    features["H2H_Prior_Home_Win_Rate"] = float(h_profile.get("H2H_Prior_Home_Win_Rate", 0.40))
    features["H2H_Prior_Draw_Rate"] = float(h_profile.get("H2H_Prior_Draw_Rate", 0.25))
    features["H2H_Prior_Away_Win_Rate"] = float(h_profile.get("H2H_Prior_Away_Win_Rate", 0.35))

    features["Home_Days_Rest"] = float(h_profile.get("Home_Days_Rest", 6))
    features["Away_Days_Rest"] = float(a_profile.get("Away_Days_Rest", 5))
    features["Days_Rest_Diff"] = features["Home_Days_Rest"] - features["Away_Days_Rest"]

    # Transform into model dataframe
    expected_cols = meta["feature_columns"]
    row_df = pd.DataFrame([features])

    # Encode categorical columns using saved encoders
    cat_cols = ["Home_Formation", "Away_Formation", "Weather_Condition", "Pitch_Condition", "Match_Condition", "Key_Player_Missing_Side"]
    for c in cat_cols:
        le = encoders[c]
        val = str(row_df[c].iloc[0])
        # Safe transform with fallback to 0 if unknown class
        if val in le.classes_:
            row_df[c] = le.transform([val])[0]
        else:
            row_df[c] = 0

    # Ensure column ordering matches training
    row_df = row_df[expected_cols]

    # Scale with saved MinMaxScaler
    row_scaled = pd.DataFrame(scaler.transform(row_df), columns=expected_cols)

    # Predict Probabilities
    probs = model.predict_proba(row_scaled)[0]
    target_classes = meta["target_classes"]  # e.g. ['Away_Win', 'Draw', 'Home_Win']
    prob_dict = {cls: round(float(p) * 100, 1) for cls, p in zip(target_classes, probs)}

    # Map to standardized names
    home_win_prob = prob_dict.get("Home_Win", 0.0)
    draw_prob = prob_dict.get("Draw", 0.0)
    away_win_prob = prob_dict.get("Away_Win", 0.0)

    # Determine winner
    pred_idx = np.argmax(probs)
    predicted_class = target_classes[pred_idx]
    confidence = round(float(probs[pred_idx]) * 100, 1)

    result_label = "HOME WIN" if predicted_class == "Home_Win" else ("AWAY WIN" if predicted_class == "Away_Win" else "DRAW")

    # Factors
    positive_factors = []
    negative_factors = []

    if features["Form_Difference"] > 0:
        positive_factors.append(f"Home team has superior recent form (+{features['Form_Difference']:.0f} pts over last 5 matches)")
    else:
        negative_factors.append(f"Away team has equal or better recent form ({features['Form_Difference']:.0f} pts differential)")

    if features["Market_Value_Difference"] > 0:
        positive_factors.append(f"Higher squad market valuation (INR {features['Home_Squad_Market_Value_Cr']:.1f} Cr vs INR {features['Away_Squad_Market_Value_Cr']:.1f} Cr)")
    else:
        negative_factors.append(f"Lower squad market valuation (INR {features['Home_Squad_Market_Value_Cr']:.1f} Cr vs INR {features['Away_Squad_Market_Value_Cr']:.1f} Cr)")

    if features["Foreign_Rating_Difference"] > 0:
        positive_factors.append("Stronger foreign player performance rating index")
    else:
        negative_factors.append("Away team possesses higher foreign player rating index")

    if features["Home_Venue_Win_Rate"] > 0.45:
        positive_factors.append(f"Significant home advantage (Home venue win rate: {features['Home_Venue_Win_Rate']*100:.1f}%)")

    if features["Fatigue_Difference"] < 0:
        positive_factors.append("Favorable rest schedule (lower fatigue index)")
    else:
        negative_factors.append("Higher fatigue accumulation heading into kickoff")

    print(f"\nFIXTURE: {home_team} vs {away_team}")
    print(f"MODEL:   {model_choice}")
    print("\n------------------------------------------------")
    print(f"  PREDICTED OUTCOME:  {result_label}")
    print(f"  CONFIDENCE:         {confidence}%")
    print("------------------------------------------------")
    print(f"  Home Win ({home_team}): {home_win_prob:>5.1f}%")
    print(f"  Draw:                     {draw_prob:>5.1f}%")
    print(f"  Away Win ({away_team}): {away_win_prob:>5.1f}%")
    print("------------------------------------------------")

    print("\nKEY POSITIVE FACTORS FOR HOME:")
    for f in positive_factors:
        print(f"  [+] {f}")

    print("\nKEY CHALLENGES / OPPONENT ADVANTAGES:")
    for f in negative_factors:
        print(f"  [-] {f}")

    print("\n" + "=" * 65)
    print("SUCCESS: 07_test_prediction completed.")
    print("=" * 65)

if __name__ == "__main__":
    test_prediction()
