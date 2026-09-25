import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import joblib
import time
import os

print("Loading dataset from d:/ML project/Loan_default.csv...")
t0 = time.time()
df = pd.read_csv("d:/ML project/Loan_default.csv")
print(f"Loaded {len(df)} records in {time.time()-t0:.2f}s")

X = df.drop(columns=["Default", "LoanID"])
y = df["Default"]

categorical_cols = X.select_dtypes(include=["object"]).columns.tolist()
numerical_cols = X.select_dtypes(exclude=["object"]).columns.tolist()

print("Categorical columns:", categorical_cols)
print("Numerical columns:", numerical_cols)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numerical_cols),
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols)
    ]
)

decision_tree = Pipeline([
    ("preprocessor", preprocessor),
    ("model", DecisionTreeClassifier(random_state=42))
])

print("Training Decision Tree Classifier...")
t1 = time.time()
decision_tree.fit(X_train, y_train)
print(f"Training completed in {time.time()-t1:.2f}s")

# Evaluate to verify exact test scores
y_pred = decision_tree.predict(X_test)
print("Test Accuracy :", accuracy_score(y_test, y_pred))
print("Test Precision:", precision_score(y_test, y_pred))
print("Test Recall   :", recall_score(y_test, y_pred))
print("Test F1-score :", f1_score(y_test, y_pred))

model_path = os.path.join(os.path.dirname(__file__), "decision_tree_model.joblib")
joblib.dump(decision_tree, model_path)
print(f"Saved trained pipeline to {model_path} successfully!")
