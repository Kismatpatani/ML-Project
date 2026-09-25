import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GitBranch, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateLoginForm } from '../utils/validators';
import { useNotification } from '../context/NotificationContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useNotification();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateLoginForm(formData.email, formData.password);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const res = await login(formData.email, formData.password, formData.rememberMe);
      if (res.success) {
        addToast(`Welcome back, ${res.user.name || 'Officer'}!`, 'success');
        navigate('/dashboard');
      } else {
        addToast(res.error || 'Authentication failed. Please verify credentials.', 'error');
      }
    } catch {
      addToast('An unexpected error occurred during login.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1040px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1.05fr 1fr',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(15, 23, 42, 0.85)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)'
      }} className="login-card-container">

        {/* Left Side: AI / Financial Visual */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle glow circle */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            left: '-50px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
            filter: 'blur(30px)'
          }} />

          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#818CF8',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '24px'
            }}>
              <GitBranch size={16} />
              <span>DECISION TREE CLASSIFIER</span>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.1rem',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: '14px'
            }}>
              Intelligent Loan Risk Analysis
            </h2>

            <p style={{
              color: '#CBD5E1',
              fontSize: '1rem',
              lineHeight: 1.6,
              marginBottom: '32px'
            }}>
              Make data-driven risk assessments with machine learning.
            </p>

            {/* Architecture Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={16} color="#10B981" />
                </div>
                <span style={{ fontSize: '0.88rem', color: '#E2E8F0' }}>
                  Pre-configured for ML Backend Integration
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={16} color="#06B6D4" />
                </div>
                <span style={{ fontSize: '0.88rem', color: '#E2E8F0' }}>
                  16 Demographic & Financial Inputs
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={16} color="#818CF8" />
                </div>
                <span style={{ fontSize: '0.88rem', color: '#E2E8F0' }}>
                  Trained on 255K+ Historical Records
                </span>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '36px',
            padding: '14px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '0.78rem',
            color: '#94A3B8'
          }}>
            <span style={{ color: '#CBD5E1', fontWeight: 600 }}>Note:</span> Connect your backend auth route (e.g. <code>/auth/login</code>) in Settings, or log in directly to evaluate the frontend interface.
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
              Analyst Sign In
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', margin: 0 }}>
              Access the risk evaluation and prediction platform
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Email Field */}
            <div>
              <label className="input-label" htmlFor="login-email">
                <span>Work Email</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-email"
                  type="email"
                  className={`text-input ${errors.email ? 'input-error' : ''}`}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="analyst@fintech.io"
                  style={{ paddingLeft: '40px' }}
                />
                <Mail size={18} color="#64748B" style={{ position: 'absolute', left: '14px', top: '15px' }} />
              </div>
              {errors.email && (
                <div className="field-error-text">
                  <AlertCircle size={13} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="input-label" htmlFor="login-password">
                <span>Password</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`text-input ${errors.password ? 'input-error' : ''}`}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  style={{ paddingLeft: '40px', paddingRight: '40px' }}
                />
                <Lock size={18} color="#64748B" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '12px',
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <div className="field-error-text">
                  <AlertCircle size={13} />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#CBD5E1', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  style={{ accentColor: '#6366F1' }}
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => addToast('Password reset link can be managed through your backend identity provider.', 'info')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38BDF8',
                  cursor: 'pointer',
                  fontSize: '0.84rem',
                  textDecoration: 'none'
                }}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', marginTop: '6px' }}
            >
              {submitting ? 'Authenticating...' : 'Sign In to Dashboard'}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick Demo Hint */}
          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.8rem', color: '#64748B' }}>
            Testing frontend without backend? Enter any valid email & 6+ char password.
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .login-card-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
