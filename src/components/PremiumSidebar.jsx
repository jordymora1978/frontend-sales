import React, { useState, useEffect, useContext, createContext, useMemo } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Users,
  Package,
  FolderOpen,
  Archive,
  CheckCircle2,
  TrendingUp,
  Mail,
  DollarSign,
  Settings,
  ChevronRight,
  ChevronLeft,
  Menu,
  Moon,
  Sun,
  User,
  LogOut,
  HelpCircle,
  Activity,
  Sparkles,
  RefreshCw,
  Cloud,
  Truck,
  Tag,
  Key,
  Shield,
  Crown,
  ShoppingCart,
  BarChart3
} from 'lucide-react';
import './PremiumSidebar.css';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import menuJSONService from '../services/MenuJSONService';

// 🚀 SISTEMA SIMPLE Y CONFIABLE - PÁGINAS POR TIPO DE USUARIO
const PAGES_BY_USER_TYPE = {
  'super_admin': [
    'dashboard', 'orders2_0', 'customers', 'control-reportes', 'quotes',
    'ml-stores', 'ml-sync', 'apis-conexiones', 'mis-etiquetas',
    'control-consolidador', 'control-validador', 'control-trm', 'control-gmail-drive', 'google-api',
    'catalogo-amazon', 'publicaciones-ml', 'stock-proveedores',
    'admin-panel', 'admin-users', 'admin-system'
  ],
  'admin': [
    'dashboard', 'orders2_0', 'customers', 'control-reportes', 'quotes',
    'admin-users', 'admin-system'
  ],
  'asesor': [
    'dashboard', 'orders2_0', 'customers', 'control-reportes', 'quotes'
  ],
  'marketplace': [
    'dashboard', 'orders2_0', 'ml-stores', 'ml-sync', 'publicaciones-ml'
  ],
  'dropshipper': [
    'dashboard', 'orders2_0', 'customers', 'catalogo-amazon', 'stock-proveedores'
  ],
  'proveedor': [
    'dashboard', 'stock-proveedores', 'control-reportes'
  ]
};

