/**
 * Authentication Context for Sales Frontend
 * Provides global authentication state and methods
 */

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
// Use real auth service for production
// import authService from '../services/mockAuthService';
import authService from '../services/authService';
// import ssoManager from '../utils/ssoManager';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if we have tokens in localStorage
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          
          // Validate token is not expired and user data is valid
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            // Token is invalid, clear everything
            localStorage.clear();
            setUser(null);
          }
        } catch (parseError) {
          console.error('Failed to parse user data:', parseError);
          setUser(null);
          localStorage.removeItem('user_data');
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setError('Failed to initialize authentication');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login(email, password);
      const userData = response.user || response;
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setError(null);
      // Clear all localStorage
      localStorage.clear();
      sessionStorage.clear();
      // Redirect to login
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API fails, clear local state
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/auth/login';
    } finally {
      setLoading(false);
    }
  };

  // Add protection against infinite loops
  useEffect(() => {
    const checkForInfiniteLoop = () => {
      const refreshErrors = parseInt(localStorage.getItem('refresh_error_count') || '0');
      if (refreshErrors > 3) {
        console.warn('Detected potential infinite refresh loop, forcing logout');
        localStorage.removeItem('refresh_error_count');
        authService.forceLogout();
      }
    };

    // Check every 5 seconds for potential loops
    const intervalId = setInterval(checkForInfiniteLoop, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      console.error('Refresh user error:', error);
      return null;
    }
  };

  // Permission checking helpers
  const hasPermission = (permissionType = 'read') => {
    return authService.hasPermission(permissionType);
  };

  const isAdmin = () => {
    return authService.isAdmin();
  };

  // Calculate authentication status based on context state
  const isAuthenticated = useMemo(() => {
    // Only authenticated if we have a valid user object
    return !loading && !!user && !!user.id && !!user.email;
  }, [loading, user]);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    refreshUser,
    hasPermission,
    isAdmin,
    isAuthenticated,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;