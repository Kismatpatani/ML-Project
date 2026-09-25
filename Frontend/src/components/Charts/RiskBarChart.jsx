import React from 'react';

export const RiskBarChart = ({ low = 0, medium = 0, high = 0 }) => {
  const total = low + medium + high;
  const max = Math.max(low, medium, high, 1);

  const categories = [
    { label: 'Low Risk', count: low, color: '#10B981', bg: 'rgba(16, 185, 129, 0.2)' },
    { label: 'Medium Risk', count: medium, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.2)' },
    { label: 'High Risk (Default)', count: high, color: '#F43F5E', bg: 'rgba(244, 63, 94, 0.2)' }
  ];

  if (total === 0) {
    return (
      <div style={{
        height: '240px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748B',
        fontSize: '0.88rem'
      }}>
        <span>No risk categorization data available</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', padding: '10px 0' }}>
      {categories.map((cat) => {
        const pctOfMax = (cat.count / max) * 100;
        const pctOfTotal = total > 0 ? ((cat.count / total) * 100).toFixed(1) : 0;
        return (
          <div key={cat.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
              <span style={{ color: '#CBD5E1', fontWeight: 500 }}>{cat.label}</span>
              <span style={{ color: cat.color, fontWeight: 700 }}>
                {cat.count} assessments ({pctOfTotal}%)
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              borderRadius: '999px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${pctOfMax}%`,
                height: '100%',
                backgroundColor: cat.color,
                borderRadius: '999px',
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: `0 0 10px ${cat.color}88`
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
