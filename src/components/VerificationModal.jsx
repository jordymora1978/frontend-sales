import React, { useState, useEffect } from 'react';
import { X, Mail, Shield, RefreshCw, Loader2, CheckCircle } from 'lucide-react';

const VerificationModal = ({ isOpen, onClose, email, onVerify, onResend }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setCode(['', '', '', '', '', '']);
      setError('');
      setMessage('');
      setResendTimer(60);
      // Focus first input
      setTimeout(() => {
        const firstInput = document.getElementById('code-0');
        if (firstInput) firstInput.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (resendTimer > 0 && isOpen) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer, isOpen]);

  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      setError('');
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
      
      // Auto-submit when all digits are entered
      if (index === 5 && value) {
        const fullCode = [...newCode].join('');
        if (fullCode.length === 6) {
          handleVerify(fullCode);
        }
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      // Auto-submit
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (codeString = null) => {
    const finalCode = codeString || code.join('');
    
    if (finalCode.length !== 6) {
      setError('Por favor ingresa el código completo');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await onVerify(finalCode);
      if (!result.success) {
        setError(result.error || 'Código inválido o expirado');
        // Clear code on error
        setCode(['', '', '', '', '', '']);
        document.getElementById('code-0')?.focus();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      const result = await onResend();
      if (result.success) {
        setMessage('Nuevo código enviado a tu email');
        setResendTimer(60);
        setCode(['', '', '', '', '', '']);
        document.getElementById('code-0')?.focus();
      } else {
        setError(result.error || 'Error al reenviar código');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" />
      
      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Content */}
          <div className="p-8">
            {/* Icon */}
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
              Verificación de Email
            </h2>
            
            {/* Description */}
            <p className="text-gray-600 text-center mb-1">
              Ingresa el código de 6 dígitos enviado a
            </p>
            <p className="text-purple-600 font-semibold text-center mb-8 flex items-center justify-center">
              <Mail className="w-4 h-4 mr-2" />
              {email}
            </p>
            
            {/* Success Message */}
            {message && (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-green-700 text-sm">{message}</span>
              </div>
            )}
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}
            
            {/* Code Input */}
            <div className="flex justify-center gap-2 mb-8">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={`
                    w-12 h-14 text-center text-2xl font-bold 
                    border-2 rounded-lg transition-all
                    ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-purple-500'}
                    focus:outline-none focus:ring-2 focus:ring-purple-200
                  `}
                  maxLength="1"
                  disabled={loading}
                />
              ))}
            </div>
            
            {/* Verify Button */}
            <button
              onClick={() => handleVerify()}
              disabled={loading || code.join('').length !== 6}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mb-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Verificando...
                </>
              ) : (
                'Verificar Código'
              )}
            </button>
            
            {/* Resend */}
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">
                ¿No recibiste el código?
              </p>
              <button
                onClick={handleResend}
                disabled={loading || resendTimer > 0}
                className={`
                  font-semibold text-sm transition-colors
                  ${resendTimer > 0 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-purple-600 hover:text-purple-700 cursor-pointer'
                  }
                `}
              >
                {resendTimer > 0 ? (
                  <span>Reenviar código en {resendTimer}s</span>
                ) : (
                  <span className="flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Reenviar código
                  </span>
                )}
              </button>
            </div>
            
            {/* Info */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                El código expira en 5 minutos. Si tienes problemas, 
                contacta a soporte@dropux.co
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;