/**
 * OAuth Service - Enterprise authentication with Google & Microsoft
 * Manages social login flows for business users
 */

class OAuthService {
  constructor() {
    // OAuth configuration - These will be replaced with your actual IDs
    this.config = {
      google: {
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
        redirectUri: process.env.REACT_APP_OAUTH_REDIRECT_URI || window.location.origin + '/auth/callback',
        scope: 'openid email profile'
      },
      microsoft: {
        clientId: process.env.REACT_APP_MICROSOFT_CLIENT_ID || 'YOUR_MICROSOFT_CLIENT_ID',
        authority: 'https://login.microsoftonline.com/common',
        redirectUri: process.env.REACT_APP_OAUTH_REDIRECT_URI || window.location.origin + '/auth/callback',
        scope: 'openid email profile'
      }
    };

    // Track OAuth state
    this.state = {
      isLoading: false,
      error: null
    };
  }

  // Google OAuth Handler
  async handleGoogleLogin(credential) {
    try {
      this.state.isLoading = true;
      this.state.error = null;

      // Send credential to backend for verification
      const response = await fetch('https://auth-api.dropux.co/auth/oauth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          credential: credential,
          client_id: this.config.google.clientId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'OAuth authentication failed');
      }

      const data = await response.json();
      
      // Store tokens
      this.saveAuthTokens(data);

      return {
        success: true,
        user: data.user,
        tokens: data.tokens,
        isNewUser: data.isNewUser || false
      };

    } catch (error) {
      console.error('Google OAuth error:', error);
      this.state.error = error.message;
      return {
        success: false,
        error: error.message
      };
    } finally {
      this.state.isLoading = false;
    }
  }

  // Microsoft OAuth Handler
  async handleMicrosoftLogin(authCode) {
    try {
      this.state.isLoading = true;
      this.state.error = null;

      // Send auth code to backend for token exchange
      const response = await fetch('https://auth-api.dropux.co/auth/oauth/microsoft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          auth_code: authCode,
          redirect_uri: this.config.microsoft.redirectUri
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Microsoft OAuth authentication failed');
      }

      const data = await response.json();
      
      // Store tokens
      this.saveAuthTokens(data);

      return {
        success: true,
        user: data.user,
        tokens: data.tokens,
        isNewUser: data.isNewUser || false
      };

    } catch (error) {
      console.error('Microsoft OAuth error:', error);
      this.state.error = error.message;
      return {
        success: false,
        error: error.message
      };
    } finally {
      this.state.isLoading = false;
    }
  }

  // Generic OAuth handler for future providers
  async handleOAuthCallback(provider, params) {
    switch (provider.toLowerCase()) {
      case 'google':
        return this.handleGoogleLogin(params.credential);
      case 'microsoft':
        return this.handleMicrosoftLogin(params.code);
      default:
        return {
          success: false,
          error: `Unsupported OAuth provider: ${provider}`
        };
    }
  }

  // Save authentication tokens securely
  saveAuthTokens(authData) {
    try {
      // Store access token
      if (authData.access_token) {
        localStorage.setItem('access_token', authData.access_token);
      }

      // Store refresh token if provided
      if (authData.refresh_token) {
        localStorage.setItem('refresh_token', authData.refresh_token);
      }

      // Store user information
      if (authData.user) {
        localStorage.setItem('user_profile', JSON.stringify(authData.user));
      }

      // Store OAuth provider
      if (authData.provider) {
        localStorage.setItem('auth_provider', authData.provider);
      }

      // Store token expiry if provided
      if (authData.expires_in) {
        const expiryTime = Date.now() + (authData.expires_in * 1000);
        localStorage.setItem('token_expiry', expiryTime.toString());
      }

    } catch (error) {
      console.error('Failed to save auth tokens:', error);
      throw new Error('Failed to save authentication data');
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    const expiry = localStorage.getItem('token_expiry');

    if (!token) return false;

    // Check if token is expired
    if (expiry && Date.now() > parseInt(expiry)) {
      this.clearAuthData();
      return false;
    }

    return true;
  }

  // Get current user profile
  getCurrentUser() {
    try {
      const userProfile = localStorage.getItem('user_profile');
      return userProfile ? JSON.parse(userProfile) : null;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }

  // Clear all authentication data
  clearAuthData() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_profile');
    localStorage.removeItem('auth_provider');
    localStorage.removeItem('token_expiry');
  }

  // Logout user
  async logout() {
    try {
      const token = localStorage.getItem('access_token');
      
      if (token) {
        // Notify backend about logout
        await fetch('https://auth-api.dropux.co/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local auth data regardless of backend response
      this.clearAuthData();
    }
  }

  // Refresh expired token
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch('https://auth-api.dropux.co/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refresh_token: refreshToken
        })
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      this.saveAuthTokens(data);

      return {
        success: true,
        tokens: data
      };

    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearAuthData();
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get OAuth login URL for provider
  getOAuthLoginUrl(provider) {
    switch (provider.toLowerCase()) {
      case 'google':
        return `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${this.config.google.clientId}&` +
          `redirect_uri=${encodeURIComponent(this.config.google.redirectUri)}&` +
          `response_type=code&` +
          `scope=${encodeURIComponent(this.config.google.scope)}&` +
          `access_type=offline&` +
          `prompt=consent`;

      case 'microsoft':
        return `${this.config.microsoft.authority}/oauth2/v2.0/authorize?` +
          `client_id=${this.config.microsoft.clientId}&` +
          `redirect_uri=${encodeURIComponent(this.config.microsoft.redirectUri)}&` +
          `response_type=code&` +
          `scope=${encodeURIComponent(this.config.microsoft.scope)}&` +
          `response_mode=query`;

      default:
        return null;
    }
  }

  // Validate OAuth configuration
  isConfigured(provider) {
    switch (provider.toLowerCase()) {
      case 'google':
        return this.config.google.clientId !== 'YOUR_GOOGLE_CLIENT_ID';
      case 'microsoft':
        return this.config.microsoft.clientId !== 'YOUR_MICROSOFT_CLIENT_ID';
      default:
        return false;
    }
  }

  // Get configuration status
  getConfigurationStatus() {
    return {
      google: {
        configured: this.isConfigured('google'),
        clientId: this.config.google.clientId
      },
      microsoft: {
        configured: this.isConfigured('microsoft'),
        clientId: this.config.microsoft.clientId
      }
    };
  }
}

export default new OAuthService();