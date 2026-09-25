import pandas as pd
import numpy as np
import time
from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, precision_recall_curve, confusion_matrix, classification_report
)

print("Loading dataset...")
df = pd.read_csv("Backend/Loan_default.csv")
print(f"Dataset shape: {df.shape}")

# Feature Engineering function
def add_features(data):
    df_feat = data.copy()
    monthly_income = df_feat["Income"] / 12.0 + 1e-5
    monthly_payment = df_feat["LoanAmount"] / df_feat["LoanTerm"]
    df_feat["PaymentToIncome"] = monthly_payment / monthly_income
    df_feat["TotalInterestEstimate"] = df_feat["LoanAmount"] * (df_feat["InterestRate"] / 100.0)
    df_feat["InterestDTIRisk"] = df_feat["InterestRate"] * df_feat["DTIRatio"]
    df_feat["EmploymentRatio"] = df_feat["MonthsEmployed"] / (df_feat["Age"] * 12.0 + 1e-5)
    df_feat["LoanPerCreditLine"] = df_feat["LoanAmount"] / (df_feat["NumCreditLines"] + 1)
    return df_feat

df_feat = add_features(df)
X = df_feat.drop(columns=["Default", "LoanID"])
y = df_feat["Default"]

# 80/20 train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

# Split X_train into X_tr and X_val for validation/threshold tuning
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

print("\n--- 1. Majority Class Baseline ---")
maj_pred = np.zeros_like(y_val)
print(f"Val Acc: {accuracy_score(y_val, maj_pred):.4f} | Prec: {precision_score(y_val, maj_pred, zero_division=0):.4f} | Rec: {recall_score(y_val, maj_pred):.4f} | F1: {f1_score(y_val, maj_pred, zero_division=0):.4f}")

print("\n--- 2. Default Unpruned DecisionTree ---")
clf1 = Pipeline([
    ("preprocessor", preprocessor),
    ("dt", DecisionTreeClassifier(random_state=42))
])
clf1.fit(X_tr, y_tr)
y_pred1 = clf1.predict(X_val)
print(f"Val Acc: {accuracy_score(y_val, y_pred1):.4f} | Prec: {precision_score(y_val, y_pred1):.4f} | Rec: {recall_score(y_val, y_pred1):.4f} | F1: {f1_score(y_val, y_pred1):.4f}")

print("\n--- 3. Hyperparameter Tuning & Threshold Search ---")
best_overall = None
best_val_f1 = -1

for criterion in ["gini", "entropy"]:
    for depth in [6, 8, 10, 12, 15]:
        for min_leaf in [10, 50, 100]:
            for class_weight in [None, "balanced", {0: 1.0, 1: 3.0}, {0: 1.0, 1: 4.5}]:
                clf = Pipeline([
                    ("preprocessor", preprocessor),
                    ("dt", DecisionTreeClassifier(
                        criterion=criterion,
                        max_depth=depth,
                        min_samples_leaf=min_leaf,
                        class_weight=class_weight,
                        random_state=42
                    ))
                ])
                clf.fit(X_tr, y_tr)
                y_proba = clf.predict_proba(X_val)[:, 1]
                
                # Search best threshold
                for th in np.linspace(0.2, 0.85, 27):
                    pred_th = (y_proba >= th).astype(int)
                    f1 = f1_score(y_val, pred_th, zero_division=0)
                    if f1 > best_val_f1:
                        acc = accuracy_score(y_val, pred_th)
                        prec = precision_score(y_val, pred_th, zero_division=0)
                        rec = recall_score(y_val, pred_th, zero_division=0)
                        best_val_f1 = f1
                        best_overall = {
                            "criterion": criterion,
                            "depth": depth,
                            "min_leaf": min_leaf,
                            "class_weight": class_weight,
                            "threshold": th,
                            "val_acc": acc,
                            "val_prec": prec,
                            "val_rec": rec,
                            "val_f1": f1,
                            "model": clf
                        }

print("\nBEST VALIDATION CONFIGURATION:")
print(f"Criterion: {best_overall['criterion']}")
print(f"Max Depth: {best_overall['depth']}")
print(f"Min Leaf: {best_overall['min_leaf']}")
print(f"Class Weight: {best_overall['class_weight']}")
print(f"Optimal Threshold: {best_overall['threshold']:.3f}")
print(f"Val Accuracy : {best_overall['val_acc']:.4f}")
print(f"Val Precision: {best_overall['val_prec']:.4f}")
print(f"Val Recall   : {best_overall['val_rec']:.4f}")
print(f"Val F1-Score : {best_overall['val_f1']:.4f}")

