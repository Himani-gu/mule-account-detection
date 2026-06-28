import pandas as pd
import joblib
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from config import MODEL_PATH, SCALER_PATH, ALERT_THRESHOLD

def generate_risk_scores(df_input):
    model  = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)

    X_scaled = scaler.transform(df_input)
    risk_scores = model.predict_proba(X_scaled)[:, 1]

    df_output = df_input.copy()
    df_output["risk_score"] = risk_scores
    df_output["alert"]      = df_output["risk_score"] >= ALERT_THRESHOLD

    print(f"Total accounts scored : {len(df_output)}")
    print(f"Alerts generated      : {df_output['alert'].sum()}")
    return df_output