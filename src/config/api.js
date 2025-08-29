// API Configuration for Sales Frontend
// Centralized configuration to avoid environment variable conflicts

const isDevelopment = process.env.NODE_ENV === 'development';

// Production URLs (default)
const PRODUCTION_CONFIG = {
  AUTH_API_URL: 'https://auth-api.dropux.co',
  SALES_API_URL: 'https://api-sales.dropux.co',
};

// Development URLs (only when explicitly enabled)
const DEVELOPMENT_CONFIG = {
  AUTH_API_URL: 'http://localhost:8004',
  SALES_API_URL: 'http://localhost:8001',
};

// Override logic: Use production by default, only use development if explicitly set
const getAPIConfig = () => {
  // Force production URLs for deployed environments
  if (typeof window !== 'undefined' && (
    window.location.hostname === 'sales.dropux.co' ||
    window.location.hostname.includes('vercel.app')
  )) {
    console.log('🚀 PRODUCTION MODE: Using production API URLs');
    return PRODUCTION_CONFIG;
  }

  // For local development - force local API
  if (isDevelopment) {
    console.log('🔧 DEVELOPMENT MODE: Using local API URLs');
    return DEVELOPMENT_CONFIG;
  }

  // Default to production
  console.log('✅ DEFAULT MODE: Using production API URLs');
  return PRODUCTION_CONFIG;
};

const config = getAPIConfig();

export const AUTH_API_URL = config.AUTH_API_URL;
export const SALES_API_URL = config.SALES_API_URL;

export default config;