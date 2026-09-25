import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import pandas as pd
import numpy as np

app = FastAPI(
    title="FINRISK AI — Loan Default Prediction API",
    description="FastAPI Backend powered by an optimized Decision Tree Classifier",
    version="1.0.0"
)

# Enable CORS for local development and Render deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "decision_tree_model.joblib")
METRICS_PATH = os.path.join(BASE_DIR, "model_metrics.json")

pipeline = None
threshold = 0.62

def apply_feature_engineering(df_raw: pd.DataFrame) -> pd.DataFrame:
    """Applies domain feature engineering transformations to raw 16 input features."""
    df_feat = df_raw.copy()
    monthly_income = df_feat["Income"] / 12.0 + 1.0
    monthly_payment = df_feat["LoanAmount"] / np.maximum(df_feat["LoanTerm"], 1)
    
    df_feat["PaymentToIncome"] = monthly_payment / monthly_income
    df_feat["TotalEstimatedDTI"] = df_feat["DTIRatio"] + df_feat["PaymentToIncome"]
    df_feat["TotalInterest"] = df_feat["LoanAmount"] * (df_feat["InterestRate"] / 100.0) * (df_feat["LoanTerm"] / 12.0)
    df_feat["AnnualInterestToIncome"] = (df_feat["LoanAmount"] * (df_feat["InterestRate"] / 100.0)) / monthly_income
    df_feat["CreditRiskIndex"] = (850 - df_feat["CreditScore"]) * df_feat["InterestRate"]
    df_feat["EmpToAgeRatio"] = df_feat["MonthsEmployed"] / (df_feat["Age"] * 12.0 + 1.0)
    df_feat["LoanToIncome"] = df_feat["LoanAmount"] / monthly_income
    df_feat["LoanPerCreditLine"] = df_feat["LoanAmount"] / (df_feat["NumCreditLines"] + 1)
    return df_feat

def load_model_artifact():
    global pipeline, threshold
    try:
        if os.path.exists(MODEL_PATH):
            artifact = joblib.load(MODEL_PATH)
            if isinstance(artifact, dict) and "pipeline" in artifact:
                pipeline = artifact["pipeline"]
                threshold = artifact.get("threshold", 0.62)
            else:
                pipeline = artifact
            print(f"Successfully loaded Decision Tree model from {MODEL_PATH} (Optimal Threshold: {threshold})")
        else:
            print(f"Warning: Model file not found at {MODEL_PATH}")
    except Exception as e:
        print(f"Error loading model from {MODEL_PATH}: {e}")
        pipeline = None

load_model_artifact()

# Input Pydantic Schema
class LoanPredictionRequest(BaseModel):
    Age: int = Field(..., ge=18, le=100, description="Applicant age (18-100)")
    Income: float = Field(..., ge=0, description="Annual income in USD")
    LoanAmount: float = Field(..., gt=0, description="Requested loan amount in USD")
    CreditScore: int = Field(..., ge=300, le=850, description="Credit score (300-850)")
    MonthsEmployed: int = Field(..., ge=0, description="Months in current employment")
    NumCreditLines: int = Field(..., ge=0, description="Number of active credit lines")
    InterestRate: float = Field(..., ge=0, description="Annual interest rate in %")
    LoanTerm: int = Field(..., gt=0, description="Loan term in months")
    DTIRatio: float = Field(..., ge=0, le=1.0, description="Debt-to-income ratio (0.0 to 1.0)")
    Education: str = Field(..., description="Education level")
    EmploymentType: str = Field(..., description="Employment type")
    MaritalStatus: str = Field(..., description="Marital status")
    HasMortgage: str = Field(..., description="Has mortgage (Yes/No)")
    HasDependents: str = Field(..., description="Has dependents (Yes/No)")
    LoanPurpose: str = Field(..., description="Purpose of loan")
    HasCoSigner: str = Field(..., description="Has co-signer (Yes/No)")

@app.get("/")
def root():
    return {
        "status": "online",
        "system": "FINRISK AI — Loan Default Prediction System",
        "model": "Decision Tree Classifier",
        "docs": "/docs"
    }

@app.get("/health")
def health():
    if pipeline is None:
        load_model_artifact()
    return {
        "status": "healthy" if pipeline is not None else "degraded",
        "model_loaded": pipeline is not None,
        "model_type": "Decision Tree Classifier",
        "threshold": threshold,
        "version": "1.0.0"
    }

@app.get("/metrics")
@app.get("/model/metrics")
def get_metrics():
    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH, "r") as f:
            return json.load(f)
    raise HTTPException(status_code=404, detail="Model evaluation metrics file not found. Run optimize_tree.py first.")

@app.post("/predict")
def predict(request: LoanPredictionRequest):
    global pipeline, threshold
    if pipeline is None:
        load_model_artifact()
        if pipeline is None:
            raise HTTPException(status_code=500, detail="Decision Tree model is not loaded on server.")
    
    try:
        input_data = request.model_dump() if hasattr(request, "model_dump") else request.dict()
        df_input = pd.DataFrame([input_data])
        df_feat = apply_feature_engineering(df_input)
        
        probabilities = pipeline.predict_proba(df_feat)[0]
        prob_default = float(probabilities[1])
        prediction = 1 if prob_default >= threshold else 0
        result_label = "Default" if prediction == 1 else "No Default"
        
        return {
            "prediction": prediction,
            "result": result_label,
            "probability": prob_default,
            "threshold": threshold,
            "model_used": "Decision Tree Classifier",
            "risk_level": "High Risk" if prediction == 1 else "Low Risk"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
