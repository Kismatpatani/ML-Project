import React, { useEffect, useState } from 'react';
import { GitBranch, CheckCircle2, HelpCircle, Database, AlertTriangle, ShieldAlert, Layers } from 'lucide-react';
import { getApiConfig } from '../services/apiConfig';

const inputFeatures = [
  'Age', 'Income', 'Loan Amount', 'Credit Score', 'Months Employed',
  'Number of Credit Lines', 'Interest Rate', 'Loan Term', 'DTI Ratio',
  'Education', 'Employment Type', 'Marital Status', 'Has Mortgage',
  'Has Dependents', 'Loan Purpose', 'Has Co-Signer'
];

export const AboutModel = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const baseUrl = getApiConfig().baseUrl.replace(/\/+$/, '');
    
    fetch(`${baseUrl}/metrics`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          return fetch(`${baseUrl}/model/metrics`, { signal: controller.signal });
        }
        return response;
      })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setMetrics(data);
      })
      .catch(() => {});

    return () => controller.abort();
  }, []);

  const cardStyle = { padding: 28, marginBottom: 24 };
  const headingStyle = { fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 750, color: 'var(--text-primary)', margin: '0 0 16px' };
  const mutedStyle = { color: 'var(--text-secondary)', lineHeight: 1.7 };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-badge">MACHINE LEARNING SPECIFICATIONS</div>
        <h1 className="page-title">About the ML Model</h1>
        <p className="page-subtitle">Understanding the Decision Tree Classifier behind our loan risk prediction system.</p>
      </div>

      {/* SECTION 1 — MODEL OVERVIEW */}
      <section className="glass-card" style={{ ...cardStyle, padding: 36, border: '1px solid var(--border-primary)' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 18 }}>
          <div style={{ width: 54, height: 54, borderRadius: 14, background: 'linear-gradient(135deg,#6366F1,#38BDF8)', display: 'grid', placeItems: 'center' }}>
            <GitBranch color="white" size={28}/>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ ...headingStyle, fontSize: '1.8rem', margin: 0 }}>
              {metrics?.model || 'Decision Tree Classifier'}
            </h2>
            <span style={{ color: 'var(--text-muted)' }}>Supervised Machine Learning Classification • Decision Tree Architecture</span>
          </div>
          <span className="page-badge" style={{ margin: 0 }}>Selected ML Algorithm</span>
        </div>
        <p style={{ ...mutedStyle, margin: 0 }}>
          Our system utilizes an optimized <strong>Decision Tree Classifier</strong> trained on historical borrower records. 
          It evaluates 16 key financial, demographic, and credit risk features to calculate an applicant's probability of default. 
          Decision rules were optimized to provide clear risk assessment and reliable decision support.
        </p>
      </section>

      {/* Why We Used It */}
      <section className="glass-card" style={cardStyle}>
        <h3 style={headingStyle}><HelpCircle size={21} color="#38BDF8" style={{ verticalAlign: 'middle', marginRight: 10 }}/>Why We Used Decision Tree Classifier</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 14 }}>
          {[
            'Transparent, rule-based decision logic suitable for financial auditing',
            'Supports binary classification: Default (Class 1) vs No Default (Class 0)',
            'Processes applicant demographic, credit history and loan parameters',
            'Captures non-linear feature interactions without black-box opacity',
            'Optimized with entropy criterion, depth limits, and custom thresholding'
          ].map((item) => (
            <div key={item} style={{ padding: 14, borderRadius: 10, background: 'var(--bg-segmented)', border: '1px solid var(--border-subtle)', display: 'flex', gap: 10, ...mutedStyle }}>
              <CheckCircle2 size={18} color="#38BDF8" style={{ flexShrink: 0, marginTop: 4 }}/>
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* DATASET OVERVIEW */}
      <section className="glass-card" style={cardStyle}>
        <h3 style={headingStyle}><Database size={22} color="#818CF8" style={{ verticalAlign: 'middle', marginRight: 10 }}/>Dataset Overview</h3>
        <p style={mutedStyle}>
          The model was trained and evaluated on historical borrower records. The target variable is binary: Default (1) vs Non-Default (0).
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 14 }}>
          {[
            ['Total Records', metrics?.total_records?.toLocaleString() || '255,347'],
            ['Training Samples', metrics?.train_samples?.toLocaleString() || '204,277'],
            ['Test Samples', metrics?.test_samples?.toLocaleString() || '51,070'],
            ['Prediction Features', metrics?.num_features || '16'],
            ['Decision Threshold', typeof metrics?.threshold === 'number' ? metrics.threshold.toFixed(2) : '0.62']
          ].map(([label, value]) => (
            <div key={label} style={{ background: 'var(--bg-segmented)', border: '1px solid var(--border-subtle)', padding: 18, borderRadius: 12 }}>
              <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 8 }}>{label}</div>
              <strong style={{ fontSize: 24, color: 'var(--text-primary)' }}>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      {/* INPUT FEATURES */}
      <section style={{ marginBottom: 34 }}>
        <div className="page-badge">INPUT ARCHITECTURE</div>
        <h3 style={headingStyle}>Model Input Features (16 Features)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 13 }}>
          {inputFeatures.map((feature, index) => (
            <div className="glass-card" key={feature} style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ borderRadius: 8, background: 'var(--bg-segmented)', color: '#818CF8', padding: '6px 10px', fontWeight: 750 }}>
                {index + 1}
              </span>
              <strong style={{ color: 'var(--text-primary)' }}>{feature}</strong>
            </div>
          ))}
        </div>
      </section>

      {/* HOW THE MODEL WORKS */}
      <section className="glass-card" style={cardStyle}>
        <h3 style={headingStyle}><Layers size={22} color="#818CF8" style={{ verticalAlign: 'middle', marginRight: 10 }}/>How the Decision Tree Works</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14 }}>
          {[
            ['01', 'Data Preprocessing', 'Continuous features are normalized and categorical inputs are encoded.'],
            ['02', 'Feature Transformation', 'Domain ratios (Payment-to-Income, Interest Risk Index) are engineered.'],
            ['03', 'Decision Splitting', 'Entropy-based decision splits evaluate conditions across tree nodes.'],
            ['04', 'Probability Estimation', 'Terminal leaf nodes compute estimated default probability.'],
            ['05', 'Final Classification', 'The calibrated decision threshold assigns Default vs No Default.']
          ].map(([number, title, detail]) => (
            <div key={number} style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-segmented)', borderRadius: 12, padding: 19 }}>
              <div style={{ color: '#818CF8', fontWeight: 800, marginBottom: 10 }}>{number}</div>
              <strong style={{ color: 'var(--text-primary)' }}>{title}</strong>
              <p style={{ ...mutedStyle, fontSize: 13, marginBottom: 0 }}>{detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MODEL LIMITATIONS */}
      <section className="limitations-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 34 }}>
        <div className="glass-card" style={{ padding: 26, border: '1px solid rgba(245,158,11,0.3)' }}>
          <h3 style={headingStyle}><AlertTriangle size={20} color="#FBBF24" style={{ verticalAlign: 'middle', marginRight: 10 }}/>Class Imbalance & Thresholding</h3>
          <p style={mutedStyle}>
            Only ~11.6% of historical records in the dataset default. Standard 0.5 decision thresholds underdetect defaults. We tuned the decision threshold and cost parameters to optimize default risk detection.
          </p>
        </div>
        <div className="glass-card" style={{ padding: 26, border: '1px solid rgba(244,63,94,0.3)' }}>
          <h3 style={headingStyle}><ShieldAlert size={20} color="#FB7185" style={{ verticalAlign: 'middle', marginRight: 10 }}/>Model Limitations & Risk Scope</h3>
          <p style={mutedStyle}>
            Predictions are statistical probability estimates derived from historical data. Decision tree rules do not replace human credit underwriting or legal compliance checks.
          </p>
        </div>
      </section>

      <style>{`@media(max-width:900px){.limitations-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
};
