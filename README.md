# ISL Football Intelligence
### Machine Learning Match Prediction & Advanced Football Analytics Platform

A production-grade sports analytics and predictive machine learning platform based on the MSc Applied Data Science research project at **SRM Institute of Science and Technology (SRMIST)**:

> **"Indian Super League Match Prediction Using Machine Learning"**  
> **Authors**: Jerein Sam Thomas, Gautham Ragunath, Adhith NJ  
> **Institution**: SRM Institute of Science and Technology, Kattankulathur, Tamil Nadu, India  
> **Publication**: *International Research Journal of Innovations in Engineering and Technology (IRJIET)*, Vol. 9, Issue 5, pp. 447–451, March 2026.

---

## 1. Project Overview

**ISL Football Intelligence** transforms raw Indian Super League (ISL) match data spanning 10 seasons (2015–16 to 2024–25, 1,100 matches, 70 feature variables) into an interactive, real-time sports intelligence platform.

The system addresses the core challenge of predicting football match outcomes (`Home Win`, `Draw`, `Away Win`) by enforcing a **strict zero-leakage pre-match feature engineering pipeline**. Unlike retrospective analyses that inadvertently use in-match statistics (in-game goals, corners, cards, possession), this system uses only variables available prior to kickoff.

---

## 2. Platform Architecture

```
                                  PRIMARY ISL DATASET
                             (1,100 Matches • 70 Variables)
                                           │
             ┌─────────────────────────────┼────────────────────────────┐
             ▼                             ▼                            ▼
      Opponent Analysis              Player Analysis            Tactical Analysis
   (Form, H2H, Goal Diff)       (Indian vs Foreign Squad)    (Formations, Pitch Shape)
             └─────────────────────────────┬────────────────────────────┘
                                           │
                                           ▼
                             DATA PREPROCESSING & AUDIT
                           (Missing Imputation, Encoding)
                                           │
                                           ▼
                        DIFFERENTIAL FEATURE ENGINEERING
                      (Market Value Diff, Rating Gap, Form)
                                           │
                                           ▼
                                MACHINE LEARNING SUITE
             ┌─────────────────────────────┼────────────────────────────┐
             ▼                             ▼                            ▼
    Logistic Regression              Random Forest              Gradient Boosting
    Decision Tree Classifier              KNN                        XGBoost
             └─────────────────────────────┬────────────────────────────┘
                                           │
                                           ▼
                                    MODEL EVALUATION
                        (Random 80:20 & Temporal Season Splits)
                                           │
                                           ▼
                              FASTAPI PREDICTION ENGINE
                                           │
                                           ▼
                            REACT + TYPESCRIPT DASHBOARD
                  (Interactive SVG Pitch, Probabilities, Factors)
```

---

## 3. Key Modules & Capabilities

1. **Match Predictor**: Select any two clubs, customize tactical formations, weather, turf quality, and referee strictness. Yields calibrated outcome probabilities (`Home Win %`, `Draw %`, `Away Win %`), confidence score, and qualitative factor explanations.
2. **Interactive Football Pitch**: Responsive SVG pitch rendering tactical formations (4-3-3, 4-2-3-1, 4-4-2, 3-5-2, 3-4-3, 5-3-2) with player role nodes and tactical geometry.
3. **Indian vs. Foreign Player Analytics**: 4-tab research dashboard exploring Attack (goals, big chances), Defence (clearances, tackles, interception rates), Creativity (ratings gap), and Market Valuation vs. performance.
4. **Data Integrity & Zero Fabrication Policy**: Explicitly distinguishes between verified aggregate squad metrics and unavailable individual roster entries.
5. **Team Analytics**: Club records, form streak badges (`W W D L W`), home vs. away differential, attribute radar profiles, and last 10 fixture histories.
6. **Head-to-Head Hub**: Historical records between any pair of clubs, win rates, goal totals, and previous encounter scorelines.
7. **Match Conditions & Referee Hub**: Empirical outcomes across weather types (Clear, Humid, Overcast, Rainy), pitch qualities (Good, Average, Poor), and officiating strictness tiers.
8. **Multi-Model Comparison**: Real-time evaluation table comparing 6 algorithms under both Stratified Random Split and Chronological Temporal Split.
9. **Data Explorer & Quality Dictionary**: Filterable 1,100-match table with CSV export and 70-column Data Dictionary.
10. **Research & System Architecture**: Interactive flowchart detailing each phase of the SRMIST research methodology.

---

## 4. Machine Learning Benchmarks

### Production Pre-Match Model Performance (Zero Data Leakage)
Target Outcome: 3-Class Categorical (`Home_Win`, `Draw`, `Away_Win`). Baseline random guess = 33.3%.

