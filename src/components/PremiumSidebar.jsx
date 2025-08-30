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


  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, badge: null, path: '/dashboard' },
    { id: 'orders2_0', name: 'Mis Ventas', icon: ShoppingBag, badge: null, path: '/orders2_0' },
    { id: 'customers', name: 'Mis Clientes', icon: Users, badge: null, path: '/customers' },
    { id: 'control-reportes', name: 'Mis Reportes', icon: TrendingUp, badge: null, path: '/control-reportes' },
    { id: 'quotes', name: 'Cotizaciones', icon: FileText, badge: '3', path: '/quotes' }
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
            
            {menuItems.map(item => (
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
              
              {expandedItems.has('configuracion') && (
                <div className="sub-items">
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
                </div>
              )}

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
              
              {expandedItems.has('control') && (
                <div className="sub-items">
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
                </div>
              )}

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
              
              {expandedItems.has('products') && (
                <div className="sub-items">
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

          {/* SUPER ADMIN Section - Solo para super_admin */}
          {!isCollapsed && user?.roles?.includes('super_admin') && (
            <div className="nav-section nav-bottom">
              <div className="section-label">SUPER ADMIN</div>
              
              <Link 
                to="/admin"
                className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={handleItemClick}
              >
                <div className="item-content">
                  <Shield className="item-icon" size={18} />
                  <span className="item-name">Panel Admin</span>
                  <Crown className="item-badge badge-new" size={14} />
                </div>
              </Link>

              <Link 
                to="/admin/users"
                className={`nav-item ${activeTab === 'admin/users' ? 'active' : ''}`}
                onClick={handleItemClick}
              >
                <div className="item-content">
                  <User className="item-icon" size={18} />
                  <span className="item-name">Gestionar Usuarios</span>
                </div>
              </Link>

              <Link 
                to="/admin/system"
                className={`nav-item ${activeTab === 'admin/system' ? 'active' : ''}`}
                onClick={handleItemClick}
              >
                <div className="item-content">
                  <Activity className="item-icon" size={18} />
                  <span className="item-name">Monitor Sistema</span>
                </div>
              </Link>
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
                <div className="user-role">{user?.roles?.includes('super_admin') ? 'Super Admin' : 'Usuario'}</div>
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