import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [systemStats, setSystemStats] = useState({
        totalUsers: 0,
        totalStores: 0,
        activeConnections: 0,
        systemHealth: 'loading'
    });
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        // Verificar que es super_admin
        if (!user?.roles?.includes('super_admin')) {
            return;
        }
        
        fetchSystemStats();
        fetchRecentActivity();
    }, [user]);

    const fetchSystemStats = async () => {
        // TODO: Conectar con API real
        setTimeout(() => {
            setSystemStats({
                totalUsers: 247,
                totalStores: 189,
                activeConnections: 156,
                systemHealth: 'healthy'
            });
        }, 1000);
    };

    const fetchRecentActivity = async () => {
        // TODO: Conectar con logs centralizados
        setTimeout(() => {
            setRecentActivity([
                {
                    id: 1,
                    user: 'vendor@tienda.com',
                    action: 'Conectó nueva tienda ML',
                    timestamp: '2025-08-28 10:30',
                    status: 'success'
                },
                {
                    id: 2,
                    user: 'empleado@empresa.com', 
                    action: 'Accedió a reportes',
                    timestamp: '2025-08-28 10:15',
                    status: 'info'
                },
                {
                    id: 3,
                    user: 'system',
                    action: 'Backup automático completado',
                    timestamp: '2025-08-28 09:00',
                    status: 'success'
                }
            ]);
        }, 800);
    };

    // Verificar permisos
    if (!user?.roles?.includes('super_admin')) {
        return (
            <div className="admin-access-denied">
                <h2>🚫 Acceso Denegado</h2>
                <p>Solo Super Administradores pueden acceder a este módulo.</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <div className="admin-header">
                <div className="admin-title">
                    <h1>🛡️ Panel de Administración</h1>
                    <p>Control total del ecosistema Dropux</p>
                </div>
                <div className="admin-user-info">
                    <span className="admin-badge">SUPER ADMIN</span>
                    <span className="admin-name">{user?.first_name} {user?.last_name}</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="admin-stats-grid">
                <div className="admin-stat-card users">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <h3>{systemStats.totalUsers}</h3>
                        <p>Usuarios Registrados</p>
                        <span className="stat-change">+12 esta semana</span>
                    </div>
                </div>
                
                <div className="admin-stat-card stores">
                    <div className="stat-icon">🏪</div>
                    <div className="stat-content">
                        <h3>{systemStats.totalStores}</h3>
                        <p>Tiendas Conectadas</p>
                        <span className="stat-change">+8 este mes</span>
                    </div>
                </div>
                
                <div className="admin-stat-card connections">
                    <div className="stat-icon">🔗</div>
                    <div className="stat-content">
                        <h3>{systemStats.activeConnections}</h3>
                        <p>Conexiones Activas</p>
                        <span className="stat-change">83% uptime</span>
                    </div>
                </div>
                
                <div className={`admin-stat-card health ${systemStats.systemHealth}`}>
                    <div className="stat-icon">⚡</div>
                    <div className="stat-content">
                        <h3>{systemStats.systemHealth === 'healthy' ? '✅' : '⚠️'}</h3>
                        <p>Estado del Sistema</p>
                        <span className="stat-change">
                            {systemStats.systemHealth === 'healthy' ? 'Operativo' : 'Verificando...'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="admin-content-grid">
                {/* Quick Actions */}
                <div className="admin-section">
                    <h2>⚡ Acciones Rápidas</h2>
                    <div className="quick-actions-grid">
                        <button className="quick-action-btn users-btn" 
                                onClick={() => window.location.href = '/admin/users'}>
                            <span className="action-icon">👥</span>
                            <span>Gestionar Usuarios</span>
                        </button>
                        
                        <button className="quick-action-btn stores-btn"
                                onClick={() => window.location.href = '/admin/tiendas'}>
                            <span className="action-icon">🏪</span>
                            <span>Administrar Tiendas</span>
                        </button>
                        
                        <button className="quick-action-btn system-btn"
                                onClick={() => window.location.href = '/admin/system'}>
                            <span className="action-icon">⚙️</span>
                            <span>Monitor Sistema</span>
                        </button>
                        
                        <button className="quick-action-btn logs-btn"
                                onClick={() => window.location.href = '/admin/logs'}>
                            <span className="action-icon">📋</span>
                            <span>Ver Logs</span>
                        </button>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="admin-section">
                    <h2>📊 Actividad Reciente</h2>
                    <div className="activity-list">
                        {recentActivity.map(activity => (
                            <div key={activity.id} className={`activity-item ${activity.status}`}>
                                <div className="activity-icon">
                                    {activity.status === 'success' && '✅'}
                                    {activity.status === 'info' && 'ℹ️'}
                                    {activity.status === 'warning' && '⚠️'}
                                </div>
                                <div className="activity-details">
                                    <p className="activity-action">{activity.action}</p>
                                    <span className="activity-user">{activity.user}</span>
                                </div>
                                <span className="activity-time">{activity.timestamp}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* System Health Overview */}
            <div className="admin-section full-width">
                <h2>🔍 Estado de Servicios</h2>
                <div className="services-status-grid">
                    <div className="service-status healthy">
                        <span className="service-name">Auth API</span>
                        <span className="service-status-badge">✅ Operativo</span>
                        <span className="service-response">45ms</span>
                    </div>
                    
                    <div className="service-status healthy">
                        <span className="service-name">Sales API</span>
                        <span className="service-status-badge">✅ Operativo</span>
                        <span className="service-response">32ms</span>
                    </div>
                    
                    <div className="service-status healthy">
                        <span className="service-name">Control API</span>
                        <span className="service-status-badge">✅ Operativo</span>
                        <span className="service-response">28ms</span>
                    </div>
                    
                    <div className="service-status healthy">
                        <span className="service-name">Products API</span>
                        <span className="service-status-badge">✅ Operativo</span>
                        <span className="service-response">41ms</span>
                    </div>
                    
                    <div className="service-status healthy">
                        <span className="service-name">Logs Service</span>
                        <span className="service-status-badge">✅ Operativo</span>
                        <span className="service-response">38ms</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;