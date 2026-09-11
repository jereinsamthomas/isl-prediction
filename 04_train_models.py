"""
04_train_models.py
==================
Trains multiple ML algorithms on the ISL Pre-Match Training Dataset:
1. Logistic Regression
2. Random Forest
3. Decision Tree
4. K-Nearest Neighbors
5. Gradient Boosting
6. XGBoost

Evaluates under both:
- Temporal Split (2015-2022 Train vs 2023-2025 Test)
- Stratified Random 80:20 Split
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import xgboost as xgb

MODELS_DIR = os.path.join("backend", "models")
os.makedirs(MODELS_DIR, exist_ok=True)
DATA_PATH = os.path.join("backend", "data", "processed", "ISL_PREMATCH_TRAINING_DATASET.csv")

def get_feature_columns():
    categorical = [
        "Home_Formation", "Away_Formation",
        "Weather_Condition", "Pitch_Condition", "Match_Condition",
        "Key_Player_Missing_Side"
    ]
    numeric = [
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
        "Home_Fatigue_Index", "Away_Fatigue_Index",
        "Home_Team_Chemistry_Score", "Away_Team_Chemistry_Score",
        "H2H_Home_Wins_Last5", "H2H_Away_Wins_Last5",
        "Referee_Strictness_Index",
        "Home_Recent_Form_Pts", "Away_Recent_Form_Pts",
        "Home_Set_Piece_Conversion_Pct", "Away_Set_Piece_Conversion_Pct",
        "Home_Foreign_Player_Ratio", "Away_Foreign_Player_Ratio",
        # Engineered Differentials & Ratios
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
    return categorical, numeric

def train_and_evaluate_all():
    print("=" * 70)
    print("ISL FOOTBALL INTELLIGENCE - MULTI-MODEL TRAINING PIPELINE")
    print("=" * 70)

    df = pd.read_csv(DATA_PATH)
    print(f"Dataset loaded: {len(df)} matches")

    categorical_cols, numeric_cols = get_feature_columns()
    all_feature_cols = categorical_cols + numeric_cols

    # Encode categorical features
    encoders = {}
    X_df = pd.DataFrame()
    for col in categorical_cols:
        le = LabelEncoder()
        X_df[col] = le.fit_transform(df[col].astype(str))
        encoders[col] = le

    for col in numeric_cols:
        X_df[col] = df[col].astype(float)

    # Encode target label: Home_Win (1), Draw (0), Away_Win (2)
    # Order: Draw, Home_Win, Away_Win or standard classes
    target_le = LabelEncoder()
    y = target_le.fit_transform(df["Match_Result"])
    encoders["target"] = target_le
    target_classes = list(target_le.classes_)
    print(f"Target classes: {target_classes}")

    # Scale numeric features
    scaler = MinMaxScaler()
    X_scaled = pd.DataFrame(scaler.fit_transform(X_df), columns=all_feature_cols)

    # -------------------------------------------------------------
    # 1. Stratified Random 80:20 Split
    # -------------------------------------------------------------
    X_tr_rand, X_te_rand, y_tr_rand, y_te_rand = train_test_split(
        X_scaled, y, test_size=0.20, random_state=42, stratify=y
    )

    # -------------------------------------------------------------
    # 2. Temporal Split: Train on Seasons <= 2022-23, Test on >= 2023-24
    # -------------------------------------------------------------
    temporal_train_mask = df["Season"].isin([
        "2015-16", "2016-17", "2017-18", "2018-19", "2019-20", "2020-21", "2021-22", "2022-23"
    ])
    X_tr_temp = X_scaled[temporal_train_mask]
    y_tr_temp = y[temporal_train_mask]
    X_te_temp = X_scaled[~temporal_train_mask]
    y_te_temp = y[~temporal_train_mask]

    print(f"\n[Split Configurations]")
    print(f"  Random 80:20 Split:     Train={len(X_tr_rand)}, Test={len(X_te_rand)}")
    print(f"  Temporal Time Split:    Train={len(X_tr_temp)} (2015-2023), Test={len(X_te_temp)} (2023-2025)")

    # Model definitions
    model_factory = {
        "Logistic Regression": lambda: LogisticRegression(max_iter=3000, C=1.0, random_state=42),
        "Random Forest": lambda: RandomForestClassifier(n_estimators=250, max_depth=9, random_state=42, min_samples_leaf=2),
        "Decision Tree": lambda: DecisionTreeClassifier(max_depth=5, random_state=42),
        "K-Nearest Neighbors": lambda: KNeighborsClassifier(n_neighbors=9),
        "Gradient Boosting": lambda: GradientBoostingClassifier(n_estimators=120, max_depth=4, learning_rate=0.08, random_state=42),
        "XGBoost": lambda: xgb.XGBClassifier(n_estimators=100, max_depth=4, learning_rate=0.08, random_state=42, eval_metric="mlogloss")
    }

    results = {
        "random_split": {},
        "temporal_split": {},
        "target_classes": target_classes,
        "feature_columns": all_feature_cols
    }

    trained_models = {}

    # Train on Random Split (Primary production model)
    print("\n" + "-" * 70)
    print("TRAINING ON STRATIFIED RANDOM SPLIT (80:20)")
    print("-" * 70)
    print(f"{'Model':<24} | {'Accuracy':<10} | {'Precision':<10} | {'Recall':<10} | {'F1-Macro':<10}")
    print("-" * 70)

    for name, factory in model_factory.items():
        m = factory()
        m.fit(X_tr_rand, y_tr_rand)
        pred = m.predict(X_te_rand)
        
        acc = accuracy_score(y_te_rand, pred) * 100
        prec = precision_score(y_te_rand, pred, average="macro", zero_division=0) * 100
        rec = recall_score(y_te_rand, pred, average="macro", zero_division=0) * 100
        f1 = f1_score(y_te_rand, pred, average="macro", zero_division=0) * 100
        cm = confusion_matrix(y_te_rand, pred).tolist()

        trained_models[name] = m
        results["random_split"][name] = {
            "accuracy": round(acc, 2),
            "precision": round(prec, 2),
            "recall": round(rec, 2),
            "f1_score": round(f1, 2),
            "confusion_matrix": cm
        }
        print(f"{name:<24} | {acc:>8.2f}% | {prec:>8.2f}% | {rec:>8.2f}% | {f1:>8.2f}%")

    # Train on Temporal Split (Academic Validation)
    print("\n" + "-" * 70)
    print("TRAINING ON TEMPORAL TIME SPLIT (2015-2022 Train vs 2023-2025 Test)")
    print("-" * 70)
    print(f"{'Model':<24} | {'Accuracy':<10} | {'Precision':<10} | {'Recall':<10} | {'F1-Macro':<10}")
    print("-" * 70)

    for name, factory in model_factory.items():
        m_temp = factory()
        m_temp.fit(X_tr_temp, y_tr_temp)
        pred_temp = m_temp.predict(X_te_temp)

        acc = accuracy_score(y_te_temp, pred_temp) * 100
        prec = precision_score(y_te_temp, pred_temp, average="macro", zero_division=0) * 100
        rec = recall_score(y_te_temp, pred_temp, average="macro", zero_division=0) * 100
        f1 = f1_score(y_te_temp, pred_temp, average="macro", zero_division=0) * 100
        cm = confusion_matrix(y_te_temp, pred_temp).tolist()

        results["temporal_split"][name] = {
            "accuracy": round(acc, 2),
            "precision": round(prec, 2),
            "recall": round(rec, 2),
            "f1_score": round(f1, 2),
            "confusion_matrix": cm
        }
        print(f"{name:<24} | {acc:>8.2f}% | {prec:>8.2f}% | {rec:>8.2f}% | {f1:>8.2f}%")

    # Extract Feature Importances from Random Forest
    rf_model = trained_models["Random Forest"]
    rf_importances = pd.Series(rf_model.feature_importances_, index=all_feature_cols).sort_values(ascending=False)
    
    top_features = []
    for feat, imp in rf_importances.head(25).items():
        top_features.append({
            "feature": feat,
            "importance": round(float(imp), 4),
            "percentage": round(float(imp * 100), 2)
        })
    results["feature_importance_rf"] = top_features

    # Paper comparison benchmarks
    results["paper_benchmarks"] = {
        "Logistic Regression": 82.4,
        "Random Forest": 79.8,
        "Decision Tree": 74.3,
        "K-Nearest Neighbors": 71.2,
        "note": "Paper benchmarks represent retrospective in-match feature experiments. Production model uses strict zero-leakage pre-match features."
    }

    # Best model selection
    best_rand_model = max(results["random_split"].items(), key=lambda x: x[1]["accuracy"])
    results["best_model"] = {
        "name": best_rand_model[0],
        "accuracy": best_rand_model[1]["accuracy"],
        "f1_score": best_rand_model[1]["f1_score"]
    }
    print("\n" + "=" * 70)
    print(f"BEST PERFORMING PRODUCTION MODEL: {results['best_model']['name']} ({results['best_model']['accuracy']}%)")
    print("=" * 70)

    # Save models, scaler, encoders, metadata
    for name, m in trained_models.items():
        safe_name = name.lower().replace(" ", "_").replace("-", "_")
        pkl_path = os.path.join(MODELS_DIR, f"{safe_name}.pkl")
        joblib.dump(m, pkl_path)
        print(f"Saved model binary -> {pkl_path}")

    joblib.dump(scaler, os.path.join(MODELS_DIR, "scaler.pkl"))
    joblib.dump(encoders, os.path.join(MODELS_DIR, "encoders.pkl"))

    with open(os.path.join(MODELS_DIR, "metadata.json"), "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print(f"Saved evaluation metadata -> {os.path.join(MODELS_DIR, 'metadata.json')}")

    return results

if __name__ == "__main__":
    train_and_evaluate_all()
