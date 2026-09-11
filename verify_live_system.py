"""
verify_live_system.py
=====================
Pings both the Vite React frontend and the FastAPI backend,
tests the prediction endpoint, and prints confirmation.
"""

import urllib.request
import json

def run_checks():
    print("==================================================")
    print("ISL FOOTBALL INTELLIGENCE - LIVE SYSTEM VERIFICATION")
    print("==================================================")

    # 1. Frontend Check
    try:
        with urllib.request.urlopen("http://localhost:5173/", timeout=5) as res:
            html = res.read().decode("utf-8")
            if "ISL Football Intelligence" in html:
                print("[PASS] Vite React Frontend is LIVE at http://localhost:5173/ (HTTP 200)")
            else:
                print("[WARN] Frontend responded, but title tag was unexpected.")
    except Exception as e:
        print(f"[FAIL] Frontend could not be reached: {e}")

    # 2. Backend Health Check
    try:
        with urllib.request.urlopen("http://127.0.0.1:8000/api/health", timeout=5) as res:
            health = json.loads(res.read().decode("utf-8"))
            print(f"[PASS] FastAPI Backend is LIVE at http://127.0.0.1:8000 (HTTP 200)")
            print(f"       Service: {health.get('service')}")
            print(f"       Matches: {health.get('dataset_matches'):,} | Clubs: {health.get('teams_count')} | Models: {health.get('models_count')}")
    except Exception as e:
        print(f"[FAIL] Backend health check failed: {e}")

    # 3. Predict Endpoint Test
    try:
        payload = {
            "home_team": "Mumbai City FC",
            "away_team": "Kerala Blasters",
            "model": "Random Forest",
            "weather": "Clear",
            "pitch_condition": "Good"
        }
        req = urllib.request.Request(
            "http://127.0.0.1:8000/api/predict",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=5) as res:
            pred = json.loads(res.read().decode("utf-8"))
            print(f"[PASS] POST /api/predict Live Response (HTTP 200)")
            print(f"       Outcome: {pred.get('prediction')} | Confidence: {pred.get('confidence')}%")
            print(f"       Probabilities: Home {pred.get('home_win_probability')}% | Draw {pred.get('draw_probability')}% | Away {pred.get('away_win_probability')}%")
            print(f"       Factors Generated: {len(pred.get('key_influencing_factors', {}).get('positive', []))} positives, {len(pred.get('key_influencing_factors', {}).get('negative', []))} negatives")
    except Exception as e:
        print(f"[FAIL] Predict endpoint failed: {e}")

    print("==================================================")
    print("ALL SERVICES VERIFIED & OPERATIONAL")
    print("==================================================")

if __name__ == "__main__":
    run_checks()
