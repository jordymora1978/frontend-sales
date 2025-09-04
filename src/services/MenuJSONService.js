// MenuJSONService.js - Sistema de menús basado en JSON
import { 
  LayoutDashboard, ShoppingBag, Users, FileText, Package, RefreshCw, 
  Key, Tag, Settings, FolderOpen, Archive, CheckCircle2, DollarSign, 
  TrendingUp, Mail, Cloud, Shield, User, Activity, Truck 
} from 'lucide-react';

// Configuración embebida para evitar problemas de import JSON
const menuConfig = {
  "version": "1.0.0",
  "lastUpdated": "2025-01-17",
  "roles": {
    "super_admin": {
      "displayName": "👑 Super Admin",
      "mainMenu": [
        {
          "id": "dashboard",
          "name": "Dashboard",
          "icon": "LayoutDashboard",
          "path": "/dashboard",
          "order": 1
        },
        {
          "id": "orders2_0", 
          "name": "Órdenes Pro",
          "icon": "ShoppingBag",
          "path": "/orders2_0",
          "order": 2
        },
        {
          "id": "customers",
          "name": "Clientes", 
          "icon": "Users",
          "path": "/customers",
          "order": 3
        },
        {
          "id": "quotes",
          "name": "Cotizaciones",
          "icon": "FileText", 
          "path": "/quotes",
          "order": 4
        }
      ],
      "sections": {
        "configuration": {
          "name": "Configuración",
          "icon": "Settings",
          "items": [
            {
              "id": "ml-stores",
              "name": "Mis Tiendas",
              "icon": "Package",
              "path": "/ml-stores"
            },
            {
              "id": "ml-sync",
              "name": "Sincronizar Órdenes", 
              "icon": "RefreshCw",
              "path": "/ml-sync"
            }
          ]
        }
      }
    },
    "admin": {
      "displayName": "🛡️ Administrador",
      "mainMenu": [
        {
          "id": "dashboard",
          "name": "Dashboard", 
          "icon": "LayoutDashboard",
          "path": "/dashboard",
          "order": 1
        },
        {
          "id": "orders2_0",
          "name": "Órdenes Pro",
          "icon": "ShoppingBag", 
          "path": "/orders2_0",
          "order": 2
        },
        {
          "id": "customers",
          "name": "Clientes",
          "icon": "Users",
          "path": "/customers",
          "order": 3
        },
        {
          "id": "quotes",
          "name": "Cotizaciones",
          "icon": "FileText",
          "path": "/quotes",
          "order": 4
        }
      ],
      "sections": {}
    },
    "asesor": {
      "displayName": "👨‍💼 Asesor",
      "mainMenu": [
        {
          "id": "dashboard",
          "name": "Dashboard",
          "icon": "LayoutDashboard", 
          "path": "/dashboard",
          "order": 1
        },
        {
          "id": "orders2_0",
          "name": "Órdenes Pro",
          "icon": "ShoppingBag",
          "path": "/orders2_0",
          "order": 2
        }
      ],
      "sections": {}
    }
  }
};

class MenuJSONService {
  constructor() {
    this.config = menuConfig;
    this.iconMap = this.createIconMap();
    this.dynamicPermissionsCache = {};
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutos cache
  }

  /**
   * Mapeo de strings a componentes de iconos reales
   */
  createIconMap() {
    return {
      'LayoutDashboard': LayoutDashboard,
      'ShoppingBag': ShoppingBag,
      'Users': Users,
      'FileText': FileText,
      'Package': Package,
      'RefreshCw': RefreshCw,
      'Key': Key,
      'Tag': Tag,
      'Settings': Settings,
      'FolderOpen': FolderOpen,
      'Archive': Archive,
      'CheckCircle2': CheckCircle2,
      'DollarSign': DollarSign,
      'TrendingUp': TrendingUp,
      'Mail': Mail,
      'Cloud': Cloud,
      'Shield': Shield,
      'User': User,
      'Activity': Activity,
      'Truck': Truck
    };
  }

  /**
   * Obtener permisos dinámicos desde la API
   * @returns {Promise<Object>} Permisos por rol desde la base de datos
   */
  async fetchDynamicPermissions() {
    try {
      const response = await fetch('http://localhost:8004/admin/role-permissions');
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      const data = await response.json();
      
      console.log('🔥 [MenuJSON] Dynamic permissions loaded from API:', data.permissions);
      
      // Cache con timestamp
      this.dynamicPermissionsCache = {
        data: data.permissions,
        timestamp: Date.now(),
        source: data.source
      };
      
      return data.permissions;
    } catch (error) {
      console.warn('⚠️ [MenuJSON] Failed to fetch dynamic permissions:', error);
      return null;
    }
  }

