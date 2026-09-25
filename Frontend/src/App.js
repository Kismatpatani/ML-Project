import React, { useState } from 'react';
import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import './styles/theme.css';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { HistoryProvider } from './context/HistoryContext';

// Common Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { LoanPrediction } from './pages/LoanPrediction';
import { PredictionHistory } from './pages/PredictionHistory';
import { AboutModel } from './pages/AboutModel';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';

function AppContent() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-dark)'
    }}>
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Router */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/predict" element={<LoanPrediction />} />
          <Route path="/history" element={<PredictionHistory />} />
          <Route path="/about-model" element={<AboutModel />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Professional Fintech Footer */}
      <Footer />
    </div>
  );
}

function App() {
  // Use BrowserRouter for clean modern URLs; HashRouter fallback if running from file system
  const RouterComponent = typeof window !== 'undefined' && window.location.protocol === 'file:' 
    ? HashRouter 
    : BrowserRouter;

  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <HistoryProvider>
            <RouterComponent>
              <AppContent />
            </RouterComponent>
          </HistoryProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
