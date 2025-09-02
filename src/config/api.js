// API Configuration for Sales Frontend
// Centralized configuration to avoid environment variable conflicts

const isDevelopment = process.env.NODE_ENV === 'development';

// Production URLs (default)
const PRODUCTION_CONFIG = {
  AUTH_API_URL: 'https://auth-api.dropux.co',
  SALES_API_URL: 'https://api-sales.dropux.co',
  GOOGLE_API_URL: 'https://google-api.dropux.co',
  CONTROL_API_URL: 'https://control-api.dropux.co',
};

// Development URLs (only when explicitly enabled)
const DEVELOPMENT_CONFIG = {
  AUTH_API_URL: 'http://localhost:8004',
  SALES_API_URL: 'http://localhost:8001',
  GOOGLE_API_URL: 'http://localhost:8000',
  CONTROL_API_URL: 'http://localhost:8002',
};

// Override logic: Use production by default, only use development if explicitly set
const getAPIConfig = () => {
  // ALWAYS use production URLs for deployed environments (regardless of NODE_ENV)
  if (typeof window !== 'undefined' && (
    window.location.hostname === 'app.dropux.co' ||
    window.location.hostname === 'sales.dropux.co' ||
    window.location.hostname.includes('vercel.app')
  )) {
    console.log('🚀 PRODUCTION MODE: Using production API URLs - hostname:', window.location.hostname);
    console.log('AUTH_API_URL:', PRODUCTION_CONFIG.AUTH_API_URL);
    return PRODUCTION_CONFIG;
  }

  // ONLY use development URLs for localhost
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log('🔧 DEVELOPMENT MODE: Using local API URLs');
    return DEVELOPMENT_CONFIG;
  }

  // Default to production for any other case
  console.log('✅ DEFAULT MODE: Using production API URLs');
  return PRODUCTION_CONFIG;
};

const config = getAPIConfig();

export const AUTH_API_URL = config.AUTH_API_URL;
export const SALES_API_URL = config.SALES_API_URL;
export const GOOGLE_API_URL = config.GOOGLE_API_URL;
export const CONTROL_API_URL = config.CONTROL_API_URL;

export default config;