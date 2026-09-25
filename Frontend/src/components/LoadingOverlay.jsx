import React, { useState, useEffect } from 'react';
import { GitBranch, Cpu, ShieldCheck } from 'lucide-react';

export const LoadingOverlay = ({ isVisible }) => {
  const [internalStage, setInternalStage] = useState(1);

  useEffect(() => {
    if (!isVisible) {
      setInternalStage(1);
      return;
    }

    const t1 = setTimeout(() => {
      setInternalStage(2);
    }, 900);

    return () => clearTimeout(t1);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(7, 11, 20, 0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.25s ease'
    }}>
      <div style={{
        background: 'var(--bg-card-solid)',
        border: '1px solid var(--border-primary)',
        borderRadius: '24px',
        padding: '40px 48px',
        maxWidth: '460px',
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxShadow: 'var(--card-shadow)'
      }}>
        {/* Pulsing Central Icon */}
        <div style={{
          position: 'relative',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.2))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          border: '1px solid rgba(99, 102, 241, 0.5)'
        }}>
          {/* Animated concentric rings */}
          <div style={{
            position: 'absolute',
            inset: '-8px',
            borderRadius: '50%',
            border: '2px solid rgba(99, 102, 241, 0.4)',
            animation: 'pulseGlow 2s infinite ease-in-out'
          }} />
          <div style={{
            position: 'absolute',
            inset: '-16px',
            borderRadius: '50%',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            animation: 'pulseGlow 2s infinite ease-in-out',
            animationDelay: '0.4s'
          }} />

          {internalStage === 1 ? (
            <Cpu size={36} color="#38BDF8" />
          ) : (
            <GitBranch size={36} color="#818CF8" />
          )}
        </div>

        {/* Dynamic Multi-Stage Heading */}
        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.35rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '10px'
        }}>
          {internalStage === 1 ? 'Analyzing Applicant Profile...' : 'Running Decision Tree Model...'}
        </h3>

        <p style={{
          fontSize: '0.88rem',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
          marginBottom: '24px'
        }}>
          Evaluating applicant financial parameters against Decision Tree classification rules.
        </p>

        {/* Progress Bar indicator */}
        <div style={{
          width: '100%',
          height: '6px',
          backgroundColor: 'var(--border-subtle)',
          borderRadius: '999px',
          overflow: 'hidden',
          marginBottom: '16px'
        }}>
          <div style={{
            width: internalStage === 1 ? '55%' : '90%',
            height: '100%',
            background: 'linear-gradient(90deg, #6366F1, #38BDF8)',
            borderRadius: '999px',
            transition: 'width 0.8s ease'
          }} />
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.78rem',
          color: 'var(--text-dim)'
        }}>
          <ShieldCheck size={14} color="#10B981" />
          <span>Decision Tree Classifier (Supervised Risk Engine)</span>
        </div>
      </div>
    </div>
  );
};
