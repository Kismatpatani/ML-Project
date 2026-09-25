import React from 'react';

export const PerformanceHorizontalBar = () => {
  const metrics = [
    { label: 'Accuracy', value: 80.16, color: '#38BDF8', desc: 'Overall correct classification rate across test set' },
    { label: 'Precision', value: 19.76, color: '#818CF8', desc: 'Proportion of predicted defaults that actually defaulted' },
    { label: 'Recall', value: 23.13, color: '#F59E0B', desc: 'Proportion of actual defaults correctly identified' },
    { label: 'F1-Score', value: 21.31, color: '#10B981', desc: 'Harmonic mean of precision and recall for imbalanced target' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {metrics.map((m) => (
        <div key={m.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.95rem', color: '#F8FAFC' }}>
                {m.label}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', marginLeft: '10px' }}>
                {m.desc}
              </span>
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.15rem', color: m.color }}>
              {m.value.toFixed(2)}%
            </span>
          </div>

          {/* Bar track */}
          <div style={{
            width: '100%',
            height: '14px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '999px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{
              width: `${m.value}%`,
              height: '100%',
              backgroundColor: m.color,
              borderRadius: '999px',
              transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: `0 0 12px ${m.color}66`
            }} />
          </div>
        </div>
      ))}

      {/* Cross validation callout */}
      <div style={{
        marginTop: '12px',
        padding: '12px 16px',
        borderRadius: '10px',
        background: 'rgba(99, 102, 241, 0.08)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>
          5-Fold Cross-Validation Mean F1
        </span>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#A5B4FC', fontSize: '1.05rem' }}>
          21.14%
        </span>
      </div>
    </div>
  );
};
