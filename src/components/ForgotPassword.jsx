import React, { useState } from 'react';
import { 
  Mail, 
  CheckCircle, 
  AlertCircle
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 p-4">
        {/* Logo fuera de la caja blanca, en el fondo morado */}
        <DropuxLogo className="mb-6" />
        
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Email Enviado!</h1>
            <p className="text-gray-600">Revisa tu bandeja de entrada</p>
          </div>

          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 text-sm">
              Si el email <strong>{email}</strong> está registrado en nuestro sistema, 
              recibirás un enlace para restablecer tu contraseña.
            </p>
          </div>

          {/* Instructions */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700 text-sm">Revisa tu bandeja de entrada y spam</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700 text-sm">Haz clic en el enlace del email</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700 text-sm">Crea tu nueva contraseña</span>
            </div>
          </div>

          <button
            onClick={onBackToLogin}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2.5 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition duration-200 font-semibold text-base shadow-lg"
          >
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 p-4">
      {/* Logo fuera de la caja blanca, en el fondo morado */}
      <DropuxLogo className="mb-6" />
      
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Recuperar Contraseña</h1>
          <p className="text-gray-600">Ingresa tu email para recibir un enlace de recuperación</p>
        </div>

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
                className="pl-10 pr-3 py-2.5 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
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
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2.5 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition duration-200 font-semibold text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            ¿Recordaste tu contraseña? Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;