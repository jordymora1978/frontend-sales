import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import apiService from '../services/api';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Login attempt started

    try {
      const response = await apiService.login(formData.email, formData.password);
      // Login successful
      onLoginSuccess(response);
    } catch (error) {
      // Login failed - check console for details in development
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Login failed:', error.message);
      }
      
      // Mostrar el error real del servidor o un mensaje genérico
      if (error.message.includes('CORS')) {
        setError('Error de conexión con el servidor. Por favor intenta más tarde.');
      } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        setError('No se puede conectar con el servidor. Verifica tu conexión.');
      } else if (error.message.includes('401') || error.message.includes('Session expired')) {
        setError('Credenciales inválidas. Verifica tu email y contraseña.');
      } else {
        // No exponer mensajes del servidor - usar mensaje genérico seguro
        setError('Error al iniciar sesión. Por favor intenta de nuevo.');
        // Solo log en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.error('Login error details:', error.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>DROPUX Sales</h1>
          <p>Sistema de Gestión de Ventas</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <User size={20} className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@dropux.co"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-with-icon">
              <Lock size={20} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                aria-pressed={showPassword}
                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {process.env.NODE_ENV === 'development' && (
          <div className="login-footer">
            <p>Ambiente: {process.env.REACT_APP_ENV || 'development'}</p>
            <p>API: {process.env.REACT_APP_API_URL || 'local'}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .login-card {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 400px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .login-header h1 {
          color: #333;
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: bold;
        }

        .login-header p {
          color: #666;
          margin: 0;
          font-size: 14px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          color: #999;
          z-index: 1;
        }

        .input-with-icon input {
          width: 100%;
          padding: 12px 12px 12px 40px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
        }

        .input-with-icon input:focus {
          outline: none;
          border-color: #667eea;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 4px;
          z-index: 1;
        }

        .password-toggle:hover {
          color: #667eea;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #dc3545;
          background: #f8d7da;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #f5c6cb;
          font-size: 14px;
        }

        .login-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #999;
        }

        .login-footer p {
          margin: 4px 0;
        }
      `}</style>
    </div>
  );
};

export default Login;