  /**
   * Obtener permisos con cache
   * @returns {Promise<Object>} Permisos cacheados o desde API
   */
  async getDynamicPermissions() {
    // Verificar cache válido
    if (this.dynamicPermissionsCache.data && 
        (Date.now() - this.dynamicPermissionsCache.timestamp) < this.cacheExpiry) {
      console.log('✅ [MenuJSON] Using cached dynamic permissions');
      return this.dynamicPermissionsCache.data;
    }
    
    // Fetch nuevos datos
    return await this.fetchDynamicPermissions();
  }

  /**
   * Convertir permisos de la API a formato de menú
   * @param {Array} permissions - Lista de módulos desde la API
   * @param {string} role - Rol del usuario  
   * @returns {Object} Configuración de menú en formato esperado
   */
  convertPermissionsToMenuConfig(permissions, role) {
    if (!permissions || !Array.isArray(permissions)) return null;
    
    console.log(`🔧 [MenuJSON] Converting ${permissions.length} permissions for role '${role}':`, permissions);
    
    // Mapeo de módulos API (IDs técnicos) a configuración de menú
    const moduleToMenuMap = {
      'dashboard': { id: 'dashboard', name: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard', order: 1 },
      'orders2_0': { id: 'orders2_0', name: 'Órdenes Pro', icon: 'ShoppingBag', path: '/orders2_0', order: 2 },
      'customers': { id: 'customers', name: 'Clientes', icon: 'Users', path: '/customers', order: 3 },
      'quotes': { id: 'quotes', name: 'Cotizaciones', icon: 'FileText', path: '/quotes', order: 4 },
      'ml-stores': { id: 'ml-stores', name: 'Mis Tiendas', icon: 'Package', path: '/ml-stores', order: 5 },
      'ml-sync': { id: 'ml-sync', name: 'Sincronizar Órdenes', icon: 'RefreshCw', path: '/ml-sync', order: 6 },
      'control-consolidador': { id: 'control-consolidador', name: 'Consolidador 2.0', icon: 'Archive', path: '/control-consolidador', order: 7 },
      'control-validador': { id: 'control-validador', name: 'Validador', icon: 'CheckCircle2', path: '/control-validador', order: 8 },
      'control-reportes': { id: 'control-reportes', name: 'Reportes', icon: 'TrendingUp', path: '/control-reportes', order: 9 },
      'apis-conexiones': { id: 'apis-conexiones', name: 'APIs y Conexiones', icon: 'Key', path: '/apis-conexiones', order: 10 },
      'mis-etiquetas': { id: 'mis-etiquetas', name: 'Mis Etiquetas', icon: 'Tag', path: '/mis-etiquetas', order: 11 },
      'control-trm': { id: 'control-trm', name: 'TRM Monitor', icon: 'DollarSign', path: '/control-trm', order: 12 },
      'control-gmail-drive': { id: 'control-gmail-drive', name: 'Gmail Drive', icon: 'Mail', path: '/control-gmail-drive', order: 13 },
      'google-api': { id: 'google-api', name: 'Google API', icon: 'Cloud', path: '/google-api', order: 14 },
      'catalogo-amazon': { id: 'catalogo-amazon', name: 'Catálogo Amazon', icon: 'Package', path: '/catalogo-amazon', order: 15 },
      'publicaciones-ml': { id: 'publicaciones-ml', name: 'Publicaciones ML', icon: 'ShoppingBag', path: '/publicaciones-ml', order: 16 },
      'stock-proveedores': { id: 'stock-proveedores', name: 'Stock Proveedores', icon: 'Truck', path: '/stock-proveedores', order: 17 },
      'admin-panel': { id: 'admin-panel', name: 'Panel Admin', icon: 'Shield', path: '/admin', order: 18 },
      'admin-users': { id: 'admin-users', name: 'Gestionar Usuarios', icon: 'User', path: '/admin/users', order: 19 },
      'admin-system': { id: 'admin-system', name: 'Monitor Sistema', icon: 'Activity', path: '/admin/system', order: 20 }
    };
    
    const mainMenu = [];
    
    // Procesar permisos y convertir a items de menú
    permissions.forEach(permission => {
      const menuItem = moduleToMenuMap[permission];
      if (menuItem) {
        mainMenu.push(menuItem);
        console.log(`✅ [MenuJSON] Mapped '${permission}' → '${menuItem.name}'`);
      } else {
        console.warn(`⚠️ [MenuJSON] No mapping found for permission: '${permission}'`);
      }
    });
    
    // Ordenar por order
    mainMenu.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    return {
      displayName: this.config.roles[role]?.displayName || `🔥 ${role}`,
      mainMenu: mainMenu,
      sections: this.config.roles[role]?.sections || {}
    };
  }

  /**
   * Obtener configuración de menú para un rol específico
   * @param {string} role - El rol del usuario (admin, super_admin, etc.)
   * @returns {Object} Configuración del menú para el rol
   */
  getMenuForRole(role) {
    if (!role || !this.config.roles[role]) {
      console.warn(`[MenuJSON] Role '${role}' not found, using 'asesor' as fallback`);
      return this.config.roles['asesor'];
    }
    
    return this.config.roles[role];
  }

  /**
   * Obtener configuración de menú para un rol específico (DINÁMICO)
   * @param {string} role - El rol del usuario (admin, super_admin, etc.)
   * @returns {Promise<Object>} Configuración del menú para el rol
   */
  async getMenuForRoleDynamic(role) {
    try {
      console.log(`🔥 [MenuJSON] Loading dynamic menu for role: '${role}'`);
      
      // Obtener permisos dinámicos de la API
      const dynamicPermissions = await this.getDynamicPermissions();
      
      if (dynamicPermissions && dynamicPermissions[role]) {
        console.log(`✅ [MenuJSON] Found dynamic permissions for role '${role}':`, dynamicPermissions[role]);
        
        // Convertir permisos a configuración de menú
        const dynamicConfig = this.convertPermissionsToMenuConfig(dynamicPermissions[role], role);
        
        if (dynamicConfig) {
          console.log(`🎯 [MenuJSON] Using dynamic menu with ${dynamicConfig.mainMenu.length} items for '${role}'`);
          return dynamicConfig;
        }
      }
      
      console.log(`⚠️ [MenuJSON] No dynamic permissions found for role '${role}', falling back to static config`);
    } catch (error) {
      console.warn(`❌ [MenuJSON] Error loading dynamic menu for '${role}':`, error);
    }
    
    // Fallback a configuración estática
    return this.getMenuForRole(role);
  }

  /**
   * Convertir items del menú de JSON a formato con iconos reales
   * @param {Array} items - Array de items del menú
   * @returns {Array} Items con iconos convertidos
   */
  processMenuItems(items) {
    if (!items || !Array.isArray(items)) return [];
    
    return items.map(item => ({
      ...item,
      icon: this.iconMap[item.icon] || Package // Fallback icon
    }));
  }

  /**
   * Obtener menú principal para un rol
   * @param {string} role - El rol del usuario
   * @returns {Array} Items del menú principal con iconos procesados
   */
  getMainMenuForRole(role) {
    const roleConfig = this.getMenuForRole(role);
    if (!roleConfig || !roleConfig.mainMenu) return [];
    
    // Ordenar por campo 'order' si existe
    const sortedMenu = [...roleConfig.mainMenu].sort((a, b) => {
      return (a.order || 0) - (b.order || 0);
    });
    
    return this.processMenuItems(sortedMenu);
  }

  /**
   * Obtener menú principal para un rol (DINÁMICO)
   * @param {string} role - El rol del usuario
   * @returns {Promise<Array>} Items del menú principal con iconos procesados
   */
  async getMainMenuForRoleDynamic(role) {
    try {
      const roleConfig = await this.getMenuForRoleDynamic(role);
      if (!roleConfig || !roleConfig.mainMenu) return [];
      
      // Ordenar por campo 'order' si existe
      const sortedMenu = [...roleConfig.mainMenu].sort((a, b) => {
        return (a.order || 0) - (b.order || 0);
      });
      
      return this.processMenuItems(sortedMenu);
    } catch (error) {
      console.warn(`❌ [MenuJSON] Error in getMainMenuForRoleDynamic:`, error);
      // Fallback a la función estática
      return this.getMainMenuForRole(role);
    }
  }

  /**
   * Obtener secciones del menú para un rol
   * @param {string} role - El rol del usuario
   * @returns {Object} Secciones con items procesados
   */
  getSectionsForRole(role) {
    const roleConfig = this.getMenuForRole(role);
    if (!roleConfig || !roleConfig.sections) return {};
    
    const processedSections = {};
    
    Object.keys(roleConfig.sections).forEach(sectionKey => {
      const section = roleConfig.sections[sectionKey];
      processedSections[sectionKey] = {
        ...section,
        icon: this.iconMap[section.icon] || Settings,
        items: this.processMenuItems(section.items || [])
      };
    });
    
    return processedSections;
  }

  /**
   * Verificar si un usuario tiene acceso a una página específica
   * @param {string} role - El rol del usuario
   * @param {string} pageId - ID de la página a verificar
   * @returns {boolean} true si tiene acceso
   */
  hasPageAccess(role, pageId) {
    const roleConfig = this.getMenuForRole(role);
    if (!roleConfig) return false;
    
    // Buscar en menú principal
    if (roleConfig.mainMenu && roleConfig.mainMenu.some(item => item.id === pageId)) {
      return true;
    }
    
    // Buscar en secciones
    if (roleConfig.sections) {
      for (const sectionKey of Object.keys(roleConfig.sections)) {
        const section = roleConfig.sections[sectionKey];
        if (section.items && section.items.some(item => item.id === pageId)) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Versión DINÁMICA de hasPageAccess que consulta la API
   * @param {string} role - Rol del usuario
   * @param {string} pageId - ID de la página a verificar
   * @returns {Promise<boolean>} True si el usuario tiene acceso
   */
  async hasPageAccessDynamic(role, pageId) {
    try {
      const dynamicPermissions = await this.getDynamicPermissions();
      const rolePermissions = dynamicPermissions[role] || [];
      
      console.log(`🔍 [MenuJSON] Checking access for '${role}' to '${pageId}':`, rolePermissions.includes(pageId));
      
      return rolePermissions.includes(pageId);
    } catch (error) {
      console.error('🚫 [MenuJSON] Dynamic permission check failed:', error);
      return false;
    }
  }

  /**
   * Obtener nombre de display para un rol
   * @param {string} role - El rol del usuario
   * @returns {string} Nombre display del rol
   */
  getRoleDisplayName(role) {
    const roleConfig = this.getMenuForRole(role);
    return roleConfig?.displayName || 'Usuario';
  }

  /**
   * Obtener todas las páginas disponibles para un rol
   * @param {string} role - El rol del usuario
   * @returns {Array} Array con todos los IDs de páginas disponibles
   */
  getAllPagesForRole(role) {
    const roleConfig = this.getMenuForRole(role);
    if (!roleConfig) return [];
    
    const pages = [];
    
    // Agregar páginas del menú principal
    if (roleConfig.mainMenu) {
      pages.push(...roleConfig.mainMenu.map(item => item.id));
    }
    
    // Agregar páginas de las secciones
    if (roleConfig.sections) {
      Object.values(roleConfig.sections).forEach(section => {
        if (section.items) {
          pages.push(...section.items.map(item => item.id));
        }
      });
    }
    
    return [...new Set(pages)]; // Eliminar duplicados
  }

  /**
   * Validar configuración JSON
   * @returns {Object} Resultado de la validación
   */
  validateConfig() {
    const errors = [];
    const warnings = [];
    
    if (!this.config.roles) {
      errors.push('No roles defined in config');
      return { isValid: false, errors, warnings };
    }
    
    Object.keys(this.config.roles).forEach(role => {
      const roleConfig = this.config.roles[role];
      
      if (!roleConfig.displayName) {
        warnings.push(`Role '${role}' missing displayName`);
      }
      
      if (!roleConfig.mainMenu || !Array.isArray(roleConfig.mainMenu)) {
        warnings.push(`Role '${role}' missing or invalid mainMenu`);
      }
      
      // Validar iconos
      if (roleConfig.mainMenu) {
        roleConfig.mainMenu.forEach(item => {
          if (item.icon && !this.iconMap[item.icon]) {
            warnings.push(`Unknown icon '${item.icon}' in role '${role}'`);
          }
        });
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Obtener versión de la configuración
   * @returns {string} Versión actual
   */
  getVersion() {
    return this.config.version || '1.0.0';
  }

  /**
   * Obtener fecha de última actualización
   * @returns {string} Fecha de última actualización
   */
  getLastUpdated() {
    return this.config.lastUpdated || 'Unknown';
  }
}

// Exportar instancia singleton
const menuJSONService = new MenuJSONService();

export default menuJSONService;