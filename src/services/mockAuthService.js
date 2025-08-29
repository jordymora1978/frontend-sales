/**
 * Mock Auth Service for Local Development
 * Simulates authentication without requiring auth-api
 */

const MOCK_USERS = [
  {
    id: 'e86a0348-acda-43ba-8a7e-2d0bbcb9627',
    email: 'admin@dropux.co',
    password: 'Admin123!',
    first_name: 'Super',
    last_name: 'Admin',
    roles: ['SUPER_ADMIN'],
    permissions: ['admin.all'],
    active: true
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'user@dropux.co',
    password: 'user123',
    first_name: 'Usuario',
    last_name: 'Normal',
    roles: ['EMPLOYEE'],
    permissions: ['read'],
    active: true
  }
];

class MockAuthService {
  constructor() {
    this.currentUser = this.loadUserFromStorage();
  }

  loadUserFromStorage() {
    try {
      const userData = localStorage.getItem('mock_user_data');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  async login(email, password) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Credenciales inválidas');
    }
    
    // Create mock token
    const mockToken = btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      exp: Date.now() + 86400000 // 24 hours
    }));
    
    // Store auth data
    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('mock_user_data', JSON.stringify(user));
    this.currentUser = user;
    
    return {
      access_token: mockToken,
      user: user
    };
  }

  async logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('mock_user_data');
    localStorage.clear();
    this.currentUser = null;
  }

  async getCurrentUser() {
    // Check if we have a valid token
    const token = localStorage.getItem('auth_token');
    if (!token) return null;
    
    try {
      const decoded = JSON.parse(atob(token));
      if (decoded.exp < Date.now()) {
        // Token expired
        await this.logout();
        return null;
      }
      
      return this.currentUser;
    } catch {
      return null;
    }
  }

  hasPermission(permission) {
    if (!this.currentUser) return false;
    if (this.currentUser.roles.includes('SUPER_ADMIN')) return true;
    return this.currentUser.permissions?.includes(permission) || false;
  }

  isAdmin() {
    if (!this.currentUser) return false;
    return this.currentUser.roles.includes('SUPER_ADMIN') || 
           this.currentUser.roles.includes('CLIENT_ADMIN');
  }

  getToken() {
    return localStorage.getItem('auth_token');
  }
}

export default new MockAuthService();