import React from 'react';

export const ActivityChart = ({ assessments = [] }) => {
  // Aggregate assessments by date or time buckets
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Calculate activity from records or default empty
  const dayCounts = [0, 0, 0, 0, 0, 0, 0];
  if (assessments.length > 0) {
    assessments.forEach((item) => {
      try {
        const d = new Date(item.timestamp || item.date);
        const dayIdx = (d.getDay() + 6) % 7; // Monday = 0
        dayCounts[dayIdx] = (dayCounts[dayIdx] || 0) + 1;
      } catch {
        dayCounts[3] += 1;
      }
    });
  }

  const maxVal = Math.max(...dayCounts, 5);

  const points = dayCounts.map((val, idx) => {
    const x = (idx / 6) * 360 + 20;
    const y = 140 - (val / maxVal) * 110;
    return `${x},${y}`;
  });

  const pathD = `M 20,140 L ${points.join(' L ')} L 380,140 Z`;
  const lineD = `M ${points.join(' L ')}`;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ position: 'relative', width: '100%', height: '180px' }}>
        <svg width="100%" height="100%" viewBox="0 0 400 160" preserveAspectRatio="none">
          <defs>
            <linearGradient id="activityGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="20" y1="30" x2="380" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
          <line x1="20" y1="85" x2="380" y2="85" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
          <line x1="20" y1="140" x2="380" y2="140" stroke="rgba(255,255,255,0.12)" />

          {/* Area fill */}
          {assessments.length > 0 && (
            <path d={pathD} fill="url(#activityGrad)" />
          )}

          {/* Line curve */}
          {assessments.length > 0 && (
            <path d={lineD} fill="none" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          )}

          {/* Data point circles */}
          {assessments.length > 0 && dayCounts.map((val, idx) => {
            const x = (idx / 6) * 360 + 20;
            const y = 140 - (val / maxVal) * 110;
            return (
              <g key={idx}>
                <circle cx={x} cy={y} r="5" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
                {val > 0 && (
                  <text x={x} y={y - 10} fill="#E2E8F0" fontSize="10" textAnchor="middle" fontWeight="600">
                    {val}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* X Axis Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px', fontSize: '0.78rem', color: '#64748B' }}>
        {days.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </div>
  );
};
