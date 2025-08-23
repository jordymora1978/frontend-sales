/**
 * Centralized Auth Service for Sales Frontend
 * Handles authentication with auth-api.dropux.co
 */

import axios from 'axios';

// API URLs
const AUTH_API_URL = process.env.REACT_APP_AUTH_API_URL || 'https://auth-api.dropux.co';
const SALES_API_URL = process.env.REACT_APP_SALES_API_URL || 'https://api-sales.dropux.co';

// Token management
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

class AuthService {
  constructor() {
    this.token = localStorage.getItem(TOKEN_KEY);
    this.refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    this.user = this.getUserFromStorage();
    
    // Setup axios interceptors for automatic token handling
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor - add auth header
    axios.interceptors.request.use(
      (config) => {
        if (this.token && this.isValidApiUrl(config.url)) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle token refresh
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            await this.refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${this.token}`;
            return axios(originalRequest);
          } catch (refreshError) {
            this.logout();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  isValidApiUrl(url) {
    return url && (
      url.includes(AUTH_API_URL) || 
      url.includes(SALES_API_URL) ||
      url.startsWith('/') // Relative URLs
    );
  }

  /**
   * Login user with email and password
   */
  async login(email, password) {
    try {
      const response = await axios.post(`${AUTH_API_URL}/auth/login`, {
        email,
        password
      });

      if (response.data.access_token) {
        this.setAuthData(response.data);
        return response.data.user;
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.detail || 'Authentication failed');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${AUTH_API_URL}/auth/refresh`, {
        refresh_token: this.refreshToken
      });

      if (response.data.access_token) {
        this.setAuthData(response.data);
        return response.data.access_token;
      } else {
        throw new Error('No access token in refresh response');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      throw error;
    }
  }

  /**
   * Get current user info from auth API
   */
  async getCurrentUser() {
    try {
      const response = await axios.get(`${AUTH_API_URL}/auth/me`);
      
      if (response.data.user) {
        this.user = response.data.user;
        localStorage.setItem(USER_KEY, JSON.stringify(this.user));
        return this.user;
      }
      
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      if (error.response?.status === 401) {
        this.logout();
      }
      return null;
    }
  }

  /**
   * Logout user and clear all auth data
   */
  async logout() {
    try {
      if (this.refreshToken) {
        await axios.post(`${AUTH_API_URL}/auth/logout`, {
          refresh_token: this.refreshToken
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local logout even if API call fails
    } finally {
      this.clearAuthData();
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!(this.token && this.user);
  }

  /**
   * Get current user data
   */
  getUser() {
    return this.user;
  }

  /**
   * Check if user has specific permission for sales app
   */
  hasPermission(permissionType = 'read') {
    if (!this.user) return false;
    
    // SUPER_ADMIN has all permissions
    if (this.user.roles?.includes('SUPER_ADMIN')) return true;
    
    // Check specific sales permissions
    return this.user.permissions?.some(permission => 
      permission.app_name === 'sales' && 
      (permission.permission_type === permissionType || permission.permission_type === 'admin')
    );
  }

  /**
   * Check if user has admin permissions for sales app
   */
  isAdmin() {
    return this.hasPermission('admin') || this.user?.roles?.includes('SALES_ADMIN');
  }

  /**
   * Set authentication data in storage and memory
   */
  setAuthData(authData) {
    this.token = authData.access_token;
    this.refreshToken = authData.refresh_token;
    this.user = authData.user;

    localStorage.setItem(TOKEN_KEY, this.token);
    if (this.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, this.refreshToken);
    }
    localStorage.setItem(USER_KEY, JSON.stringify(this.user));
  }

  /**
   * Clear all authentication data
   */
  clearAuthData() {
    this.token = null;
    this.refreshToken = null;
    this.user = null;

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Get user data from localStorage
   */
  getUserFromStorage() {
    try {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data from storage:', error);
      return null;
    }
  }

  /**
   * Make authenticated API call to Sales API
   */
  async apiCall(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${SALES_API_URL}${endpoint}`;
    
    try {
      const response = await axios({
        url,
        method: options.method || 'GET',
        data: options.data,
        params: options.params,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      return response.data;
    } catch (error) {
      console.error(`API call to ${endpoint} failed:`, error);
      throw error;
    }
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;