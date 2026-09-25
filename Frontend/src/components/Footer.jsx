import React from 'react';
import { Link } from 'react-router-dom';
import { GitBranch, Shield, Database, Cpu } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      background: 'var(--footer-bg)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '44px 20px 30px 20px',
      color: 'var(--text-muted)',
      fontSize: '0.88rem',
      transition: 'background 0.25s ease, border-color 0.25s ease'
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '36px',
        marginBottom: '36px'
      }}>
        {/* Brand & Project Info */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '14px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <GitBranch size={18} color="#FFFFFF" />
            </div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '1.05rem',
              color: 'var(--text-primary)'
            }}>
              Loan Default Prediction System
            </span>
          </div>
          <p style={{ lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: '14px', fontSize: '0.86rem' }}>
            Machine learning platform engineered for institutional loan default risk assessment, powered by supervised classification rules.
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 10px',
            borderRadius: '6px',
            background: 'var(--badge-bg)',
            border: '1px solid var(--badge-border)',
            color: 'var(--badge-color)',
            fontSize: '0.78rem',
            fontWeight: 700
          }}>
            <Cpu size={14} />
            Decision Tree Classifier
          </div>
        </div>

        {/* System Navigation */}
        <div>
          <h4 style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.95rem',
            fontWeight: 700,
            marginBottom: '16px'
          }}>
            Navigation
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>
                Home & Overview
              </Link>
            </li>
            <li>
              <Link to="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>
                Analytics Dashboard
              </Link>
            </li>
            <li>
              <Link to="/predict" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>
                Loan Assessment Form
              </Link>
            </li>
            <li>
              <Link to="/history" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>
                Prediction History
              </Link>
            </li>
            <li>
              <Link to="/about-model" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>
                Decision Tree ML Specifications
              </Link>
            </li>
          </ul>
        </div>

        {/* Machine Learning Specs */}
        <div>
          <h4 style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.95rem',
            fontWeight: 700,
            marginBottom: '16px'
          }}>
            ML Model Specs
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
              <span>Algorithm</span>
              <strong style={{ color: 'var(--text-primary)' }}>Decision Tree</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
              <span>Test Accuracy</span>
              <strong style={{ color: 'var(--cyan-light)' }}>80.16%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
              <span>5-Fold CV Mean F1</span>
              <strong style={{ color: '#10B981' }}>21.14%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
              <span>Dataset Size</span>
              <strong style={{ color: 'var(--text-primary)' }}>255,347 Records</strong>
            </div>
          </div>
        </div>

        {/* Architecture & Integration */}
        <div>
          <h4 style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.95rem',
            fontWeight: 700,
            marginBottom: '16px'
          }}>
            Architecture Layer
          </h4>
          <p style={{ lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: '12px', fontSize: '0.83rem' }}>
            Decoupled frontend with a pluggable service layer. Supports direct connection to external RESTful ML inference services via configurable environment variables.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
            <Database size={14} />
            <span>Target: Default (0 = No Default, 1 = Default)</span>
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '14px 18px',
        borderRadius: '12px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <Shield size={20} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5 }}>
          <strong style={{ color: '#F59E0B' }}>Official Project Disclaimer:</strong> This application is an educational machine-learning project designed for loan default risk prediction. Predictions should be treated as decision-support information and not as the sole basis for financial decisions.
        </p>
      </div>

      {/* Copyright */}
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        fontSize: '0.78rem',
        color: 'var(--text-dim)',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '18px'
      }}>
        <div>
          Loan Default Prediction System © {new Date().getFullYear()}. All Rights Reserved.
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>Supervised ML: Decision Tree Classifier</span>
          <span>•</span>
          <span>16 Input Features</span>
          <span>•</span>
          <span>Capstone Release</span>
        </div>
      </div>
    </footer>
  );
};
