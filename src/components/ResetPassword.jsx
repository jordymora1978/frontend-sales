import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Shield
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DropuxLogo from './DropuxLogo';
import { AUTH_API_URL } from '../config/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  useEffect(() => {
    // If no email or token in URL, redirect to login
    if (!email || !token) {
      navigate('/login');
    }
  }, [email, token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'Nueva contraseña es requerida';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmar contraseña es requerida';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${AUTH_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          reset_token: token,
          new_password: formData.newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al restablecer la contraseña');
      }

      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
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
              ¡Contraseña Restablecida!
            </h1>
            <p className="text-gray-600">
              Tu contraseña ha sido cambiada exitosamente
            </p>
          </div>

          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-800 text-sm">
                  <strong>Seguridad actualizada:</strong> Tu nueva contraseña está activa. 
                  Serás redirigido al login en unos segundos.
                </p>
              </div>
            </div>
          </div>

          {/* Redirect Info */}
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-4">
              Redirigiendo al login...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-6">
            <DropuxLogo size="lg" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Nueva Contraseña
          </h1>
          <p className="text-gray-600">
            Ingresa tu nueva contraseña segura
          </p>
          
          {/* Email Display */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Restableciendo para: <span className="font-medium">{email}</span>
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nueva Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className={`pl-10 pr-12 py-3 w-full border rounded-lg focus:outline-none focus:border-blue-500 ${
                  errors.newPassword ? 'border-red-500' : ''
                }`}
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Confirmar Nueva Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`pl-10 pr-12 py-3 w-full border rounded-lg focus:outline-none focus:border-blue-500 ${
                  errors.confirmPassword ? 'border-red-500' : ''
                }`}
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {errors.submit}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Restableciendo...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Restablecer Contraseña
              </>
            )}
          </button>
        </form>

        {/* Password Requirements */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Requisitos de contraseña:</strong>
          </p>
          <ul className="text-blue-700 text-xs mt-1 space-y-1">
            <li>• Mínimo 6 caracteres</li>
            <li>• Combina letras, números y símbolos</li>
            <li>• Evita información personal</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;