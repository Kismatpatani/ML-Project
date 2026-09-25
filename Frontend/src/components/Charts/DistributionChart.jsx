import React, { useState } from 'react';

export const DistributionChart = ({ defaultCount = 0, noDefaultCount = 0 }) => {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const total = defaultCount + noDefaultCount;

  if (total === 0) {
    return (
      <div style={{
        height: '240px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748B',
        fontSize: '0.88rem'
      }}>
        <span>No assessment data available to chart</span>
      </div>
    );
  }

  const defaultPct = total > 0 ? (defaultCount / total) * 100 : 0;
  const noDefaultPct = total > 0 ? (noDefaultCount / total) * 100 : 0;

  // SVG Donut calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const noDefaultStroke = (noDefaultPct / 100) * circumference;
  const defaultStroke = (defaultPct / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{ position: 'relative', width: '180px', height: '180px' }}>
        <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="20"
          />
          {/* No Default (Green/Cyan) */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke="#10B981"
            strokeWidth="20"
            strokeDasharray={`${noDefaultStroke} ${circumference}`}
            strokeDashoffset="0"
            style={{
              transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
              opacity: hoveredSegment === 'default' ? 0.4 : 1,
              cursor: 'pointer'
            }}
            onMouseEnter={() => setHoveredSegment('noDefault')}
            onMouseLeave={() => setHoveredSegment(null)}
          />
          {/* Default (Red/Rose) */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke="#F43F5E"
            strokeWidth="20"
            strokeDasharray={`${defaultStroke} ${circumference}`}
            strokeDashoffset={-noDefaultStroke}
            style={{
              transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
              opacity: hoveredSegment === 'noDefault' ? 0.4 : 1,
              cursor: 'pointer'
            }}
            onMouseEnter={() => setHoveredSegment('default')}
            onMouseLeave={() => setHoveredSegment(null)}
          />
        </svg>

        {/* Center label */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {hoveredSegment === 'default' ? 'Default' : hoveredSegment === 'noDefault' ? 'No Default' : 'Total'}
          </span>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>
            {hoveredSegment === 'default' ? `${defaultPct.toFixed(1)}%` :
             hoveredSegment === 'noDefault' ? `${noDefaultPct.toFixed(1)}%` : total}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '20px', fontSize: '0.84rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#10B981' }} />
          <span style={{ color: '#CBD5E1' }}>No Default: <strong>{noDefaultCount}</strong> ({noDefaultPct.toFixed(1)}%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#F43F5E' }} />
          <span style={{ color: '#CBD5E1' }}>Default: <strong>{defaultCount}</strong> ({defaultPct.toFixed(1)}%)</span>
        </div>
      </div>
    </div>
  );
};
