import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input';
import { 
  User, 
  Mail, 
  Lock, 
  AlertCircle, 
  CheckCircle,
  Eye,
  EyeOff,
  Phone
} from 'lucide-react';
import geolocationService from '../services/geolocationService';
import passwordService from '../services/passwordService';
import authService from '../services/authService';
import DropuxLogo from './DropuxLogo';
import VerificationModal from './VerificationModal';
import { AUTH_API_URL } from '../config/api';
import 'react-phone-number-input/style.css';

const EnterpriseRegister = ({ onBackToLogin, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [countryCode, setCountryCode] = useState('CO');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [pendingRegistrationData, setPendingRegistrationData] = useState(null);

  // Auto-detect location on component mount
  useEffect(() => {
    detectUserLocation();
  }, []);

  // Analyze password strength on change
  useEffect(() => {
    if (formData.password) {
      const analysis = passwordService.analyzePassword(formData.password, {
        userInputs: [formData.email, formData.firstName, formData.lastName]
      });
      setPasswordStrength(analysis);
    } else {
      setPasswordStrength(null);
    }
  }, [formData.password, formData.email, formData.firstName, formData.lastName]);

  const detectUserLocation = async () => {
    setLocationLoading(true);
    try {
      const location = await geolocationService.detectUserLocation();
      if (location && location.countryCode) {
        setCountryCode(location.countryCode);
      }
    } catch (error) {
      console.error('Location detection failed:', error);
      setCountryCode('CO'); // Default to Colombia
    } finally {
      setLocationLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phone: value || '' }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: null }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Email inválido';
    }
    return null;
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Personal info validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Nombre es requerido';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Nombre debe tener al menos 2 caracteres';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Apellido es requerido';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Apellido debe tener al menos 2 caracteres';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email es requerido';
    } else {
      const emailError = validateEmail(formData.email);
      if (emailError) {
        newErrors.email = emailError;
      }
    }
    
    if (!formData.password) {
      newErrors.password = 'Contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Contraseña debe tener al menos 8 caracteres';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmar contraseña es requerido';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (!formData.phone || formData.phone.length < 8) {
      newErrors.phone = 'Número de teléfono válido es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      // Step 1: Send verification code to email
      const verifyResponse = await fetch(`${AUTH_API_URL}/verification/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      
      const verifyData = await verifyResponse.json();
      
      if (verifyData.success) {
        // Store registration data for later
        setPendingRegistrationData({
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          country: countryCode ? geolocationService.getSupportedCountries().find(c => c.code === countryCode)?.name : 'Colombia'
        });
        
        // Show verification modal
        setShowVerificationModal(true);
        setLoading(false);
      } else {
        setErrors({ submit: verifyData.error || 'Error enviando código de verificación' });
        setLoading(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: error.message || 'Error al registrar usuario' });
      setLoading(false);
    }
  };

  const handleVerifyCode = async (code) => {
    try {
      // Step 2: Verify the code
      const verifyCodeResponse = await fetch(`${AUTH_API_URL}/verification/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email,
          code: code
        })
      });
      
      const verifyCodeData = await verifyCodeResponse.json();
      
      // Check if it's an error response from FastAPI
      if (!verifyCodeResponse.ok || !verifyCodeData.success) {
        const errorMessage = verifyCodeData.detail || verifyCodeData.error || 'Código inválido o expirado';
        return { success: false, error: errorMessage };
      }
      
      // Step 3: Register the user (email is verified)
      const registerResponse = await fetch(`${AUTH_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingRegistrationData)
      });
      
      const registerData = await registerResponse.json();
      
      if (registerResponse.ok) {
        // Step 4: Auto-login after successful registration
        const loginResponse = await fetch(`${AUTH_API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });
        
        const loginData = await loginResponse.json();
        
        if (loginResponse.ok) {
          // Save token and user data
          localStorage.setItem('access_token', loginData.access_token);
          localStorage.setItem('user', JSON.stringify(loginData.user));
          
          setShowVerificationModal(false);
          setSuccess(true);
          
          // Redirect to dashboard
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
          
          return { success: true };
        } else {
          // Registration successful but login failed - rare case
          setShowVerificationModal(false);
          setSuccess(true);
          if (onRegisterSuccess) {
            setTimeout(() => {
              onRegisterSuccess();
            }, 3000);
          }
          return { success: true };
        }
      } else {
        const errorMessage = typeof registerData.detail === 'string' 
          ? registerData.detail 
          : registerData.error || 'Error al registrar usuario';
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Verification error:', error);
      return { success: false, error: 'Error de conexión' };
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await fetch(`${AUTH_API_URL}/verification/resend-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      
      const data = await response.json();
      
      if (data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Error reenviando código' };
      }
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  };

  const getPasswordStrengthColor = () => {
    if (!passwordStrength) return 'bg-gray-200';
    
    switch (passwordStrength.score) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-blue-500';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-200';
    }
  };

  const getPasswordStrengthText = () => {
    if (!passwordStrength) return '';
    
    const labels = ['Muy débil', 'Débil', 'Moderada', 'Fuerte', 'Muy fuerte'];
    return labels[passwordStrength.score] || '';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 p-4">
      {/* Logo fuera de la caja blanca, en el fondo morado */}
      <DropuxLogo className="mb-6" />
      
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Únete a Dropux</h1>
          <p className="text-gray-600">
            Ingresa tus datos para crear una cuenta en Dropux
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-green-800 mb-1">¡Bienvenido a Dropux!</h4>
                <p className="text-green-700 text-sm">
                  Tu cuenta ha sido creada y verificada exitosamente.
                </p>
                <p className="text-green-600 text-xs mt-1">
                  <strong>Ingresando al sistema...</strong> Serás redirigido al dashboard en unos momentos.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Nombres y Apellidos en una fila */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Nombre *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`pl-10 pr-3 py-3 w-full border-2 rounded-lg focus:outline-none focus:border-purple-500 transition-colors ${errors.firstName ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="Nombre(s)"
                    required
                  />
                </div>
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Apellido *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`pl-10 pr-3 py-3 w-full border-2 rounded-lg focus:outline-none focus:border-purple-500 transition-colors ${errors.lastName ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="Apellido(s)"
                    required
                  />
                </div>
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                <Phone className="inline h-4 w-4 mr-1" />
                Teléfono *
              </label>
              <div className={`enterprise-phone-input ${errors.phone ? 'phone-error' : ''}`}>
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry={countryCode}
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="Ingresa tu número"
                  smartCaret={true}
                  limitMaxLength={true}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-purple-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`pl-10 pr-3 py-2 w-full border-2 rounded-lg focus:outline-none focus:border-purple-500 transition-colors ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Contraseña *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-purple-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`pl-10 pr-10 py-2 w-full border-2 rounded-lg focus:outline-none focus:border-purple-500 transition-colors ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="Mínimo 8 caracteres"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${passwordStrength ? (passwordStrength.score + 1) * 20 : 0}%` }}
                    ></div>
                  </div>
                  <p className={`text-xs mt-1 ${
                    passwordStrength?.score <= 1 ? 'text-red-500' : 
                    passwordStrength?.score === 2 ? 'text-yellow-500' : 
                    passwordStrength?.score === 3 ? 'text-blue-500' : 'text-green-500'
                  }`}>
                    Seguridad: {getPasswordStrengthText()}
                  </p>
                </div>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Repetir contraseña *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-purple-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`pl-10 pr-10 py-2 w-full border-2 rounded-lg focus:outline-none focus:border-purple-500 transition-colors ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="Confirma tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Error en el registro</p>
                  <p className="text-sm mt-1">{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2.5 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition duration-200 font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creando cuenta...
                </div>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </div>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <button
            onClick={onBackToLogin}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            ¿Ya tienes cuenta? Iniciar sesión
          </button>
        </div>

        {/* CSS específico para el teléfono */}
        <style jsx global>{`
          .enterprise-phone-input .PhoneInput {
            display: flex !important;
            align-items: center !important;
          }
          
          .enterprise-phone-input .PhoneInputCountrySelect {
            padding: 8px 6px !important;
            border: 2px solid #e5e7eb !important;
            border-radius: 8px 0 0 8px !important;
            border-right: 1px solid #e5e7eb !important;
            background: white !important;
            font-size: 14px !important;
            min-width: 70px !important;
          }
          
          .enterprise-phone-input .PhoneInputCountrySelect select {
            border-radius: 8px 0 0 8px !important;
          }
          
          .enterprise-phone-input .PhoneInputInput {
            padding: 8px 12px !important;
            border: 2px solid #e5e7eb !important;
            border-radius: 0 8px 8px 0 !important;
            border-left: 1px solid #e5e7eb !important;
            font-size: 14px !important;
            transition: all 0.2s !important;
          }
          
          .enterprise-phone-input .PhoneInputInput:focus {
            outline: none !important;
            border-color: #6366f1 !important;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
          }
          
          .enterprise-phone-input.phone-error .PhoneInputCountrySelect,
          .enterprise-phone-input.phone-error .PhoneInputInput {
            border-color: #ef4444 !important;
          }
          
          .enterprise-phone-input .PhoneInputCountryIcon {
            width: 24px !important;
            height: 18px !important;
            margin-right: 4px !important;
          }
          
          .enterprise-phone-input .PhoneInputCountryIcon img {
            border-radius: 2px !important;
          }
          
          /* Mobile responsive */
          @media (max-width: 640px) {
            .enterprise-phone-input .PhoneInputInput {
              font-size: 16px !important; /* Prevent zoom on iOS */
            }
            
            .enterprise-phone-input .PhoneInputCountrySelect {
              min-width: 70px !important;
            }
          }
        `}</style>
      </div>
      
      {/* Verification Modal */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        email={formData.email}
        onVerify={handleVerifyCode}
        onResend={handleResendCode}
      />
    </div>
  );
};

export default EnterpriseRegister;