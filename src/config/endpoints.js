/**
 * Centralized API Endpoints Configuration
 * ✅ EMPRESARIAL: Sin hardcode, fácil mantenimiento
 */

export const ENDPOINTS = {
  // Auth API Endpoints
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout', 
    REFRESH: '/auth/refresh',
    ME: '/auth/me'
  },

  // Admin Endpoints
  ADMIN: {
    USERS: '/admin/users',
    ROLE_PERMISSIONS: '/admin/role-permissions',
    GET_ROLE_PERMISSIONS: '/admin/role-permissions',
    UPDATE_ROLE_PERMISSIONS: '/admin/save-role-permissions',
    SAVE_ROLE_PERMISSIONS: '/admin/save-role-permissions',
    SAVE_RESTRICTED_PAGES: '/admin/save-restricted-pages',
    SAVE_USER_RESTRICTIONS: '/admin/save-user-restrictions'
  },

  // Google API Endpoints
  GOOGLE_API: {
    SETUP_STATUS: '/api/v1/google-api/setup/status',
    AUTH_START: '/api/v1/google-api/auth/start',
    AUTH_VERIFY: '/api/v1/google-api/auth/verify',
    PROCESS_EMAILS: '/api/v1/google-api/process/emails',
    AUDIT_EMAILS: '/api/v1/google-api/audit/emails'
  },

  // Control API Endpoints
  CONTROL: {
    REPORTS: '/api/reports',
    CONSOLIDADOR: '/api/consolidador'
  }
};

export default ENDPOINTS;