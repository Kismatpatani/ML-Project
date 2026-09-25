import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import pandas as pd

app = FastAPI(title="Loan Default Prediction API")

# Configure CORS for both CRA (port 3000) and Vite (port 5173) development servers
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained Decision Tree Classifier pipeline
MODEL_PATH = os.path.join(os.path.dirname(__file__), "decision_tree_model.joblib")

try:
    model = joblib.load(MODEL_PATH)
    print(f"Loaded Decision Tree pipeline model from {MODEL_PATH}")
except Exception as e:
    print(f"Error loading model from {MODEL_PATH}: {e}")
    model = None

# Input Pydantic schema matching the 16 features exactly
class LoanPredictionRequest(BaseModel):
    Age: int = Field(..., ge=18, le=100, description="Applicant age in years")
    Income: float = Field(..., ge=0, description="Annual income")
    LoanAmount: float = Field(..., gt=0, description="Requested loan amount")
    CreditScore: int = Field(..., ge=300, le=850, description="Credit score between 300 and 850")
    MonthsEmployed: int = Field(..., ge=0, description="Months in current employment")
    NumCreditLines: int = Field(..., ge=0, description="Number of active credit lines")
    InterestRate: float = Field(..., ge=0, description="Annual interest rate in %")
    LoanTerm: int = Field(..., gt=0, description="Loan term in months")
    DTIRatio: float = Field(..., ge=0, le=1.0, description="Debt-to-income ratio")
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
        "system": "Loan Default Prediction System",
        "model": "Decision Tree Classifier"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None
    }

@app.post("/predict")
def predict(request: LoanPredictionRequest):
    if model is None:
        raise HTTPException(status_code=500, detail="Decision Tree model is not loaded on server.")

    try:
        # Convert request to single-row DataFrame with exact columns expected by ColumnTransformer
        input_data = {
            "Age": [request.Age],
            "Income": [request.Income],
            "LoanAmount": [request.LoanAmount],
            "CreditScore": [request.CreditScore],
            "MonthsEmployed": [request.MonthsEmployed],
            "NumCreditLines": [request.NumCreditLines],
            "InterestRate": [request.InterestRate],
            "LoanTerm": [request.LoanTerm],
            "DTIRatio": [request.DTIRatio],
            "Education": [request.Education],
            "EmploymentType": [request.EmploymentType],
            "MaritalStatus": [request.MaritalStatus],
            "HasMortgage": [request.HasMortgage],
            "HasDependents": [request.HasDependents],
            "LoanPurpose": [request.LoanPurpose],
            "HasCoSigner": [request.HasCoSigner]
        }
        df_input = pd.DataFrame(input_data)

        # Predict using the trained Decision Tree Pipeline
        prediction = int(model.predict(df_input)[0])
        result_label = "Default" if prediction == 1 else "No Default"

        response = {
            "prediction": prediction,
            "result": result_label,
            "model_used": "Decision Tree Classifier"
        }

        # If probability is supported by the model
        if hasattr(model, "predict_proba"):
            try:
                proba = model.predict_proba(df_input)[0]
                response["probability"] = float(proba[1])
            except Exception:
                pass

        return response

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
