import api from './api';

const AUTH_BASE_URL = 'http://localhost';

export const authApi = {
  /**
   * Returns the Google OAuth authorization URL
   */
  getGoogleAuthUrl: () => {
    return `${AUTH_BASE_URL}/api/auth/google`;
  },

  /**
   * Triggers redirection to Google OAuth endpoint
   */
  loginWithGoogle: () => {
    window.location.href = authApi.getGoogleAuthUrl();
  },

  /**
   * Fetch current authenticated user session
   */
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  /**
   * Logout current authenticated user session
   */
  logout: async () => {
    const response = await api.get('/api/auth/logout');
    return response.data;
  },
};

export default authApi;
