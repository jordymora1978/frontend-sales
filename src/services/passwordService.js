/**
 * Password Strength Service - Modern enterprise password validation
 * Uses zxcvbn for realistic password strength estimation
 */

import zxcvbn from 'zxcvbn';

class PasswordService {
  constructor() {
    // Common patterns to check against
    this.commonPatterns = [
      'dropux', 'admin', 'password', '123456', 'qwerty',
      'colombia', 'bogota', 'medellin', 'cali'
    ];
  }

  analyzePassword(password, userInfo = {}) {
    if (!password) {
      return {
        score: 0,
        strength: 'empty',
        message: 'Ingresa una contraseña',
        color: '#e5e7eb',
        requirements: this.getRequirements(password)
      };
    }

    // Use zxcvbn for realistic analysis
    const userInputs = [
      userInfo.email,
      userInfo.firstName,
      userInfo.lastName,
      userInfo.company,
      ...this.commonPatterns
    ].filter(Boolean);

    const result = zxcvbn(password, userInputs);
    
    return {
      score: result.score,
      strength: this.getStrengthLabel(result.score),
      message: this.getStrengthMessage(result.score, result.feedback),
      color: this.getStrengthColor(result.score),
      crackTime: result.crack_times_display.offline_slow_hashing_1e4_per_second,
      requirements: this.getRequirements(password),
      suggestions: result.feedback.suggestions,
      warning: result.feedback.warning
    };
  }

  getStrengthLabel(score) {
    const labels = {
      0: 'Muy débil',
      1: 'Débil', 
      2: 'Aceptable',
      3: 'Fuerte',
      4: 'Muy fuerte'
    };
    return labels[score] || 'Débil';
  }

  getStrengthMessage(score, feedback) {
    const messages = {
      0: 'Contraseña muy insegura',
      1: 'Contraseña débil, fácil de descifrar',
      2: 'Contraseña aceptable, considera mejorarla',
      3: 'Contraseña fuerte y segura',
      4: 'Contraseña excelente, muy segura'
    };
    
    if (feedback.warning) {
      return feedback.warning;
    }
    
    return messages[score] || 'Mejora tu contraseña';
  }

  getStrengthColor(score) {
    const colors = {
      0: '#ef4444', // red-500
      1: '#f97316', // orange-500  
      2: '#eab308', // yellow-500
      3: '#22c55e', // green-500
      4: '#059669'  // green-600
    };
    return colors[score] || '#ef4444';
  }

  getRequirements(password) {
    return {
      minLength: {
        met: password.length >= 8,
        label: 'Mínimo 8 caracteres',
        icon: password.length >= 8 ? '✅' : '❌'
      },
      hasUppercase: {
        met: /[A-Z]/.test(password),
        label: 'Al menos una mayúscula',
        icon: /[A-Z]/.test(password) ? '✅' : '❌'
      },
      hasLowercase: {
        met: /[a-z]/.test(password),
        label: 'Al menos una minúscula', 
        icon: /[a-z]/.test(password) ? '✅' : '❌'
      },
      hasNumber: {
        met: /\d/.test(password),
        label: 'Al menos un número',
        icon: /\d/.test(password) ? '✅' : '❌'
      },
      hasSpecial: {
        met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        label: 'Al menos un carácter especial',
        icon: /[!@#$%^&*(),.?":{}|<>]/.test(password) ? '✅' : '❌'
      }
    };
  }

  validatePassword(password, userInfo = {}) {
    const analysis = this.analyzePassword(password, userInfo);
    
    return {
      isValid: analysis.score >= 2, // Minimum acceptable score
      ...analysis
    };
  }

  generateSecurePassword(length = 12) {
    const charset = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz', 
      numbers: '0123456789',
      special: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };
    
    let password = '';
    
    // Ensure at least one character from each category
    password += this.getRandomChar(charset.uppercase);
    password += this.getRandomChar(charset.lowercase);
    password += this.getRandomChar(charset.numbers);
    password += this.getRandomChar(charset.special);
    
    // Fill the rest randomly
    const allChars = Object.values(charset).join('');
    for (let i = 4; i < length; i++) {
      password += this.getRandomChar(allChars);
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  getRandomChar(charset) {
    return charset.charAt(Math.floor(Math.random() * charset.length));
  }

  getPasswordStrengthWidth(score) {
    const widths = {
      0: '10%',
      1: '25%',
      2: '50%', 
      3: '75%',
      4: '100%'
    };
    return widths[score] || '10%';
  }

  isPasswordCompromised(password) {
    // Check against common compromised passwords
    const commonPasswords = [
      '123456', 'password', '123456789', '12345678', '12345',
      '1234567', '1234567890', 'qwerty', 'abc123', 'password123',
      'admin', 'letmein', 'welcome', 'monkey', '1234'
    ];
    
    return commonPasswords.includes(password.toLowerCase());
  }
}

export default new PasswordService();