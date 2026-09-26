import pandas as pd
import numpy as np
import time
import os
import json
import gc
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
print("FINRISK AI — DECISION TREE MODEL OPTIMIZATION")
print("====================================================")

# 1. Dataset Loading & Inspection
data_path = os.path.join(os.path.dirname(__file__), "Loan_default.csv")
if not os.path.exists(data_path):
    data_path = os.path.join(os.path.dirname(__file__), "..", "Loan_default.csv")

print(f"1. Loading dataset from: {data_path}")
df = pd.read_csv(data_path)

total_records = len(df)
missing_vals = int(df.isnull().sum().sum())
duplicate_records = int(df.duplicated().sum())
num_defaults = int((df["Default"] == 1).sum())
num_non_defaults = int((df["Default"] == 0).sum())
default_rate_overall = float(df["Default"].mean())

print(f"   Total Records       : {total_records}")
print(f"   Missing Values      : {missing_vals}")
print(f"   Duplicate Records   : {duplicate_records}")
print(f"   Class 0 (Non-Default): {num_non_defaults} ({100*(1-default_rate_overall):.2f}%)")
print(f"   Class 1 (Default)    : {num_defaults} ({100*default_rate_overall:.2f}%)")

# 2. Feature Engineering
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

print("2. Applying financial domain feature transformations...")
df_feat = feature_engineering(df)
del df
gc.collect()

X = df_feat.drop(columns=["Default", "LoanID"])
y = df_feat["Default"]

original_features = [
    'Age', 'Income', 'LoanAmount', 'CreditScore', 'MonthsEmployed',
    'NumCreditLines', 'InterestRate', 'LoanTerm', 'DTIRatio',
    'Education', 'EmploymentType', 'MaritalStatus', 'HasMortgage',
    'HasDependents', 'LoanPurpose', 'HasCoSigner'
]

# 3. Stratified Train/Test Split (80/20)
print("3. Performing reproducible Stratified 80/20 Train/Test split...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

print(f"   Training Partition: {len(X_train)} records (Default Rate: {y_train.mean():.2%})")
print(f"   Untouched Test Set: {len(X_test)} records (Default Rate: {y_test.mean():.2%})")

# 4. Preprocessing Setup
categorical_cols = X.select_dtypes(include=["object"]).columns.tolist()
numerical_cols = X.select_dtypes(exclude=["object"]).columns.tolist()

preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numerical_cols),
        ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_cols)
    ]
)

# Split X_train into Train (75% of X_train) and Validation (25% of X_train) for hyperparameter selection
X_tr, X_val, y_tr, y_val = train_test_split(
    X_train, y_train, test_size=0.25, random_state=42, stratify=y_train
)

print("4. Pre-transforming feature matrices for fast search...")
X_tr_proc = preprocessor.fit_transform(X_tr)
X_val_proc = preprocessor.transform(X_val)

# 5. Hyperparameter & Decision Threshold Search
print("\n5. Running Hyperparameter & Threshold Optimization...")

best_cv_f1 = -1
best_params = None
best_thresh = 0.5

param_candidates = []
for depth in [6, 7, 8, 9]:
    for min_leaf in [20, 50, 100]:
        for min_split in [50, 100]:
            for cw in [{0: 1.0, 1: 3.5}, {0: 1.0, 1: 5.0}, "balanced"]:
                param_candidates.append({
                    "criterion": "entropy",
                    "max_depth": depth,
                    "min_samples_leaf": min_leaf,
                    "min_samples_split": min_split,
                    "class_weight": cw,
                    "ccp_alpha": 0.0,
                    "random_state": 42
                })

print(f"   Total parameter combinations to evaluate: {len(param_candidates)}")

