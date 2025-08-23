import React, { useState } from 'react';
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
  Archive
} from 'lucide-react';
import ssoManager from '../utils/ssoManager';
import './UnifiedSidebar.css';

const UnifiedSidebar = ({ activeTab, setActiveTab }) => {
  const [expandedSections, setExpandedSections] = useState(new Set(['sales']));

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
    // Usar el SSO Manager para navegar con autenticación automática
    console.log('🔗 Abriendo enlace externo:', url);
    
    // Verificar que el usuario está autenticado
    if (!ssoManager.isAuthenticated()) {
      console.warn('⚠️ Usuario no autenticado, no se puede abrir enlace externo');
      return;
    }
    
    // Abrir enlace con SSO automático
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const navigationStructure = {
    sales: {
      title: "🛒 Ventas",
      icon: ShoppingCart,
      type: "native",
      items: [
        { id: "orders", name: "Órdenes", icon: ShoppingCart },
        { id: "customers", name: "Clientes", icon: Users },
        { id: "quotes", name: "Cotizaciones", icon: FileText },
        { id: "dashboard", name: "Dashboard", icon: BarChart3 },
        { id: "ml-stores", name: "Tiendas ML", icon: Package }
      ]
    },
    control: {
      title: "📊 Control",
      icon: BarChart3,
      type: "external",
      items: [
        { 
          name: "Consolidador", 
          icon: Archive,
          url: window.location.hostname === 'localhost' ? "http://localhost:3000/consolidator" : "https://control.dropux.co/consolidator",
          description: "Procesamiento de órdenes"
        },
        { 
          name: "Validador", 
          icon: CheckCircle,
          url: window.location.hostname === 'localhost' ? "http://localhost:3000/validator" : "https://control.dropux.co/validator",
          description: "Verificación de duplicados"
        },
        { 
          name: "TRM", 
          icon: DollarSign,
          url: window.location.hostname === 'localhost' ? "http://localhost:3000/trm" : "https://control.dropux.co/trm",
          description: "Tasas de cambio"
        },
        { 
          name: "Reportes", 
          icon: TrendingUp,
          url: window.location.hostname === 'localhost' ? "http://localhost:3000/reports" : "https://control.dropux.co/reports",
          description: "Reportes de utilidad"
        },
        { 
          name: "Gmail Drive", 
          icon: Mail,
          url: window.location.hostname === 'localhost' ? "http://localhost:3000/gmail-drive" : "https://control.dropux.co/gmail-drive",
          description: "Procesamiento automático"
        }
      ]
    },
    products: {
      title: "📦 Productos",
      icon: Package,
      type: "external",
      comingSoon: true,
      items: [
        { 
          name: "Catálogo", 
          icon: Package,
          url: "https://products.dropux.co/catalog",
          description: "Gestión de productos"
        },
        { 
          name: "Inventario", 
          icon: Archive,
          url: "https://products.dropux.co/inventory",
          description: "Control de stock"
        },
        { 
          name: "Proveedores", 
          icon: Users,
          url: "https://products.dropux.co/suppliers",
          description: "Gestión de suppliers"
        }
      ]
    }
  };

  return (
    <aside className="unified-sidebar">
      {/* Header del Hub */}
      <div className="sidebar-header">
        <div className="app-logo">
          <ShoppingCart className="logo-icon" size={24} />
          <div className="app-info">
            <h1>Dropux Hub</h1>
            <span className="app-subtitle">Sales Principal</span>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="sidebar-nav">
        {Object.entries(navigationStructure).map(([sectionId, section]) => {
          const isExpanded = expandedSections.has(sectionId);
          const SectionIcon = section.icon;
          
          return (
            <div key={sectionId} className="nav-section">
              {/* Encabezado de sección */}
              <div 
                className={`section-header ${section.comingSoon ? 'coming-soon' : ''}`}
                onClick={() => !section.comingSoon && toggleSection(sectionId)}
              >
                <div className="section-title">
                  <SectionIcon size={18} />
                  <span>{section.title}</span>
                </div>
                {!section.comingSoon && (
                  <ChevronDown 
                    className={`chevron ${isExpanded ? 'expanded' : ''}`}
                    size={16}
                  />
                )}
                {section.comingSoon && (
                  <span className="coming-soon-badge">Próximamente</span>
                )}
              </div>

              {/* Items de la sección */}
              {isExpanded && !section.comingSoon && (
                <div className="section-items">
                  {section.items.map((item, index) => {
                    const ItemIcon = item.icon;
                    
                    if (section.type === 'native') {
                      // Items nativos de Sales
                      return (
                        <div 
                          key={item.id}
                          className={`nav-item native ${activeTab === item.id ? 'active' : ''}`}
                          onClick={() => setActiveTab(item.id)}
                        >
                          <div className="item-content">
                            <ItemIcon size={16} />
                            <span className="item-name">{item.name}</span>
                          </div>
                        </div>
                      );
                    } else {
                      // Items externos (Control/Products)
                      return (
                        <div 
                          key={index}
                          className="nav-item external"
                          onClick={() => openExternalLink(item.url)}
                        >
                          <div className="item-content">
                            <ItemIcon size={16} />
                            <div className="item-info">
                              <span className="item-name">{item.name}</span>
                              {item.description && (
                                <span className="item-description">{item.description}</span>
                              )}
                            </div>
                          </div>
                          <ExternalLink size={12} className="external-icon" />
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer del sidebar */}
      <div className="sidebar-footer">
        <div className="app-version">
          <Settings size={14} />
          <span>Hub v1.0</span>
        </div>
        <div className="ecosystem-info">
          <span className="ecosystem-label">Dropux Ecosystem</span>
          <div className="app-indicators">
            <div className="app-dot active" title="Sales (Activo)"></div>
            <div className="app-dot available" title="Control (Disponible)"></div>
            <div className="app-dot coming-soon" title="Products (Próximamente)"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default UnifiedSidebar;