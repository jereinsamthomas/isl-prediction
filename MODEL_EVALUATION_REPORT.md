# ISL Match Prediction - Model Evaluation Report

**Research Project**: Indian Super League Match Prediction Using Machine Learning  
**Institution**: SRM Institute of Science and Technology (SRMIST)  
**Authors**: Jerein Sam Thomas, Gautham Ragunath, Adhith NJ  
**Dataset**: 1,100 ISL matches (2015-16 to 2024-25), 12 teams, 70 columns  

---

## 1. Machine Learning Performance Summary

| Model | Random 80:20 Accuracy | Temporal Split Accuracy | SRMIST Paper Benchmark | F1-Macro (Random) | Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Logistic Regression | 43.18% | 43.18% | 82.4% | 36.63% | Production Ready |
| Random Forest | 40.91% | 43.18% | 79.8% | 26.66% | Production Ready |
| Decision Tree | 36.82% | 38.64% | 74.3% | 32.26% | Baseline |
| K-Nearest Neighbors | 43.64% | 39.55% | 71.2% | 41.56% | Production Ready |
| Gradient Boosting | 38.64% | 34.09% | N/A | 33.73% | Baseline |
| XGBoost | 36.82% | 40.00% | N/A | 31.67% | Baseline |

---

## 2. Methodology & Leakage Protection Audit

- **Outcome Leakage Prevention**: In-match statistics (in-game goals, shots, corner kicks, red/yellow cards, clearances during the match) are strictly excluded from the pre-match predictor set.
- **Rolling Form Calculation**: Recent form (last 5 & 10 matches) and Head-to-Head win rates are calculated strictly using matches played **prior** to kickoff date.
- **Dual Validation**: Evaluated using both Stratified Random Split (80:20) and Chronological Temporal Split (2015-2022 Train vs 2023-2025 Test).
- **Target Variable**: 3-Class Categorical (`Home_Win`, `Draw`, `Away_Win`).

---

## 3. Top Predictive Features (Random Forest)

| Rank | Feature | Importance | Relative % |
| :---: | :--- | :---: | :---: |
| 1 | `Overall_Rating_Difference` | 0.0251 | 2.51% |
| 2 | `Fatigue_Difference` | 0.0227 | 2.27% |
| 3 | `Indian_Rating_Difference` | 0.0220 | 2.2% |
| 4 | `Home_Indian_Player_Rating_Avg` | 0.0215 | 2.15% |
| 5 | `Home_Historical_Win_Rate` | 0.0192 | 1.92% |
| 6 | `Away_Foreign_Player_Rating_Avg` | 0.0192 | 1.92% |
| 7 | `Away_Set_Piece_Conversion_Pct` | 0.0186 | 1.86% |
| 8 | `Away_Venue_Win_Rate` | 0.0183 | 1.83% |
| 9 | `Chemistry_Difference` | 0.0183 | 1.83% |
| 10 | `Foreign_Rating_Difference` | 0.0180 | 1.8% |
| 11 | `Home_Venue_Win_Rate` | 0.0177 | 1.77% |
| 12 | `Foreign_Player_Ratio_Diff` | 0.0177 | 1.77% |
| 13 | `Days_Rest_Diff` | 0.0176 | 1.76% |
| 14 | `Away_Team_Chemistry_Score` | 0.0174 | 1.74% |
| 15 | `Historical_Win_Rate_Diff` | 0.0173 | 1.73% |
