import pandas as pd
import numpy as np
import time
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import OneHotEncoder, StandardScaler, KBinsDiscretizer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, precision_recall_curve, confusion_matrix, classification_report, auc
)

df = pd.read_csv("Backend/Loan_default.csv")

def feature_engineering(data):
    df_feat = data.copy()
    # 1. Monthly income
    inc_monthly = df_feat["Income"] / 12.0 + 1.0
    # 2. Monthly loan payment
    pay_monthly = df_feat["LoanAmount"] / np.maximum(df_feat["LoanTerm"], 1)
    # 3. Payment to Income Ratio (DTI for this loan)
    df_feat["PaymentToIncome"] = pay_monthly / inc_monthly
    # 4. Total DTI estimate (Existing DTI + New Payment DTI)
    df_feat["TotalEstimatedDTI"] = df_feat["DTIRatio"] + df_feat["PaymentToIncome"]
    # 5. Total interest over loan term
    df_feat["TotalInterest"] = df_feat["LoanAmount"] * (df_feat["InterestRate"] / 100.0) * (df_feat["LoanTerm"] / 12.0)
    # 6. Interest to Income Ratio
    df_feat["AnnualInterestToIncome"] = (df_feat["LoanAmount"] * (df_feat["InterestRate"] / 100.0)) / inc_monthly
    # 7. Credit Score Risk Index (inverse scaled score)
    df_feat["CreditRiskIndex"] = (850 - df_feat["CreditScore"]) * df_feat["InterestRate"]
    # 8. Employment stability indicator
    df_feat["EmpToAgeRatio"] = df_feat["MonthsEmployed"] / (df_feat["Age"] * 12.0 + 1.0)
    # 9. Loan to Income Ratio
    df_feat["LoanToIncome"] = df_feat["LoanAmount"] / inc_monthly
    # 10. Credit lines leverage
    df_feat["LoanPerCreditLine"] = df_feat["LoanAmount"] / (df_feat["NumCreditLines"] + 1)
    return df_feat

df_feat = feature_engineering(df)
X = df_feat.drop(columns=["Default", "LoanID"])
y = df_feat["Default"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

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

best_val_f1 = 0
best_config = None

print("Tuning Decision Tree with engineered features...")

for depth in [6, 7, 8, 9, 10, 11, 12]:
    for min_leaf in [20, 50, 100, 200]:
        for ccp_alpha in [0.0, 0.0001, 0.0005]:
            for cw in ["balanced", {0: 1.0, 1: 3.5}, {0: 1.0, 1: 5.0}, {0: 1.0, 1: 6.0}]:
                clf = Pipeline([
                    ("preprocessor", preprocessor),
                    ("dt", DecisionTreeClassifier(
                        criterion="entropy",
                        max_depth=depth,
                        min_samples_leaf=min_leaf,
                        ccp_alpha=ccp_alpha,
                        class_weight=cw,
                        random_state=42
                    ))
                ])
                clf.fit(X_tr, y_tr)
                y_proba = clf.predict_proba(X_val)[:, 1]
                
                for th in np.linspace(0.3, 0.75, 46):
                    pred_th = (y_proba >= th).astype(int)
                    f1 = f1_score(y_val, pred_th, zero_division=0)
                    if f1 > best_val_f1:
                        best_val_f1 = f1
                        best_config = {
                            "depth": depth,
                            "min_leaf": min_leaf,
                            "ccp_alpha": ccp_alpha,
                            "class_weight": cw,
                            "threshold": th,
                            "val_f1": f1,
                            "val_acc": accuracy_score(y_val, pred_th),
                            "val_prec": precision_score(y_val, pred_th, zero_division=0),
                            "val_rec": recall_score(y_val, pred_th, zero_division=0)
                        }

print("\n--- BEST CONFIGURATION FOUND ---")
print(best_config)

