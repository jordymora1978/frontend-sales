import config from '../config/api';

class ApiService {
  constructor() {
    this.API_BASE = config.SALES_API_URL;
    this.initializeAuth();
  }

  initializeAuth() {
    const storedToken = localStorage.getItem('auth_token');
    const storedExpiry = localStorage.getItem('token_expiry');
    
    if (storedToken && storedExpiry) {
      const now = new Date();
      const expiry = new Date(storedExpiry);
      
      if (now >= expiry) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔒 Token expired, clearing auth');
        }
        this.logout();
        return;
      }
      
      this.token = storedToken;
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Auth restored from localStorage');
      }
    } else {
      this.token = null;
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.API_BASE}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 API Request:', {
        url,
        method: config.method || 'GET'
        // Headers and body excluded for security
      });
    }

    try {
      const response = await fetch(url, config);
      
      const responseText = await response.text();
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📡 Response Status:', response.status);
        console.log('📡 Response Body (truncated):', responseText.substring(0, 200) + '...');
      }
      
      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
          throw new Error('Session expired');
        }
        
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.detail || `API Error: ${response.status}`);
        } catch {
          throw new Error(`API Error: ${response.status} - ${responseText}`);
        }
      }

      try {
        return JSON.parse(responseText);
      } catch {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to parse JSON:', responseText);
        }
        throw new Error('Invalid JSON response from server');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ API Request failed:', error);
      }
      throw error;
    }
  }

  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.access_token) {
      this.token = response.access_token;
      
      const expiry = new Date();
      expiry.setHours(23, 59, 59, 999);
      
      localStorage.setItem('auth_token', this.token);
      localStorage.setItem('token_expiry', expiry.toISOString());
      localStorage.setItem('user', JSON.stringify(response.user));
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔑 Token stored, expires at: ${expiry.toLocaleString()}`);
      }
    }

    return response;
  }

  async verifyToken() {
    try {
      const response = await this.request('/auth/me');
      return response;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token_expiry');
    localStorage.removeItem('user');
    if (process.env.NODE_ENV === 'development') {
      console.log('🚪 Logged out, auth cleared');
    }
  }

  async getMLStores() {
    return await this.request('/api/ml/my-stores');
  }

  async setupMLStore(storeData) {
    return await this.request('/api/ml/stores/setup', {
      method: 'POST',
      body: JSON.stringify(storeData),
    });
  }

  async getSystemStatus() {
    return await this.request('/status');
  }

  async getHealthCheck() {
    return await this.request('/health');
  }

  isAuthenticated() {
    if (!this.token) return false;
    
    const storedExpiry = localStorage.getItem('token_expiry');
    if (!storedExpiry) return false;
    
    const now = new Date();
    const expiry = new Date(storedExpiry);
    
    if (now >= expiry) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔒 Token expired during check');
      }
      this.logout();
      return false;
    }
    
    return true;
  }

  checkTokenExpiration() {
    const storedExpiry = localStorage.getItem('token_expiry');
    if (!storedExpiry || !this.token) return false;
    
    const now = new Date();
    const expiry = new Date(storedExpiry);
    
    if (now >= expiry) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔒 Auto-logout: Token expired');
      }
      this.logout();
      return false;
    }
    
    return true;
  }

  startTokenValidation() {
    setInterval(() => {
      if (this.token) {
        this.checkTokenExpiration();
      }
    }, 30000);
  }

  getUser() {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }
}

const apiServiceInstance = new ApiService();
apiServiceInstance.startTokenValidation();

export default apiServiceInstance;