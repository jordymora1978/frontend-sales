import React, { useState, useEffect, useContext, createContext } from 'react';
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
  Crown
} from 'lucide-react';
import './PremiumSidebar.css';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

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

  // 🚀 SISTEMA SIMPLE: Check if user has permission for a page
  const hasPagePermission = (pageId) => {
    if (!user) return false;
    
    // Get user type from roles array or user_type field
    let userType = user?.user_type;
    if (user?.roles && user.roles.length > 0) {
      userType = user.roles[0]; // First role is primary
    }
    
    // Get user pages from static definition
    const userPages = PAGES_BY_USER_TYPE[userType] || PAGES_BY_USER_TYPE['asesor'];
    return userPages.includes(pageId);
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

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, badge: null, path: '/dashboard' },
    { id: 'orders2_0', name: 'Mis Ventas', icon: ShoppingBag, badge: null, path: '/orders2_0' },
    { id: 'customers', name: 'Mis Clientes', icon: Users, badge: null, path: '/customers' },
    { id: 'control-reportes', name: 'Mis Reportes', icon: TrendingUp, badge: null, path: '/control-reportes' },
    { id: 'quotes', name: 'Cotizaciones', icon: FileText, badge: '3', path: '/quotes' }
  ];

  // System section pages (always visible but filtered by permissions)
  const systemPages = [
    { id: 'ml-stores', name: 'Mis Tiendas', icon: Package, path: '/ml-stores' },
    { id: 'ml-sync', name: 'Sincronizar Órdenes', icon: RefreshCw, path: '/ml-sync' },
    { id: 'apis-conexiones', name: 'APIs y Conexiones', icon: Key, path: '/apis-conexiones' },
    { id: 'mis-etiquetas', name: 'Mis Etiquetas', icon: Tag, path: '/mis-etiquetas' },
    { id: 'control-consolidador', name: 'Consolidador 2.0', icon: Archive, path: '/control-consolidador' },
    { id: 'control-validador', name: 'Validador', icon: CheckCircle2, path: '/control-validador' },
    { id: 'control-trm', name: 'TRM Monitor', icon: DollarSign, path: '/control-trm' },
    { id: 'control-gmail-drive', name: 'Gmail Drive', icon: Mail, path: '/control-gmail-drive' },
    { id: 'google-api', name: 'Google API', icon: Cloud, path: '/google-api' },
    { id: 'catalogo-amazon', name: 'Catálogo Amazon', icon: Package, path: '/catalogo-amazon' },
    { id: 'publicaciones-ml', name: 'Publicaciones ML', icon: ShoppingBag, path: '/publicaciones-ml' },
    { id: 'stock-proveedores', name: 'Stock Proveedores', icon: Truck, path: '/stock-proveedores' }
  ];

  // Admin pages (requires special permissions)
  const adminPages = [
    { id: 'admin-panel', name: 'Panel Admin', icon: Shield, path: '/admin' },
    { id: 'admin-users', name: 'Gestionar Usuarios', icon: User, path: '/admin/users' },
    { id: 'admin-system', name: 'Monitor Sistema', icon: Activity, path: '/admin/system' }
  ];

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
          <div className="nav-section">
            {!isCollapsed && (
              <div className="section-label">NAVEGACIÓN</div>
            )}
            
            {menuItems.filter(item => hasPagePermission(item.id)).map(item => (
              <div key={item.id} className="nav-item-wrapper">
                {item.isGroup ? (
                  <>
                    <button
                      className={`nav-item nav-group ${
                        expandedItems.has(item.id) ? 'expanded' : ''
                      }`}
                      onClick={() => toggleExpanded(item.id)}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div className="item-content">
                        <item.icon className="item-icon" size={18} />
                        {!isCollapsed && (
                          <>
                            <span className="item-name">{item.name}</span>
                            <ChevronRight className={`expand-icon ${
                              expandedItems.has(item.id) ? 'expanded' : ''
                            }`} size={14} />
                          </>
                        )}
                      </div>
                    </button>

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && hoveredItem === item.id && (
                      <div className="sidebar-tooltip">
                        <div className="tooltip-title">{item.name}</div>
                        <div className="tooltip-items">
                          {item.items.map(subItem => (
                            <button
                              key={subItem.id}
                              className="tooltip-item"
                              onClick={() => handleItemClick(subItem.id)}
                            >
                              <subItem.icon size={14} />
                              <span>{subItem.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Expanded subitems - Show for both collapsed and expanded states */}
                    {expandedItems.has(item.id) && (
                      <div className="sub-items">
                        {item.items.map(subItem => (
                          <Link
                            key={subItem.id}
                            to={subItem.path}
                            className={`nav-item sub-item ${
                              activeTab === subItem.id ? 'active' : ''
                            }`}
                            onClick={handleItemClick}
                            onMouseEnter={() => isCollapsed && setHoveredItem(subItem.id)}
                            onMouseLeave={() => isCollapsed && setHoveredItem(null)}
                          >
                            <div className="item-content">
                              <subItem.icon className="item-icon" size={16} />
                              {!isCollapsed && (
                                <span className="item-name">{subItem.name}</span>
                              )}
                            </div>
                            
                            {/* Tooltip for collapsed sub-items */}
                            {isCollapsed && hoveredItem === subItem.id && (
                              <div className="sidebar-tooltip">
                                {subItem.name}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                    onClick={handleItemClick}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="item-content">
                      <item.icon className="item-icon" size={18} />
                      {!isCollapsed && (
                        <>
                          <span className="item-name">{item.name}</span>
                          {item.badge && (
                            <span className={`item-badge ${
                              item.badge === 'new' ? 'badge-new' : ''
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && hoveredItem === item.id && (
                      <div className="sidebar-tooltip">
                        {item.name}
                      </div>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </div>


          {/* Bottom Section */}
          {!isCollapsed && (
            <div className="nav-section nav-bottom">
              <div className="section-label">SISTEMA</div>
              
              {sectionHasPermissions(configPages) && (
                <button
                  className={`nav-item nav-group ${
                    expandedItems.has('configuracion') ? 'expanded' : ''
                  }`}
                  onClick={() => toggleExpanded('configuracion')}
                >
                  <div className="item-content">
                    <Settings className="item-icon" size={18} />
                    <span className="item-name">Configuración</span>
                    <ChevronRight className={`expand-icon ${
                      expandedItems.has('configuracion') ? 'expanded' : ''
                    }`} size={14} />
                  </div>
                </button>
              )}
              
              {expandedItems.has('configuracion') && (
                <div className="sub-items">
                  {hasPagePermission('ml-stores') && (
                    <Link 
                      to="/ml-stores"
                      className="nav-item sub-item"
                      onClick={handleItemClick}
                    >
                      <div className="item-content">
                        <Package className="item-icon" size={16} />
                        <span className="item-name">Mis Tiendas</span>
                      </div>
                    </Link>
                  )}
                  {hasPagePermission('ml-sync') && (
                    <Link 
                      to="/ml-sync"
                      className="nav-item sub-item"
                      onClick={handleItemClick}
                    >
                      <div className="item-content">
                        <RefreshCw className="item-icon" size={16} />
                        <span className="item-name">Sincronizar Órdenes</span>
                      </div>
                    </Link>
                  )}
                  {hasPagePermission('apis-conexiones') && (
                    <Link 
                      to="/apis-conexiones"
                      className="nav-item sub-item"
                      onClick={handleItemClick}
                    >
                      <div className="item-content">
                        <Key className="item-icon" size={16} />
                        <span className="item-name">APIs y Conexiones</span>
                      </div>
                    </Link>
                  )}
                  {hasPagePermission('mis-etiquetas') && (
                    <Link 
                      to="/mis-etiquetas"
                      className="nav-item sub-item"
                      onClick={handleItemClick}
                    >
                      <div className="item-content">
                        <Tag className="item-icon" size={16} />
                        <span className="item-name">Mis Etiquetas</span>
                      </div>
                    </Link>
                  )}
                </div>
              )}

              {sectionHasPermissions(controlPages) && (
                <button
                  className={`nav-item nav-group ${
                    expandedItems.has('control') ? 'expanded' : ''
                  }`}
                  onClick={() => toggleExpanded('control')}
                >
                  <div className="item-content">
                    <FolderOpen className="item-icon" size={18} />
                    <span className="item-name">Control Suite</span>
                    <ChevronRight className={`expand-icon ${
                      expandedItems.has('control') ? 'expanded' : ''
                    }`} size={14} />
                  </div>
                </button>
              )}
              
              {expandedItems.has('control') && (
                <div className="sub-items">
                  {hasPagePermission('control-consolidador') && (
                    <Link 
                      to="/control-consolidador"
                      className="nav-item sub-item"
                      onClick={handleItemClick}
                    >
                      <div className="item-content">
                        <Archive className="item-icon" size={16} />
                        <span className="item-name">Consolidador 2.0</span>
                      </div>
                    </Link>
                  )}
                  {hasPagePermission('control-validador') && (
                    <Link 
                      to="/control-validador"
                      className="nav-item sub-item"
                      onClick={handleItemClick}
                    >
                      <div className="item-content">
                        <CheckCircle2 className="item-icon" size={16} />
                        <span className="item-name">Validador</span>
                      </div>
                    </Link>
                  )}
                  {hasPagePermission('control-trm') && (
                    <Link 
                      to="/control-trm"
                      className="nav-item sub-item"
                      onClick={handleItemClick}
                    >
                      <div className="item-content">
                        <DollarSign className="item-icon" size={16} />
                        <span className="item-name">TRM Monitor</span>
                      </div>
                    </Link>
                  )}
                  {hasPagePermission('control-gmail-drive') && (
                    <Link 
                      to="/control-gmail-drive"
                      className="nav-item sub-item"
                      onClick={handleItemClick}
                    >
                      <div className="item-content">
                        <Mail className="item-icon" size={16} />
                        <span className="item-name">Gmail Drive</span>
                      </div>
                    </Link>
                  )}
                  {hasPagePermission('google-api') && (
                    <Link 
                      to="/google-api"
                      className="nav-item sub-item"
                      onClick={handleItemClick}
                    >
                      <div className="item-content">
                        <Cloud className="item-icon" size={16} />
                        <span className="item-name">Google API</span>
                      </div>
                    </Link>
                  )}
                </div>
              )}

              {sectionHasPermissions(productPages) && (
                <button
                  className={`nav-item nav-group ${
                    expandedItems.has('products') ? 'expanded' : ''
                  }`}
                  onClick={() => toggleExpanded('products')}
                >
                  <div className="item-content">
                    <Package className="item-icon" size={18} />
                    <span className="item-name">Products Suit</span>
                    <ChevronRight className={`expand-icon ${
                      expandedItems.has('products') ? 'expanded' : ''
                    }`} size={14} />
                  </div>
                </button>
              )}
              
              {expandedItems.has('products') && (
                <div className="sub-items">
                  {hasPagePermission('catalogo-amazon') && (
                    <Link 
                      to="/catalogo-amazon"
                      className="nav-item sub-item"
                      onClick={handleItemClick}
                    >
                      <div className="item-content">
                        <Package className="item-icon" size={16} />
                        <span className="item-name">Catálogo Amazon</span>
                      </div>
                    </Link>
                  )}
                  {hasPagePermission('publicaciones-ml') && (
                    <Link 
                      to="/publicaciones-ml"
                      className="nav-item sub-item"
                      onClick={handleItemClick}
                    >
                      <div className="item-content">
                        <ShoppingBag className="item-icon" size={16} />
                        <span className="item-name">Publicaciones ML</span>
                      </div>
                    </Link>
                  )}
                  {hasPagePermission('stock-proveedores') && (
                    <Link 
                      to="/stock-proveedores"
                      className="nav-item sub-item"
                      onClick={handleItemClick}
                    >
                      <div className="item-content">
                        <Truck className="item-icon" size={16} />
                        <span className="item-name">Stock Proveedores</span>
                      </div>
                    </Link>
                  )}
                </div>
              )}

              <button className="nav-item">
                <div className="item-content">
                  <HelpCircle className="item-icon" size={18} />
                  <span className="item-name">Ayuda</span>
                </div>
              </button>

              {/* Theme toggle removido - solo se usa en el header */}
            </div>
          )}

          {/* Admin Section - Based on user permissions */}
          {!isCollapsed && adminPages.filter(page => hasPagePermission(page.id)).length > 0 && (
            <div className="nav-section nav-bottom">
              <div className="section-label">ADMINISTRACIÓN</div>
              
              {adminPages.filter(page => hasPagePermission(page.id)).map(page => (
                <Link 
                  key={page.id}
                  to={page.path}
                  className={`nav-item ${activeTab === page.id.replace('admin-', '') || activeTab === page.path.replace('/', '') ? 'active' : ''}`}
                  onClick={handleItemClick}
                >
                  <div className="item-content">
                    <page.icon className="item-icon" size={18} />
                    <span className="item-name">{page.name}</span>
                    {page.id === 'admin-panel' && <Crown className="item-badge badge-new" size={14} />}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="user-section">
            <div className="user-avatar">
              <User size={16} />
            </div>
            {!isCollapsed && (
              <div className="user-info">
                <div className="user-name">{user?.first_name || 'Usuario'} {user?.last_name || ''}</div>
                <div className="user-role">{getRoleDisplayName()}</div>
              </div>
            )}
            {!isCollapsed && (
              <button 
                className="logout-btn" 
                title="Cerrar sesión"
                onClick={logout}
              >
                <LogOut size={16} />
              </button>
            )}
          </div>

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