import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Moon, 
  Sun,
  Bell, 
  Save, 
  Sliders,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { addToast } = useNotification();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Loan Officer',
    email: user?.email || 'analyst@finrisk.ai',
    role: user?.role || 'Senior Underwriting Analyst',
    organization: user?.organization || 'Commercial Credit Risk Unit'
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    addToast('Profile preferences updated successfully', 'success');
  };

  const handleLogout = async () => {
    await logout();
    addToast('You have been signed out', 'info');
    navigate('/login');
  };

  return (
    <div className="page-container" style={{ maxWidth: '960px' }}>
      {/* Header */}
      <div className="page-header">
        <div className="page-badge">ACCOUNT PREFERENCES</div>
        <h1 className="page-title">Officer Profile & Settings</h1>
        <p className="page-subtitle">
          Manage your account profile, prediction alerts, and visual appearance preferences.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* User Information Card */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #6366F1, #38BDF8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontFamily: 'var(--font-heading)',
              fontSize: '1.8rem',
              fontWeight: 800,
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
              flexShrink: 0
            }}>
              {profileForm.name ? profileForm.name[0].toUpperCase() : 'A'}
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                {profileForm.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                <Mail size={14} />
                <span>{profileForm.email}</span>
                <span>•</span>
                <span className="badge-model" style={{ padding: '2px 8px' }}>{profileForm.role}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="input-group">
              <label className="input-label" htmlFor="user-name">Full Name</label>
              <input
                id="user-name"
                type="text"
                className="text-input"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="user-email">Email Address</label>
              <input
                id="user-email"
                type="email"
                className="text-input"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="user-role">Role Title</label>
              <input
                id="user-role"
                type="text"
                className="text-input"
                value={profileForm.role}
                onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="user-dept">Department / Unit</label>
              <input
                id="user-dept"
                type="text"
                className="text-input"
                value={profileForm.organization}
                onChange={(e) => setProfileForm({ ...profileForm, organization: e.target.value })}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="submit" className="btn-primary" style={{ padding: '10px 22px', fontSize: '0.88rem' }}>
                <Save size={16} />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* System & Notification Settings */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Sliders size={18} color="#38BDF8" />
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                System & Theme Preferences
              </h4>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Visual appearance and telemetry controls
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Theme Selector */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--bg-segmented)', borderRadius: '12px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {theme === 'dark' ? <Moon size={20} color="#818CF8" /> : <Sun size={20} color="#F59E0B" />}
                <div>
                  <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>Theme Appearance</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Current: <strong>{theme === 'dark' ? 'Dark Navy' : 'Clean White (Light)'}</strong>
                  </div>
                </div>
              </div>

              {/* Segmented Theme Buttons */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`segmented-btn ${theme === 'dark' ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}
                >
                  <Moon size={14} />
                  <span>Dark</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`segmented-btn ${theme === 'light' ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}
                >
                  <Sun size={14} />
                  <span>Light (White)</span>
                </button>
              </div>
            </div>

            {/* In-App Toast Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--bg-segmented)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bell size={18} color="#34D399" />
                <div>
                  <div style={{ color: 'var(--text-primary)', fontSize: '0.88rem', fontWeight: 600 }}>Assessment Feedback Toasts</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Show toast notifications when calculations and saves complete</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#6366F1', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Logout Session Action */}
        <div className="glass-card" style={{ padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 600 }}>
              End Analyst Session
            </h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Safely clears cached session credentials
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="btn-secondary"
            style={{ padding: '10px 18px', color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};
