import React, { useState, useCallback, useMemo } from 'react';
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
  const [validationErrors, setValidationErrors] = useState({});
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

  // Security utilities
  const RATE_LIMIT_KEY = 'dropux_login_attempts';
  const RATE_LIMIT_TIME_KEY = 'dropux_last_attempt';
  const MAX_ATTEMPTS = 3;
  const BLOCK_DURATION = 5 * 60 * 1000; // 5 minutes

  // Form validation
  const validateForm = useCallback(() => {
    const errors = {};
    
    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Formato de email inválido';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Rate limiting check
  const checkRateLimit = useCallback(() => {
    const attempts = parseInt(localStorage.getItem(RATE_LIMIT_KEY) || '0');
    const lastAttempt = localStorage.getItem(RATE_LIMIT_TIME_KEY);
    
    if (attempts >= MAX_ATTEMPTS && lastAttempt) {
      const timeDiff = Date.now() - parseInt(lastAttempt);
      if (timeDiff < BLOCK_DURATION) {
        const remainingTime = Math.ceil((BLOCK_DURATION - timeDiff) / 1000 / 60);
        setIsBlocked(true);
        setBlockTimeRemaining(remainingTime);
        setError(`Demasiados intentos fallidos. Inténtalo de nuevo en ${remainingTime} minutos.`);
        return false;
      } else {
        // Reset attempts after block duration
        localStorage.removeItem(RATE_LIMIT_KEY);
        localStorage.removeItem(RATE_LIMIT_TIME_KEY);
      }
    }
    
    setIsBlocked(false);
    return true;
  }, []);

  // Record failed attempt
  const recordFailedAttempt = useCallback(() => {
    const attempts = parseInt(localStorage.getItem(RATE_LIMIT_KEY) || '0');
    localStorage.setItem(RATE_LIMIT_KEY, (attempts + 1).toString());
    localStorage.setItem(RATE_LIMIT_TIME_KEY, Date.now().toString());
  }, []);

  // Clear failed attempts on success
  const clearFailedAttempts = useCallback(() => {
    localStorage.removeItem(RATE_LIMIT_KEY);
    localStorage.removeItem(RATE_LIMIT_TIME_KEY);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setValidationErrors({});

    // Check rate limiting first
    if (!checkRateLimit()) {
      setLoading(false);
      return;
    }

    // Validate form
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.login(formData.email, formData.password);
      
      // Login successful - clear any failed attempts
      clearFailedAttempts();
      onLoginSuccess(response);
      
    } catch (error) {
      // Record failed attempt for rate limiting
      recordFailedAttempt();
      
      // Log details only in development mode
      if (process.env.NODE_ENV === 'development') {
        console.error('Login failed:', error.message);
      }
      
      // Use generic error message to prevent information disclosure
      setError('Credenciales inválidas. Verifica tu email y contraseña.');
      
      // Check if this was the final allowed attempt
      const attempts = parseInt(localStorage.getItem(RATE_LIMIT_KEY) || '0');
      if (attempts >= MAX_ATTEMPTS) {
        setIsBlocked(true);
        setBlockTimeRemaining(5);
        setError('Demasiados intentos fallidos. Inténtalo de nuevo en 5 minutos.');
      }
      
    } finally {
      setLoading(false);
    }
  };

  // Optimized change handler with validation clearing
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        [name]: undefined
      }));
    }
    
    // Clear general error when user starts typing
    if (error) {
      setError('');
    }
  }, [validationErrors, error]);

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
                className={validationErrors.email ? 'input-error' : ''}
                aria-describedby={validationErrors.email ? 'email-error' : undefined}
              />
            </div>
            {validationErrors.email && (
              <div id="email-error" className="validation-error">
                <AlertCircle size={14} />
                {validationErrors.email}
              </div>
            )}
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
                className={validationErrors.password ? 'input-error' : ''}
                aria-describedby={validationErrors.password ? 'password-error' : undefined}
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
            {validationErrors.password && (
              <div id="password-error" className="validation-error">
                <AlertCircle size={14} />
                {validationErrors.password}
              </div>
            )}
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
            disabled={loading || isBlocked}
          >
            {loading 
              ? 'Iniciando sesión...' 
              : isBlocked 
                ? `Bloqueado (${blockTimeRemaining} min)`
                : 'Iniciar Sesión'
            }
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

        .input-with-icon input.input-error {
          border-color: #dc3545;
        }

        .validation-error {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #dc3545;
          font-size: 13px;
          margin-top: 4px;
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
          transform: none !important;
        }

        .login-button:disabled:hover {
          box-shadow: none;
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