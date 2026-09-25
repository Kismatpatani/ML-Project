// Configuration service for ML Backend API
const STORAGE_KEY = 'loan_prediction_api_config';

const DEFAULT_CONFIG = {
  baseUrl: process.env.REACT_APP_API_BASE_URL || (typeof window !== 'undefined' && window.__API_BASE_URL__) || 'http://127.0.0.1:8000',
  predictEndpoint: '/predict',
  healthEndpoint: '/health',
  historyEndpoint: '/history',
  timeoutMs: 12000,
  simulationMode: false // Developer preview when backend is not yet started
};

export const getApiConfig = () => {
  return DEFAULT_CONFIG;
};

export const saveApiConfig = (newConfig) => {
  try {
    const updated = { ...getApiConfig(), ...newConfig };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Could not save api config', e);
    return DEFAULT_CONFIG;
  }
};

export const resetApiConfig = () => {
  localStorage.removeItem(STORAGE_KEY);
  return DEFAULT_CONFIG;
};

export const testBackendConnection = async (baseUrl) => {
  const targetUrl = (baseUrl || getApiConfig().baseUrl).replace(/\/+$/, '');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(`${targetUrl}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return {
      connected: response.ok,
      status: response.status,
      message: response.ok ? 'Backend service reached successfully!' : `Backend responded with HTTP ${response.status}`
    };
  } catch (err) {
    clearTimeout(timeoutId);
    try {
      const fallbackController = new AbortController();
      const fbTimeout = setTimeout(() => fallbackController.abort(), 2000);
      const rootRes = await fetch(`${targetUrl}/`, {
        method: 'GET',
        signal: fallbackController.signal
      });
      clearTimeout(fbTimeout);
      return {
        connected: rootRes.ok,
        status: rootRes.status,
        message: 'Connected to API host root endpoint.'
      };
    } catch (e2) {
      return {
        connected: false,
        error: err.name === 'AbortError' ? 'Connection timed out' : 'Unable to connect to backend server',
        message: `Could not reach ${targetUrl}. Ensure your backend server is running and CORS is enabled.`
      };
    }
  }
};
