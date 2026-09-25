import { getApiConfig } from './apiConfig';

const HISTORY_STORAGE_KEY = 'loan_prediction_assessments_history';

/**
 * Service to manage assessment history.
 * Fetches from backend /history if available, otherwise persists genuine assessments
 * performed by the user locally so records are preserved across sessions.
 */
export const historyService = {
  /**
   * Fetch assessment history.
   * Does NOT return fake dummy records. If none conducted or saved, returns empty array.
   */
  async getHistory() {
    const config = getApiConfig();
    const targetUrl = `${config.baseUrl.replace(/\/+$/, '')}${config.historyEndpoint}`;

    // Try backend if live
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(targetUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
        if (data.history && Array.isArray(data.history)) return data.history;
      }
    } catch {
      // Backend not yet reachable or history endpoint not defined, read local user assessments
    }

    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  /**
   * Add a newly completed assessment result to history.
   */
  async addRecord(record) {
    const history = await this.getHistory();
    const newRecord = {
      id: record.id || `AST-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      date: record.date || new Date().toISOString().split('T')[0],
      timestamp: record.timestamp || new Date().toISOString(),
      loanAmount: Number(record.loanAmount || 0),
      creditScore: Number(record.creditScore || 0),
      prediction: record.predictionLabel || (record.prediction === 1 ? 'Default' : 'No Default'),
      risk: record.risk || (record.prediction === 1 || record.predictionLabel === 'Default' ? 'High' : 'Low'),
      model: record.model || 'Decision Tree Classifier',
      details: record.details || record
    };

    const updated = [newRecord, ...history];
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to store history locally', e);
    }

    // Attempt to sync with backend if online
    try {
      const config = getApiConfig();
      const targetUrl = `${config.baseUrl.replace(/\/+$/, '')}${config.historyEndpoint}`;
      await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord)
      }).catch(() => {});
    } catch {}

    return newRecord;
  },

  /**
   * Clear local assessment history.
   */
  async clearHistory() {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    return true;
  }
};
