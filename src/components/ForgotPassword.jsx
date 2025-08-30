import React, { useState } from 'react';
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Send
} from 'lucide-react';
import DropuxLogo from './DropuxLogo';
import { AUTH_API_URL } from '../config/api';

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email es requerido');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email no es válido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${AUTH_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al enviar email de recuperación');
      }

      setSuccess(true);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-6">
              <DropuxLogo size="lg" />
            </div>
            
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Email Enviado!
            </h1>
            <p className="text-gray-600">
              Revisa tu bandeja de entrada
            </p>
          </div>

          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-green-800 text-sm">
              Si el email <strong>{email}</strong> está registrado en nuestro sistema, 
              recibirás un enlace para restablecer tu contraseña.
            </p>
          </div>

          {/* Instructions */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 text-sm">
                Revisa tu bandeja de entrada y spam
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700 text-sm">
                Haz clic en el enlace del email
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 text-sm">
                Crea tu nueva contraseña
              </span>
            </div>
          </div>

          {/* Back to Login */}
          <button
            onClick={onBackToLogin}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-200 font-semibold"
          >
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <button
              onClick={onBackToLogin}
              className="absolute left-8 top-8 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex justify-center mb-6">
            <DropuxLogo size="lg" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Recuperar Contraseña
          </h1>
          <p className="text-gray-600">
            Ingresa tu email para recibir un enlace de recuperación
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className={`pl-10 pr-3 py-3 w-full border rounded-lg focus:outline-none focus:border-blue-500 ${
                  error ? 'border-red-500' : ''
                }`}
                placeholder="tu@empresa.com"
                required
                disabled={loading}
              />
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar Enlace de Recuperación
              </>
            )}
          </button>
        </form>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 text-sm">
                <strong>Nota de seguridad:</strong> Por tu protección, 
                no revelaremos si este email existe en nuestro sistema.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <button
            onClick={onBackToLogin}
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            ¿Recordaste tu contraseña? Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;