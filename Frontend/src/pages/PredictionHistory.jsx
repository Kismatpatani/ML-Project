import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Download, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Calendar, 
  Database,
  X
} from 'lucide-react';
import { useHistory } from '../context/HistoryContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useNotification } from '../context/NotificationContext';

export const PredictionHistory = () => {
  const { history, clearAllHistory } = useHistory();
  const { addToast } = useNotification();

  const [searchQuery, setSearchQuery] = useState('');
  const [predictionFilter, setPredictionFilter] = useState('ALL'); // 'ALL' | 'Default' | 'No Default'
  const [dateFilter, setDateFilter] = useState('ALL'); // 'ALL' | '7DAYS' | '30DAYS'
  const [sortField, setSortField] = useState('timestamp');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const pageSize = 8;

  // Filter and sort history
  const filteredRecords = useMemo(() => {
    return history.filter((item) => {
      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.id.toLowerCase().includes(q) ||
        String(item.loanAmount).includes(q) ||
        String(item.creditScore).includes(q) ||
        (item.date && item.date.toLowerCase().includes(q));

      // Prediction filter
      const matchesPrediction = predictionFilter === 'ALL' || item.prediction === predictionFilter;

      // Date filter
      let matchesDate = true;
      if (dateFilter !== 'ALL') {
        const itemDate = new Date(item.timestamp || item.date);
        const now = new Date();
        const diffDays = (now - itemDate) / (1000 * 60 * 60 * 24);
        if (dateFilter === '7DAYS') matchesDate = diffDays <= 7;
        if (dateFilter === '30DAYS') matchesDate = diffDays <= 30;
      }

      return matchesSearch && matchesPrediction && matchesDate;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === 'timestamp' || sortField === 'date') {
        valA = new Date(valA || a.date).getTime();
        valB = new Date(valB || b.date).getTime();
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [history, searchQuery, predictionFilter, dateFilter, sortField, sortAsc]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      addToast('No records available to export', 'warning');
      return;
    }
    const headers = ['Assessment ID', 'Date', 'Loan Amount', 'Credit Score', 'Prediction', 'Risk', 'Model'];
    const rows = filteredRecords.map(r => [
      r.id,
      r.date,
      r.loanAmount,
      r.creditScore,
      r.prediction,
      r.risk,
      r.model
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `loan_assessments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('History exported to CSV file', 'success');
  };

  const handleClearHistory = async () => {
    await clearAllHistory();
    setShowClearConfirm(false);
    addToast('Assessment history cleared', 'info');
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="page-badge">AUDIT TRAIL & LOGS</div>
          <h1 className="page-title">Prediction History</h1>
          <p className="page-subtitle">
            Auditable record of historical loan evaluations and Decision Tree classification results.
          </p>
        </div>

        {/* Global Controls */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleExportCSV}
            disabled={filteredRecords.length === 0}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.84rem' }}
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          {history.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="btn-outline-danger"
            >
              <Trash2 size={15} />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '18px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <input
              type="text"
              className="text-input"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search by ID, amount, credit score..."
              style={{ paddingLeft: '38px', fontSize: '0.88rem' }}
            />
            <Search size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '14px' }} />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            {/* Prediction Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} color="#94A3B8" />
              <select
                className="select-input"
                style={{ padding: '8px 12px', fontSize: '0.84rem', width: 'auto' }}
                value={predictionFilter}
                onChange={(e) => { setPredictionFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="ALL">All Outcomes</option>
                <option value="No Default">No Default Only</option>
                <option value="Default">Default Only</option>
              </select>
            </div>

            {/* Date Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} color="#94A3B8" />
              <select
                className="select-input"
                style={{ padding: '8px 12px', fontSize: '0.84rem', width: 'auto' }}
                value={dateFilter}
                onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="ALL">All Dates</option>
                <option value="7DAYS">Last 7 Days</option>
                <option value="30DAYS">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table or Empty State */}
      {filteredRecords.length === 0 ? (
        <div className="glass-card" style={{
          padding: '64px 20px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Database size={26} color="#64748B" />
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#CBD5E1', marginBottom: '6px' }}>
            No prediction history available yet.
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.88rem', maxWidth: '420px', lineHeight: 1.5, margin: 0 }}>
            Run a loan risk evaluation to generate an assessment record, or adjust your active search and filters.
          </p>
        </div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94A3B8' }}>
                  <th style={{ padding: '14px 16px', cursor: 'pointer' }} onClick={() => handleSort('date')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Date</span>
                      <ArrowUpDown size={13} />
                    </div>
                  </th>
                  <th style={{ padding: '14px 16px' }}>Assessment ID</th>
                  <th style={{ padding: '14px 16px', cursor: 'pointer' }} onClick={() => handleSort('loanAmount')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Loan Amount</span>
                      <ArrowUpDown size={13} />
                    </div>
                  </th>
                  <th style={{ padding: '14px 16px', cursor: 'pointer' }} onClick={() => handleSort('creditScore')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Credit Score</span>
                      <ArrowUpDown size={13} />
                    </div>
                  </th>
                  <th style={{ padding: '14px 16px' }}>Prediction</th>
                  <th style={{ padding: '14px 16px' }}>Risk</th>
                  <th style={{ padding: '14px 16px' }}>Model</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px', color: '#94A3B8' }}>{formatDate(item.date)}</td>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: '#818CF8', fontWeight: 600 }}>
                      {item.id}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#F8FAFC' }}>
                      {formatCurrency(item.loanAmount)}
                    </td>
                    <td style={{ padding: '14px 16px', color: item.creditScore >= 670 ? '#34D399' : '#FBBF24' }}>
                      {item.creditScore}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {item.prediction === 'Default' ? (
                        <span className="badge-default">Default</span>
                      ) : (
                        <span className="badge-nodefault">No Default</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        color: item.risk === 'High' || item.prediction === 'Default' ? '#FB7185' : '#34D399',
                        fontWeight: 600,
                        fontSize: '0.82rem'
                      }}>
                        {item.risk || (item.prediction === 'Default' ? 'High' : 'Low')}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="badge-model">{item.model || 'Decision Tree Classifier'}</span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedRecord(item)}
                        style={{
                          background: 'rgba(99, 102, 241, 0.1)',
                          border: '1px solid rgba(99, 102, 241, 0.3)',
                          color: '#818CF8',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Eye size={13} />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.84rem',
            color: '#94A3B8'
          }}>
            <div>
              Showing {filteredRecords.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredRecords.length)} of {filteredRecords.length} records
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: currentPage === 1 ? '#475569' : '#CBD5E1',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: currentPage >= totalPages ? '#475569' : '#CBD5E1',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal for Selected History Record */}
      {selectedRecord && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9996,
          background: 'rgba(7, 11, 20, 0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#0B1120',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            borderRadius: '20px',
            maxWidth: '520px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span className="badge-model">{selectedRecord.model || 'Decision Tree Classifier'}</span>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: '#FFFFFF', margin: '8px 0 0 0', fontSize: '1.25rem' }}>
                  {selectedRecord.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: '12px',
              background: selectedRecord.prediction === 'Default' ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.12)',
              border: `1px solid ${selectedRecord.prediction === 'Default' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase' }}>Classification Result</div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.8rem',
                fontWeight: 800,
                color: selectedRecord.prediction === 'Default' ? '#FB7185' : '#34D399',
                margin: '4px 0'
              }}>
                {selectedRecord.prediction}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#CBD5E1' }}>
                Risk Tier: <strong>{selectedRecord.risk}</strong>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#64748B' }}>Loan Amount:</span>
                <div style={{ color: '#F8FAFC', fontWeight: 600 }}>{formatCurrency(selectedRecord.loanAmount)}</div>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Credit Score:</span>
                <div style={{ color: '#F8FAFC', fontWeight: 600 }}>{selectedRecord.creditScore}</div>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Evaluation Date:</span>
                <div style={{ color: '#F8FAFC', fontWeight: 600 }}>{formatDate(selectedRecord.date)}</div>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Model:</span>
                <div style={{ color: '#818CF8', fontWeight: 600 }}>{selectedRecord.model}</div>
              </div>
            </div>

            <button
              onClick={() => setSelectedRecord(null)}
              className="btn-primary"
              style={{ width: '100%', marginTop: '24px', padding: '10px' }}
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Clearing History */}
      {showClearConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          background: 'rgba(7, 11, 20, 0.85)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#0B1120',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            borderRadius: '18px',
            maxWidth: '440px',
            width: '100%',
            padding: '28px',
            textAlign: 'center'
          }}>
            <Trash2 size={36} color="#F43F5E" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', color: '#FFFFFF', fontSize: '1.2rem', marginBottom: '8px' }}>
              Clear Assessment History?
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '24px' }}>
              This will permanently delete locally recorded assessments. This action cannot be reversed.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setShowClearConfirm(false)} className="btn-secondary" style={{ padding: '8px 18px' }}>
                Cancel
              </button>
              <button onClick={handleClearHistory} className="btn-outline-danger" style={{ padding: '8px 20px', background: '#F43F5E', color: '#fff', border: 'none' }}>
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