// Theme Context para manejo profesional
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('dropux-premium-theme');
    return saved || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dropux-premium-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const PremiumSidebar = ({ isMobile, showMobileMenu, setShowMobileMenu }) => {
  const location = useLocation();
  const activeTab = location.pathname.replace('/', '') || 'dashboard';
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [hoveredItem, setHoveredItem] = useState(null);
  const [internalIsMobile, setInternalIsMobile] = useState(false);
  const [internalShowMobileMenu, setInternalShowMobileMenu] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext) || {};
  const { user, logout, refreshUser } = useAuth();

  // Use props if provided, otherwise use internal state
  const effectiveIsMobile = isMobile !== undefined ? isMobile : internalIsMobile;
  const effectiveShowMobileMenu = showMobileMenu !== undefined ? showMobileMenu : internalShowMobileMenu;
  const effectiveSetShowMobileMenu = setShowMobileMenu || setInternalShowMobileMenu;

  // Responsive detection - only when using internal state
  useEffect(() => {
    if (isMobile === undefined) {
      const checkMobile = () => {
        setInternalIsMobile(window.innerWidth < 768);
        if (window.innerWidth >= 768) {
          setInternalShowMobileMenu(false);
        }
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, [isMobile]);

  // 🚀 ELIMINADO: Todo el sistema complejo de API permissions

  // 🔧 JSON-BASED: Sistema que usa configuración JSON
  const hasPagePermission = (pageId) => {
    if (!user) return false;
    
    // Get user type from roles array or user_type field
    let userType = user?.user_type;
    if (user?.roles && user.roles.length > 0) {
      userType = user.roles[0]; // First role is primary
    }
    
    // 👑 SUPER ADMIN: Acceso total a todo
    if (userType === 'super_admin') {
      return true; // Super admin no tiene restricciones
    }
    
    // Use DYNAMIC pre-loaded permissions for fast checking
    const hasAccess = userPermissions.has(pageId);
    console.log(`🔍 [SIDEBAR] Permission check for '${pageId}':`, hasAccess);
    return hasAccess;
  };

  // Check if a section has any pages with permissions
  const sectionHasPermissions = (pageIds) => {
    return pageIds.some(pageId => hasPagePermission(pageId));
  };

  // Configuration section pages
  const configPages = ['ml-stores', 'ml-sync', 'apis-conexiones', 'mis-etiquetas'];
  
  // Control suite pages
  const controlPages = ['control-consolidador', 'control-validador', 'control-trm', 'control-gmail-drive', 'google-api'];
  
  // Products suite pages
  const productPages = ['catalogo-amazon', 'publicaciones-ml', 'stock-proveedores'];

  // Function to get role display name with emoji
  const getRoleDisplayName = () => {
    if (!user?.roles || user.roles.length === 0) {
      return 'Usuario';
    }

    const role = user.roles[0];
    const roleNames = {
      'super_admin': '👑 Super Admin',
      'admin': '🛡️ Administrador', 
      'asesor': '👨‍💼 Asesor',
      'marketplace': '🏪 Marketplace',
      'dropshipper': '📦 Dropshipper',
      'proveedor': '🚚 Proveedor'
    };

    return roleNames[role] || 'Usuario';
  };

  // 🚀 DYNAMIC: Generate menu items and permissions from dynamic API configuration
  const [menuItems, setMenuItems] = useState([]);
  const [userPermissions, setUserPermissions] = useState(new Set());
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);

  useEffect(() => {
    const loadDynamicMenu = async () => {
      if (!user) {
        setMenuItems([]);
        setUserPermissions(new Set());
        setIsLoadingMenu(false);
        return;
      }

      setIsLoadingMenu(true);
      
      // Get user type from roles array or user_type field
      let userType = user?.user_type;
      if (user?.roles && user.roles.length > 0) {
        userType = user.roles[0]; // First role is primary
      }

      try {
        // Load both menu items and permissions dynamically
        const [dynamicMenuItems, dynamicPermissions] = await Promise.all([
          menuJSONService.getMainMenuForRoleDynamic(userType),
          menuJSONService.getDynamicPermissions()
        ]);

        if (dynamicMenuItems && dynamicMenuItems.length > 0) {
          console.log('✅ [SIDEBAR] Using DYNAMIC menu system with', dynamicMenuItems.length, 'items');
          setMenuItems(dynamicMenuItems);
        } else {
          // Fallback: basic menu while loading
          setMenuItems([
            { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' }
          ]);
        }

        // Set user permissions for fast filtering
        const rolePermissions = dynamicPermissions[userType] || [];
        setUserPermissions(new Set(rolePermissions));
        console.log('✅ [SIDEBAR] Loaded permissions for', userType, ':', rolePermissions);

      } catch (error) {
        console.warn('⚠️ [SIDEBAR] Dynamic menu failed, using fallback:', error);
        // Fallback: basic menu on error
        setMenuItems([
          { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' }
        ]);
        setUserPermissions(new Set(['dashboard']));
      } finally {
        setIsLoadingMenu(false);
      }
    };

    loadDynamicMenu();
  }, [user]);

  // Páginas sin padre (sueltas)
  const standalonePages = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'orders2_0', name: 'Mis Ventas', icon: ShoppingCart, path: '/orders2_0' },
    { id: 'customers', name: 'Mis Clientes', icon: Users, path: '/customers' },
    { id: 'quotes', name: 'Mis Cotizaciones', icon: FileText, path: '/quotes' }
  ];

  // Grupos con hijos
  const groupedPages = {
    settings: {
      name: 'Configuraciones',
      icon: Settings,
      children: [
        { id: 'mis-etiquetas', name: 'Mis Etiquetas', path: '/mis-etiquetas' },
        { id: 'ml-stores', name: 'Mis Tiendas', path: '/ml-stores' },
        { id: 'apis-conexiones', name: 'APIs y Conexiones', path: '/apis-conexiones' },
        { id: 'ml-sync', name: 'Sincronizar Órdenes', path: '/ml-sync' }
      ]
    },
    businessReports: {
      name: 'Reportes',
      icon: BarChart3,
      children: [
        { id: 'control-consolidador', name: 'Consolidador 2.0', path: '/control-consolidador' },
        { id: 'control-validador', name: 'Validador', path: '/control-validador' },
        { id: 'control-trm', name: 'TRM Monitor', path: '/control-trm' },
        { id: 'control-reportes', name: 'Reportes', path: '/control-reportes' },
        { id: 'control-gmail-drive', name: 'Gmail Drive', path: '/control-gmail-drive' },
        { id: 'google-api', name: 'Google API', path: '/google-api' }
      ]
    },
    productManagement: {
      name: 'Productos',
      icon: Package,
      children: [
        { id: 'catalogo-amazon', name: 'Catálogo Amazon', path: '/catalogo-amazon' },
        { id: 'publicaciones-ml', name: 'Publicaciones ML', path: '/publicaciones-ml' },
        { id: 'stock-proveedores', name: 'Stock Proveedores', path: '/stock-proveedores' }
      ]
    },
    admin: {
      name: 'Admin',
      icon: Shield,
      children: [
        { id: 'admin-panel', name: 'Panel Admin', path: '/admin' },
        { id: 'admin-users', name: 'Gestionar Usuarios', path: '/admin/users' },
        { id: 'admin-system', name: 'Monitor Sistema', path: '/admin/system' },
        { id: 'custom-menu', name: 'Menú Personalizado', path: '/admin/custom-menu' },
        { id: 'private-pages', name: 'Páginas Privadas', path: '/admin/private-pages' }
      ]
    }
  };

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemClick = () => {
    if (effectiveIsMobile) {
      effectiveSetShowMobileMenu(false);
    }
  };


  return (
    <>
      {/* Mobile Menu Overlay */}
      {effectiveIsMobile && effectiveShowMobileMenu && (
        <div 
          className="mobile-overlay"
          onClick={() => effectiveSetShowMobileMenu(false)}
        />
      )}

      {/* Mobile header is now handled by PremiumHeader component */}

      {/* Main Sidebar */}
      <aside className={`
        premium-sidebar
        ${isCollapsed ? 'collapsed' : ''}
        ${effectiveIsMobile ? (effectiveShowMobileMenu ? 'mobile-open' : 'mobile-closed') : ''}
      `}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          {!effectiveIsMobile && (
            <button
              className="collapse-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
            >
              <Menu size={18} />
            </button>
          )}
          
          <div className="logo-container">
            <div className="logo-wrapper">
              <Package className="logo-icon text-purple-600" />
              {!isCollapsed && <span className="logo-text text-purple-800 font-semibold">Dropux Pro</span>}
            </div>
          </div>

        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {/* Páginas sueltas (sin padre) */}
          {standalonePages.filter(page => hasPagePermission(page.id)).map(page => (
            <Link
              key={page.id}
              to={page.path}
              className={`nav-item ${activeTab === page.id ? 'active' : ''}`}
              onClick={handleItemClick}
            >
              <div className="item-content">
                <page.icon className="item-icon" size={18} />
                {!isCollapsed && <span className="item-name">{page.name}</span>}
              </div>
            </Link>
          ))}

          {/* Grupos colapsables */}
          {Object.entries(groupedPages).filter(([groupId, group]) => 
            groupId !== 'admin' && // Admin se muestra en su propia sección
            group.children.some(page => hasPagePermission(page.id))
          ).map(([groupId, group]) => (
            <div key={groupId}>
              <button
                className={`nav-item nav-group ${
                  expandedItems.has(groupId) ? 'expanded' : ''
                }`}
                onClick={() => toggleExpanded(groupId)}
              >
                <div className="item-content">
                  <group.icon className="item-icon" size={18} />
                  {!isCollapsed && (
                    <>
                      <span className="item-name">{group.name}</span>
                      <ChevronRight className={`expand-icon ${
                        expandedItems.has(groupId) ? 'expanded' : ''
                      }`} size={14} />
                    </>
                  )}
                </div>
              </button>
              
              {expandedItems.has(groupId) && (
                <div className="sub-items">
                  {group.children.filter(page => hasPagePermission(page.id)).map(page => (
                    <Link
                      key={page.id}
                      to={page.path}
                      className={`nav-item sub-item ${activeTab === page.id ? 'active' : ''}`}
                      onClick={handleItemClick}
                    >
                      <div className="item-content">
                        {!isCollapsed && <span className="item-name">{page.name}</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}



          {/* Sección vieja eliminada - ahora todo está en groupedPages */}

          {/* Admin Section - Now part of groupedPages */}
          {groupedPages.admin.children.filter(page => hasPagePermission(page.id)).length > 0 && (
            <div>
              <button
                className={`nav-item nav-group ${
                  expandedItems.has('admin') ? 'expanded' : ''
                }`}
                onClick={() => toggleExpanded('admin')}
              >
                <div className="item-content">
                  <Shield className="item-icon" size={18} />
                  <span className="item-name">Admin</span>
                  <ChevronRight className={`expand-icon ${
                    expandedItems.has('admin') ? 'expanded' : ''
                  }`} size={14} />
                </div>
              </button>
              
              {expandedItems.has('admin') && (
                <div className="sub-items">
                  {groupedPages.admin.children.filter(page => hasPagePermission(page.id)).map(page => (
                    <Link 
                      key={page.id}
                      to={page.path}
                      className={`nav-item sub-item ${activeTab === page.id.replace('admin-', '') || activeTab === page.path.replace('/', '') ? 'active' : ''}`}
                      onClick={handleItemClick}
                    >
                      <div className="item-content">
                        <span className="item-name">{page.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">

          {/* Activity Indicator */}
          {!isCollapsed && (
            <div className="activity-indicator">
              <Activity className="activity-icon pulse" size={12} />
              <span className="activity-text">Sistema activo</span>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Menu Button - Floating (solo cuando no hay header) */}
      {effectiveIsMobile && !effectiveShowMobileMenu && !setShowMobileMenu && (
        <button
          className="mobile-floating-btn"
          onClick={() => effectiveSetShowMobileMenu(true)}
          aria-label="Abrir menú"
        >
          <Menu size={24} />
        </button>
      )}

    </>
  );
};

export default PremiumSidebar;