import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  GitBranch, 
  Database, 
  Layers, 
  CheckCircle, 
  FileText, 
  Activity, 
  PieChart, 
  UserCheck, 
  CreditCard, 
  TrendingUp, 
  ShieldAlert
} from 'lucide-react';
import { StatCard } from '../components/StatCard';

export const Home = () => {
  const projectStats = [
    { title: 'Dataset Records', value: '255K+', subtitle: '255,347 evaluated records', icon: Database, color: 'cyan', badge: 'High-Volume' },
    { title: 'Prediction Features', value: '16', subtitle: 'Demographic & financial inputs', icon: Layers, color: 'primary', badge: 'Multi-Factor' },
    { title: 'ML Model', value: 'Decision Tree', subtitle: 'Supervised rule-based classifier', icon: GitBranch, color: 'success', badge: 'Selected' },
    { title: 'Cross Validation', value: '5-Fold', subtitle: 'Mean F1: 21.14% under imbalance', icon: Activity, color: 'warning', badge: 'Robust' }
  ];

  const steps = [
    {
      num: '01',
      title: 'Enter Applicant Details',
      desc: 'Capture fundamental demographic factors including age, education level, dependents, and marital status.',
      icon: UserCheck
    },
    {
      num: '02',
      title: 'Provide Financial Information',
      desc: 'Input annual income, credit score ratings, debt-to-income (DTI) metrics, and existing mortgage obligations.',
      icon: CreditCard
    },
    {
      num: '03',
      title: 'Analyze Loan Profile',
      desc: 'Specify the requested loan principal, nominal interest rate, loan tenure, purpose, and co-signer backing.',
      icon: TrendingUp
    },
    {
      num: '04',
      title: 'View Default Risk Prediction',
      desc: 'Execute the Decision Tree classification model to generate instant default risk assessment and actionable insights.',
      icon: ShieldAlert
    }
  ];

  const features = [
    { title: 'Applicant Analysis', desc: 'Granular assessment of demographic profiles to ensure comprehensive borrower underwriting.', icon: UserCheck },
    { title: 'Financial Profile', desc: 'Precise financial ratio evaluation including debt burden and income solvency indicators.', icon: CreditCard },
    { title: 'Loan Risk Assessment', desc: 'Multivariate examination of tenure, principal exposure, and associated interest terms.', icon: TrendingUp },
    { title: 'ML-Based Prediction', desc: 'Transparent rule-based classification using a trained Decision Tree Classifier.', icon: GitBranch },
    { title: 'Prediction History', desc: 'Auditable registry of all performed evaluations with full parameter tracking.', icon: FileText },
    { title: 'Interactive Dashboard', desc: 'Visual institutional dashboards monitoring portfolio risk and assessment metrics.', icon: PieChart }
  ];

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section style={{
        padding: '48px 0 64px 0',
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '48px',
        alignItems: 'center'
      }} className="hero-grid">
        <div>
          {/* Badge */}
          <div className="page-badge">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 8px #10B981' }} />
            AI-POWERED RISK ANALYSIS
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.12,
            letterSpacing: '-0.03em',
            marginBottom: '18px'
          }}>
            Loan Default <br />
            <span style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #38BDF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Prediction System
            </span>
          </h1>

          <p style={{
            color: '#CBD5E1',
            fontSize: '1.15rem',
            lineHeight: 1.6,
            maxWidth: '560px',
            marginBottom: '32px'
          }}>
            Analyze applicant and loan information with machine learning to assess potential loan default risk.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <Link to="/predict" className="btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              <span>Start Risk Assessment</span>
              <ArrowRight size={18} />
            </Link>

            <Link to="/about-model" className="btn-secondary" style={{ padding: '14px 26px', fontSize: '1rem' }}>
              <span>Explore Our Model</span>
              <GitBranch size={18} />
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '36px', color: '#94A3B8', fontSize: '0.84rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={15} color="#10B981" />
              <span>Decision Tree Classifier</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={15} color="#10B981" />
              <span>16 Assessment Features</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={15} color="#10B981" />
              <span>80.16% Test Accuracy</span>
            </div>
          </div>
        </div>

        {/* Visual Financial/AI Graphic Card */}
        <div style={{ position: 'relative' }}>
          {/* Subtle background glow */}
          <div style={{
            position: 'absolute',
            inset: '-10px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.05) 70%, transparent 100%)',
            filter: 'blur(30px)',
            zIndex: 0
          }} />

          <div className="glass-card" style={{
            position: 'relative',
            zIndex: 1,
            padding: '28px',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(11, 17, 32, 0.95) 100%)'
          }}>
            {/* Header of AI Card */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(99, 102, 241, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <GitBranch size={18} color="#818CF8" />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#FFFFFF', fontSize: '0.92rem' }}>
                    Decision Tree Inference Engine
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                    Supervised Classification Pipeline
                  </div>
                </div>
              </div>
              <span className="badge-model">Production ML</span>
            </div>

            {/* Simulated Live Assessment Preview Box */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Input Feature Vector</span>
                <span style={{ fontSize: '0.82rem', color: '#38BDF8', fontWeight: 600 }}>16 Standardized Inputs</span>
              </div>

              <div style={{
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Evaluation Metric (CV Mean F1)</span>
                <span style={{ fontSize: '0.82rem', color: '#34D399', fontWeight: 700 }}>21.14%</span>
              </div>

              <div style={{
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.76rem', color: '#94A3B8', textTransform: 'uppercase' }}>Target Output</div>
                  <div style={{ fontWeight: 700, color: '#34D399', fontSize: '0.95rem' }}>Default (0 / 1)</div>
                </div>
                <div className="badge-nodefault">
                  <CheckCircle size={13} />
                  <span>Binary Classification</span>
                </div>
              </div>
            </div>

            {/* Tree Branch Visual Preview */}
            <div style={{
              padding: '14px',
              borderRadius: '10px',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              fontSize: '0.78rem',
              color: '#CBD5E1',
              lineHeight: 1.6
            }}>
              <span style={{ color: '#818CF8', fontWeight: 600 }}>Algorithm Principle:</span> Splits dataset recursively based on learned threshold conditions to maximize node purity (Gini index).
            </div>
          </div>
        </div>
      </section>

      {/* Project Statistics Section */}
      <section style={{ marginBottom: '64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="page-badge">PROJECT METRICS</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 700 }}>
            Model & Dataset Foundations
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
            Empirical baseline derived from extensive supervised training and 5-fold cross-validation.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          {projectStats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </section>

      {/* How It Works Section (4 Steps) */}
      <section style={{ marginBottom: '64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div className="page-badge">STREAMLINED UNDERWRITING</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 700 }}>
            How The Assessment Works
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
            A structured four-step methodology to evaluate credit default risk.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="glass-card glass-card-interactive" style={{ padding: '28px 24px', position: 'relative' }}>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: 'rgba(99, 102, 241, 0.18)',
                  position: 'absolute',
                  top: '16px',
                  right: '20px',
                  lineHeight: 1
                }}>
                  {step.num}
                </div>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <Icon size={22} color="#818CF8" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '10px' }}>
                  {step.title}
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.86rem', lineHeight: 1.5, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* System Features Section */}
      <section style={{ marginBottom: '64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div className="page-badge">CAPABILITIES</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 700 }}>
            Comprehensive Risk Assessment Suite
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
            Tailored specifically for analytical rigor and institutional presentation.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.title} className="glass-card" style={{ padding: '24px', display: 'flex', gap: '16px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(6, 182, 212, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={20} color="#38BDF8" />
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.02rem', color: '#FFFFFF', fontWeight: 600, marginBottom: '6px' }}>
                    {feat.title}
                  </h4>
                  <p style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Official Disclaimer Banner */}
      <section style={{
        padding: '24px 28px',
        borderRadius: '16px',
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'rgba(245, 158, 11, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <ShieldAlert size={26} color="#F59E0B" />
        </div>
        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', color: '#FBBF24', fontSize: '0.98rem', fontWeight: 700, marginBottom: '4px' }}>
            Academic Machine Learning Notice
          </h4>
          <p style={{ color: '#CBD5E1', fontSize: '0.86rem', lineHeight: 1.5, margin: 0 }}>
            This application is an educational machine-learning project designed for loan default risk prediction. Predictions should be treated as decision-support information and not as the sole basis for financial decisions.
          </p>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            padding: 24px 0 40px 0 !important;
          }
        }
      `}</style>
    </div>
  );
};
