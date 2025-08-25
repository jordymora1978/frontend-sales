import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Users, 
  FileText, 
  BarChart3,
  ChevronDown,
  ChevronRight,
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
  Download,
  Home,
  PieChart,
  UserCheck,
  Briefcase,
  HelpCircle,
  Shield,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import ssoManager from '../utils/ssoManager';
import './UnifiedSidebar3.css';

const UnifiedSidebar3 = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
  const [expandedSections, setExpandedSections] = useState(new Set(['navigation', 'control']));
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Manejo responsive
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

  // Manejo de teclado
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
      setTimeout(() => setIsLoading(false), 300);
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

  const navigationStructure = {
    navigation: {
      title: "NAVEGACIÓN",
      items: [
        // Rutas sin hijos (navegación directa)
        { id: "dashboard", name: "Dashboard", icon: BarChart3, type: "native" },
        { id: "orders2", name: "Órdenes Pro", icon: ShoppingCart, type: "native" },
        { id: "quotes", name: "Cotizaciones", icon: FileText, type: "native" },
        { id: "customers", name: "Clientes", icon: Users, type: "native" },
        { id: "ml-stores", name: "Tiendas MercadoLibre", icon: Package, type: "native" },
        
        // Una sola sección con hijos
        { 
          id: "control", 
          name: "Control", 
          icon: Archive, 
          type: "submenu",
          items: [
            { id: "control-consolidador", name: "Consolidador 2.0", icon: Archive },
            { id: "control-validador", name: "Validador de Duplicados", icon: CheckCircle },
            { id: "control-trm", name: "TRM - Tasas de Cambio", icon: DollarSign },
            { id: "control-reportes", name: "Reportes de Utilidad", icon: TrendingUp },
            { id: "control-gmail-drive", name: "Gmail Drive", icon: Mail },
            { id: "control-google-api", name: "Google API", icon: Settings }
          ]
        }
      ]
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div 
          className="sidebar-overlay-v3"
          onClick={toggleMobileMenu}
          aria-label="Cerrar menú de navegación"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && toggleMobileMenu()}
        />
      )}

      {/* Mobile Hamburger Button */}
      {isMobile && (
        <button
          onClick={toggleMobileMenu}
          className="mobile-menu-toggle-v3"
          aria-label={isMobileOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMobileOpen}
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      <aside 
        className={`unified-sidebar-v3 ${isMobile ? (isMobileOpen ? 'mobile-open' : 'mobile-closed') : ''} ${isLoading ? 'loading' : ''} ${isCollapsed && !isMobile ? 'collapsed' : ''}`}
        role="navigation"
        aria-label="Navegación principal"
      >
        {/* Header con Logo */}
        <header className="sidebar-header-v3">
          <div className="logo-container">
            {isCollapsed && !isMobile ? (
              <div className="logo-icon-only">
                <Package size={20} />
              </div>
            ) : (
              <div className="logo-text">DROPUX</div>
            )}
          </div>
        </header>

        {/* Navigation */}
        <nav className="sidebar-nav-v3" role="navigation">
          {Object.entries(navigationStructure).map(([sectionKey, section]) => {
            const isSectionExpanded = expandedSections.has(sectionKey);
            
            return (
              <div key={sectionKey} className="nav-section-v3">
                {/* Section Title */}
                <div className="section-title-v3">
                  {isCollapsed && !isMobile ? "..." : section.title}
                </div>

                {/* Section Items */}
                <div className="section-items-v3">
                  {section.items.map((item) => {
                    const ItemIcon = item.icon;
                    const isActive = activeTab === item.id;
                    const isExpanded = expandedSections.has(item.id);
                    
                    // Si es un item nativo (sin submenu)
                    if (item.type === 'native') {
                      return (
                        <div 
                          key={item.id} 
                          className="nav-item-wrapper-v3"
                          onMouseEnter={() => setHoveredItem(item.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          <button 
                            className={`nav-item-v3 ${isActive ? 'active' : ''}`}
                            onClick={() => handleNavItemClick(item.id)}
                            title={isCollapsed && !isMobile ? item.name : ''}
                          >
                            <div className="item-content-v3">
                              <ItemIcon size={16} />
                              {(!isCollapsed || isMobile) && (
                                <span className="item-name-v3">{item.name}</span>
                              )}
                            </div>
                          </button>
                          
                          {/* Tooltip para modo colapsado */}
                          {isCollapsed && !isMobile && hoveredItem === item.id && (
                            <div className="nav-tooltip-v3">
                              {item.name}
                            </div>
                          )}
                        </div>
                      );
                    }
                    
                    // Si es un item con submenu
                    if (item.type === 'submenu') {
                      return (
                        <div 
                          key={item.id} 
                          className="nav-item-container-v3"
                          onMouseEnter={() => setHoveredItem(item.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          {/* Main Item */}
                          <button 
                            className="nav-item-v3"
                            onClick={() => !isCollapsed && toggleSection(item.id)}
                            aria-expanded={isExpanded}
                            title={isCollapsed && !isMobile ? item.name : ''}
                          >
                            <div className="item-content-v3">
                              <ItemIcon size={16} />
                              {(!isCollapsed || isMobile) && (
                                <span className="item-name-v3">{item.name}</span>
                              )}
                            </div>
                            {(!isCollapsed || isMobile) && (
                              isExpanded ? (
                                <ChevronDown 
                                  className="item-chevron-v3 expanded"
                                  size={14}
                                />
                              ) : (
                                <ChevronRight 
                                  className="item-chevron-v3"
                                  size={14}
                                />
                              )
                            )}
                          </button>
                          
                          {/* Tooltip para submenu en modo colapsado */}
                          {isCollapsed && !isMobile && hoveredItem === item.id && (
                            <div className="nav-submenu-tooltip-v3">
                              <div className="tooltip-title">{item.name}</div>
                              {item.items.map((subItem, idx) => (
                                <button
                                  key={subItem.id}
                                  className="tooltip-item"
                                  onClick={() => handleNavItemClick(subItem.id)}
                                >
                                  <subItem.icon size={14} />
                                  <span>{subItem.name}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Subitems - Solo mostrar si NO está colapsado */}
                          {isExpanded && item.items && (!isCollapsed || isMobile) && (
                            <div className="sub-items-v3">
                              {item.items.map((subItem, index) => {
                                const SubItemIcon = subItem.icon;
                                const isSubActive = activeTab === subItem.id;
                                
                                if (subItem.url) {
                                  return (
                                    <button 
                                      key={index}
                                      className="sub-item-v3 external"
                                      onClick={() => openExternalLink(subItem.url)}
                                    >
                                      <div className="sub-item-content-v3">
                                        <SubItemIcon size={14} />
                                        <span className="sub-item-name-v3">{subItem.name}</span>
                                      </div>
                                      <ExternalLink size={12} className="external-icon-v3" />
                                    </button>
                                  );
                                } else {
                                  return (
                                    <button 
                                      key={subItem.id}
                                      className={`sub-item-v3 ${isSubActive ? 'active' : ''}`}
                                      onClick={() => handleNavItemClick(subItem.id)}
                                    >
                                      <div className="sub-item-content-v3">
                                        <SubItemIcon size={14} />
                                        <span className="sub-item-name-v3">{subItem.name}</span>
                                      </div>
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
              </div>
            );
          })}
        </nav>

        {/* Footer - Dropux Sales Hub */}
        <footer className="sidebar-footer-v3">
          <div className="download-center">
            <div className="download-icon">
              <Package size={16} />
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="download-info">
                <div className="download-title">Sales Hub</div>
                <div className="download-subtitle">Dropux CRM Suite v2.0</div>
              </div>
            )}
          </div>
        </footer>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="loading-indicator-v3">
            <div className="loading-shimmer-v3" />
          </div>
        )}
      </aside>
    </>
  );
};

export default UnifiedSidebar3;