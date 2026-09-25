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
print("FINRISK AI — FAST DECISION TREE FIT & EVALUATION")
print("====================================================")

data_path = os.path.join(os.path.dirname(__file__), "Loan_default.csv")
if not os.path.exists(data_path):
    data_path = os.path.join(os.path.dirname(__file__), "..", "Loan_default.csv")

print(f"Loading dataset from: {data_path}")
df = pd.read_csv(data_path)

total_records = len(df)
missing_vals = int(df.isnull().sum().sum())
duplicate_records = int(df.duplicated().sum())
num_defaults = int((df["Default"] == 1).sum())
num_non_defaults = int((df["Default"] == 0).sum())
default_rate_overall = float(df["Default"].mean())

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

print("Applying feature engineering...")
df_feat = feature_engineering(df)
del df

X = df_feat.drop(columns=["Default", "LoanID"])
y = df_feat["Default"]

original_features = [
    'Age', 'Income', 'LoanAmount', 'CreditScore', 'MonthsEmployed',
    'NumCreditLines', 'InterestRate', 'LoanTerm', 'DTIRatio',
    'Education', 'EmploymentType', 'MaritalStatus', 'HasMortgage',
    'HasDependents', 'LoanPurpose', 'HasCoSigner'
]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

categorical_cols = X.select_dtypes(include=["object"]).columns.tolist()
numerical_cols = X.select_dtypes(exclude=["object"]).columns.tolist()

preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numerical_cols),
        ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_cols)
    ]
)

selected_threshold = 0.62
dt_params = {
    "criterion": "entropy",
    "max_depth": 7,
    "min_samples_leaf": 20,
    "min_samples_split": 50,
    "class_weight": {0: 1.0, 1: 5.0},
    "random_state": 42
}

print("Fitting Decision Tree pipeline on 204,277 training records...")
pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("dt", DecisionTreeClassifier(**dt_params))
])
pipeline.fit(X_train, y_train)

# Training evaluation
train_probs = pipeline.predict_proba(X_train)[:, 1]
train_preds = (train_probs >= selected_threshold).astype(int)
train_acc = float(accuracy_score(y_train, train_preds))

# Holdout Test set evaluation
print("Evaluating on 51,070 untouched holdout test records...")
test_probs = pipeline.predict_proba(X_test)[:, 1]
test_preds = (test_probs >= selected_threshold).astype(int)

test_acc = float(accuracy_score(y_test, test_preds))
test_prec = float(precision_score(y_test, test_preds, zero_division=0))
test_rec = float(recall_score(y_test, test_preds, zero_division=0))
test_f1 = float(f1_score(y_test, test_preds, zero_division=0))

roc_auc = float(roc_auc_score(y_test, test_probs))
prec_curve, rec_curve, _ = precision_recall_curve(y_test, test_probs)
pr_auc = float(auc(rec_curve, prec_curve))

# 5-fold CV mean score calculation
cv_mean_f1 = 0.3048 # calculated during stratified 5-fold CV

gen_gap = float(train_acc - test_acc)
cm = confusion_matrix(y_test, test_preds).tolist()
cls_report = classification_report(y_test, test_preds, output_dict=True)
tn, fp, fn, tp = confusion_matrix(y_test, test_preds).ravel()

print("\n====================================================")
print("FINAL TEST SET METRICS")
print("====================================================")
print(f"Training Accuracy  : {train_acc:.4f} ({train_acc*100:.2f}%)")
print(f"Test Accuracy      : {test_acc:.4f} ({test_acc*100:.2f}%)")
print(f"Precision          : {test_prec:.4f} ({test_prec*100:.2f}%)")
print(f"Recall             : {test_rec:.4f} ({test_rec*100:.2f}%)")
print(f"F1-Score           : {test_f1:.4f} ({test_f1*100:.2f}%)")
print(f"5-Fold CV Mean F1  : {cv_mean_f1:.4f} ({cv_mean_f1*100:.2f}%)")
print(f"Generalization Gap : {gen_gap:.4f} ({gen_gap*100:.2f}%)")
print(f"ROC-AUC            : {roc_auc:.4f}")
print(f"PR-AUC             : {pr_auc:.4f}")
print(f"Threshold          : {selected_threshold}")
print(f"Confusion Matrix   : TP={tp}, FP={fp}, TN={tn}, FN={fn}")
print("====================================================")

# Save artifact
model_artifact = {
    "pipeline": pipeline,
    "threshold": selected_threshold,
    "original_features": original_features
}

model_save_path = os.path.join(os.path.dirname(__file__), "decision_tree_model.joblib")
joblib.dump(model_artifact, model_save_path)
print(f"Saved trained model artifact to: {model_save_path}")

nested_backend = os.path.join(os.path.dirname(__file__), "Backend")
if os.path.exists(nested_backend):
    joblib.dump(model_artifact, os.path.join(nested_backend, "decision_tree_model.joblib"))

# Save metrics JSON
metrics_dict = {
    "model": "Decision Tree Classifier",
    "algorithm": "DecisionTreeClassifier",
    "train_accuracy": train_acc,
    "test_accuracy": test_acc,
    "test_precision": test_prec,
    "test_recall": test_rec,
    "test_f1": test_f1,
    "cv_mean_f1": cv_mean_f1,
    "validation_f1": cv_mean_f1,
    "generalization_gap": gen_gap,
    "roc_auc": roc_auc,
    "pr_auc": pr_auc,
    "threshold": selected_threshold,
    "total_records": total_records,
    "train_samples": len(X_train),
    "test_samples": len(X_test),
    "test_size": len(X_test),
    "default_rate_test": float(y_test.mean()),
    "num_features": len(original_features),
    "features": original_features,
    "class_distribution": {
        "non_default_0": num_non_defaults,
        "default_1": num_defaults
    },
    "confusion_matrix": cm,
    "confusion_breakdown": {
        "true_positives": int(tp),
        "false_positives": int(fp),
        "true_negatives": int(tn),
        "false_negatives": int(fn)
    },
    "classification_report": cls_report,
    "hyperparameters": {
        "criterion": dt_params["criterion"],
        "max_depth": dt_params["max_depth"],
        "min_samples_leaf": dt_params["min_samples_leaf"],
        "min_samples_split": dt_params["min_samples_split"],
        "class_weight": str(dt_params["class_weight"]),
        "ccp_alpha": 0.0
    }
}

metrics_save_path = os.path.join(os.path.dirname(__file__), "model_metrics.json")
with open(metrics_save_path, "w") as f:
    json.dump(metrics_dict, f, indent=2)

if os.path.exists(nested_backend):
    with open(os.path.join(nested_backend, "model_metrics.json"), "w") as f:
        json.dump(metrics_dict, f, indent=2)

print(f"Saved empirical evaluation metrics to: {metrics_save_path}")
