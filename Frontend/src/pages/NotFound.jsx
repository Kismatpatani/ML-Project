import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, LayoutDashboard, Calculator } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="page-container" style={{
      minHeight: 'calc(100vh - 72px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 20px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '54px 36px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <FileQuestion size={36} color="#818CF8" />
        </div>

        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '4.5rem',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #6366F1, #38BDF8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
          marginBottom: '12px'
        }}>
          404
        </div>

        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
          Page Not Found
        </h2>

        <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '32px' }}>
          The requested route does not exist or has been relocated within the loan risk assessment system.
        </p>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/dashboard" className="btn-primary" style={{ padding: '12px 24px' }}>
            <LayoutDashboard size={18} />
            <span>Return to Dashboard</span>
          </Link>
          <Link to="/predict" className="btn-secondary" style={{ padding: '12px 20px' }}>
            <Calculator size={18} />
            <span>Loan Prediction</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
