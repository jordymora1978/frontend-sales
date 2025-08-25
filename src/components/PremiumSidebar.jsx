import React, { useState, useEffect, useContext, createContext } from 'react';
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
  Cloud
} from 'lucide-react';
import './PremiumSidebar.css';

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

const PremiumSidebar = ({ activeTab, setActiveTab, isMobile, showMobileMenu, setShowMobileMenu }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState(new Set(['control']));
  const [hoveredItem, setHoveredItem] = useState(null);
  const [internalIsMobile, setInternalIsMobile] = useState(false);
  const [internalShowMobileMenu, setInternalShowMobileMenu] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext) || {};

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
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'orders2', name: 'Órdenes Pro', icon: ShoppingBag, badge: '12' },
    { id: 'orders2_0', name: 'Órdenes Pro 2.0', icon: ShoppingBag, badge: 'new' },
    { id: 'quotes', name: 'Cotizaciones', icon: FileText, badge: '3' },
    { id: 'customers', name: 'Clientes', icon: Users, badge: null },
    { id: 'ml-stores', name: 'ML Stores', icon: Package, badge: 'new' },
    { id: 'ml-sync', name: 'Sincronizar Órdenes', icon: RefreshCw, badge: null },
    { id: 'google-api', name: 'Google API', icon: Cloud, badge: 'beta' },
    {
      id: 'control',
      name: 'Control Suite',
      icon: FolderOpen,
      isGroup: true,
      items: [
        { id: 'control-consolidador', name: 'Consolidador 2.0', icon: Archive },
        { id: 'control-validador', name: 'Validador', icon: CheckCircle2 },
        { id: 'control-trm', name: 'TRM Monitor', icon: DollarSign },
        { id: 'control-reportes', name: 'Analytics', icon: TrendingUp },
        { id: 'control-gmail-drive', name: 'Gmail Drive', icon: Mail }
      ]
    }
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

  const handleItemClick = (itemId) => {
    setActiveTab(itemId);
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
              <Package className="logo-icon" />
              {!isCollapsed && <span className="logo-text">Dropux Pro</span>}
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
                          <button
                            key={subItem.id}
                            className={`nav-item sub-item ${
                              activeTab === subItem.id ? 'active' : ''
                            }`}
                            onClick={() => handleItemClick(subItem.id)}
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
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => handleItemClick(item.id)}
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
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          {!isCollapsed && (
            <div className="nav-section nav-bottom">
              <div className="section-label">SISTEMA</div>
              
              <button className="nav-item">
                <div className="item-content">
                  <Settings className="item-icon" size={18} />
                  <span className="item-name">Configuración</span>
                </div>
              </button>

              <button className="nav-item">
                <div className="item-content">
                  <HelpCircle className="item-icon" size={18} />
                  <span className="item-name">Ayuda</span>
                </div>
              </button>

              {/* Theme toggle removido - solo se usa en el header */}
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
                <div className="user-name">John Doe</div>
                <div className="user-role">Administrador</div>
              </div>
            )}
            {!isCollapsed && (
              <button className="logout-btn" title="Cerrar sesión">
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