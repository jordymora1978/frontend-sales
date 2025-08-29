import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Fingerprint, Mail, KeyRound } from 'lucide-react';
import oauthService from '../../services/oauthService';
import passkeyService from '../../services/passkeyService';

const SimplifiedAuthButtons = ({ onSuccess, onError, variant = 'login' }) => {
  const [loading, setLoading] = useState({ 
    google: false, 
    passkey: false 
  });
  const [passkeySupported, setPasskeySupported] = useState(false);

  // Check if browser supports passkeys
  React.useEffect(() => {
    const checkPasskeySupport = async () => {
      const supported = await passkeyService.isSupported();
      setPasskeySupported(supported);
    };
    checkPasskeySupport();
  }, []);

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

  // Handle Passkey authentication
  const handlePasskey = async () => {
    setLoading({ ...loading, passkey: true });
    
    try {
      let result;
      
      if (variant === 'register') {
        // Register new passkey
        result = await passkeyService.registerPasskey();
      } else {
        // Authenticate with existing passkey
        result = await passkeyService.authenticateWithPasskey();
      }
      
      if (result.success) {
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        if (onError) {
          onError(result.error || 'Passkey authentication failed');
        }
      }
    } catch (error) {
      if (onError) {
        onError(error.message);
      }
    } finally {
      setLoading({ ...loading, passkey: false });
    }
  };

  const buttonText = variant === 'register' ? 'Registrarse' : 'Iniciar sesión';
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
  const isGoogleConfigured = googleClientId && googleClientId !== 'YOUR_GOOGLE_CLIENT_ID';

  return (
    <div className="auth-buttons-container">
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">O continúa con</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Google Sign-In Button */}
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
            <Mail className="w-5 h-5" />
            {buttonText} con Google (Configurar ID)
          </button>
        )}

        {/* Passkey Button - Only show if supported */}
        {passkeySupported && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-400">Más seguro</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePasskey}
              disabled={loading.passkey}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-blue-500 rounded-lg text-blue-600 hover:bg-blue-50 transition-all group relative overflow-hidden"
            >
              {loading.passkey ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <Fingerprint className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">
                    {variant === 'register' ? 'Crear Passkey' : 'Usar Passkey'}
                  </span>
                  <span className="absolute -top-2 -right-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full rotate-12 font-semibold">
                    NUEVO
                  </span>
                </>
              )}
            </button>

            {/* Passkey Info */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <KeyRound className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-700">
                <p className="font-semibold mb-1">🔐 Passkeys = Máxima Seguridad</p>
                <p>Sin contraseñas. Usa tu huella dactilar, Face ID o PIN del dispositivo.</p>
              </div>
            </div>
          </>
        )}

        {/* Apple Sign In - Future Implementation */}
        {/* Uncomment when Apple Developer Account is ready
        <button
          type="button"
          disabled
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-400 bg-gray-50 cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
          </svg>
          {buttonText} con Apple (Próximamente)
        </button>
        */}
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
          .auth-buttons-container button {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default SimplifiedAuthButtons;