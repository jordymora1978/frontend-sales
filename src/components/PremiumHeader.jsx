import React, { useContext, useState } from 'react';
import { 
  Bell, 
  User, 
  ChevronDown,
  Sun,
  Moon,
  Settings,
  HelpCircle,
  LogOut,
  Menu
} from 'lucide-react';
import { ThemeContext } from './PremiumSidebar';
import './PremiumHeader.css';

const PremiumHeader = ({ activeTab, onToggleMobileSidebar }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const themeContext = useContext(ThemeContext);
  const { theme, toggleTheme } = themeContext || {};

  // Funciones de breadcrumb eliminadas - ya no se usan

  const notifications = [
    { id: 1, title: '12 nuevas órdenes pendientes', time: '5 min', unread: true },
    { id: 2, title: 'Sincronización ML completada', time: '1 h', unread: true },
    { id: 3, title: 'Reporte mensual disponible', time: '2 h', unread: false }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="premium-header">
      <div className="header-content">
        {/* Left Section */}
        <div className="header-left">
        </div>


        {/* Right Section */}
        <div className="header-right">
          {/* Quick Actions */}
          <div className="quick-actions">
            {/* Theme Toggle */}
            <button 
              className="action-btn theme-btn"
              onClick={toggleTheme}
              title={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Notifications */}
            <div className="notification-container">
              <button 
                className="action-btn notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notificaciones"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <>
                  <div 
                    className="dropdown-overlay"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="notification-dropdown">
                    <div className="dropdown-header">
                      <h3>Notificaciones</h3>
                      <span className="notification-count">{unreadCount} nuevas</span>
                    </div>
                    <div className="notification-list">
                      {notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`notification-item ${
                            notification.unread ? 'unread' : ''
                          }`}
                        >
                          <div className="notification-content">
                            <div className="notification-title">
                              {notification.title}
                            </div>
                            <div className="notification-time">
                              hace {notification.time}
                            </div>
                          </div>
                          {notification.unread && (
                            <div className="unread-indicator" />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="dropdown-footer">
                      <button className="view-all-btn">
                        Ver todas las notificaciones
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Menu */}
            <div className="user-menu-container">
              <button 
                className="user-menu-trigger"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-expanded={showUserMenu}
              >
                <div className="user-avatar">
                  <User size={16} />
                </div>
                <div className="user-info">
                  <div className="user-name">John Doe</div>
                  <div className="user-role">Administrador</div>
                </div>
                <ChevronDown size={14} className={`chevron ${showUserMenu ? 'rotated' : ''}`} />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <>
                  <div 
                    className="dropdown-overlay"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <div className="user-avatar large">
                        <User size={20} />
                      </div>
                      <div className="user-details">
                        <div className="user-name">John Doe</div>
                        <div className="user-email">john@dropux.co</div>
                        <div className="user-role">Administrador</div>
                      </div>
                    </div>
                    
                    <div className="dropdown-menu">
                      <button className="dropdown-item">
                        <User size={16} />
                        <span>Mi perfil</span>
                      </button>
                      <button className="dropdown-item">
                        <Settings size={16} />
                        <span>Configuración</span>
                      </button>
                      <button className="dropdown-item">
                        <HelpCircle size={16} />
                        <span>Ayuda y soporte</span>
                      </button>
                      <div className="dropdown-separator" />
                      <button className="dropdown-item danger">
                        <LogOut size={16} />
                        <span>Cerrar sesión</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

    </header>
  );
};

export default PremiumHeader;