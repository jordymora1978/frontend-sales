import React from 'react';
import { 
  CheckCircle, 
  Mail, 
  Shield, 
  Clock,
  ArrowRight,
  Building
} from 'lucide-react';
import DropuxLogo from './DropuxLogo';

const RegistrationSuccess = ({ userEmail, onContinueToLogin }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 p-4">
      {/* Logo fuera de la caja blanca, en el fondo morado */}
      <DropuxLogo className="mb-6" />
      
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Registro Exitoso!
          </h1>
          <p className="text-gray-600 text-lg">
            Su cuenta ha sido creada correctamente
          </p>
        </div>

        {/* Success Details */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="space-y-4">
            {/* Email Confirmation */}
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Email Verificado
                </h3>
                <p className="text-gray-600 text-sm">
                  Cuenta registrada con: <span className="font-medium">{userEmail}</span>
                </p>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Cuenta Segura
                </h3>
                <p className="text-gray-600 text-sm">
                  Su información ha sido protegida con encriptación empresarial
                </p>
              </div>
            </div>

            {/* Approval Process */}
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Aprobación Pendiente
                </h3>
                <p className="text-gray-600 text-sm">
                  Un administrador revisará y activará su cuenta en las próximas 24 horas
                </p>
              </div>
            </div>

            {/* Enterprise Notice */}
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Acceso Empresarial
                </h3>
                <p className="text-gray-600 text-sm">
                  Recibirá un email de confirmación cuando su cuenta sea activada
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Siguientes Pasos
          </h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">
                Revisión de cuenta por parte del equipo de administración
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">
                Email de activación enviado a su bandeja de entrada
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700">
                Acceso completo a la plataforma Dropux
              </span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button
            onClick={onContinueToLogin}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2.5 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition duration-200 font-semibold text-base shadow-lg"
          >
            Continuar al Login
          </button>
          
          <p className="text-gray-500 text-sm mt-4">
            ¿Necesita ayuda? Contacte a{' '}
            <a href="mailto:support@dropux.co" className="text-purple-600 hover:underline">
              support@dropux.co
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;