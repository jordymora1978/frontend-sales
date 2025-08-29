import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Building, 
  Phone, 
  Globe, 
  AlertCircle, 
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = ({ onBackToLogin, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: 'Colombia',
    phone: '',
    company: ''
  });
  
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const countries = [
    'Colombia', 'México', 'Argentina', 'Chile', 'Perú', 
    'Ecuador', 'Venezuela', 'Uruguay', 'Bolivia', 'Paraguay'
  ];

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

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Nombre es requerido';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Apellido es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email no es válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password es requerido';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password debe tener al menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Teléfono es requerido';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Empresa es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setLoading(true);
    setErrors({});
    
    try {
      const response = await fetch('https://auth-api.dropux.co/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          country: formData.country,
          phone: formData.phone,
          company: formData.company
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro');
      }
      
      setSuccess(true);
      
      // Show success message for 3 seconds then redirect
      setTimeout(() => {
        if (onRegisterSuccess) {
          onRegisterSuccess();
        }
      }, 3000);
      
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-600">
        <div className="bg-white p-8 rounded-lg shadow-2xl w-96 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Registro Exitoso!</h2>
          <p className="text-gray-600 mb-4">
            Tu cuenta ha sido creada y está pendiente de aprobación por un administrador.
          </p>
          <p className="text-sm text-gray-500">
            Recibirás un email cuando tu cuenta sea activada.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            {step > 1 && (
              <button
                onClick={() => setStep(1)}
                className="absolute left-8 top-8 p-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Registro</h1>
          <p className="text-gray-600 mt-2">
            Crear cuenta en Dropux App
          </p>
          <div className="flex justify-center mt-4">
            <div className={`w-4 h-4 rounded-full mx-1 ${step >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`} />
            <div className={`w-4 h-4 rounded-full mx-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`} />
          </div>
        </div>

        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit}>
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nombre
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:border-blue-500 ${errors.firstName ? 'border-red-500' : ''}`}
                      placeholder="Juan"
                      required
                    />
                  </div>
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Apellido
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:border-blue-500 ${errors.lastName ? 'border-red-500' : ''}`}
                      placeholder="Pérez"
                      required
                    />
                  </div>
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email Corporativo
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:border-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="juan@empresa.com"
                    required
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:border-blue-500 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="••••••••"
                    required
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:border-blue-500 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="••••••••"
                    required
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 font-semibold"
              >
                Siguiente
              </button>
            </div>
          )}

          {/* Step 2: Business Information */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  País
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:border-blue-500 appearance-none"
                    required
                  >
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Teléfono
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:border-blue-500 ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="+57 300 123 4567"
                    required
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Empresa
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className={`pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:border-blue-500 ${errors.company ? 'border-red-500' : ''}`}
                    placeholder="Nombre de tu empresa"
                    required
                  />
                </div>
                {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
              </div>

              {errors.submit && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {errors.submit}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200 font-semibold disabled:opacity-50"
              >
                {loading ? 'Registrando...' : 'Crear Cuenta'}
              </button>
            </div>
          )}
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <button
            onClick={onBackToLogin}
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            ¿Ya tienes cuenta? Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;