import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'primary', badge }) => {
  const colorMap = {
    primary: {
      border: 'rgba(99, 102, 241, 0.3)',
      iconBg: 'rgba(99, 102, 241, 0.15)',
      iconColor: '#818CF8',
      textGrad: 'linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 100%)'
    },
    cyan: {
      border: 'rgba(6, 182, 212, 0.3)',
      iconBg: 'rgba(6, 182, 212, 0.15)',
      iconColor: '#38BDF8',
      textGrad: 'linear-gradient(135deg, #38BDF8 0%, #E0F2FE 100%)'
    },
    success: {
      border: 'rgba(16, 185, 129, 0.3)',
      iconBg: 'rgba(16, 185, 129, 0.15)',
      iconColor: '#34D399',
      textGrad: 'linear-gradient(135deg, #34D399 0%, #D1FAE5 100%)'
    },
    danger: {
      border: 'rgba(244, 63, 94, 0.3)',
      iconBg: 'rgba(244, 63, 94, 0.15)',
      iconColor: '#FB7185',
      textGrad: 'linear-gradient(135deg, #FB7185 0%, #FFE4E6 100%)'
    },
    warning: {
      border: 'rgba(245, 158, 11, 0.3)',
      iconBg: 'rgba(245, 158, 11, 0.15)',
      iconColor: '#FBBF24',
      textGrad: 'linear-gradient(135deg, #FBBF24 0%, #FEF3C7 100%)'
    }
  };

  const scheme = colorMap[color] || colorMap.primary;

  return (
    <div
      className="glass-card"
      style={{
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        border: `1px solid ${scheme.border}`
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {title}
          </span>
          {badge && (
            <span style={{
              marginLeft: '8px',
              fontSize: '0.72rem',
              padding: '2px 8px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#CBD5E1'
            }}>
              {badge}
            </span>
          )}
        </div>
        {Icon && (
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: scheme.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Icon size={20} color={scheme.iconColor} />
          </div>
        )}
      </div>

      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '2.2rem',
        fontWeight: 800,
        background: scheme.textGrad,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '6px',
        lineHeight: 1.1
      }}>
        {value}
      </div>

      {subtitle && (
        <div style={{ fontSize: '0.84rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};
