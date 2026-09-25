import React, { useState } from 'react';
import { X, Server, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { getApiConfig, saveApiConfig, testBackendConnection, resetApiConfig } from '../services/apiConfig';
import { useNotification } from '../context/NotificationContext';

export const ApiConfigModal = ({ isOpen, onClose }) => {
  const { addToast } = useNotification();
  const [config, setConfig] = useState(getApiConfig());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleSave = () => {
    saveApiConfig(config);
    addToast('Backend URL saved successfully!', 'success');
    onClose();
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testBackendConnection(config.baseUrl);
    setTestResult(res);
    setTesting(false);
  };

  const handleReset = () => {
    const def = resetApiConfig();
    setConfig(def);
    setTestResult(null);
    addToast('Reset to default backend URL', 'info');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9990,
      background: 'var(--modal-overlay)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--bg-card-solid)',
        border: '1px solid var(--border-light)',
        borderRadius: '20px',
        maxWidth: '520px',
        width: '100%',
        boxShadow: 'var(--card-shadow)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--badge-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Server size={18} color="var(--primary-light)" />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>
                Backend API Connection
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Connect your existing ML prediction server
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Simple Body Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label className="input-label" htmlFor="api-base-url">
              <span>Backend Server URL</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Default: http://127.0.0.1:8000</span>
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                id="api-base-url"
                type="text"
                className="text-input"
                value={config.baseUrl}
                onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                placeholder="http://127.0.0.1:8000"
              />
              <button
                onClick={handleTest}
                disabled={testing}
                style={{
                  padding: '0 16px',
                  borderRadius: '10px',
                  background: 'var(--badge-bg)',
                  border: '1px solid var(--badge-border)',
                  color: 'var(--badge-color)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                <RefreshCw size={14} className={testing ? 'animate-spin' : ''} />
                {testing ? 'Testing...' : 'Test Ping'}
              </button>
            </div>
          </div>

          {/* Test Ping Status */}
          {testResult && (
            <div style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: testResult.connected ? 'var(--success-bg)' : 'var(--danger-bg)',
              border: `1px solid ${testResult.connected ? 'var(--success-border)' : 'var(--danger-border)'}`,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontSize: '0.84rem'
            }}>
              {testResult.connected ? (
                <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
              ) : (
                <AlertCircle size={18} color="#F43F5E" style={{ flexShrink: 0, marginTop: '2px' }} />
              )}
              <div>
                <strong style={{ color: testResult.connected ? '#10B981' : '#F43F5E' }}>
                  {testResult.connected ? 'Connected Successfully!' : 'Server Offline or Not Reached'}
                </strong>
                <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {testResult.message}
                </div>
              </div>
            </div>
          )}

          <div style={{
            padding: '12px 14px',
            borderRadius: '10px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5
          }}>
            When you run your Python model (Flask / FastAPI), ensure CORS is enabled. The form will send the 16 applicant values to <code>{config.baseUrl}/predict</code>.
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={handleReset}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.84rem' }}
          >
            Reset Default
          </button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.88rem' }}>
              Save & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
