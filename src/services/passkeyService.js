/**
 * Passkey Service - WebAuthn implementation for passwordless authentication
 * Modern biometric authentication using device capabilities
 */

import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
  browserSupportsWebAuthnAutofill
} from '@simplewebauthn/browser';

class PasskeyService {
  constructor() {
    this.apiUrl = process.env.REACT_APP_AUTH_API_URL || 'https://auth-api.dropux.co';
    this.rpName = 'Dropux App';
    this.rpId = window.location.hostname;
  }

  /**
   * Check if browser supports passkeys
   */
  async isSupported() {
    try {
      // Check basic WebAuthn support
      if (!browserSupportsWebAuthn()) {
        console.log('WebAuthn not supported');
        return false;
      }

      // Check if platform authenticator is available (biometrics)
      if (window.PublicKeyCredential) {
        const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        return available;
      }

      return false;
    } catch (error) {
      console.error('Error checking passkey support:', error);
      return false;
    }
  }

  /**
   * Check if browser supports conditional UI (autofill)
   */
  async supportsConditionalUI() {
    try {
      return await browserSupportsWebAuthnAutofill();
    } catch {
      return false;
    }
  }

  /**
   * Register a new passkey for the user
   */
  async registerPasskey(userEmail) {
    try {
      // Step 1: Get registration options from server
      const optionsResponse = await fetch(`${this.apiUrl}/auth/passkey/register/begin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          email: userEmail || localStorage.getItem('user_email'),
          displayName: localStorage.getItem('user_name') || 'Usuario'
        })
      });

      if (!optionsResponse.ok) {
        throw new Error('Failed to get registration options');
      }

      const options = await optionsResponse.json();

      // Step 2: Create credential using browser API
      let attestationResponse;
      try {
        attestationResponse = await startRegistration(options);
      } catch (error) {
        // User cancelled or error occurred
        if (error.name === 'NotAllowedError') {
          return {
            success: false,
            error: 'Registro de passkey cancelado'
          };
        }
        throw error;
      }

      // Step 3: Send credential to server for verification
      const verificationResponse = await fetch(`${this.apiUrl}/auth/passkey/register/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(attestationResponse)
      });

      if (!verificationResponse.ok) {
        throw new Error('Failed to verify passkey');
      }

      const verificationResult = await verificationResponse.json();

      if (verificationResult.verified) {
        return {
          success: true,
          message: 'Passkey registrado exitosamente'
        };
      } else {
        return {
          success: false,
          error: 'No se pudo verificar el passkey'
        };
      }

    } catch (error) {
      console.error('Passkey registration error:', error);
      return {
        success: false,
        error: error.message || 'Error al registrar passkey'
      };
    }
  }

  /**
   * Authenticate using an existing passkey
   */
  async authenticateWithPasskey(userEmail) {
    try {
      // Step 1: Get authentication options from server
      const optionsResponse = await fetch(`${this.apiUrl}/auth/passkey/authenticate/begin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userEmail // Optional: can be empty for usernameless flow
        })
      });

      if (!optionsResponse.ok) {
        throw new Error('Failed to get authentication options');
      }

      const options = await optionsResponse.json();

      // Step 2: Get assertion from browser
      let assertionResponse;
      try {
        assertionResponse = await startAuthentication(options);
      } catch (error) {
        // User cancelled or error occurred
        if (error.name === 'NotAllowedError') {
          return {
            success: false,
            error: 'Autenticación cancelada'
          };
        }
        throw error;
      }

      // Step 3: Send assertion to server for verification
      const verificationResponse = await fetch(`${this.apiUrl}/auth/passkey/authenticate/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(assertionResponse)
      });

      if (!verificationResponse.ok) {
        throw new Error('Failed to verify authentication');
      }

      const result = await verificationResponse.json();

      if (result.verified) {
        // Store tokens and user info
        if (result.access_token) {
          localStorage.setItem('access_token', result.access_token);
        }
        if (result.refresh_token) {
          localStorage.setItem('refresh_token', result.refresh_token);
        }
        if (result.user) {
          localStorage.setItem('user_profile', JSON.stringify(result.user));
        }
        localStorage.setItem('auth_method', 'passkey');

        return {
          success: true,
          user: result.user,
          tokens: {
            access_token: result.access_token,
            refresh_token: result.refresh_token
          }
        };
      } else {
        return {
          success: false,
          error: 'Autenticación no válida'
        };
      }

    } catch (error) {
      console.error('Passkey authentication error:', error);
      return {
        success: false,
        error: error.message || 'Error al autenticar con passkey'
      };
    }
  }

  /**
   * Check if user has registered passkeys
   */
  async hasPasskeys(userEmail) {
    try {
      const response = await fetch(`${this.apiUrl}/auth/passkey/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: userEmail })
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.hasPasskeys || false;

    } catch (error) {
      console.error('Error checking passkeys:', error);
      return false;
    }
  }

  /**
   * List all registered passkeys for the current user
   */
  async listPasskeys() {
    try {
      const response = await fetch(`${this.apiUrl}/auth/passkey/list`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to list passkeys');
      }

      const data = await response.json();
      return {
        success: true,
        passkeys: data.passkeys || []
      };

    } catch (error) {
      console.error('Error listing passkeys:', error);
      return {
        success: false,
        error: error.message,
        passkeys: []
      };
    }
  }

  /**
   * Delete a specific passkey
   */
  async deletePasskey(credentialId) {
    try {
      const response = await fetch(`${this.apiUrl}/auth/passkey/${credentialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete passkey');
      }

      return {
        success: true,
        message: 'Passkey eliminado exitosamente'
      };

    } catch (error) {
      console.error('Error deleting passkey:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get passkey registration status and metadata
   */
  getPasskeyStatus() {
    return {
      supported: this.isSupported(),
      authMethod: localStorage.getItem('auth_method') === 'passkey',
      lastUsed: localStorage.getItem('passkey_last_used'),
      deviceName: this.getDeviceName()
    };
  }

  /**
   * Get a friendly device name for passkey registration
   */
  getDeviceName() {
    const userAgent = navigator.userAgent;
    
    // Detect device type
    if (/iPhone/.test(userAgent)) return 'iPhone';
    if (/iPad/.test(userAgent)) return 'iPad';
    if (/Android/.test(userAgent)) return 'Android';
    if (/Mac/.test(userAgent)) return 'Mac';
    if (/Windows/.test(userAgent)) return 'Windows PC';
    if (/Linux/.test(userAgent)) return 'Linux';
    
    return 'Dispositivo';
  }

  /**
   * Clear all passkey-related data from localStorage
   */
  clearPasskeyData() {
    localStorage.removeItem('passkey_last_used');
    if (localStorage.getItem('auth_method') === 'passkey') {
      localStorage.removeItem('auth_method');
    }
  }
}

const passkeyService = new PasskeyService();
export default passkeyService;