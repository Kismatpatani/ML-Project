import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { historyService } from '../services/historyService';

const HistoryContext = createContext(null);

// Curated sample evaluation dataset for presentation preview mode ONLY, clearly labelled as demo
const DEMO_ASSESSMENTS = [
  {
    id: 'AST-DEC-7821',
    date: '2026-09-24',
    timestamp: '2026-09-24T14:15:00Z',
    loanAmount: 45000,
    creditScore: 680,
    prediction: 'No Default',
    risk: 'Low',
    model: 'Decision Tree Classifier',
    details: { income: 75000, dtiRatio: 0.35, loanTerm: 36, education: "Bachelor's" }
  },
  {
    id: 'AST-DEC-7820',
    date: '2026-09-23',
    timestamp: '2026-09-23T11:20:00Z',
    loanAmount: 85000,
    creditScore: 540,
    prediction: 'Default',
    risk: 'High',
    model: 'Decision Tree Classifier',
    details: { income: 42000, dtiRatio: 0.62, loanTerm: 60, education: 'High School' }
  },
  {
    id: 'AST-DEC-7819',
    date: '2026-09-22',
    timestamp: '2026-09-22T09:45:00Z',
    loanAmount: 25000,
    creditScore: 720,
    prediction: 'No Default',
    risk: 'Low',
    model: 'Decision Tree Classifier',
    details: { income: 90000, dtiRatio: 0.22, loanTerm: 24, education: "Master's" }
  },
  {
    id: 'AST-DEC-7818',
    date: '2026-09-21',
    timestamp: '2026-09-21T16:10:00Z',
    loanAmount: 60000,
    creditScore: 590,
    prediction: 'Default',
    risk: 'High',
    model: 'Decision Tree Classifier',
    details: { income: 51000, dtiRatio: 0.55, loanTerm: 48, education: 'Associate' }
  },
  {
    id: 'AST-DEC-7817',
    date: '2026-09-20',
    timestamp: '2026-09-20T13:30:00Z',
    loanAmount: 32000,
    creditScore: 710,
    prediction: 'No Default',
    risk: 'Low',
    model: 'Decision Tree Classifier',
    details: { income: 68000, dtiRatio: 0.28, loanTerm: 36, education: "Bachelor's" }
  }
];

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const refreshHistory = useCallback(async () => {
    setLoading(true);
    try {
      const records = await historyService.getHistory();
      setHistory(records);
    } catch (e) {
      console.error('Failed to load history', e);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const addAssessment = async (record) => {
    const saved = await historyService.addRecord(record);
    setHistory((prev) => [saved, ...prev]);
    return saved;
  };

  const clearAllHistory = async () => {
    await historyService.clearHistory();
    setHistory([]);
  };

  // Determine active dataset based on mode
  const activeRecords = isDemoMode ? DEMO_ASSESSMENTS : history;

  const totalCount = activeRecords.length;
  const defaultCount = activeRecords.filter(r => r.prediction === 'Default').length;
  const noDefaultCount = activeRecords.filter(r => r.prediction === 'No Default').length;
  const highRiskCount = activeRecords.filter(r => r.risk === 'High' || r.prediction === 'Default').length;

  return (
    <HistoryContext.Provider
      value={{
        history: activeRecords,
        realHistoryCount: history.length,
        loading,
        isDemoMode,
        setIsDemoMode,
        refreshHistory,
        addAssessment,
        clearAllHistory,
        stats: {
          total: totalCount,
          defaultCount,
          noDefaultCount,
          highRiskCount
        }
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error('useHistory must be used within HistoryProvider');
  return ctx;
};
