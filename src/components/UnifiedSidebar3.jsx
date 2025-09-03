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
import { useAuth } from '../context/AuthContext';
import { AUTH_API_URL } from '../config/api.js';
import './UnifiedSidebar3.css';

const UnifiedSidebar3 = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
  const { user } = useAuth(); // 🔒 Obtener usuario con permisos personalizados
  const [expandedSections, setExpandedSections] = useState(new Set(['navigation', 'control']));
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [userRolePermissions, setUserRolePermissions] = useState(null);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

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

  // 🚀 NUEVA FUNCIÓN: Cargar permisos específicos del usuario desde BD
  const loadUserRolePermissionsFromAPI = async () => {
    if (!user || !user.roles || user.roles.length === 0) {
      console.log('🔍 [SIDEBAR] No user or roles, skipping permission load');
      return;
    }

    try {
      console.log('🚀 [SIDEBAR] Cargando permisos desde API para usuario:', user.email);
      const userRole = user.roles[0]; // Rol principal
      
      const response = await fetch(`${AUTH_API_URL}/admin/role-permissions`);
      
      if (response.ok) {
        const allRolePermissions = await response.json();
        console.log('📥 [SIDEBAR] Todos los permisos de roles:', allRolePermissions);
        
        // Obtener permisos específicos del rol del usuario
        const userPermissions = allRolePermissions[userRole] || [];
        console.log(`✅ [SIDEBAR] Permisos para rol ${userRole}:`, userPermissions);
        
        // Limpiar cache y forzar actualización
        localStorage.removeItem('menu_cache');
        setUserRolePermissions(userPermissions);
        setPermissionsLoaded(true);
        
        // Forzar re-render inmediato
        const newNavigation = generateNavigation(userPermissions);
        setNavigationStructure(newNavigation);
        
        return userPermissions;
      } else {
        console.error('❌ [SIDEBAR] Error loading role permissions:', response.status);
      }
    } catch (error) {
      console.error('💥 [SIDEBAR] Error loading user role permissions:', error);
    }
    
    return [];
  };

  // 🔧 FUNCIÓN AUXILIAR: Generar navegación desde permisos
  const generateNavigation = (permissions) => {
    const allowedModules = [];
    
    permissions.forEach(moduleId => {
      const moduleConfig = AVAILABLE_MODULES[moduleId];
      if (moduleConfig) {
        allowedModules.push({
          id: moduleId,
          name: moduleConfig.name,
          icon: moduleConfig.icon,
          type: moduleConfig.type
        });
      }
    });
    
    return {
      navigation: {
        title: "MENÚ PERSONALIZADO",
        items: allowedModules
      }
    };
  };

  // 🧪 FUNCIÓN DE TEST: Simular usuario Administrador
  const testAdminUser = () => {
    console.log('🧪 [TEST] Simulando usuario Administrador...');
    
    // Permisos reales del administrador desde BD
    const adminPermissions = ['dashboard', 'admin-users', 'quotes', 'customers'];
    const allowedModules = [];
    
    adminPermissions.forEach(moduleId => {
      const moduleConfig = AVAILABLE_MODULES[moduleId];
      if (moduleConfig) {
        allowedModules.push({
          id: moduleId,
          name: moduleConfig.name,
          icon: moduleConfig.icon,
          type: moduleConfig.type
        });
        console.log(`✅ [TEST] Módulo válido: ${moduleConfig.name} (${moduleId})`);
      } else {
        console.log(`❌ [TEST] Módulo NO ENCONTRADO: ${moduleId}`);
      }
    });
    
    console.log('📋 [TEST RESULT] Administrador verá:', allowedModules.map(m => `${m.name}`));
    return allowedModules;
  };

  // 🔒 MENÚ PERSONALIZADO: Mapeo de IDs a configuración de módulos
  const AVAILABLE_MODULES = {
    // 🏠 Principales
    'dashboard': { name: 'Dashboard', icon: BarChart3, type: 'native' },
    'orders2_0': { name: 'Mis Ventas', icon: ShoppingCart, type: 'native' },
    'customers': { name: 'Mis Clientes', icon: Users, type: 'native' },
    'control-reportes': { name: 'Mis Reportes', icon: TrendingUp, type: 'native' },
    'quotes': { name: 'Cotizaciones', icon: FileText, type: 'native' },
    
    // ⚙️ Configuración
    'ml-stores': { name: 'Mis Tiendas', icon: Package, type: 'native' },
    'ml-sync': { name: 'Sincronizar Órdenes', icon: CheckCircle, type: 'native' },
    'apis-conexiones': { name: 'APIs y Conexiones', icon: Settings, type: 'native' },
    'mis-etiquetas': { name: 'Mis Etiquetas', icon: FileText, type: 'native' },
    
    // 📊 Control Suite
    'control-consolidador': { name: 'Consolidador 2.0', icon: Archive, type: 'native' },
    'control-validador': { name: 'Validador', icon: CheckCircle, type: 'native' },
    'control-trm': { name: 'TRM Monitor', icon: DollarSign, type: 'native' },
    'control-gmail-drive': { name: 'Gmail Drive', icon: Mail, type: 'native' },
    'google-api': { name: 'Google API', icon: Settings, type: 'native' },
    
    // 📦 Products Suite
    'catalogo-amazon': { name: 'Catálogo Amazon', icon: Package, type: 'native' },
    'publicaciones-ml': { name: 'Publicaciones ML', icon: ShoppingCart, type: 'native' },
    'stock-proveedores': { name: 'Stock Proveedores', icon: Users, type: 'native' },
    
    // 👑 Super Admin
    'admin-panel': { name: 'Panel Admin', icon: Shield, type: 'native' },
    'admin-users': { name: 'Gestión de Usuarios', icon: UserCheck, type: 'native' },
    'admin-system': { name: 'Monitor Sistema', icon: Settings, type: 'native' }
  };

  // 🔒 GENERAR ESTRUCTURA DE NAVEGACIÓN PERSONALIZADA basada en permisos del usuario
  const getPersonalizedNavigation = () => {
    console.log('🔍 [DEBUG] Usuario completo:', user);
    console.log('🔍 [DEBUG] user.role_permissions (AuthContext):', user?.role_permissions);
    console.log('🔍 [DEBUG] userRolePermissions (API):', userRolePermissions);
    console.log('🔍 [DEBUG] permissionsLoaded:', permissionsLoaded);
    console.log('🔍 [DEBUG] user.roles:', user?.roles);
    
    // Usar permisos de la API si están disponibles, sino usar los del contexto
    const sourcePermissions = userRolePermissions || user?.role_permissions;
    
    if (!user || !sourcePermissions || sourcePermissions.length === 0) {
      console.log('⚠️ [DEBUG] Sin permisos válidos - mostrando solo dashboard');
      // Fallback: mostrar solo dashboard si no hay permisos
      return {
        navigation: {
          title: "NAVEGACIÓN",
          items: [
            { id: "dashboard", name: "Dashboard", icon: BarChart3, type: "native" }
          ]
        }
      };
    }

    const userPermissions = sourcePermissions;
    const allowedModules = [];
    
    console.log('🔍 [DEBUG] Permisos finales del usuario:', userPermissions);

    // 🔒 Filtrar solo módulos que el usuario tiene permitidos
    userPermissions.forEach(moduleId => {
      const moduleConfig = AVAILABLE_MODULES[moduleId];
      if (moduleConfig) {
        allowedModules.push({
          id: moduleId,
          name: moduleConfig.name,
          icon: moduleConfig.icon,
          type: moduleConfig.type
        });
      }
    });

    console.log(`🔒 Menú personalizado generado para ${user.roles?.[0] || 'usuario'}:`, allowedModules.map(m => m.name));
    console.log('📋 [FINAL MENU] Módulos que verá el usuario:', allowedModules.map(m => `${m.icon} ${m.name} (${m.id})`));

    return {
      navigation: {
        title: "MENÚ PERSONALIZADO",
        items: allowedModules
      }
    };
  };

  const [navigationStructure, setNavigationStructure] = useState(() => getPersonalizedNavigation());

  // 🚀 NUEVO: Cargar permisos del usuario desde API cuando se monte el componente o cambie el usuario
  useEffect(() => {
    if (user && user.roles && user.roles.length > 0 && !permissionsLoaded) {
      console.log('🔄 [SIDEBAR] Cargando permisos del usuario al montar componente');
      loadUserRolePermissionsFromAPI();
    }
    
    // 🧪 TEST: Ejecutar test de usuario Administrador
    testAdminUser();
  }, [user, permissionsLoaded]);

  // 🔄 REACTIVO: Actualizar menú cuando cambien los permisos del usuario (desde API o contexto)
  useEffect(() => {
    const newNavigation = getPersonalizedNavigation();
    setNavigationStructure(newNavigation);
    console.log('🔄 Menú actualizado por cambio en permisos de usuario');
  }, [user?.role_permissions, userRolePermissions, permissionsLoaded]); // Se ejecuta cuando cambien los permisos

  // 🚀 TIEMPO REAL: Escuchar cambios de permisos desde AdminUsers
  useEffect(() => {
    const handlePermissionUpdate = (event) => {
      const { role, allowedPages } = event.detail;
      
      // Si el usuario actual pertenece al rol modificado, recargar permisos desde la API
      if (user?.roles?.includes(role)) {
        console.log(`🚀 [TIEMPO REAL] Actualizando menú para rol ${role}:`, allowedPages);
        
        // Forzar recarga de permisos desde la API
        setPermissionsLoaded(false);
        loadUserRolePermissionsFromAPI().then(() => {
          console.log('✅ [TIEMPO REAL] Menú actualizado desde API');
        });
      }
    };

    // Escuchar eventos de actualización de permisos
    window.addEventListener('userPermissionsUpdated', handlePermissionUpdate);
    
    return () => {
      window.removeEventListener('userPermissionsUpdated', handlePermissionUpdate);
    };
  }, [user]);

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