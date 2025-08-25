import React, { useState } from 'react';
import { 
  Menu,
  Search,
  Bell,
  Settings,
  User,
  ChevronDown,
  Filter,
  Plus,
  Home,
  ChevronRight,
  HelpCircle,
  Power,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import './CRMHeader.css';

const CRMHeader = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  // Breadcrumb mapping based on active tab
  const getBreadcrumb = () => {
    const breadcrumbMap = {
      'dashboard': ['Reports', 'Home', 'Dashboard'],
      'orders': ['Reports', 'Home', 'Sales'],
      'orders2': ['Reports', 'Home', 'Advanced Sales'],
      'customers': ['Applications', 'Customers', 'List'],
      'quotes': ['Proposal', 'Quotes', 'Management'],
      'ml-stores': ['Applications', 'ML', 'Stores'],
      'control-consolidador': ['Widgets', 'Control', 'Consolidator'],
      'control-validador': ['Widgets', 'Control', 'Validator'],
      'control-trm': ['Payment', 'TRM', 'Management'],
      'control-reportes': ['Projects', 'Reports', 'Analytics'],
      'control-gmail-drive': ['Settings', 'Gmail', 'Drive']
    };

    return breadcrumbMap[activeTab] || ['Reports', 'Home', 'Dashboard'];
  };

  const breadcrumb = getBreadcrumb();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleAddWidgets = () => {
    console.log('Adding widgets...');
  };

  const handleUserMenuToggle = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleNotificationClick = () => {
    setNotificationCount(0);
    console.log('Opening notifications...');
  };

  const handleRefresh = () => {
    console.log('Refreshing data...');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <header className={`crm-header ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="crm-header-content">
        {/* Left Section - Menu & Breadcrumb */}
        <div className="header-left">
          {/* Sidebar Toggle Button */}
          <button 
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
            title={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {isCollapsed ? <ArrowRight size={16} /> : <Menu size={16} />}
          </button>

          {/* Mega Menu Button */}
          <button className="mega-menu-btn">
            <Menu size={16} />
            <span className="mega-menu-text">MEGA MENU</span>
          </button>

          {/* User Avatar */}
          <div className="user-avatar-small">
            <User size={16} />
          </div>

          {/* Breadcrumb Navigation */}
          <nav className="breadcrumb-nav" aria-label="Breadcrumb">
            {breadcrumb.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <ChevronRight size={12} className="breadcrumb-separator" />
                )}
                <button 
                  className={`breadcrumb-item ${index === breadcrumb.length - 1 ? 'active' : ''}`}
                >
                  {item}
                </button>
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Right Section - Actions & User */}
        <div className="header-right">
          {/* Filter Button */}
          <button className="header-action-btn" title="Filter">
            <Filter size={16} />
            <span className="action-text">FILTER</span>
          </button>

          {/* Add Widgets Button */}
          <button className="add-widgets-btn" onClick={handleAddWidgets}>
            <Plus size={16} />
            <span>ADD WIDGETS</span>
          </button>

          {/* Action Icons */}
          <div className="header-actions">
            {/* Search */}
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-container">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </form>

            {/* Refresh */}
            <button className="icon-btn" onClick={handleRefresh} title="Refresh">
              <RefreshCw size={16} />
            </button>

            {/* Notifications */}
            <button 
              className="icon-btn notification-btn" 
              onClick={handleNotificationClick}
              title="Notifications"
            >
              <Bell size={16} />
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </button>

            {/* Settings */}
            <button className="icon-btn" title="Settings">
              <Settings size={16} />
            </button>

            {/* Help */}
            <button className="icon-btn" title="Help">
              <HelpCircle size={16} />
            </button>

            {/* User Menu */}
            <div className="user-menu-container">
              <button 
                className="user-menu-btn"
                onClick={handleUserMenuToggle}
                aria-expanded={userMenuOpen}
              >
                <div className="user-avatar">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facepad&facepad=2&w=256&h=256&q=80"
                    alt="User Avatar"
                    className="avatar-image"
                  />
                </div>
                <ChevronDown size={12} className="user-chevron" />
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="user-info">
                      <div className="user-name">John Doe</div>
                      <div className="user-role">Administrator</div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-items">
                    <button className="dropdown-item">
                      <User size={14} />
                      <span>Profile</span>
                    </button>
                    <button className="dropdown-item">
                      <Settings size={14} />
                      <span>Settings</span>
                    </button>
                    <button className="dropdown-item">
                      <HelpCircle size={14} />
                      <span>Help</span>
                    </button>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout">
                      <Power size={14} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CRMHeader;