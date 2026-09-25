import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  ShieldAlert, 
  ShieldCheck, 
  Calculator, 
  ArrowRight, 
  AlertTriangle, 
  Sparkles, 
  Database
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { DistributionChart } from '../components/Charts/DistributionChart';
import { RiskBarChart } from '../components/Charts/RiskBarChart';
import { ActivityChart } from '../components/Charts/ActivityChart';
import { useHistory } from '../context/HistoryContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export const Dashboard = () => {
  const { history, realHistoryCount, isDemoMode, setIsDemoMode, stats } = useHistory();

  const isRealEmpty = realHistoryCount === 0 && !isDemoMode;

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
        <div>
          <div className="page-badge">INSTITUTIONAL METRICS</div>
          <h1 className="page-title">Risk Analysis Dashboard</h1>
          <p className="page-subtitle">
            Monitor loan risk assessments and prediction activity.
          </p>
        </div>

        {/* Action Controls: New Assessment & Demo Data Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '10px',
              background: isDemoMode ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${isDemoMode ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255, 255, 255, 0.12)'}`,
              color: isDemoMode ? '#FBBF24' : '#CBD5E1',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Sparkles size={16} />
            <span>{isDemoMode ? 'Demo Mode Active' : 'Enable Demo Preview'}</span>
          </button>

          <Link to="/predict" className="btn-primary" style={{ padding: '10px 18px', fontSize: '0.88rem' }}>
            <Calculator size={16} />
            <span>New Assessment</span>
          </Link>
        </div>
      </div>

      {/* Demo Notice Banner (if enabled) */}
      {isDemoMode && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '12px',
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '28px',
          fontSize: '0.85rem',
          color: '#FEF3C7'
        }}>
          <AlertTriangle size={18} color="#F59E0B" style={{ flexShrink: 0 }} />
          <span>
            <strong>Demo Presentation Mode:</strong> Displaying sample assessment records for dashboard layout preview. Turn off demo mode to view only live/recorded assessments.
          </span>
        </div>
      )}

      {/* Empty State Banner (if no assessments and demo mode is off) */}
      {isRealEmpty ? (
        <div className="glass-card" style={{
          padding: '60px 32px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(99, 102, 241, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <Database size={30} color="#818CF8" />
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
            No Assessments Performed Yet
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.92rem', maxWidth: '480px', lineHeight: 1.6, marginBottom: '24px' }}>
            Live assessment metrics will populate here automatically as loan evaluations are processed by the Decision Tree model.
          </p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/predict" className="btn-primary">
              <span>Run First Assessment</span>
              <ArrowRight size={16} />
            </Link>
            <button onClick={() => setIsDemoMode(true)} className="btn-secondary">
              <span>View Sample Dashboard</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Top Metric Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            <StatCard
              title="Total Assessments"
              value={stats.total}
              subtitle="Evaluated loan profiles"
              icon={BarChart3}
              color="primary"
            />
            <StatCard
              title="Default Predictions"
              value={stats.defaultCount}
              subtitle="Class 1: High credit risk"
              icon={ShieldAlert}
              color="danger"
            />
            <StatCard
              title="No Default Predictions"
              value={stats.noDefaultCount}
              subtitle="Class 0: Solvent loan terms"
              icon={ShieldCheck}
              color="success"
            />
            <StatCard
              title="High Risk Cases"
              value={stats.highRiskCount}
              subtitle="Flagged for manual review"
              icon={AlertTriangle}
              color="warning"
            />
          </div>

          {/* Charts Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '24px',
            marginBottom: '36px'
          }}>
            {/* Chart 1: Default vs No Default Distribution */}
            <div className="glass-card dash-col-4" style={{ gridColumn: 'span 4', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                  Classification Distribution
                </h3>
                <span className="badge-model">Target (0/1)</span>
              </div>
              <DistributionChart
                defaultCount={stats.defaultCount}
                noDefaultCount={stats.noDefaultCount}
              />
            </div>

            {/* Chart 2: Risk Categorization */}
            <div className="glass-card dash-col-4" style={{ gridColumn: 'span 4', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                  Risk Distribution
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Severity tiers</span>
              </div>
              <RiskBarChart
                low={stats.noDefaultCount}
                medium={0}
                high={stats.defaultCount}
              />
            </div>

            {/* Chart 3: Prediction Activity */}
            <div className="glass-card dash-col-4" style={{ gridColumn: 'span 4', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                  Prediction Activity
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Recent velocity</span>
              </div>
              <ActivityChart assessments={history} />
            </div>
          </div>

          {/* Recent Assessments Quick Registry */}
          <div className="glass-card" style={{ padding: '24px', overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  Recent Predictions
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Last processed applicant profiles</span>
              </div>
              <Link to="/history" style={{ color: '#38BDF8', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>View Full History</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94A3B8' }}>
                  <th style={{ padding: '12px 14px' }}>Assessment ID</th>
                  <th style={{ padding: '12px 14px' }}>Date</th>
                  <th style={{ padding: '12px 14px' }}>Loan Amount</th>
                  <th style={{ padding: '12px 14px' }}>Credit Score</th>
                  <th style={{ padding: '12px 14px' }}>Model</th>
                  <th style={{ padding: '12px 14px' }}>Prediction</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 5).map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: '#E2E8F0' }}>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#818CF8' }}>{item.id}</td>
                    <td style={{ padding: '12px 14px' }}>{formatDate(item.date)}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 600 }}>{formatCurrency(item.loanAmount)}</td>
                    <td style={{ padding: '12px 14px' }}>{item.creditScore}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge-model">Decision Tree</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {item.prediction === 'Default' ? (
                        <span className="badge-default">Default</span>
                      ) : (
                        <span className="badge-nodefault">No Default</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .dash-col-4 {
            grid-column: span 6 !important;
          }
        }
        @media (max-width: 768px) {
          .dash-col-4 {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </div>
  );
};
