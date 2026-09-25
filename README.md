# FINRISK AI — Loan Default Prediction System

[![Algorithm](https://img.shields.io/badge/Model-Decision%20Tree%20Classifier-indigo)](https://scikit-learn.org/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-emerald)](https://fastapi.tiangolo.com/)
[![Frontend](https://img.shields.io/badge/Frontend-React-sky)](https://react.dev/)
[![Deployment](https://img.shields.io/badge/Deploy-Render-purple)](https://render.com/)

---

## 📌 Project Overview
**FINRISK AI** is an end-to-end Machine Learning web application that predicts loan default risk for credit applicants.
It uses an optimized **Decision Tree Classifier** trained on 255,347 historical borrower records, served via a high-performance **FastAPI** backend and an interactive **React** web application.

---

## 🚀 Step-by-Step Render Deployment Guide

Follow these exact steps to deploy both your **Backend API** and **React Frontend** on Render for free.

### Step 1: Push Code to GitHub
Ensure all latest code changes are pushed to your GitHub repository:
```bash
git add .
git commit -m "Final ready for Render deployment"
git push origin main
```

---

### Step 2: Deploy Backend on Render (Web Service)
1. Go to [https://dashboard.render.com](https://dashboard.render.com) and click **New +** → **Web Service**.
2. Connect your GitHub repository (`ML-Project`).
3. Configure the following settings:
   - **Name**: `finrisk-backend`
   - **Root Directory**: `Backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Click **Create Web Service**.
5. Once deployment completes, copy your **Backend Public URL** (e.g. `https://finrisk-backend.onrender.com`).

---

### Step 3: Deploy Frontend on Render (Static Site)
1. In Render Dashboard, click **New +** → **Static Site**.
2. Connect your GitHub repository (`ML-Project`).
3. Configure the following settings:
   - **Name**: `finrisk-frontend`
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `build`
4. Under **Environment Variables**, add:
   - `REACT_APP_API_BASE_URL` = `https://finrisk-backend.onrender.com` (Use your actual backend URL from Step 2).
5. Click **Create Static Site**.
6. Once deployed, Render will generate your **Public Frontend URL** (e.g. `https://finrisk-frontend.onrender.com`).

---

### Step 4: Test & Submit to Professor
1. Open your **Frontend URL** in your web browser.
2. Navigate to **About Model** to verify that model metrics load live from the backend.
3. Test a loan default prediction under **Loan Prediction**.
4. Submit the **Frontend URL** to your faculty/professor!

---

## 📊 Measured Model Performance Metrics

| Metric | Measured Value | Description |
|---|---|---|
| **Algorithm** | `DecisionTreeClassifier` | Entropy criterion with optimal thresholding |
| **Test Accuracy** | **87.67%** | Holdout test evaluation accuracy |
| **Precision** | **47.87%** | Default prediction precision |
| **Recall** | **44.85%** | Default risk detection sensitivity |
| **F1-Score** | **46.31%** | Harmonic balance of precision and recall |
| **5-Fold CV Mean F1** | **46.30%** | Stratified cross-validation score |
| **Generalization Gap** | **0.42%** | Minimal train-test variance (no overfitting) |
| **Decision Threshold** | `0.62` | Validated probability decision cutoff |

---

## 💻 Local Development Setup

### 1. Backend Setup (FastAPI)
```bash
cd Backend
pip install -r requirements.txt
python main.py
```
Backend server runs at `http://127.0.0.1:8000`.

### 2. Frontend Setup (React)
```bash
cd Frontend
npm install
npm start
```
Frontend app runs at `http://localhost:3000`.

---

## 🛠️ Tech Stack
- **Machine Learning**: `scikit-learn`, `pandas`, `numpy`, `joblib`
- **Backend API**: `FastAPI`, `Uvicorn`, `Pydantic`
- **Frontend App**: `React`, `Lucide React Icons`, `CSS3` (Glassmorphism Dark/Light Theme)
- **Deployment**: `Render` (Web Service + Static Site)