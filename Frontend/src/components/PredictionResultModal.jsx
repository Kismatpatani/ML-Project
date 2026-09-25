import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertOctagon, 
  GitBranch, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  BookmarkCheck, 
  Shield
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { useNotification } from '../context/NotificationContext';

export const PredictionResultModal = ({ isOpen, onClose, result, formData, onResetForm }) => {
  const { addToast } = useNotification();
  const [showDetails, setShowDetails] = useState(false);

  if (!isOpen || !result) return null;

  const isDefault = result.prediction === 1 || result.predictionLabel === 'Default';

  const handleSave = () => {
    addToast('Assessment record saved to Prediction History', 'success');
    onClose();
  };

  const handleAdjust = () => {
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9995,
      background: 'var(--modal-overlay)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: 'var(--bg-card-solid)',
        border: `1px solid ${isDefault ? 'rgba(244, 63, 94, 0.45)' : 'rgba(16, 185, 129, 0.45)'}`,
        borderRadius: '24px',
        maxWidth: '620px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: 'var(--card-shadow)',
        position: 'relative'
      }}>
        {/* Top Header */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <GitBranch size={16} color="#818CF8" />
            </div>
            <span style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#818CF8'
            }}>
              LOAN DEFAULT PREDICTION
            </span>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Hero Result Banner */}
        <div style={{
          padding: '36px 28px',
          textAlign: 'center',
          background: isDefault 
            ? 'radial-gradient(ellipse at top, rgba(244, 63, 94, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.15) 0%, transparent 70%)'
        }}>
          {/* Visual Indicator Icon */}
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            margin: '0 auto 20px auto',
            background: isDefault ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.12)',
            border: `2px solid ${isDefault ? '#F43F5E' : '#10B981'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isDefault ? '0 0 30px rgba(244, 63, 94, 0.3)' : '0 0 30px rgba(16, 185, 129, 0.3)'
          }}>
            {isDefault ? (
              <AlertOctagon size={42} color="#FB7185" />
            ) : (
              <CheckCircle2 size={42} color="#34D399" />
            )}
          </div>

          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            DEFAULT RISK EVALUATION
          </div>

          {/* Large Result Status */}
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.4rem, 6vw, 3.2rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            color: isDefault ? '#FB7185' : '#34D399',
            letterSpacing: '-0.02em',
            marginBottom: '10px'
          }}>
            {result.predictionLabel ? result.predictionLabel : (isDefault ? 'Default' : 'No Default')}
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '20px',
            background: isDefault ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${isDefault ? 'rgba(244, 63, 94, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
            fontSize: '0.88rem',
            fontWeight: 700,
            color: isDefault ? '#FFA4B2' : '#A7F3D0'
          }}>
            <Shield size={16} />
            <span>Risk Tier: {result.riskLevel || (isDefault ? 'HIGH RISK' : 'LOW RISK')}</span>
          </div>

          {/* Probability or Risk Score ONLY IF backend returns it */}
          {result.probability !== null && result.probability !== undefined && (
            <div style={{ marginTop: '16px', fontSize: '0.9rem', color: '#CBD5E1' }}>
              Model Probability: <strong style={{ color: '#38BDF8' }}>{formatPercent(result.probability)}</strong>
            </div>
          )}

          {/* Model Specification Card */}
          <div style={{
            marginTop: '28px',
            padding: '14px 18px',
            borderRadius: '12px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.85rem'
          }}>
            <span style={{ color: 'var(--text-muted)' }}>Model Used:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                {result.modelUsed || 'Decision Tree Classifier'}
              </strong>
              <span className="badge-model">Production ML</span>
            </div>
          </div>
        </div>

        {/* Assessment Details Toggle */}
        <div style={{ padding: '0 28px 24px 28px' }}>
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>View Assessment Details</span>
            {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {/* Collapsible Details Grid */}
          {showDetails && (
            <div style={{
              marginTop: '12px',
              padding: '18px',
              borderRadius: '12px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              fontSize: '0.82rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>Loan Amount:</span>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formatCurrency(formData.loanAmount)}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>Credit Score:</span>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formData.creditScore}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>Annual Income:</span>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formatCurrency(formData.income)}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>DTI Ratio:</span>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{Math.round(formData.dtiRatio * 100)}%</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>Employment:</span>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formData.employmentType} ({formData.monthsEmployed} mos)</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>Interest Rate:</span>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formData.interestRate}% ({formData.loanTerm} mos)</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>Loan Purpose:</span>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formData.loanPurpose}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>Co-Signer:</span>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formData.hasCoSigner}</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '20px 28px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <button
            onClick={handleAdjust}
            className="btn-secondary"
            style={{ padding: '10px 18px', fontSize: '0.88rem' }}
          >
            <RotateCcw size={16} />
            <span>Adjust Inputs & Re-predict</span>
          </button>

          <button
            onClick={handleSave}
            className="btn-primary"
            style={{ padding: '10px 24px', fontSize: '0.88rem' }}
          >
            <BookmarkCheck size={16} />
            <span>Save Assessment</span>
          </button>
        </div>
      </div>
    </div>
  );
};
