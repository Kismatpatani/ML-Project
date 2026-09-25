import streamlit as st
import pandas as pd
import numpy as np
import joblib
import os
import io
import plotly.express as px
import plotly.graph_objects as go

# ---------------------------------------------------------
# Page Configuration & Modern Theme Setup
# ---------------------------------------------------------
st.set_page_config(
    page_title="LoanGuard AI - Loan Default Risk Predictor",
    page_icon="💳",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for Premium Aesthetics
st.markdown("""
<style>
    /* Global Styles & Dark Theme Adjustments */
    .stApp {
        background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    
    /* Header Gradient Banner */
    .main-header {
        background: linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 0.2rem;
    }
    
    .sub-header {
        color: #94a3b8;
        font-size: 1.1rem;
        margin-bottom: 2rem;
    }

    /* Glassmorphism Card Style */
    .css-card {
        background: rgba(30, 41, 59, 0.7);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    }
    
    /* Result Badges */
    .badge-approved {
        background: linear-gradient(135deg, #059669 0%, #10b981 100%);
        color: #ffffff;
        padding: 0.75rem 1.5rem;
        border-radius: 12px;
        font-weight: 700;
        font-size: 1.3rem;
        text-align: center;
        box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.39);
        display: inline-block;
        width: 100%;
    }
    
    .badge-default {
        background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
        color: #ffffff;
        padding: 0.75rem 1.5rem;
        border-radius: 12px;
        font-weight: 700;
        font-size: 1.3rem;
        text-align: center;
        box-shadow: 0 4px 14px 0 rgba(239, 68, 68, 0.39);
        display: inline-block;
        width: 100%;
    }

    /* Metric Display styling */
    div[data-testid="stMetricValue"] {
        font-size: 1.8rem;
        font-weight: 700;
        color: #f8fafc;
    }
    
    /* Sidebar Styling */
    section[data-testid="stSidebar"] {
        background-color: #0f172a;
        border-right: 1px solid rgba(255, 255, 255, 0.08);
    }
    
    /* Button Aesthetics */
    .stButton>button {
        background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        font-weight: 600;
        border: none;
        border-radius: 10px;
        padding: 0.6rem 1.5rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
    .stButton>button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
    }
</style>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# Load Trained ML Model Pipeline
# ---------------------------------------------------------
@st.cache_resource
def load_ml_model():
    possible_paths = [
        "decision_tree_model.joblib",
        os.path.join("Backend", "decision_tree_model.joblib"),
        os.path.join(os.path.dirname(__file__), "Backend", "decision_tree_model.joblib"),
    ]
    for path in possible_paths:
        if os.path.exists(path):
            try:
                model = joblib.load(path)
                return model, path
            except Exception as e:
                st.error(f"Error loading model from {path}: {e}")
    return None, None

model, model_path = load_ml_model()

# ---------------------------------------------------------
# Sidebar Navigation & Settings
# ---------------------------------------------------------
with st.sidebar:
    st.markdown("## 💳 LoanGuard AI")
    st.markdown("Decision Tree Machine Learning Platform")
    st.markdown("---")
    
    app_mode = st.radio(
        "Navigation",
        [
            "🎯 Single Applicant Predictor",
            "📁 Batch CSV Processing",
            "📊 Model & Feature Analytics",
            "🚀 Deploying to Cloud"
        ]
    )
    
    st.markdown("---")
    st.markdown("### ⚙️ System Status")
    if model is not None:
        st.success(f"Model Loaded\n\n(`Decision Tree Classifier`)")
    else:
        st.error("Model Not Found! Please check model path.")
        
    st.markdown("---")
    st.caption("Powered by Scikit-Learn & Streamlit")

# ---------------------------------------------------------
# TAB 1: Single Applicant Predictor
# ---------------------------------------------------------
if app_mode == "🎯 Single Applicant Predictor":
    st.markdown('<div class="main-header">Loan Default Risk Evaluator</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Enter applicant details to predict default risk probability instantly using ML.</div>', unsafe_allow_html=True)

    # Preset Quick Load Buttons
    st.markdown("#### ⚡ Quick Preset Test Profiles")
    preset_col1, preset_col2, preset_col3 = st.columns([1, 1, 2])
    
    # Session state initialization for form inputs
    if "preset_loaded" not in st.session_state:
        st.session_state.age = 35
        st.session_state.income = 75000.0
        st.session_state.loan_amount = 25000.0
        st.session_state.credit_score = 720
        st.session_state.months_emp = 48
        st.session_state.credit_lines = 3
        st.session_state.interest_rate = 8.5
        st.session_state.loan_term = 36
        st.session_state.dti = 0.28
        st.session_state.education = "Bachelor's"
        st.session_state.employment = "Full-time"
        st.session_state.marital = "Married"
        st.session_state.mortgage = "No"
        st.session_state.dependents = "Yes"
        st.session_state.purpose = "Home"
        st.session_state.cosigner = "Yes"

    with preset_col1:
        if st.button("🟢 Low Risk Profile"):
            st.session_state.age = 42
            st.session_state.income = 110000.0
            st.session_state.loan_amount = 18000.0
            st.session_state.credit_score = 780
            st.session_state.months_emp = 84
            st.session_state.credit_lines = 2
            st.session_state.interest_rate = 6.0
            st.session_state.loan_term = 36
            st.session_state.dti = 0.18
            st.session_state.education = "Master's"
            st.session_state.employment = "Full-time"
            st.session_state.marital = "Married"
            st.session_state.mortgage = "No"
            st.session_state.dependents = "Yes"
            st.session_state.purpose = "Home"
            st.session_state.cosigner = "Yes"
            st.rerun()

    with preset_col2:
        if st.button("🔴 High Risk Profile"):
            st.session_state.age = 22
            st.session_state.income = 24000.0
            st.session_state.loan_amount = 45000.0
            st.session_state.credit_score = 520
            st.session_state.months_emp = 6
            st.session_state.credit_lines = 7
            st.session_state.interest_rate = 22.5
            st.session_state.loan_term = 60
            st.session_state.dti = 0.65
            st.session_state.education = "High School"
            st.session_state.employment = "Unemployed"
            st.session_state.marital = "Single"
            st.session_state.mortgage = "No"
            st.session_state.dependents = "No"
            st.session_state.purpose = "Other"
            st.session_state.cosigner = "No"
            st.rerun()

    st.markdown("---")

    # Form Input Layout (3 Sections)
    with st.form("loan_input_form"):
        col1, col2, col3 = st.columns(3)

        with col1:
            st.markdown("### 👤 Personal Details")
            age = st.number_input("Age (Years)", min_value=18, max_value=100, value=st.session_state.age)
            education = st.selectbox("Education Level", ["Bachelor's", "Master's", "High School", "PhD"], index=["Bachelor's", "Master's", "High School", "PhD"].index(st.session_state.education))
            employment_type = st.selectbox("Employment Type", ["Full-time", "Unemployed", "Self-employed", "Part-time"], index=["Full-time", "Unemployed", "Self-employed", "Part-time"].index(st.session_state.employment))
            months_employed = st.number_input("Months Employed", min_value=0, max_value=300, value=st.session_state.months_emp)
            marital_status = st.selectbox("Marital Status", ["Married", "Single", "Divorced"], index=["Married", "Single", "Divorced"].index(st.session_state.marital))
            has_dependents = st.selectbox("Has Dependents?", ["Yes", "No"], index=["Yes", "No"].index(st.session_state.dependents))

        with col2:
            st.markdown("### 💰 Financial Profile")
            income = st.number_input("Annual Income ($)", min_value=0.0, max_value=1000000.0, value=float(st.session_state.income), step=1000.0)
            credit_score = st.slider("Credit Score", min_value=300, max_value=850, value=st.session_state.credit_score)
            dti_ratio = st.slider("Debt-to-Income (DTI) Ratio", min_value=0.0, max_value=1.0, value=float(st.session_state.dti), step=0.01, help="Ratio of monthly debt payment to total monthly income")
            num_credit_lines = st.number_input("Number of Credit Lines", min_value=0, max_value=20, value=st.session_state.credit_lines)
            has_mortgage = st.selectbox("Has Mortgage?", ["Yes", "No"], index=["Yes", "No"].index(st.session_state.mortgage))

        with col3:
            st.markdown("### 📑 Loan Request Specs")
            loan_amount = st.number_input("Requested Loan Amount ($)", min_value=500.0, max_value=1000000.0, value=float(st.session_state.loan_amount), step=500.0)
            loan_purpose = st.selectbox("Loan Purpose", ["Home", "Auto", "Business", "Education", "Other"], index=["Home", "Auto", "Business", "Education", "Other"].index(st.session_state.purpose))
            loan_term = st.selectbox("Loan Term (Months)", [12, 24, 36, 48, 60, 72, 120], index=[12, 24, 36, 48, 60, 72, 120].index(st.session_state.loan_term) if st.session_state.loan_term in [12, 24, 36, 48, 60, 72, 120] else 2)
            interest_rate = st.number_input("Annual Interest Rate (%)", min_value=0.0, max_value=40.0, value=float(st.session_state.interest_rate), step=0.25)
            has_cosigner = st.selectbox("Has Co-Signer?", ["Yes", "No"], index=["Yes", "No"].index(st.session_state.cosigner))

        submit_btn = st.form_submit_button("🔍 Evaluate Default Risk")

    if submit_btn:
        if model is None:
            st.error("Cannot predict: Trained Decision Tree model is missing!")
        else:
            # Prepare Single Row DataFrame for Sklearn Pipeline
            input_df = pd.DataFrame([{
                "Age": age,
                "Income": income,
                "LoanAmount": loan_amount,
                "CreditScore": credit_score,
                "MonthsEmployed": months_employed,
                "NumCreditLines": num_credit_lines,
                "InterestRate": interest_rate,
                "LoanTerm": loan_term,
                "DTIRatio": dti_ratio,
                "Education": education,
                "EmploymentType": employment_type,
                "MaritalStatus": marital_status,
                "HasMortgage": has_mortgage,
                "HasDependents": has_dependents,
                "LoanPurpose": loan_purpose,
                "HasCoSigner": has_cosigner
            }])

            # Run Model Prediction
            prediction = int(model.predict(input_df)[0])
            probability = None
            if hasattr(model, "predict_proba"):
                try:
                    proba = model.predict_proba(input_df)[0]
                    probability = float(proba[1]) # Default class probability
                except Exception:
                    pass

            st.markdown("---")
            st.markdown("## 📋 Prediction Results & Financial Risk Assessment")

            res_col1, res_col2 = st.columns([1, 1])

            with res_col1:
                st.markdown('<div class="css-card">', unsafe_allow_html=True)
                st.markdown("### Risk Status")
                if prediction == 1:
                    st.markdown('<div class="badge-default">⚠️ HIGH DEFAULT RISK</div>', unsafe_allow_html=True)
                    st.write("")
                    st.markdown("**Assessment**: The ML model projects a high likelihood of loan default for this applicant.")
                else:
                    st.markdown('<div class="badge-approved">✅ APPROVED / LOW RISK</div>', unsafe_allow_html=True)
                    st.write("")
                    st.markdown("**Assessment**: Applicant displays a healthy credit & financial profile for loan approval.")
                st.markdown('</div>', unsafe_allow_html=True)

                # Key Financial Metrics Calculation
                est_monthly_interest = (interest_rate / 100) / 12
                if est_monthly_interest > 0:
                    monthly_payment = (loan_amount * est_monthly_interest) / (1 - (1 + est_monthly_interest)**(-loan_term))
                else:
                    monthly_payment = loan_amount / loan_term

                income_loan_ratio = (loan_amount / income) * 100 if income > 0 else 0

                st.markdown("#### 📊 Loan Calculations")
                m1, m2 = st.columns(2)
                m1.metric("Est. Monthly Payment", f"${monthly_payment:,.2f}")
                m2.metric("Loan-to-Income Ratio", f"{income_loan_ratio:.1f}%")

            with res_col2:
                st.markdown('<div class="css-card">', unsafe_allow_html=True)
                st.markdown("### 🎯 Risk Probability Score")
                
                if probability is not None:
                    prob_pct = probability * 100
                    
                    # Create Plotly Radial Gauge
                    fig_gauge = go.Figure(go.Indicator(
                        mode = "gauge+number",
                        value = prob_pct,
                        number = {'suffix': "%", 'font': {'color': "#F8FAFC", 'size': 36}},
                        title = {'text': "Default Probability", 'font': {'color': "#94A3B8", 'size': 16}},
                        gauge = {
                            'axis': {'range': [0, 100], 'tickwidth': 1, 'tickcolor': "#94A3B8"},
                            'bar': {'color': "#EF4444" if prob_pct > 50 else "#10B981"},
                            'bgcolor': "#1E293B",
                            'borderwidth': 2,
                            'bordercolor': "#334155",
                            'steps': [
                                {'range': [0, 30], 'color': 'rgba(16, 185, 129, 0.2)'},
                                {'range': [30, 60], 'color': 'rgba(245, 158, 11, 0.2)'},
                                {'range': [60, 100], 'color': 'rgba(239, 68, 68, 0.2)'}
                            ]
                        }
                    ))
                    fig_gauge.update_layout(
                        height=220,
                        margin=dict(l=20, r=20, t=30, b=20),
                        paper_bgcolor='rgba(0,0,0,0)',
                        font={'color': "#F8FAFC"}
                    )
                    st.plotly_chart(fig_gauge, use_container_width=True)
                else:
                    st.info("Probability score not provided by tree model.")

                st.markdown('</div>', unsafe_allow_html=True)

            # AI Recommendations Card
            st.markdown("### 💡 Financial Risk Insights & Observations")
            risk_factors = []
            if dti_ratio > 0.40:
                risk_factors.append("⚠️ **High DTI Ratio**: Debt-to-income exceeds 40%, indicating heavy existing financial commitments.")
            if credit_score < 620:
                risk_factors.append("⚠️ **Low Credit Score**: Score is below standard prime lending thresholds (< 620).")
            if interest_rate > 15.0:
                risk_factors.append("⚠️ **High Interest Rate**: Elevated interest rate increases monthly repayment strain.")
            if months_employed < 12:
                risk_factors.append("⚠️ **Short Employment History**: Less than 1 year at current employment.")
            if has_cosigner == "No" and (income_loan_ratio > 40 or credit_score < 650):
                risk_factors.append("💡 **No Co-Signer**: Adding a co-signer with high credit score could significantly reduce risk.")

            if risk_factors:
                for factor in risk_factors:
                    st.warning(factor)
            else:
                st.success("✅ **Strong Profile**: No major financial risk red flags identified for this applicant.")

# ---------------------------------------------------------
# TAB 2: Batch CSV Processing
# ---------------------------------------------------------
elif app_mode == "📁 Batch CSV Processing":
    st.markdown('<div class="main-header">Batch Loan Default Evaluator</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Upload a CSV file containing loan applicants for bulk risk evaluation and predictions.</div>', unsafe_allow_html=True)

    col_upload, col_sample = st.columns([3, 1])

    with col_sample:
        st.markdown("#### 📥 Sample CSV Template")
        # Generate sample dataframe for download
        sample_df = pd.DataFrame([
            {
                "Age": 32, "Income": 68000.0, "LoanAmount": 20000.0, "CreditScore": 710,
                "MonthsEmployed": 36, "NumCreditLines": 3, "InterestRate": 9.5, "LoanTerm": 36,
                "DTIRatio": 0.25, "Education": "Bachelor's", "EmploymentType": "Full-time",
                "MaritalStatus": "Single", "HasMortgage": "No", "HasDependents": "No",
                "LoanPurpose": "Home", "HasCoSigner": "Yes"
            },
            {
                "Age": 24, "Income": 28000.0, "LoanAmount": 35000.0, "CreditScore": 540,
                "MonthsEmployed": 8, "NumCreditLines": 6, "InterestRate": 18.0, "LoanTerm": 48,
                "DTIRatio": 0.55, "Education": "High School", "EmploymentType": "Part-time",
                "MaritalStatus": "Single", "HasMortgage": "No", "HasDependents": "Yes",
                "LoanPurpose": "Auto", "HasCoSigner": "No"
            }
        ])
        csv_buffer = io.StringIO()
        sample_df.to_csv(csv_buffer, index=False)
        st.download_button(
            label="Download Template CSV",
            data=csv_buffer.getvalue(),
            file_name="sample_loan_applicants.csv",
            mime="text/csv"
        )

    with col_upload:
        uploaded_file = st.file_uploader("Choose a CSV file", type=["csv"])

    if uploaded_file is not None:
        try:
            batch_df = pd.read_csv(uploaded_file)
            st.success(f"Uploaded successfully! Found {len(batch_df)} applicant rows.")

            # Check if required columns exist
            required_cols = [
                "Age", "Income", "LoanAmount", "CreditScore", "MonthsEmployed",
                "NumCreditLines", "InterestRate", "LoanTerm", "DTIRatio",
                "Education", "EmploymentType", "MaritalStatus", "HasMortgage",
                "HasDependents", "LoanPurpose", "HasCoSigner"
            ]
            missing_cols = [c for c in required_cols if c not in batch_df.columns]

            if missing_cols:
                st.error(f"Missing required columns in CSV: {missing_cols}")
            elif model is None:
                st.error("Model is not loaded.")
            else:
                # Predict batch
                preds = model.predict(batch_df[required_cols])
                batch_df["Prediction"] = preds
                batch_df["Risk_Label"] = batch_df["Prediction"].map({0: "Approved / Low Risk", 1: "Default / High Risk"})

                if hasattr(model, "predict_proba"):
                    try:
                        probas = model.predict_proba(batch_df[required_cols])[:, 1]
                        batch_df["Default_Probability"] = (probas * 100).round(2)
                    except Exception:
                        pass

                # Summary Statistics
                st.markdown("### 📊 Batch Evaluation Summary")
                b_col1, b_col2, b_col3, b_col4 = st.columns(4)
                total_apps = len(batch_df)
                total_defaults = (preds == 1).sum()
                total_approved = (preds == 0).sum()
                default_rate = (total_defaults / total_apps) * 100

                b_col1.metric("Total Applicants", total_apps)
                b_col2.metric("Approved (Low Risk)", total_approved)
                b_col3.metric("High Risk / Default", total_defaults)
                b_col4.metric("Predicted Default Rate", f"{default_rate:.1f}%")

                # Filter options
                st.markdown("### 🔍 Filter Results")
                filter_choice = st.radio("Display Filter", ["All", "Approved Only", "High Risk Only"], horizontal=True)

                if filter_choice == "Approved Only":
                    display_df = batch_df[batch_df["Prediction"] == 0]
                elif filter_choice == "High Risk Only":
                    display_df = batch_df[batch_df["Prediction"] == 1]
                else:
                    display_df = batch_df

                st.dataframe(display_df, use_container_width=True)

                # Download Results CSV
                out_buffer = io.StringIO()
                batch_df.to_csv(out_buffer, index=False)
                st.download_button(
                    label="📥 Download Full Prediction Results CSV",
                    data=out_buffer.getvalue(),
                    file_name="predicted_loan_default_results.csv",
                    mime="text/csv"
                )

        except Exception as e:
            st.error(f"Error processing CSV file: {e}")

# ---------------------------------------------------------
# TAB 3: Model & Feature Analytics
# ---------------------------------------------------------
elif app_mode == "📊 Model & Feature Analytics":
    st.markdown('<div class="main-header">Model Analytics & Feature Importance</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Explore feature importance and machine learning pipeline mechanics.</div>', unsafe_allow_html=True)

    if model is None:
        st.error("Model is not loaded.")
    else:
        try:
            preprocessor = model.named_steps['preprocessor']
            dt_model = model.named_steps['model']

            # Get feature names after OneHotEncoding
            feature_names = preprocessor.get_feature_names_out()
            importances = dt_model.feature_importances_

            # Clean feature names for clean Plotly labels
            clean_names = [
                name.replace("num__", "").replace("cat__", "").replace("_", ": ")
                for name in feature_names
            ]

            fi_df = pd.DataFrame({
                "Feature": clean_names,
                "Importance": importances
            }).sort_values(by="Importance", ascending=False).head(15)

            st.markdown("### 🏆 Top 15 Most Influential Features in Decision Tree")

            fig_fi = px.bar(
                fi_df,
                x="Importance",
                y="Feature",
                orientation="h",
                color="Importance",
                color_continuous_scale="Viridis",
                title="Feature Importance Ranking (Decision Tree Classifier)"
            )
            fig_fi.update_layout(
                yaxis=dict(autorange="reversed"),
                paper_bgcolor="rgba(0,0,0,0)",
                plot_bgcolor="rgba(0,0,0,0)",
                font=dict(color="#F8FAFC"),
                height=500
            )
            st.plotly_chart(fig_fi, use_container_width=True)

            st.markdown("---")
            st.markdown("### ⚙️ Machine Learning Pipeline Specifications")
            col_info1, col_info2 = st.columns(2)

            with col_info1:
                st.markdown("""
                - **Algorithm**: `DecisionTreeClassifier` (Scikit-Learn)
                - **Numerical Preprocessing**: `StandardScaler()`
                - **Categorical Preprocessing**: `OneHotEncoder(handle_unknown='ignore')`
                """)

            with col_info2:
                st.markdown("""
                - **Total Pipeline Features**: 16 raw features -> Expanded One-Hot Encoded features
                - **Target Variable**: `Default` (0 = No Default, 1 = Default)
                - **Deployment Engine**: Streamlit Cloud / Standalone Python
                """)

        except Exception as e:
            st.error(f"Could not extract feature importances: {e}")

# ---------------------------------------------------------
# TAB 4: Deploying to Cloud Guide
# ---------------------------------------------------------
elif app_mode == "🚀 Deploying to Cloud":
    st.markdown('<div class="main-header">Cloud Deployment Guide</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Follow these step-by-step instructions to deploy your Streamlit Loan Default Predictor online for free!</div>', unsafe_allow_html=True)

    st.markdown("""
    ### Option 1: Streamlit Community Cloud (Recommended & 100% Free)
    
    1. **Push your code to GitHub**:
       - Make sure your project directory includes `app.py`, `requirements.txt`, `.streamlit/config.toml`, and `decision_tree_model.joblib`.
       - Commit and push your code to your GitHub repository.
       
    2. **Connect to Streamlit Cloud**:
       - Go to [share.streamlit.io](https://share.streamlit.io) and log in with your GitHub account.
       - Click **"New app"**.
       
    3. **Configure Deployment**:
       - **Repository**: Select your GitHub repository (`your-username/loan-default-prediction`).
       - **Branch**: `main` (or `master`).
       - **Main file path**: `app.py`.
       
    4. **Click "Deploy!"**:
       - Streamlit will automatically install `requirements.txt` and launch your web app online with a shareable URL (e.g. `https://your-app.streamlit.app`).

    ---

    ### Option 2: Deploy on Hugging Face Spaces (Free)
    1. Go to [Hugging Face Spaces](https://huggingface.co/spaces).
    2. Click **Create new Space**.
    3. Choose **Streamlit** as the Space SDK.
    4. Upload `app.py`, `requirements.txt`, and `decision_tree_model.joblib`.
    5. Your app will build and run live automatically!

    ---

    ### Option 3: Local Command Execution
    To run this Streamlit web application on your local machine:
    ```bash
    streamlit run app.py
    ```
    """)

# Footer
st.markdown("---")
st.caption("LoanGuard AI © 2026 | Built with Streamlit, Python & Scikit-Learn")
