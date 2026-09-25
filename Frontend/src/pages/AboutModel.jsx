import React from 'react';
import { 
  GitBranch, 
  CheckCircle2, 
  HelpCircle, 
  Database, 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  BarChart2
} from 'lucide-react';
import { PerformanceHorizontalBar } from '../components/Charts/PerformanceHorizontalBar';
import { OverfittingGauge } from '../components/Charts/OverfittingGauge';
import { DecisionTreeDiagram } from '../components/DecisionTreeDiagram';
import { StatCard } from '../components/StatCard';

export const AboutModel = () => {
  const modelMetrics = [
    { title: 'Test Accuracy', value: '80.16%', subtitle: 'Holdout evaluation accuracy', icon: BarChart2, color: 'cyan', badge: 'Test Set' },
    { title: 'Precision', value: '19.76%', subtitle: 'Default prediction precision', icon: Activity, color: 'primary', badge: 'Class 1' },
    { title: 'Recall', value: '23.13%', subtitle: 'Default detection recall', icon: Activity, color: 'warning', badge: 'Sensitivity' },
    { title: 'F1-Score', value: '21.31%', subtitle: 'Harmonic mean of test metrics', icon: CheckCircle2, color: 'success', badge: 'Test F1' },
    { title: '5-Fold CV Mean F1', value: '21.14%', subtitle: 'Cross-validation stability', icon: GitBranch, color: 'primary', badge: '5-Fold CV' }
  ];

  const featuresList = [
    { name: 'Age', type: 'Demographic', desc: 'Borrower age in calendar years (18–100)' },
    { name: 'Income', type: 'Financial', desc: 'Verified annual gross earned income ($)' },
    { name: 'Loan Amount', type: 'Loan Trait', desc: 'Requested borrowing principal ($)' },
    { name: 'Credit Score', type: 'Financial', desc: 'FICO creditworthiness rating (300–850)' },
    { name: 'Months Employed', type: 'Employment', desc: 'Duration with current employer in months' },
    { name: 'Number of Credit Lines', type: 'Financial', desc: 'Total open revolving & installment lines' },
    { name: 'Interest Rate', type: 'Loan Trait', desc: 'Annualized nominal lending rate (%)' },
    { name: 'Loan Term', type: 'Loan Trait', desc: 'Contract duration in months (12–60)' },
    { name: 'DTI Ratio', type: 'Financial', desc: 'Debt-to-income leverage ratio (0.00–1.00)' },
    { name: 'Education', type: 'Demographic', desc: 'Highest completed educational attainment' },
    { name: 'Employment Type', type: 'Employment', desc: 'Full-time, Part-time, Self, Unemployed' },
    { name: 'Marital Status', type: 'Demographic', desc: 'Legal marital categorization' },
    { name: 'Has Mortgage', type: 'Financial', desc: 'Active primary mortgage liability (Yes/No)' },
    { name: 'Has Dependents', type: 'Demographic', desc: 'Dependent family members supported (Yes/No)' },
    { name: 'Loan Purpose', type: 'Loan Trait', desc: 'Intended fund allocation category' },
    { name: 'Has Co-Signer', type: 'Loan Trait', desc: 'Secondary guarantor endorsement (Yes/No)' }
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-badge">MACHINE LEARNING SPECIFICATIONS</div>
        <h1 className="page-title">About the ML Model</h1>
        <p className="page-subtitle">
          Understanding the machine learning model behind our loan risk prediction system.
        </p>
      </div>

      {/* SECTION 1 — MODEL USED */}
      <section style={{ marginBottom: '40px' }}>
        <div className="glass-card" style={{
          padding: '36px',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          background: 'linear-gradient(180deg, rgba(20, 30, 52, 0.75) 0%, rgba(15, 23, 42, 0.9) 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366F1, #38BDF8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)'
              }}>
                <GitBranch size={28} color="#FFFFFF" />
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Decision Tree Classifier
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Supervised Classification Algorithm • Tree-based Partitioning
                </div>
              </div>
            </div>

            <span className="page-badge" style={{ margin: 0, background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#34D399' }}>
              Selected ML Model
            </span>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: 1.7, maxWidth: '980px', margin: 0 }}>
            A Decision Tree Classifier is a supervised machine learning algorithm that makes predictions by learning a series of decision rules from the training data. The resulting structure looks like a tree, where each decision leads toward a final classification.
          </p>
        </div>
      </section>

      {/* SECTION 2 — WHY DECISION TREE? */}
      <section style={{ marginBottom: '40px' }}>
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <HelpCircle size={20} color="#38BDF8" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Why We Used It
            </h3>
          </div>

          {/* Bullet points grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '14px',
            marginBottom: '24px'
          }}>
            {[
              'Easy to understand and interpret during evaluation',
              'Suitable for binary loan classification problems (Default vs No Default)',
              'Works natively with multiple applicant and loan-related features',
              'Produces transparent, rule-based decision paths',
              'Easy to explain and defend during institutional project presentation'
            ].map((pt, idx) => (
              <div key={idx} style={{
                padding: '12px 16px',
                borderRadius: '10px',
                background: 'var(--bg-segmented)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.88rem',
                color: 'var(--text-secondary)'
              }}>
                <CheckCircle2 size={16} color="#38BDF8" style={{ flexShrink: 0 }} />
                <span>{pt}</span>
              </div>
            ))}
          </div>

          {/* Student-Friendly Academic Summary Callout */}
          <div style={{
            padding: '20px 24px',
            borderRadius: '14px',
            background: 'var(--bg-segmented)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            fontSize: '0.94rem'
          }}>
            <p style={{ margin: '0 0 12px 0', color: 'var(--text-secondary)' }}>
              "Decision Tree Classifier is used in this project because it can learn decision rules from applicant and loan-related features and produce an easy-to-understand classification result. In our model evaluation, the Decision Tree achieved a test F1-score of 21.31% and a 5-fold cross-validation mean F1-score of 21.14%. F1-score is useful for this project because the dataset is imbalanced and the system needs to identify default cases rather than relying only on overall accuracy."
            </p>
            <p style={{ margin: '0 0 12px 0', color: 'var(--text-secondary)' }}>
              "A Decision Tree makes predictions by splitting the data using learned conditions, forming a tree-like structure from the root to the final prediction."
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '8px',
              background: 'var(--badge-bg)',
              border: '1px solid var(--badge-border)',
              color: 'var(--badge-color)',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}>
              <CheckCircle2 size={15} />
              In our evaluation, the Decision Tree achieved the highest 5-fold cross-validation Mean F1-score among the models tested during development.
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — MODEL PERFORMANCE */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ marginBottom: '20px' }}>
          <div className="page-badge">EMPIRICAL BENCHMARKS</div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Model Performance Metrics
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {modelMetrics.map((m) => (
            <StatCard key={m.title} {...m} />
          ))}
        </div>
      </section>

      {/* SECTION 4 — MODEL PERFORMANCE GRAPH & OVERFITTING */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          gap: '24px'
        }} className="graphs-grid">
          {/* Horizontal Bar Chart of Metrics */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Decision Tree Metric Performance
                </h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Evaluated on holdout test partition</span>
              </div>
              <span className="badge-model">Decision Tree</span>
            </div>
            <PerformanceHorizontalBar />
          </div>

          {/* Overfitting Visualization */}
          <div>
            <OverfittingGauge />
          </div>
        </div>
      </section>

      {/* SECTION 5 — DATASET */}
      <section style={{ marginBottom: '40px' }}>
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Database size={20} color="#818CF8" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Dataset Overview & Target Distribution
            </h3>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '24px' }}>
            The dataset contains applicant demographic, financial, employment and loan-related information.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-segmented)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Dataset Records</span>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>255,347</div>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-segmented)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Prediction Features</span>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: '#38BDF8' }}>16 Features</div>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>No Default (Class 0)</span>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: '#34D399' }}>225,694</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>88.39% of dataset</span>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Default (Class 1)</span>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: '#FB7185' }}>29,653</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>11.61% of dataset</span>
            </div>
          </div>

          <div style={{
            padding: '14px 18px',
            borderRadius: '10px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            fontSize: '0.84rem',
            color: 'var(--text-secondary)'
          }}>
            <strong style={{ color: '#D97706' }}>Class Imbalance Consideration:</strong> Approximately 88.39% of records belong to Class 0 (No Default) while only 11.61% belong to Class 1 (Default). This is why standard Accuracy alone can be misleading in credit risk models, making Precision, Recall, and cross-validated F1-score the primary evaluation criteria.
          </div>
        </div>
      </section>

      {/* SECTION 6 — FEATURES USED */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ marginBottom: '20px' }}>
          <div className="page-badge">INPUT ARCHITECTURE</div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Model Input Features (16 Features)
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '14px'
        }}>
          {featuresList.map((f, idx) => (
            <div key={f.name} className="glass-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818CF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                flexShrink: 0
              }}>
                {idx + 1}
              </span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.94rem' }}>
                    {f.name}
                  </span>
                  <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', background: 'var(--bg-segmented)', color: 'var(--text-muted)' }}>
                    {f.type}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7 — HOW DECISION TREE WORKS */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ marginBottom: '20px' }}>
          <div className="page-badge">INTERPRETABLE AI</div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
            How Decision Tree Works
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
            Conceptual flowchart of hierarchical recursive partitioning from root inputs to final risk classification.
          </p>
        </div>

        <DecisionTreeDiagram />
      </section>

      {/* SECTION 8 — MODEL LIMITATION & CONSIDERATION */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px'
        }} className="limitations-grid">
          {/* Card 1: Model Consideration */}
          <div className="glass-card" style={{ padding: '28px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertTriangle size={18} color="#F59E0B" />
              </div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#FFFFFF', margin: 0, fontWeight: 700 }}>
                Model Consideration
              </h4>
            </div>
            <p style={{ color: '#CBD5E1', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              "The Decision Tree achieved 100% training accuracy while its test accuracy was 80.16%, which indicates that the model can overfit the training data. Therefore, model complexity and hyperparameter tuning are important when preparing the final production model."
            </p>
          </div>

          {/* Card 2: Model Limitation */}
          <div className="glass-card" style={{ padding: '28px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(244, 63, 94, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldAlert size={18} color="#F43F5E" />
              </div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#FFFFFF', margin: 0, fontWeight: 700 }}>
                Model Limitation
              </h4>
            </div>
            <p style={{ color: '#CBD5E1', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              "The model's performance depends on the quality and distribution of the training data. The Decision Tree also showed a difference between training and testing accuracy, so controlling model complexity is important to reduce overfitting."
            </p>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .graphs-grid { grid-template-columns: 1fr !important; }
          .limitations-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
