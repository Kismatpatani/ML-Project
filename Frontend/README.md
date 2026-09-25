# Loan Default Prediction System — Frontend

A modern, institutional-grade Fintech & AI web platform built for institutional loan risk assessment and credit default prediction using a **Decision Tree Classifier**.

Designed specifically for final-year college project presentation, production evaluation, and clean API integration.

---

## 🚀 Key Highlights

- **Pure Frontend Architecture**: Completely decoupled from backend infrastructure. No backend assumptions or hardcoded fake prediction results.
- **Selected ML Model**: **Decision Tree Classifier** (strictly the only ML model showcased and documented across the platform).
- **16-Factor Underwriting Form**: Modular assessment organized into 4 large glass cards with real-time sliders, steppers, and segmented controls.
- **Visual AI & Analytics Dashboard**: Built-in SVG charts for outcome distribution (Donut), risk classification (Bar), and assessment activity (Sparkline).
- **Prediction History & Audit Trail**: Search, filter, sort, paginate, and export (CSV) assessment records.
- **Dedicated About ML Model Page**: Complete educational breakdown of why Decision Tree was selected, 5-fold cross-validation metrics, overfitting gap visualization, dataset distribution, 16-feature architecture, and limitations.
- **Pluggable Backend Service Layer**: Configurable API URL via `.env` or dynamically via the top-navbar settings modal with live connection pinging.

---

## 📊 Model Specifications & Benchmark Metrics

| Metric | Score | Note |
| :--- | :--- | :--- |
| **Model Algorithm** | **Decision Tree Classifier** | Supervised rule-based classification |
| **Test Accuracy** | **80.16%** | Holdout test partition |
| **Precision** | **19.76%** | Positive class (Default) precision |
| **Recall** | **23.13%** | Detection of actual default events |
| **Test F1-Score** | **21.31%** | Harmonic mean balancing imbalanced target |
| **5-Fold CV Mean F1** | **21.14%** | Cross-validation benchmark stability |
| **Training Accuracy** | **100.00%** | Visualized in the Overfitting Consideration section |
| **Total Records** | **255,347** | Historical borrower instances |
| **Class 0 (No Default)** | **225,694 (88.39%)** | Majority solvent class |
| **Class 1 (Default)** | **29,653 (11.61%)** | Minority credit default target |

---

## 📂 Project Architecture

```
src/
├── components/
│   ├── Charts/
│   │   ├── ActivityChart.jsx           # SVG Prediction velocity chart
│   │   ├── DistributionChart.jsx       # Interactive SVG Donut chart (0 vs 1)
│   │   ├── OverfittingGauge.jsx        # Training (100%) vs Test (80.16%) comparison
│   │   ├── PerformanceHorizontalBar.jsx# Decision Tree metric performance bars
│   │   └── RiskBarChart.jsx            # Severity tier breakdown
│   ├── ApiConfigModal.jsx              # Live backend configuration & test ping modal
│   ├── DecisionTreeDiagram.jsx         # Visual tree flowchart & split architecture
│   ├── Footer.jsx                      # Fintech footer with project disclaimer
│   ├── LoadingOverlay.jsx              # Multi-stage AI inference loading overlay
│   ├── Navbar.jsx                      # Sticky nav with live API status & mobile drawer
│   ├── PredictionResultModal.jsx       # Decision Tree result view with risk indicators
│   └── StatCard.jsx                    # Reusable metric card with gradients
├── context/
│   ├── AuthContext.jsx                 # User session & identity management
│   ├── HistoryContext.jsx              # Audit trail state & demo preview toggle
│   └── NotificationContext.jsx         # Global toast dispatch system
├── pages/
│   ├── AboutModel.jsx                  # Complete Decision Tree specifications
│   ├── Dashboard.jsx                   # Financial analytics & portfolio risk metrics
│   ├── Home.jsx                        # Landing page, hero, 4-step workflow, stats
│   ├── LoanPrediction.jsx              # 4-card assessment form with validation
│   ├── Login.jsx                       # Split-pane sign in with AI graphic
│   ├── NotFound.jsx                    # 404 handler
│   ├── PredictionHistory.jsx           # Filterable & exportable evaluation registry
│   └── Profile.jsx                     # Analyst profile, preferences & API settings
├── services/
│   ├── apiConfig.js                    # Dynamic API endpoint manager & health tester
│   ├── authService.js                  # Frontend auth abstraction
│   ├── historyService.js               # Assessment record persistence & sync
│   └── predictionService.js            # POST payload dispatch to backend
├── styles/
│   └── theme.css                       # Fintech dark navy, indigo, cyan theme
├── utils/
│   ├── formatters.js                   # Currency, percentage, and date utilities
│   └── validators.js                   # Form validation rules
├── App.js                              # Application root & client routing
└── index.js
```

---

## 🔌 Connecting Your Backend ML API

The frontend does not assume or mock backend endpoints. To connect your existing Python (Flask / FastAPI / Django) backend:

### 1. Endpoint Configuration
Set your backend URL in `.env` (or `.env.local`):
```env
REACT_APP_API_BASE_URL=http://127.0.0.1:5000
```
*Tip: You can also change the API endpoint on the fly by clicking the **API Status badge** in the navbar or via the **Profile** page.*

### 2. Expected POST Payload (`/predict`)
Your backend should accept a JSON body containing the 16 features:
```json
{
  "Age": 35,
  "Income": 75000,
  "LoanAmount": 45000,
  "CreditScore": 680,
  "MonthsEmployed": 48,
  "NumCreditLines": 3,
  "InterestRate": 11.5,
  "LoanTerm": 36,
  "DTIRatio": 0.35,
  "Education": "Bachelor's",
  "EmploymentType": "Full-time",
  "MaritalStatus": "Single",
  "HasMortgage": "No",
  "HasDependents": "No",
  "LoanPurpose": "Auto",
  "HasCoSigner": "No"
}
```

### 3. Expected Response Format
Return either `0` or `1`:
```json
{
  "prediction": 0,
  "model_used": "Decision Tree Classifier"
}
```
*(Optional: If your model returns a confidence score or probability, include `"probability": 0.18` or `"risk_level": "Low"` and the frontend will automatically display it).*

---

## 🛠️ Running Locally

1. **Install Dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000).

3. **Build Production Bundle**:
   ```bash
   npm run build
   ```

---

## ⚠️ Academic Disclaimer
*This application is an educational machine-learning project designed for loan default risk prediction. Predictions should be treated as decision-support information and not as the sole basis for financial decisions.*
