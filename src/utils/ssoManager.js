/**
 * SSO Manager para el ecosistema Dropux
 * Gestiona el Single Sign-On entre Sales, Control y Products
 */

class SSOManager {
  constructor() {
    this.AUTH_API_URL = process.env.REACT_APP_AUTH_API_URL || 'https://auth-api.dropux.co';
    this.TOKEN_KEY = 'dropux_token';
    this.USER_KEY = 'dropux_user';
    this.EXPIRY_KEY = 'dropux_token_expiry';
    
    // URLs de las aplicaciones del ecosistema
    this.ECOSYSTEM_APPS = {
      sales: process.env.REACT_APP_SALES_URL || 'https://sales.dropux.co',
      control: process.env.REACT_APP_CONTROL_URL || 'https://control.dropux.co',
      products: process.env.REACT_APP_PRODUCTS_URL || 'https://products.dropux.co'
    };

    this.initializeSSO();
  }

  initializeSSO() {
    // Verificar si hay un token válido al inicializar
    const token = this.getToken();
    const user = this.getUser();
    
    if (token && user) {
      console.log('✅ SSO: Usuario autenticado encontrado:', user.email);
      this.setupTokenRefresh();
    } else {
      console.log('🔐 SSO: No hay sesión activa');
    }

    // Escuchar mensajes de otras ventanas/tabs para sincronizar login/logout
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    window.addEventListener('message', this.handleCrossAppMessage.bind(this));
  }

  /**
   * Login centralizado
   */
  async login(email, password) {
    try {
      console.log('🔑 SSO: Iniciando login centralizado...');
      
      const response = await fetch(`${this.AUTH_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error en login');
      }

      const data = await response.json();
      
      // Guardar token y usuario
      this.setToken(data.access_token, data.expires_in);
      this.setUser(data.user);
      
      console.log('✅ SSO: Login exitoso para', data.user.email);
      
      // Notificar a otras tabs/ventanas del login
      this.broadcastAuthChange('login', data.user);
      
      // Configurar renovación automática
      this.setupTokenRefresh();
      
      return data;
      
    } catch (error) {
      console.error('❌ SSO: Error en login:', error);
      throw error;
    }
  }

  /**
   * Logout centralizado
   */
  logout() {
    console.log('🚪 SSO: Cerrando sesión...');
    
    const user = this.getUser();
    
    // Limpiar datos locales
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.EXPIRY_KEY);
    
    // Limpiar timer de renovación
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    
    // Notificar a otras tabs/ventanas del logout
    this.broadcastAuthChange('logout', user);
    
    console.log('✅ SSO: Sesión cerrada completamente');
  }

  /**
   * Obtener token actual
   */
  getToken() {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const expiry = localStorage.getItem(this.EXPIRY_KEY);
    
    if (!token || !expiry) {
      return null;
    }
    
    // Verificar si el token ha expirado
    if (new Date() >= new Date(expiry)) {
      console.log('⏰ SSO: Token expirado, cerrando sesión');
      this.logout();
      return null;
    }
    
    return token;
  }

  /**
   * Obtener usuario actual
   */
  getUser() {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Verificar si está autenticado
   */
  isAuthenticated() {
    return this.getToken() !== null && this.getUser() !== null;
  }

  /**
   * Guardar token con expiración
   */
  setToken(token, expiresIn = 3600) {
    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + expiresIn);
    
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.EXPIRY_KEY, expiryDate.toISOString());
  }

  /**
   * Guardar información del usuario
   */
  setUser(user) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Configurar renovación automática del token
   */
  setupTokenRefresh() {
    const expiry = localStorage.getItem(this.EXPIRY_KEY);
    if (!expiry) return;
    
    const expiryDate = new Date(expiry);
    const now = new Date();
    const timeUntilExpiry = expiryDate.getTime() - now.getTime();
    
    // Renovar el token 5 minutos antes de que expire
    const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 60000);
    
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    
    this.refreshTimer = setTimeout(() => {
      this.refreshToken();
    }, refreshTime);
    
    console.log(`🔄 SSO: Token se renovará en ${Math.round(refreshTime / 1000 / 60)} minutos`);
  }

  /**
   * Renovar token
   */
  async refreshToken() {
    try {
      const currentToken = localStorage.getItem(this.TOKEN_KEY);
      if (!currentToken) return;
      
      console.log('🔄 SSO: Renovando token...');
      
      const response = await fetch(`${this.AUTH_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.setToken(data.access_token, data.expires_in);
        this.setupTokenRefresh();
        console.log('✅ SSO: Token renovado exitosamente');
      } else {
        console.log('❌ SSO: Error renovando token, cerrando sesión');
        this.logout();
      }
    } catch (error) {
      console.error('❌ SSO: Error en renovación de token:', error);
      this.logout();
    }
  }

  /**
   * Manejar cambios en localStorage (cross-tab sync)
   */
  handleStorageChange(event) {
    if (event.key === this.TOKEN_KEY) {
      if (!event.newValue) {
        // Token eliminado en otra tab - logout
        console.log('🔄 SSO: Logout detectado en otra pestaña');
        window.location.reload();
      } else if (!event.oldValue) {
        // Token agregado en otra tab - login
        console.log('🔄 SSO: Login detectado en otra pestaña');
        window.location.reload();
      }
    }
  }

  /**
   * Manejar mensajes de otras aplicaciones del ecosistema
   */
  handleCrossAppMessage(event) {
    // Verificar que el mensaje viene de una app del ecosistema
    const allowedOrigins = Object.values(this.ECOSYSTEM_APPS);
    if (!allowedOrigins.includes(event.origin)) {
      return;
    }

    if (event.data.type === 'DROPUX_SSO') {
      const { action, user } = event.data;
      
      if (action === 'login' && !this.isAuthenticated()) {
        console.log('🔄 SSO: Login recibido desde', event.origin);
        window.location.reload();
      } else if (action === 'logout' && this.isAuthenticated()) {
        console.log('🔄 SSO: Logout recibido desde', event.origin);
        this.logout();
        window.location.reload();
      }
    }
  }

  /**
   * Broadcast cambios de autenticación a otras ventanas
   */
  broadcastAuthChange(action, user) {
    const message = {
      type: 'DROPUX_SSO',
      action,
      user,
      timestamp: new Date().toISOString(),
      source: window.location.origin
    };

    // Enviar a todas las ventanas/tabs del mismo origen
    localStorage.setItem('sso_broadcast', JSON.stringify(message));
    localStorage.removeItem('sso_broadcast');

    // Enviar a otras aplicaciones del ecosistema (si están abiertas)
    Object.values(this.ECOSYSTEM_APPS).forEach(appUrl => {
      if (appUrl !== window.location.origin) {
        try {
          window.postMessage(message, appUrl);
        } catch (error) {
          // Ignorar errores de CORS - normal entre diferentes dominios
        }
      }
    });
  }

  /**
   * Navegar a otra aplicación del ecosistema con SSO
   */
  navigateToApp(appName, path = '') {
    if (!this.ECOSYSTEM_APPS[appName]) {
      console.error(`❌ SSO: Aplicación '${appName}' no reconocida`);
      return;
    }

    const appUrl = this.ECOSYSTEM_APPS[appName];
    const fullUrl = `${appUrl}${path}`;
    
    console.log(`🔗 SSO: Navegando a ${appName}:`, fullUrl);
    
    // Abrir en nueva pestaña
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  }

  /**
   * Obtener headers de autorización para requests
   */
  getAuthHeaders() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
}

// Instancia singleton
const ssoManager = new SSOManager();

export default ssoManager;