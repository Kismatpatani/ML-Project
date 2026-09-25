import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const OverfittingGauge = () => {
  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.7)',
      border: '1px solid rgba(245, 158, 11, 0.25)',
      borderRadius: '16px',
      padding: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
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
        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: '#F8FAFC', margin: 0 }}>
            Training Accuracy vs Test Accuracy
          </h4>
          <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
            Empirical evidence of Decision Tree overfitting
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '20px' }}>
        {/* Training Accuracy Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.86rem' }}>
            <span style={{ color: '#E2E8F0', fontWeight: 500 }}>Training Accuracy (Unpruned Tree)</span>
            <strong style={{ color: '#38BDF8', fontFamily: 'var(--font-heading)' }}>100.00%</strong>
          </div>
          <div style={{
            width: '100%',
            height: '14px',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '999px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, #38BDF8, #6366F1)',
              borderRadius: '999px'
            }} />
          </div>
        </div>

        {/* Testing Accuracy Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.86rem' }}>
            <span style={{ color: '#E2E8F0', fontWeight: 500 }}>Test Accuracy (Generalization on Holdout)</span>
            <strong style={{ color: '#F59E0B', fontFamily: 'var(--font-heading)' }}>80.16%</strong>
          </div>
          <div style={{
            width: '100%',
            height: '14px',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '999px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '80.16%',
              height: '100%',
              background: 'linear-gradient(90deg, #F59E0B, #EF4444)',
              borderRadius: '999px'
            }} />
          </div>
        </div>
      </div>

      {/* Overfitting Gap Analysis */}
      <div style={{
        padding: '12px 14px',
        background: 'rgba(245, 158, 11, 0.08)',
        borderRadius: '10px',
        border: '1px dashed rgba(245, 158, 11, 0.3)',
        fontSize: '0.82rem',
        color: '#CBD5E1',
        lineHeight: 1.5
      }}>
        <strong style={{ color: '#FBBF24' }}>Overfitting Gap: 19.84% difference.</strong> Because the unconstrained Decision Tree creates splits until leaf purity is reached, it memorizes training patterns (100%), exhibiting lower test accuracy (80.16%). This highlights why max depth tuning and pruning are critical for production robustness.
      </div>
    </div>
  );
};