for idx, params in enumerate(param_candidates):
    clf = DecisionTreeClassifier(**params)
    clf.fit(X_tr_proc, y_tr)
    val_probs = clf.predict_proba(X_val_proc)[:, 1]
    
    # Threshold search
    for th in np.linspace(0.20, 0.80, 61):
        preds = (val_probs >= th).astype(int)
        f1 = f1_score(y_val, preds, zero_division=0)
        
        if f1 > best_cv_f1:
            best_cv_f1 = f1
            best_params = params
            best_thresh = float(th)

print("\n6. OPTIMAL HYPERPARAMETERS & THRESHOLD SELECTED:")
print(f"   Criterion         : {best_params['criterion']}")
print(f"   Max Depth         : {best_params['max_depth']}")
print(f"   Min Samples Leaf  : {best_params['min_samples_leaf']}")
print(f"   Min Samples Split : {best_params['min_samples_split']}")
print(f"   Class Weight      : {best_params['class_weight']}")
print(f"   Optimal Threshold : {best_thresh:.3f}")
print(f"   Validation F1     : {best_cv_f1:.4f}")

# 7. 5-Fold Stratified Cross-Validation on Full Training Set
print("\n7. Performing 5-Fold Stratified Cross-Validation on Training Dataset...")
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_f1_scores = []
cv_rec_scores = []
cv_prec_scores = []
cv_acc_scores = []

for fold, (train_idx, val_idx) in enumerate(skf.split(X_train, y_train), 1):
    X_fold_tr, y_fold_tr = X_train.iloc[train_idx], y_train.iloc[train_idx]
    X_fold_val, y_fold_val = X_train.iloc[val_idx], y_train.iloc[val_idx]
    
    fold_prep = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numerical_cols),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_cols)
        ]
    )
    X_f_tr = fold_prep.fit_transform(X_fold_tr)
    X_f_val = fold_prep.transform(X_fold_val)
    
    fold_clf = DecisionTreeClassifier(**best_params)
    fold_clf.fit(X_f_tr, y_fold_tr)
    
    val_probs = fold_clf.predict_proba(X_f_val)[:, 1]
    val_preds = (val_probs >= best_thresh).astype(int)
    
    f1_fold = f1_score(y_fold_val, val_preds, zero_division=0)
    rec_fold = recall_score(y_fold_val, val_preds, zero_division=0)
    prec_fold = precision_score(y_fold_val, val_preds, zero_division=0)
    acc_fold = accuracy_score(y_fold_val, val_preds)
    
    cv_f1_scores.append(f1_fold)
    cv_rec_scores.append(rec_fold)
    cv_prec_scores.append(prec_fold)
    cv_acc_scores.append(acc_fold)
    print(f"   Fold {fold}: Acc={acc_fold:.4f} | Prec={prec_fold:.4f} | Rec={rec_fold:.4f} | F1={f1_fold:.4f}")

cv_mean_f1 = float(np.mean(cv_f1_scores))
cv_mean_rec = float(np.mean(cv_rec_scores))
cv_mean_prec = float(np.mean(cv_prec_scores))
cv_mean_acc = float(np.mean(cv_acc_scores))

print(f"\n   5-Fold CV Mean F1: {cv_mean_f1:.4f} (Mean Recall: {cv_mean_rec:.4f}, Mean Precision: {cv_mean_prec:.4f})")

# 8. Train Final Model on 100% of Training Data (204,277 samples)
print("\n8. Fitting final Decision Tree pipeline on complete training set (204,277 records)...")
final_preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numerical_cols),
        ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_cols)
    ]
)

final_pipeline = Pipeline([
    ("preprocessor", final_preprocessor),
    ("dt", DecisionTreeClassifier(**best_params))
])
final_pipeline.fit(X_train, y_train)

# Training Performance Evaluation
train_probs = final_pipeline.predict_proba(X_train)[:, 1]
train_preds = (train_probs >= best_thresh).astype(int)
train_acc = float(accuracy_score(y_train, train_preds))

