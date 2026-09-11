"""
03_generate_training_dataset.py
===============================
Generates the comprehensive pre-match training dataset:
- Incorporates baseline pre-match features
- Adds mathematical differential features (Home - Away)
- Retains Match_Result as the only target label
- Exports ISL_PREMATCH_TRAINING_DATASET.csv and .xlsx
- Also produces a sample synthetic test dataset (DEMO ONLY)
"""

import os
import pandas as pd
import numpy as np

PROCESSED_DIR = os.path.join("backend", "data", "processed")
INPUT_CSV = os.path.join(PROCESSED_DIR, "prematch_engineered_features.csv")

def generate_training_dataset():
    print("=" * 65)
    print("ISL FOOTBALL INTELLIGENCE - TRAINING DATASET GENERATION")
    print("=" * 65)

    if not os.path.exists(INPUT_CSV):
        import importlib
        gen_mod = importlib.import_module("02_generate_prematch_features")
        df = gen_mod.generate_prematch_features()
    else:
        df = pd.read_csv(INPUT_CSV)

    print(f"Loaded {len(df)} matches with pre-match baseline features.")

    # 1. Differential & Ratio Feature Engineering (Home - Away)
    eps = 1e-5
    df["Market_Value_Difference"] = df["Home_Squad_Market_Value_Cr"] - df["Away_Squad_Market_Value_Cr"]
    df["Market_Value_Ratio"] = df["Home_Squad_Market_Value_Cr"] / (df["Away_Squad_Market_Value_Cr"] + eps)
    df["Foreign_Market_Value_Difference"] = df["Home_Foreign_Player_Market_Value_Cr"] - df["Away_Foreign_Player_Market_Value_Cr"]
    
    home_indian_mv = df["Home_Squad_Market_Value_Cr"] - df["Home_Foreign_Player_Market_Value_Cr"]
    away_indian_mv = df["Away_Squad_Market_Value_Cr"] - df["Away_Foreign_Player_Market_Value_Cr"]
    df["Indian_Market_Value_Difference"] = home_indian_mv - away_indian_mv

    df["Indian_Rating_Difference"] = df["Home_Indian_Player_Rating_Avg"] - df["Away_Indian_Player_Rating_Avg"]
    df["Foreign_Rating_Difference"] = df["Home_Foreign_Player_Rating_Avg"] - df["Away_Foreign_Player_Rating_Avg"]
    df["Overall_Rating_Difference"] = (df["Home_Indian_Player_Rating_Avg"] + df["Home_Foreign_Player_Rating_Avg"]) / 2 - \
                                      (df["Away_Indian_Player_Rating_Avg"] + df["Away_Foreign_Player_Rating_Avg"]) / 2

    df["Fatigue_Difference"] = df["Home_Fatigue_Index"] - df["Away_Fatigue_Index"]
    df["Chemistry_Difference"] = df["Home_Team_Chemistry_Score"] - df["Away_Team_Chemistry_Score"]
    df["Form_Difference"] = df["Home_Recent_Form_Pts"] - df["Away_Recent_Form_Pts"]
    df["H2H_Wins_Difference"] = df["H2H_Home_Wins_Last5"] - df["H2H_Away_Wins_Last5"]
    df["Set_Piece_Conversion_Diff"] = df["Home_Set_Piece_Conversion_Pct"] - df["Away_Set_Piece_Conversion_Pct"]
    df["Foreign_Player_Ratio_Diff"] = df["Home_Foreign_Player_Ratio"] - df["Away_Foreign_Player_Ratio"]
    df["Injury_Count_Diff"] = df["Home_Injury_Count"] - df["Away_Injury_Count"]

    df["Clearance_Tackle_Foreign_Diff"] = df["Home_Foreign_Clearances_Tackles"] - df["Away_Foreign_Clearances_Tackles"]
    df["Clearance_Tackle_Indian_Diff"] = df["Home_Indian_Clearances_Tackles"] - df["Away_Indian_Clearances_Tackles"]
    df["Big_Chance_Created_Foreign_Diff"] = df["Home_Foreign_Big_Chances_Created"] - df["Away_Foreign_Big_Chances_Created"]
    df["Big_Chance_Created_Indian_Diff"] = df["Home_Indian_Big_Chances_Created"] - df["Away_Indian_Big_Chances_Created"]
    df["Big_Chance_Missed_Foreign_Diff"] = df["Home_Foreign_Big_Chances_Missed"] - df["Away_Foreign_Big_Chances_Missed"]
    df["Big_Chance_Missed_Indian_Diff"] = df["Home_Indian_Big_Chances_Missed"] - df["Away_Indian_Big_Chances_Missed"]
    df["Interception_Rate_Foreign_Diff"] = df["Home_Foreign_Interception_Rate"] - df["Away_Foreign_Interception_Rate"]
    df["Interception_Rate_Indian_Diff"] = df["Home_Indian_Interception_Rate"] - df["Away_Indian_Interception_Rate"]

    df["Rolling_Goal_Diff_Differential"] = df["Home_Rolling_Goal_Diff"] - df["Away_Rolling_Goal_Diff"]
    df["Historical_Win_Rate_Diff"] = df["Home_Historical_Win_Rate"] - df["Away_Historical_Win_Rate"]
    df["Days_Rest_Diff"] = df["Home_Days_Rest"] - df["Away_Days_Rest"]

    # Select only metadata identifiers, pre-match features, engineered differentials, and target Match_Result
    meta_cols = ["Match_ID", "Season", "Match_Date", "Home_Team", "Away_Team", "Venue_City"]
    
    baseline_prematch = [
        "Home_Formation", "Away_Formation",
        "Home_Indian_Player_Rating_Avg", "Home_Foreign_Player_Rating_Avg",
        "Away_Indian_Player_Rating_Avg", "Away_Foreign_Player_Rating_Avg",
        "Home_Squad_Market_Value_Cr", "Home_Foreign_Player_Market_Value_Cr",
        "Away_Squad_Market_Value_Cr", "Away_Foreign_Player_Market_Value_Cr",
        "Home_Foreign_Clearances_Tackles", "Home_Indian_Clearances_Tackles",
        "Away_Foreign_Clearances_Tackles", "Away_Indian_Clearances_Tackles",
        "Home_Foreign_Big_Chances_Created", "Home_Indian_Big_Chances_Created",
        "Away_Foreign_Big_Chances_Created", "Away_Indian_Big_Chances_Created",
        "Home_Foreign_Big_Chances_Missed", "Home_Indian_Big_Chances_Missed",
        "Away_Foreign_Big_Chances_Missed", "Away_Indian_Big_Chances_Missed",
        "Home_Foreign_Interception_Rate", "Home_Indian_Interception_Rate",
        "Away_Foreign_Interception_Rate", "Away_Indian_Interception_Rate",
        "Home_Injury_Count", "Away_Injury_Count",
        "Weather_Condition", "Pitch_Condition", "Match_Condition",
        "Home_Fatigue_Index", "Away_Fatigue_Index",
        "Home_Team_Chemistry_Score", "Away_Team_Chemistry_Score",
        "H2H_Home_Wins_Last5", "H2H_Away_Wins_Last5",
        "Referee_Strictness_Index",
        "Home_Recent_Form_Pts", "Away_Recent_Form_Pts",
        "Home_Set_Piece_Conversion_Pct", "Away_Set_Piece_Conversion_Pct",
        "Key_Player_Missing_Side",
        "Home_Foreign_Player_Ratio", "Away_Foreign_Player_Ratio",
    ]

    engineered_diffs = [
        "Market_Value_Difference", "Market_Value_Ratio", "Foreign_Market_Value_Difference", "Indian_Market_Value_Difference",
        "Indian_Rating_Difference", "Foreign_Rating_Difference", "Overall_Rating_Difference",
        "Fatigue_Difference", "Chemistry_Difference", "Form_Difference", "H2H_Wins_Difference",
        "Set_Piece_Conversion_Diff", "Foreign_Player_Ratio_Diff", "Injury_Count_Diff",
        "Clearance_Tackle_Foreign_Diff", "Clearance_Tackle_Indian_Diff",
        "Big_Chance_Created_Foreign_Diff", "Big_Chance_Created_Indian_Diff",
        "Big_Chance_Missed_Foreign_Diff", "Big_Chance_Missed_Indian_Diff",
        "Interception_Rate_Foreign_Diff", "Interception_Rate_Indian_Diff",
        "Home_Historical_Win_Rate", "Away_Historical_Win_Rate", "Historical_Win_Rate_Diff",
        "Home_Venue_Win_Rate", "Away_Venue_Win_Rate",
        "Home_Rolling_Goal_Diff", "Away_Rolling_Goal_Diff", "Rolling_Goal_Diff_Differential",
        "H2H_Prior_Home_Win_Rate", "H2H_Prior_Draw_Rate", "H2H_Prior_Away_Win_Rate",
        "Home_Days_Rest", "Away_Days_Rest", "Days_Rest_Diff"
    ]

    target_col = ["Match_Result"]

    final_cols = meta_cols + baseline_prematch + engineered_diffs + target_col
    training_df = df[final_cols].copy()

    # Save to both processed dir and project root
    csv_processed = os.path.join(PROCESSED_DIR, "ISL_PREMATCH_TRAINING_DATASET.csv")
    xlsx_processed = os.path.join(PROCESSED_DIR, "ISL_PREMATCH_TRAINING_DATASET.xlsx")
    csv_root = "ISL_PREMATCH_TRAINING_DATASET.csv"
    xlsx_root = "ISL_PREMATCH_TRAINING_DATASET.xlsx"

    training_df.to_csv(csv_processed, index=False)
    training_df.to_csv(csv_root, index=False)
    training_df.to_excel(xlsx_processed, index=False)
    training_df.to_excel(xlsx_root, index=False)

    print(f"\nSaved Full Pre-Match Training Dataset:")
    print(f"  Rows: {len(training_df):,}")
    print(f"  Features: {len(training_df.columns) - len(meta_cols) - 1} predictive variables")
    print(f"  Target: Match_Result (Home_Win: {(training_df['Match_Result'] == 'Home_Win').sum()}, Draw: {(training_df['Match_Result'] == 'Draw').sum()}, Away_Win: {(training_df['Match_Result'] == 'Away_Win').sum()})")
    print(f"  Files created:")
    print(f"    - {csv_processed}")
    print(f"    - {xlsx_processed}")
    print(f"    - {csv_root}")
    print(f"    - {xlsx_root}")

    # Create Sample Demonstration Dataset as per Section 22
    sample_df = pd.DataFrame([
        {
            "Match_ID": "SAMPLE001", "Date": "2024-01-10", "Season": "2023-24", "Home_Team": "Mumbai City FC", "Away_Team": "Kerala Blasters",
            "Home_Team_Market_Value": 120.5, "Away_Team_Market_Value": 98.3,
            "Home_Foreign_Goal_Contribution": 8, "Away_Foreign_Goal_Contribution": 5, "Home_Indian_Goal_Contribution": 6, "Away_Indian_Goal_Contribution": 4,
            "Home_Recent_Form": 11, "Away_Recent_Form": 8, "Weather": "Clear", "Pitch_Condition": "Good", "Referee_Strictness_Index": 0.42,
            "Home_Days_Rest": 6, "Away_Days_Rest": 5, "Result": "WIN", "Data_Type": "SYNTHETIC_DEMO"
        },
        {
            "Match_ID": "SAMPLE002", "Date": "2024-01-15", "Season": "2023-24", "Home_Team": "East Bengal FC", "Away_Team": "FC Goa",
            "Home_Team_Market_Value": 75.2, "Away_Team_Market_Value": 110.4,
            "Home_Foreign_Goal_Contribution": 4, "Away_Foreign_Goal_Contribution": 9, "Home_Indian_Goal_Contribution": 7, "Away_Indian_Goal_Contribution": 5,
            "Home_Recent_Form": 7, "Away_Recent_Form": 12, "Weather": "Rain", "Pitch_Condition": "Wet", "Referee_Strictness_Index": 0.68,
            "Home_Days_Rest": 4, "Away_Days_Rest": 7, "Result": "LOSS", "Data_Type": "SYNTHETIC_DEMO"
        },
        {
            "Match_ID": "SAMPLE003", "Date": "2024-01-20", "Season": "2023-24", "Home_Team": "Bengaluru FC", "Away_Team": "Chennaiyin FC",
            "Home_Team_Market_Value": 121.1, "Away_Team_Market_Value": 76.5,
            "Home_Foreign_Goal_Contribution": 7, "Away_Foreign_Goal_Contribution": 6, "Home_Indian_Goal_Contribution": 5, "Away_Indian_Goal_Contribution": 5,
            "Home_Recent_Form": 10, "Away_Recent_Form": 10, "Weather": "Cloudy", "Pitch_Condition": "Good", "Referee_Strictness_Index": 0.51,
            "Home_Days_Rest": 7, "Away_Days_Rest": 6, "Result": "DRAW", "Data_Type": "SYNTHETIC_DEMO"
        }
    ])
    sample_csv = os.path.join(PROCESSED_DIR, "ISL_DEMO_SAMPLE_DATASET.csv")
    sample_df.to_csv(sample_csv, index=False)
    print(f"  Demo Sample Created: {sample_csv} (Clearly labeled SYNTHETIC_DEMO)")

    print("=" * 65)
    print("SUCCESS: 03_generate_training_dataset completed.")
    print("=" * 65)
    return training_df

if __name__ == "__main__":
    generate_training_dataset()
