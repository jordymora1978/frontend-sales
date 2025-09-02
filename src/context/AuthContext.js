/**
 * Authentication Context for Sales Frontend
 * Provides global authentication state and methods
 */

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
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

const AuthProviderInner = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 🔄 LOADING INICIAL para evitar parpadeo
  const [error, setError] = useState(null);

  // 🔄 Carga inicial: Evita parpadeo al validar autenticación
  useEffect(() => {
    const cachedUser = localStorage.getItem('user_data');
    const token = localStorage.getItem('auth_token');
    
    if (cachedUser && token) {
      try {
        setUser(JSON.parse(cachedUser)); // Usuario disponible desde cache
      } catch (e) {
        console.error('Failed to parse cached user');
        localStorage.removeItem('user_data');
      }
    }
    
    // Finalizar loading después de verificar cache
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      
      // ✅ REVERTIDO: Login normal con timeout rápido de 3 segundos
      const response = await authService.login(email, password);
      const userData = response.user || response;
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed');
      throw error;
    }
  };

  const logout = () => {
    // ⚡ EMPRESARIAL: Logout instantáneo sin recarga de página
    setUser(null);
    setError(null);
    localStorage.clear();
    sessionStorage.clear();
    
    // ⚡ NAVEGACIÓN SPA INSTANTÁNEA (0 segundos)
    navigate('/auth/login', { replace: true });
    
    // API cleanup en background (no bloquea)
    authService.logout().catch(() => {
      console.log('Background logout API cleanup failed');
    });
  };

  // ⚡ EMPRESARIAL: Logout automático a las 23:59 hora local
  useEffect(() => {
    if (!user) return; // Solo si hay usuario logueado
    
    const checkEndOfWorkDay = () => {
      const now = new Date(); // Hora local del usuario
      const hour = now.getHours();
      const minute = now.getMinutes();
      
      // Logout automático a las 23:59
      if (hour === 23 && minute === 59) {
        logout();
        alert('Fin del día laboral. Sesión cerrada automáticamente a las 23:59.');
      }
    };
    
    // Verificar cada minuto
    const interval = setInterval(checkEndOfWorkDay, 60000);
    return () => clearInterval(interval);
  }, [user]); // ⚡ Removí logout de las dependencias para evitar el error

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

// ⚡ EMPRESARIAL: Wrapper para Router
export const AuthProvider = ({ children }) => (
  <Router>
    <AuthProviderInner>{children}</AuthProviderInner>
  </Router>
);

export default AuthContext;