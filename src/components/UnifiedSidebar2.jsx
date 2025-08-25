import React, { useState, useEffect, useContext } from 'react';
import { 
  ShoppingCart, 
  Users, 
  FileText, 
  BarChart3,
  ChevronDown,
  ExternalLink,
  Package,
  CheckCircle,
  TrendingUp,
  Mail,
  DollarSign,
  Settings,
  Archive,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  User
} from 'lucide-react';
import ssoManager from '../utils/ssoManager';
import './UnifiedSidebar2.css';

// Theme Context para manejo profesional de temas
const ThemeContext = React.createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('dropux-theme');
    return savedTheme || 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState('light');

  useEffect(() => {
    const updateResolvedTheme = () => {
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setResolvedTheme(systemTheme);
      } else {
        setResolvedTheme(theme);
      }
    };

    updateResolvedTheme();
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateResolvedTheme);
      return () => mediaQuery.removeEventListener('change', updateResolvedTheme);
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    localStorage.setItem('dropux-theme', theme);
  }, [theme, resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const UnifiedSidebar2 = ({ activeTab, setActiveTab }) => {
  const [expandedSections, setExpandedSections] = useState(new Set(['control']));
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const { theme, setTheme, resolvedTheme } = useContext(ThemeContext) || { 
    theme: 'light', 
    setTheme: () => {}, 
    resolvedTheme: 'light' 
  };

  // Manejo responsive profesional
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileOpen]);

  // Manejo de teclado para accesibilidad
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    if (isMobileOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleNavItemClick = async (itemId) => {
    setIsLoading(true);
    try {
      setActiveTab(itemId);
      if (isMobile) {
        setIsMobileOpen(false);
      }
    } finally {
      setTimeout(() => setIsLoading(false), 300); // Micro-interaction delay
    }
  };

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const openExternalLink = (url) => {
    console.log('🔗 Abriendo enlace externo:', url);
    
    if (!ssoManager.isAuthenticated()) {
      console.warn('⚠️ Usuario no autenticado, no se puede abrir enlace externo');
      return;
    }
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const themeOptions = [
    { value: 'light', label: 'Claro', icon: Sun },
    { value: 'dark', label: 'Oscuro', icon: Moon },
    { value: 'system', label: 'Sistema', icon: Monitor }
  ];

  const getCurrentThemeIcon = () => {
    const option = themeOptions.find(opt => opt.value === theme);
    return option ? option.icon : Sun;
  };

  const navigationStructure = {
    main: {
      title: "Navegación",
      items: [
        { id: "orders", name: "Órdenes", icon: ShoppingCart, type: "native" },
        { id: "orders2", name: "Órdenes Pro", icon: ShoppingCart, type: "native" },
        { id: "customers", name: "Clientes", icon: Users, type: "native" },
        { id: "quotes", name: "Cotizaciones", icon: FileText, type: "native" },
        { id: "dashboard", name: "Dashboard", icon: BarChart3, type: "native" },
        { id: "ml-stores", name: "Tiendas ML", icon: Package, type: "native" },
        {
          id: "control",
          name: "Control",
          icon: BarChart3,
          type: "submenu",
          items: [
            { id: "control-consolidador", name: "Consolidador", icon: Archive },
            { id: "control-validador", name: "Validador", icon: CheckCircle },
            { id: "control-trm", name: "TRM", icon: DollarSign },
            { id: "control-reportes", name: "Reportes", icon: TrendingUp },
            { id: "control-gmail-drive", name: "Gmail Drive", icon: Mail }
          ]
        },
        {
          id: "products",
          name: "Productos",
          icon: Package,
          type: "submenu",
          comingSoon: true,
          items: [
            { name: "Catálogo", icon: Package, url: "https://products.dropux.co/catalog" },
            { name: "Inventario", icon: Archive, url: "https://products.dropux.co/inventory" },
            { name: "Proveedores", icon: Users, url: "https://products.dropux.co/suppliers" }
          ]
        }
      ]
    }
  };

  return (
    <>
      {/* Mobile Overlay - Enterprise standard */}
      {isMobile && isMobileOpen && (
        <div 
          className="sidebar-overlay"
          onClick={toggleMobileMenu}
          aria-label="Cerrar menú de navegación"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && toggleMobileMenu()}
        />
      )}

      {/* Mobile Hamburger Button - Professional positioning */}
      {isMobile && (
        <button
          onClick={toggleMobileMenu}
          className="mobile-menu-toggle"
          aria-label={isMobileOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMobileOpen}
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      <aside 
        className={`unified-sidebar-v2 ${isMobile ? (isMobileOpen ? 'mobile-open' : 'mobile-closed') : ''} ${isLoading ? 'loading' : ''}`}
        role="navigation"
        aria-label="Navegación principal"
      >
        {/* Header Minimalista */}
        <header className="sidebar-header">
          <div className="app-brand">
            <div className="brand-icon">
              <User size={18} />
            </div>
            <div className="brand-info">
              <h1 className="brand-title">Dropux Hub</h1>
            </div>
          </div>

          {/* Theme Selector - Enterprise Feature */}
          <div className="theme-selector">
            <button
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              className="theme-toggle-btn"
              aria-label="Cambiar tema"
              aria-expanded={themeMenuOpen}
            >
              {React.createElement(getCurrentThemeIcon(), { size: 18 })}
            </button>
            
            {themeMenuOpen && (
              <div className="theme-menu" role="menu">
                {themeOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        setTheme(option.value);
                        setThemeMenuOpen(false);
                      }}
                      className={`theme-option ${theme === option.value ? 'active' : ''}`}
                      role="menuitem"
                      aria-pressed={theme === option.value}
                    >
                      <IconComponent size={16} />
                      <span>{option.label}</span>
                      {theme === option.value && <CheckCircle size={14} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </header>

        {/* Navigation - Minimalista Unificada */}
        <nav className="sidebar-navigation" role="navigation" aria-label="Menú de navegación">
          <div className="nav-section">
            {navigationStructure.main.items.map((item) => {
              const ItemIcon = item.icon;
              const isActive = activeTab === item.id;
              
              // Si es un item normal (native)
              if (item.type === 'native') {
                return (
                  <button 
                    key={item.id}
                    className={`nav-item native ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavItemClick(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className="item-content">
                      <ItemIcon size={16} aria-hidden="true" />
                      <span className="item-name">{item.name}</span>
                    </div>
                    {isActive && <div className="active-indicator" aria-hidden="true" />}
                  </button>
                );
              }
              
              // Si es un submenu (Control/Productos)
              if (item.type === 'submenu') {
                const isExpanded = expandedSections.has(item.id);
                return (
                  <div key={item.id}>
                    {/* Item principal del submenu */}
                    <button 
                      className={`nav-item submenu ${item.comingSoon ? 'coming-soon' : ''}`}
                      onClick={() => !item.comingSoon && toggleSection(item.id)}
                      disabled={item.comingSoon}
                      aria-expanded={isExpanded}
                    >
                      <div className="item-content">
                        <ItemIcon size={16} aria-hidden="true" />
                        <span className="item-name">{item.name}</span>
                      </div>
                      {item.comingSoon ? (
                        <span className="coming-soon-badge">Pronto</span>
                      ) : (
                        <ChevronDown 
                          className={`submenu-chevron ${isExpanded ? 'expanded' : ''}`}
                          size={14}
                          aria-hidden="true"
                        />
                      )}
                    </button>

                    {/* Subitems */}
                    {isExpanded && !item.comingSoon && (
                      <div className="submenu-items">
                        {item.items.map((subItem, index) => {
                          const SubItemIcon = subItem.icon;
                          const isSubActive = activeTab === subItem.id;
                          
                          if (subItem.url) {
                            // Item externo
                            return (
                              <button 
                                key={index}
                                className="nav-item external sub"
                                onClick={() => openExternalLink(subItem.url)}
                              >
                                <div className="item-content">
                                  <SubItemIcon size={14} aria-hidden="true" />
                                  <span className="item-name">{subItem.name}</span>
                                </div>
                                <ExternalLink size={12} className="external-icon" aria-hidden="true" />
                              </button>
                            );
                          } else {
                            // Item nativo
                            return (
                              <button 
                                key={subItem.id}
                                className={`nav-item native sub ${isSubActive ? 'active' : ''}`}
                                onClick={() => handleNavItemClick(subItem.id)}
                                aria-current={isSubActive ? 'page' : undefined}
                              >
                                <div className="item-content">
                                  <SubItemIcon size={14} aria-hidden="true" />
                                  <span className="item-name">{subItem.name}</span>
                                </div>
                                {isSubActive && <div className="active-indicator" aria-hidden="true" />}
                              </button>
                            );
                          }
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              
              return null;
            })}
          </div>
        </nav>

        {/* Footer Minimalista */}
        <footer className="sidebar-footer">
          <div className="footer-content">
            <div className="version-info">
              <Settings size={12} aria-hidden="true" />
              <span>v2.0</span>
            </div>
            <div className="status-dots">
              <div className="status-dot active" title="Sales: Activo" />
              <div className="status-dot available" title="Control: Disponible" />
              <div className="status-dot coming-soon" title="Products: Próximamente" />
            </div>
          </div>
        </footer>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="loading-indicator" aria-hidden="true">
            <div className="loading-shimmer" />
          </div>
        )}
      </aside>
    </>
  );
};

export default UnifiedSidebar2;