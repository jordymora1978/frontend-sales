/**
 * Centralized Auth Service for Sales Frontend
 * Handles authentication with auth-api.dropux.co
 */

import axios from 'axios';
import { AUTH_API_URL, SALES_API_URL } from '../config/api.js';

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
        if (this.token && this.isValidApiUrl(config.url) && !config.skipAuthInterceptor) {
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
        
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.skipAuthInterceptor) {
          originalRequest._retry = true;
          
          try {
            const newToken = await this.refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            console.error('Token refresh failed, logging out:', refreshError);
            await this.forceLogout();
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
      }, {
        // Skip interceptors for this request specifically
        skipAuthInterceptor: true
      });

      if (response.data.access_token) {
        this.setAuthData(response.data);
        return response.data.user;
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Better error handling
      let errorMessage = 'Authentication failed';
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (status === 403) {
          errorMessage = 'Account access denied';
        } else if (status >= 500) {
          errorMessage = 'Server error, please try again';
        } else if (data && typeof data === 'object') {
          // Handle detailed error responses
          if (data.detail) {
            errorMessage = typeof data.detail === 'string' ? data.detail : 'Authentication failed';
          } else if (data.message) {
            errorMessage = data.message;
          }
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error, please check your connection';
      }
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken() {
    if (!this.refreshToken) {
      console.error('No refresh token available for refresh');
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${AUTH_API_URL}/auth/refresh`, {
        refresh_token: this.refreshToken
      }, {
        skipAuthInterceptor: true // Prevent infinite loops
      });

      if (response.data.access_token) {
        this.setAuthData(response.data);
        return response.data.access_token;
      } else {
        throw new Error('No access token in refresh response');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      
      // Different error handling based on status
      if (error.response?.status === 401) {
        console.warn('Refresh token is invalid or expired');
      } else if (error.response?.status >= 500) {
        console.warn('Server error during token refresh');
      } else if (!error.response) {
        console.warn('Network error during token refresh');
      }
      
      // Don't call logout here - let the interceptor handle it with forceLogout
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
   * Force logout with immediate redirect (for token refresh failures)
   */
  async forceLogout() {
    try {
      console.warn('Force logout: clearing all auth data and redirecting to login');
      this.clearAuthData();
      
      // Clear any stuck intervals or timeouts
      if (typeof window !== 'undefined') {
        // Clear session storage as backup
        sessionStorage.clear();
        
        // Force redirect to login
        window.location.href = '/auth/login';
      }
    } catch (error) {
      console.error('Force logout error:', error);
      // Even if everything fails, try to redirect
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
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
    
    // Check if user has roles (súper admin)
    if (this.user.roles?.includes('super_admin')) return true;
    
    // Check new RBAC permissions format: sales:read, sales:write, sales:manage
    const requiredPermission = `sales:${permissionType}`;
    return this.user.permissions?.includes(requiredPermission) || 
           this.user.permissions?.includes('sales:manage'); // manage includes all
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
   * Register a new user
   */
  async register(userData) {
    try {
      const response = await axios.post(`${AUTH_API_URL}/auth/register`, {
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
        country: userData.country || 'Colombia',
        phone: userData.phone,
        company: userData.company || ''
      });

      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Registro exitoso. Tu cuenta será revisada por un administrador.'
      };
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Error al registrar usuario';
      
      if (error.response?.data) {
        const { data, status } = error.response;
        
        if (status === 400) {
          if (data.detail) {
            errorMessage = typeof data.detail === 'string' ? data.detail : 'Datos de registro inválidos';
          } else if (data.message) {
            errorMessage = data.message;
          }
        } else if (status === 409) {
          errorMessage = 'Este email ya está registrado';
        } else if (status >= 500) {
          errorMessage = 'Error del servidor, intente nuevamente';
        }
      } else if (error.request) {
        errorMessage = 'Error de conexión, verifique su internet';
      }
      
      return {
        success: false,
        error: errorMessage
      };
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