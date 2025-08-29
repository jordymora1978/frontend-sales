/**
 * Auth Cleanup Utility
 * Professional solution for authentication management
 */

export const cleanupAuth = () => {
  console.log('🔒 Cleaning up authentication data...');
  
  // Clear all auth-related items from localStorage
  const authKeys = [
    'auth_token',
    'refresh_token', 
    'user_data',
    'user_permissions',
    'auth_expires_at',
    'ml_tokens',
    'sso_token'
  ];
  
  authKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      console.log(`  Removing ${key}`);
      localStorage.removeItem(key);
    }
  });
  
  // Clear session storage
  sessionStorage.clear();
  
  console.log('✅ Auth cleanup completed');
  console.log('📍 Redirecting to login...');
  
  // Force redirect to login
  window.location.href = '/login';
};

export const forceLogout = () => {
  // Nuclear option - clear everything
  localStorage.clear();
  sessionStorage.clear();
  
  // Clear cookies if any
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });
  
  // Redirect to login
  window.location.href = '/login';
};

export const validateCurrentSession = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return false;
    }
    
    // Check if token is expired (basic JWT decode)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.error('Invalid token format');
      cleanupAuth();
      return false;
    }
    
    try {
      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        console.error('Token expired');
        cleanupAuth();
        return false;
      }
      
      return true;
    } catch (e) {
      console.error('Failed to decode token:', e);
      cleanupAuth();
      return false;
    }
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
};

// Auto-cleanup on window focus (check session validity)
if (typeof window !== 'undefined') {
  window.addEventListener('focus', () => {
    validateCurrentSession();
  });
}

export default {
  cleanupAuth,
  forceLogout,
  validateCurrentSession
};