# 🚀 Streamlit Loan Default Predictor Deployment Guide

This guide provides step-by-step instructions for testing locally and deploying your **Streamlit Loan Default Prediction App** online for free.

---

## 🛠️ 1. Testing Locally

### Prerequisites
Make sure Python 3.9+ is installed on your system.

### Installation & Launch
1. Open terminal/PowerShell in your project directory (`d:\ML project`):
   ```bash
   pip install -r requirements.txt
   ```

2. Run the Streamlit application:
   ```bash
   streamlit run app.py
   ```

3. The application will open automatically in your browser at `http://localhost:8501`.

---

## 🌐 2. Deploying on Streamlit Community Cloud (Recommended - 100% Free)

Streamlit Community Cloud hosts Streamlit apps directly from GitHub for free with zero setup.

### Step 1: Commit and Push to GitHub
1. Initialize Git (if not already initialized):
   ```bash
   git init
   git add .
   git commit -m "Add Streamlit application and model files"
   ```
2. Create a new repository on [GitHub](https://github.com/new).
3. Connect your local repository and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Streamlit Cloud
1. Go to [share.streamlit.io](https://share.streamlit.io) and log in with your GitHub account.
2. Click the **"New app"** button.
3. Fill in the deployment form:
   - **Repository**: Select `YOUR_USERNAME/YOUR_REPO_NAME`
   - **Branch**: `main`
   - **Main file path**: `app.py`
4. Click **"Deploy!"**.

🎉 Within 1–2 minutes, your web application will be live at a public URL like:
`https://your-app.streamlit.app`

---

## 🤖 3. Deploying on Hugging Face Spaces (Free Alternative)

1. Sign up/log in at [Hugging Face](https://huggingface.co/).
2. Navigate to **Spaces** -> **Create new Space**.
3. Fill in the details:
   - **Space Name**: `loan-default-predictor`
   - **Space SDK**: Select **Streamlit**
   - **Privacy**: Public
4. Clone the Hugging Face repo or upload files directly (`app.py`, `requirements.txt`, `.streamlit/config.toml`, `decision_tree_model.joblib`).
5. Hugging Face will automatically build and launch your application.

---

## 📦 Project Structure

```text
ML project/
├── .streamlit/
│   └── config.toml          # Custom dark UI styling & configuration
├── Backend/
│   ├── decision_tree_model.joblib
│   └── train_and_save.py
├── Loan_default.csv         # Dataset reference
├── app.py                   # Main Streamlit Web Application
├── decision_tree_model.joblib # Root model binary for deployment
├── requirements.txt         # Dependencies list
└── DEPLOYMENT_GUIDE.md      # Deployment instructions
```
