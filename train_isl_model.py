"""
ISL Match Prediction - Model Training Script
==============================================
Reproduces Phases 2-4 of the paper's methodology:
  Phase 2: Preprocessing (encoding, Min-Max scaling, 80:20 split)
  Phase 3: Feature selection (pre-match features only, to avoid leakage)
  Phase 4: Model training & comparison (Logistic Regression, Random Forest,
           Decision Tree, K-Nearest Neighbors)

Usage:
    python3 train_isl_model.py

Requires: pandas, numpy, scikit-learn
Input file: ISL_Match_Prediction_Dataset.xlsx (sheet "Match_Dataset")
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

INPUT_FILE = "ISL_Match_Prediction_Dataset.xlsx"

# ---------------------------------------------------------------------------
# 1. Load data
# ---------------------------------------------------------------------------
df = pd.read_excel(INPUT_FILE, sheet_name="Match_Dataset", header=1)

# ---------------------------------------------------------------------------
# 2. Feature selection - PRE-MATCH features only
#    (excludes goals, shots, possession, cards, corners, clearances,
#     big chances, interceptions -- these are recorded DURING the match
#     and would leak the outcome if used as predictors)
# ---------------------------------------------------------------------------
pre_match_features = [
    "Season", "Home_Team", "Away_Team", "Venue_City",
    "Home_Formation", "Away_Formation",
    "Home_Indian_Player_Rating_Avg", "Home_Foreign_Player_Rating_Avg",
    "Away_Indian_Player_Rating_Avg", "Away_Foreign_Player_Rating_Avg",
    "Home_Squad_Market_Value_Cr", "Home_Foreign_Player_Market_Value_Cr",
    "Away_Squad_Market_Value_Cr", "Away_Foreign_Player_Market_Value_Cr",
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
target_col = "Match_Result"

model_df = df[pre_match_features + [target_col]].copy()

# ---------------------------------------------------------------------------
# 3. Preprocessing: Label Encoding (categorical) + Min-Max scaling (numeric)
# ---------------------------------------------------------------------------
categorical_cols = [
    "Season", "Home_Team", "Away_Team", "Venue_City", "Home_Formation",
    "Away_Formation", "Weather_Condition", "Pitch_Condition",
    "Match_Condition", "Key_Player_Missing_Side",
]

for col in categorical_cols:
    model_df[col] = LabelEncoder().fit_transform(model_df[col])

target_le = LabelEncoder()
model_df[target_col] = target_le.fit_transform(model_df[target_col])

feature_cols = [c for c in model_df.columns if c != target_col]
X = model_df[feature_cols]
y = model_df[target_col]

X_scaled = pd.DataFrame(MinMaxScaler().fit_transform(X), columns=feature_cols)

# ---------------------------------------------------------------------------
# 4. Train/Test split (80:20, stratified)
# ---------------------------------------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.20, random_state=42, stratify=y
)

# ---------------------------------------------------------------------------
# 5. Train & compare models
# ---------------------------------------------------------------------------
models = {
    "Logistic Regression": LogisticRegression(max_iter=2000),
    "Random Forest": RandomForestClassifier(n_estimators=200, random_state=42),
    "Decision Tree": DecisionTreeClassifier(max_depth=6, random_state=42),
    "K-Nearest Neighbors": KNeighborsClassifier(n_neighbors=9),
}

results = []
best_name, best_acc, best_model, best_pred = None, -1, None, None
for name, model in models.items():
    model.fit(X_train, y_train)
    pred = model.predict(X_test)
    acc = accuracy_score(y_test, pred)
    results.append((name, round(acc * 100, 2)))
    if acc > best_acc:
        best_acc, best_name, best_model, best_pred = acc, name, model, pred

print("Model Comparison (pre-match features only):")
for name, acc in results:
    print(f"  {name}: {acc}%")

print(f"\nBest model: {best_name} ({round(best_acc * 100, 2)}%)")
print("\nClassification Report:")
print(classification_report(y_test, best_pred, target_names=target_le.classes_))
print("Confusion Matrix (rows=actual, cols=predicted):", list(target_le.classes_))
print(confusion_matrix(y_test, best_pred))

# ---------------------------------------------------------------------------
# 6. Feature importance (Random Forest) - proxy for the paper's RFE step
# ---------------------------------------------------------------------------
rf = models["Random Forest"]
importances = pd.Series(rf.feature_importances_, index=feature_cols).sort_values(ascending=False)
print("\nTop 10 pre-match predictors:")
print(importances.head(10))