# 9. Evaluation ONLY ONCE on Untouched Holdout Test Set (51,070 samples)
print("\n9. Evaluating model performance on Untouched Holdout Test Set (51,070 records)...")
test_probs = final_pipeline.predict_proba(X_test)[:, 1]
test_preds = (test_probs >= best_thresh).astype(int)

test_acc = float(accuracy_score(y_test, test_preds))
test_prec = float(precision_score(y_test, test_preds, zero_division=0))
test_rec = float(recall_score(y_test, test_preds, zero_division=0))
test_f1 = float(f1_score(y_test, test_preds, zero_division=0))

roc_auc = float(roc_auc_score(y_test, test_probs))
prec_curve, rec_curve, _ = precision_recall_curve(y_test, test_probs)
pr_auc = float(auc(rec_curve, prec_curve))

gen_gap = float(train_acc - test_acc)
cm = confusion_matrix(y_test, test_preds).tolist()
cls_report = classification_report(y_test, test_preds, output_dict=True)

tn, fp, fn, tp = confusion_matrix(y_test, test_preds).ravel()

print("\n====================================================")
print("FINAL UNTOUCHED TEST SET EVALUATION RESULTS")
print("====================================================")
print(f"Algorithm            : DecisionTreeClassifier")
print(f"Training Accuracy    : {train_acc:.4f} ({train_acc*100:.2f}%)")
print(f"Test Accuracy        : {test_acc:.4f} ({test_acc*100:.2f}%)")
print(f"Precision            : {test_prec:.4f} ({test_prec*100:.2f}%)")
print(f"Recall               : {test_rec:.4f} ({test_rec*100:.2f}%)")
print(f"F1-Score             : {test_f1:.4f} ({test_f1*100:.2f}%)")
print(f"5-Fold CV Mean F1    : {cv_mean_f1:.4f} ({cv_mean_f1*100:.2f}%)")
print(f"Generalization Gap   : {gen_gap:.4f} ({gen_gap*100:.2f}%)")
print(f"ROC-AUC              : {roc_auc:.4f}")
print(f"PR-AUC               : {pr_auc:.4f}")
print(f"Decision Threshold   : {best_thresh:.3f}")
print(f"Confusion Matrix     : TP={tp}, FP={fp}, TN={tn}, FN={fn}")
print("====================================================")

# 10. Save Trained Model Pipeline Artifact
model_artifact = {
    "pipeline": final_pipeline,
    "threshold": best_thresh,
    "original_features": original_features
}

model_save_path = os.path.join(os.path.dirname(__file__), "decision_tree_model.joblib")
joblib.dump(model_artifact, model_save_path)
print(f"\nSaved trained Decision Tree model artifact to: {model_save_path}")

nested_backend = os.path.join(os.path.dirname(__file__), "Backend")
if os.path.exists(nested_backend):
    joblib.dump(model_artifact, os.path.join(nested_backend, "decision_tree_model.joblib"))

# 11. Save Metrics JSON
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
    "threshold": best_thresh,
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
        "criterion": best_params["criterion"],
        "max_depth": best_params["max_depth"],
        "min_samples_leaf": best_params["min_samples_leaf"],
        "min_samples_split": best_params["min_samples_split"],
        "class_weight": str(best_params["class_weight"]),
        "ccp_alpha": best_params["ccp_alpha"]
    }
}

metrics_save_path = os.path.join(os.path.dirname(__file__), "model_metrics.json")
with open(metrics_save_path, "w") as f:
    json.dump(metrics_dict, f, indent=2)

print(f"Saved empirical evaluation metrics to: {metrics_save_path}")

if os.path.exists(nested_backend):
    with open(os.path.join(nested_backend, "model_metrics.json"), "w") as f:
        json.dump(metrics_dict, f, indent=2)

# Update train_and_save.py for full reproducibility
with open(os.path.join(os.path.dirname(__file__), "train_and_save.py"), "w") as f:
    with open(__file__, "r") as src:
        f.write(src.read())

print("Updated train_and_save.py with reproducible final pipeline.")
