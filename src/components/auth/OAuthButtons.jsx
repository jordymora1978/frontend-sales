import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import oauthService from '../../services/oauthService';

const OAuthButtons = ({ onSuccess, onError, variant = 'login' }) => {
  const [loading, setLoading] = useState({ google: false, microsoft: false });

  // Handle Google OAuth success
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading({ ...loading, google: true });
    
    try {
      const result = await oauthService.handleGoogleLogin(credentialResponse.credential);
      
      if (result.success) {
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        if (onError) {
          onError(result.error);
        }
      }
    } catch (error) {
      if (onError) {
        onError(error.message);
      }
    } finally {
      setLoading({ ...loading, google: false });
    }
  };

  // Handle Google OAuth error
  const handleGoogleError = () => {
    if (onError) {
      onError('Google authentication failed');
    }
  };

  // Handle Microsoft OAuth
  const handleMicrosoftLogin = () => {
    setLoading({ ...loading, microsoft: true });
    
    try {
      // For Microsoft, we need to redirect to their OAuth page
      const loginUrl = oauthService.getOAuthLoginUrl('microsoft');
      
      if (loginUrl) {
        // Store return URL for after OAuth callback
        sessionStorage.setItem('oauth_return_url', window.location.pathname);
        window.location.href = loginUrl;
      } else {
        if (onError) {
          onError('Microsoft OAuth not configured');
        }
      }
    } catch (error) {
      if (onError) {
        onError(error.message);
      }
      setLoading({ ...loading, microsoft: false });
    }
  };

  const buttonText = variant === 'register' ? 'Registrarse con' : 'Iniciar sesión con';
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
  const isGoogleConfigured = googleClientId && googleClientId !== 'YOUR_GOOGLE_CLIENT_ID';

  return (
    <div className="oauth-buttons-container">
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">O continúa con</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Google OAuth Button */}
        {isGoogleConfigured ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            <div className="google-oauth-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text={variant === 'register' ? 'signup_with' : 'signin_with'}
                theme="outline"
                size="large"
                width="100%"
                locale="es"
                disabled={loading.google}
              />
            </div>
          </GoogleOAuthProvider>
        ) : (
          <button
            type="button"
            disabled
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-400 bg-gray-50 cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {buttonText} Google (No configurado)
          </button>
        )}

        {/* Microsoft OAuth Button */}
        <button
          type="button"
          onClick={handleMicrosoftLogin}
          disabled={loading.microsoft || !oauthService.isConfigured('microsoft')}
          className={`w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-lg font-medium transition-all ${
            oauthService.isConfigured('microsoft')
              ? 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              : 'border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 21 21">
            <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
            <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
            <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
          </svg>
          {loading.microsoft ? (
            <span>Conectando...</span>
          ) : (
            <span>
              {buttonText} Microsoft
              {!oauthService.isConfigured('microsoft') && ' (No configurado)'}
            </span>
          )}
        </button>
      </div>

      <style jsx>{`
        .google-oauth-wrapper :global(.gsi-material-button) {
          width: 100% !important;
          max-width: none !important;
        }
        
        .google-oauth-wrapper :global(.gsi-material-button-content-wrapper) {
          justify-content: center !important;
        }

        @media (max-width: 640px) {
          .oauth-buttons-container button {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default OAuthButtons;