import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Eye, EyeOff, UserPlus, Shield, User, Mail, Lock } from 'lucide-react';
import { AUTH_API_URL } from '../config/api';
import DropuxLogo from '../components/DropuxLogo';

const AdminRegister = () => {
  const navigate = useNavigate();
  
  // Estados
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Validaciones
    if (!formData.email || !formData.password) {
      setError('Email y contraseña son requeridos');
      setSubmitting(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      setSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${AUTH_API_URL}/admin/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          password: formData.password,
          confirm_password: formData.confirmPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/auth/login');
        }, 5000);
      } else {
        setError(data.detail || data.message || 'Error al crear la cuenta');
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  // Pantalla de éxito
  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Cuenta creada exitosamente!</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
              <div className="flex">
                <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    <strong>Cuenta pendiente de activación</strong><br/>
                    El SuperAdmin debe asignarte un rol antes de que puedas acceder.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Redirigiendo al login en unos segundos...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Formulario de registro
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 p-4">
      {/* Logo fuera de la caja blanca */}
      <DropuxLogo className="mb-6" />
      
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Registro de Staff</h1>
          <p className="text-gray-600">Crear cuenta administrativa para el equipo Dropux</p>
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex">
              <Shield className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  <strong>Nota:</strong> El SuperAdmin debe asignarte un rol después del registro.
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
            
            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email corporativo *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 pr-3 py-2.5 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  placeholder="tu.email@dropux.co"
                />
              </div>
            </div>

            {/* Nombre */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nombre
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="pl-10 pr-3 py-2.5 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                    placeholder="Juan"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Apellido
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="pl-3 pr-3 py-2.5 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  placeholder="Pérez"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Contraseña *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 py-2.5 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  placeholder="Mínimo 8 caracteres"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Confirmar contraseña *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 py-2.5 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  placeholder="Repite la contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {/* Botón submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2.5 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition duration-200 font-semibold text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creando cuenta...' : 'Crear cuenta de staff'}
          </button>
        </form>
        
        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 mb-2">
            Solo para personal autorizado de Dropux
          </p>
          <button
            onClick={() => navigate('/auth/login')}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;