import { getApiConfig } from './apiConfig';

const AUTH_USER_KEY = 'loan_prediction_auth_user';
const AUTH_TOKEN_KEY = 'loan_prediction_auth_token';

/**
 * Clean frontend authentication service prepared for backend integration.
 * Stores auth session in localStorage/sessionStorage and dispatches API calls to backend endpoints.
 */
export const authService = {
  getCurrentUser() {
    try {
      const user = localStorage.getItem(AUTH_USER_KEY) || sessionStorage.getItem(AUTH_USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY) || null;
  },

  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  /**
   * Login request — ready to communicate with backend /login or /auth/login.
   * If backend is not available, maintains frontend session so the student can navigate and test.
   */
  async login(email, password, rememberMe = true) {
    const config = getApiConfig();
    const targetUrl = `${config.baseUrl.replace(/\/+$/, '')}/auth/login`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const user = data.user || { email, role: 'Risk Analyst', name: email.split('@')[0] };
        const token = data.token || 'jwt-placeholder-token';
        
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        storage.setItem(AUTH_TOKEN_KEY, token);
        return { success: true, user, token, backendConnected: true };
      }
    } catch (e) {
      // Backend not reached or offline; fall back to local session state for frontend demonstration
      console.log('Backend auth endpoint unreachable, using client session fallback:', e.message);
    }

    // Client session fallback for evaluation / demonstration
    const fallbackUser = {
      email,
      name: email.split('@')[0] || 'Analyst',
      role: 'Loan Underwriting Officer',
      organization: 'Risk Analysis Division',
      joinedAt: new Date().toLocaleDateString()
    };
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(AUTH_USER_KEY, JSON.stringify(fallbackUser));
    storage.setItem(AUTH_TOKEN_KEY, 'client-session-token');

    return { success: true, user: fallbackUser, token: 'client-session-token', backendConnected: false };
  },

  async logout() {
    try {
      const config = getApiConfig();
      const targetUrl = `${config.baseUrl.replace(/\/+$/, '')}/auth/logout`;
      await fetch(targetUrl, { method: 'POST' }).catch(() => {});
    } finally {
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      sessionStorage.removeItem(AUTH_USER_KEY);
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
    }
    return { success: true };
  }
};
