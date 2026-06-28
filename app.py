from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib, numpy as np, pandas as pd, io

app = FastAPI(title="Mule Account Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Load model artifacts once at startup
model         = joblib.load("models/best_model.pkl")
scaler        = joblib.load("models/scaler.pkl")
feature_names = joblib.load("models/feature_names.pkl")
THRESHOLD     = 0.38

class AccountFeatures(BaseModel):
    features: dict

@app.get("/api/summary")
def summary():
    return {
        "total_accounts" : 9082,
        "fraud_flagged"  : 81,
        "auc_roc"        : 0.85,
        "auc_pr"         : 0.45,
        "threshold"      : THRESHOLD,
        "top_features"   : [
            {"feature": "F3898", "shap": 2.01},
            {"feature": "F3914", "shap": 0.53},
            {"feature": "F3908", "shap": 0.35},
            {"feature": "F2686", "shap": 0.35},
            {"feature": "F2956", "shap": 0.30},
            {"feature": "F162",  "shap": 0.28},
            {"feature": "F321",  "shap": 0.26},
            {"feature": "F3836", "shap": 0.25},
            {"feature": "F996",  "shap": 0.23},
        ]
    }

@app.post("/api/score")
def score_account(data: AccountFeatures):
    row = pd.DataFrame([data.features])
    for col in feature_names:
        if col not in row.columns:
            row[col] = 0
    row        = row[feature_names]
    scaled     = scaler.transform(row)
    risk_score = float(model.predict_proba(scaled)[0][1])
    alert      = risk_score >= THRESHOLD
    status     = "alert" if risk_score >= THRESHOLD else ("review" if risk_score >= 0.2 else "safe")
    return {
        "risk_score" : round(risk_score, 4),
        "alert"      : alert,
        "status"     : status,
        "threshold"  : THRESHOLD
    }

@app.post("/api/batch")
async def batch_score(file: UploadFile = File(...)):
    contents = await file.read()
    df       = pd.read_csv(io.StringIO(contents.decode()))
    results  = []
    for _, row in df.iterrows():
        row_df = pd.DataFrame([row.to_dict()])
        for col in feature_names:
            if col not in row_df.columns:
                row_df[col] = 0
        row_df     = row_df[feature_names]
        scaled     = scaler.transform(row_df)
        risk_score = float(model.predict_proba(scaled)[0][1])
        status     = "alert" if risk_score >= THRESHOLD else ("review" if risk_score >= 0.2 else "safe")
        results.append({
            "account"    : str(row.get("account_id", f"ACC-{len(results):04d}")),
            "risk_score" : round(risk_score, 4),
            "status"     : status
        })
    return {"total": len(results), "results": results}