import pandas as pd
import numpy as np
import os
import json
import joblib
from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, precision_recall_curve, confusion_matrix, classification_report, auc
)

print("====================================================")
print("FINRISK AI — RECALL & F1 TARGETED TREE OPTIMIZATION")
print("====================================================")

data_path = os.path.join(os.path.dirname(__file__), "Loan_default.csv")
if not os.path.exists(data_path):
    data_path = os.path.join(os.path.dirname(__file__), "..", "Loan_default.csv")

print(f"1. Loading dataset from: {data_path}")
df = pd.read_csv(data_path)

total_records = len(df)
missing_vals = int(df.isnull().sum().sum())
duplicate_records = int(df.duplicated().sum())

# Feature engineering
def feature_engineering(data):
    df_feat = data.copy()
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

print("2. Applying feature transformations...")
df_feat = feature_engineering(df)

X = df_feat.drop(columns=["Default", "LoanID"])
y = df_feat["Default"]

original_features = [
    'Age', 'Income', 'LoanAmount', 'CreditScore', 'MonthsEmployed',
    'NumCreditLines', 'InterestRate', 'LoanTerm', 'DTIRatio',
    'Education', 'EmploymentType', 'MaritalStatus', 'HasMortgage',
    'HasDependents', 'LoanPurpose', 'HasCoSigner'
]

# 80/20 Stratified Split for Untouched Test Set
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

# Further 75/25 split of X_train into Train (60% total) & Validation (20% total)
X_tr, X_val, y_tr, y_val = train_test_split(
    X_train, y_train, test_size=0.25, random_state=42, stratify=y_train
)

categorical_cols = X.select_dtypes(include=["object"]).columns.tolist()
numerical_cols = X.select_dtypes(exclude=["object"]).columns.tolist()

preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numerical_cols),
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols)
    ]
)

print("\n3. Testing Models for High Recall (>=70%) & Max F1...")

# We will test multiple objectives:
# Objective A: Max F1
# Objective B: High Recall (>= 60-70%) with max Accuracy/F1
results = []

for depth in [6, 7, 8, 9, 10, 11, 12]:
    for min_leaf in [20, 50, 100, 200]:
        for min_split in [50, 100, 300]:
            for cw in [{0: 1.0, 1: 3.5}, {0: 1.0, 1: 5.0}, {0: 1.0, 1: 7.5}, {0: 1.0, 1: 10.0}, "balanced"]:
                clf = Pipeline([
                    ("preprocessor", preprocessor),
                    ("dt", DecisionTreeClassifier(
                        criterion="entropy",
                        max_depth=depth,
                        min_samples_leaf=min_leaf,
                        min_samples_split=min_split,
                        class_weight=cw,
                        random_state=42
                    ))
                ])
                clf.fit(X_tr, y_tr)
                val_probs = clf.predict_proba(X_val)[:, 1]
                
                for th in np.linspace(0.15, 0.75, 61):
                    preds = (val_probs >= th).astype(int)
                    acc = accuracy_score(y_val, preds)
                    prec = precision_score(y_val, preds, zero_division=0)
                    rec = recall_score(y_val, preds, zero_division=0)
                    f1 = f1_score(y_val, preds, zero_division=0)
                    
                    results.append({
                        "depth": depth,
                        "min_leaf": min_leaf,
                        "min_split": min_split,
                        "class_weight": cw,
                        "threshold": th,
                        "val_acc": acc,
                        "val_prec": prec,
                        "val_rec": rec,
                        "val_f1": f1
                    })

res_df = pd.DataFrame(results)

print("\n--- TOP CONFIGURATION FOR MAXIMUM F1 ---")
best_f1_row = res_df.sort_values(by="val_f1", ascending=False).iloc[0]
print(best_f1_row.to_dict())

print("\n--- TOP CONFIGURATION FOR HIGH RECALL (>= 65%) WITH MAX ACCURACY ---")
high_rec_candidates = res_df[res_df["val_rec"] >= 0.65]
if len(high_rec_candidates) > 0:
    best_high_rec_row = high_rec_candidates.sort_values(by="val_f1", ascending=False).iloc[0]
    print(best_high_rec_row.to_dict())
else:
    print("No configuration reached 65% recall.")

print("\n--- TOP CONFIGURATION FOR HIGH RECALL (>= 60%) WITH MAX ACCURACY ---")
high_rec60 = res_df[res_df["val_rec"] >= 0.60]
if len(high_rec60) > 0:
    best_high_rec60 = high_rec60.sort_values(by="val_f1", ascending=False).iloc[0]
    print(best_high_rec60.to_dict())