| Algorithm | Random 80:20 Accuracy | Temporal Split Accuracy | Precision (Macro) | Recall (Macro) | F1-Macro | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **K-Nearest Neighbors** | **43.64%** | 39.55% | 44.16% | 41.55% | 41.56% | Production Ready |
| **Logistic Regression** | 43.18% | 43.18% | 39.10% | 38.25% | 36.63% | Production Ready |
| **Random Forest** | 40.91% | **43.18%** | 36.87% | 33.44% | 26.66% | Production Ready |
| **XGBoost** | 36.82% | 40.00% | 32.63% | 32.82% | 31.67% | Baseline |
| **Decision Tree** | 36.82% | 38.64% | 33.65% | 34.57% | 32.26% | Baseline |
| **Gradient Boosting** | 38.64% | 34.09% | 34.93% | 34.77% | 33.73% | Baseline |

### Academic Clarification: Paper Reported vs. Production Pre-Match
The SRMIST paper initially reported high retrospective accuracy:
- Logistic Regression: 82.4%
- Random Forest: 79.8%
- Decision Tree: 74.3%
- KNN: 71.2%

*Methodological Finding:* When in-match statistics (e.g. final match score, shots, corner kicks, cards) are included, retrospective correlation reaches ~80%. When strictly pre-match predictors are used with temporal validation, the operational accuracy of 40%–44% against a 33.3% random baseline reflects statistically sound sports forecasting.

---

## 5. Installation & Setup

### Prerequisites
- Python 3.10+ (tested on Python 3.13)
- Node.js v18+ (tested on Node v24.18)
- npm v10+

### Step 1: Clone or Navigate to Directory
```bash
cd c:\Users\User\isl
```

### Step 2: Install Python Dependencies
```bash
pip install -r backend/requirements.txt
```

### Step 3: Run the 7 Standalone CLI Scripts (in sequence)
```bash
# 1. Validate dataset integrity & export data dictionary
python 01_validate_dataset.py

# 2. Generate temporal pre-match rolling features (zero leakage)
python 02_generate_prematch_features.py

# 3. Assemble training dataset with mathematical differentials
python 03_generate_training_dataset.py

# 4. Train 6 ML models across random and temporal splits
python 04_train_models.py

# 5. Evaluate models and output MODEL_EVALUATION_REPORT.md
python 05_evaluate_models.py

# 6. Verify serialization of all .pkl model binaries
python 06_save_models.py

# 7. Test end-to-end prediction pipeline on sample fixture
python 07_test_prediction.py
```

### Step 4: Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

---

## 6. Running the Full-Stack Application

### Start the FastAPI Backend
```bash
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```
Backend API will be accessible at: `http://127.0.0.1:8000`  
Interactive Swagger Docs: `http://127.0.0.1:8000/docs`

### Start the React Frontend
In a separate terminal:
```bash
cd frontend
npm run dev
```
Frontend web application will open at: `http://localhost:5173`

---

## 7. API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status and dataset stats |
| `GET` | `/api/predict/options` | Available teams, formations, weather, models |
| `POST` | `/api/predict` | Match prediction probabilities and factors |
| `GET` | `/api/teams` | All 12 club summaries, points, form streaks |
| `GET` | `/api/teams/{name}` | In-depth team profile and radar metrics |
| `GET` | `/api/players/coverage` | Transparent data availability disclosure |
| `GET` | `/api/players/indian-vs-foreign` | 4-tab Indian vs Foreign analytical data |
| `GET` | `/api/players/key-player-impact` | Win rates with key player absences |
| `GET` | `/api/matches` | Filterable and paginated match list |
| `GET` | `/api/matches/h2h/{t1}/{t2}` | Historical head-to-head record |
| `GET` | `/api/analytics/overview` | League KPIs, goals per season, outcomes |
| `GET` | `/api/analytics/tactics` | Formation usage and win rates |
| `GET` | `/api/analytics/weather-pitch` | Environmental condition analysis |
| `GET` | `/api/analytics/referees` | Disciplinary strictness tiers |
| `GET` | `/api/models/comparison` | Dual split model evaluation metrics |
| `GET` | `/api/models/feature-importance` | Top 25 feature importance weights |
| `POST` | `/api/models/train` | Retrain all ML models on demand |
| `GET` | `/api/dataset/dictionary` | 70-column Data Dictionary |
| `GET` | `/api/dataset/export` | Download full training dataset CSV |

---

## 8. Disclaimers

1. **Probabilistic Forecasts**: Predictions are statistical approximations and must not be considered guaranteed outcomes or financial betting advice.
2. **Performance Indicators**: Player fatigue and injury risk metrics represent football workload indices, not clinical diagnoses.
3. **Data Integrity**: All statistics are calculated from the verified 1,100 ISL match dataset. No synthetic player statistics or mock records are blended into production models.

---

## 9. Citation

```bibtex
@article{thomas2026isl,
  title={Indian Super League Match Prediction Using Machine Learning},
  author={Thomas, Jerein Sam and Ragunath, Gautham and NJ, Adhith},
  journal={International Research Journal of Innovations in Engineering and Technology (IRJIET)},
  volume={9},
  number={5},
  pages={447--451},
  year={2026},
  publisher={IRJIET}
}
```
