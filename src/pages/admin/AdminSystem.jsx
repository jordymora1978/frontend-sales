import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminSystem.css';

const AdminSystem = () => {
    const { user } = useAuth();
    const [systemStatus, setSystemStatus] = useState({
        services: [],
        metrics: {},
        alerts: [],
        logs: []
    });
    const [loading, setLoading] = useState(true);
    const [refreshInterval, setRefreshInterval] = useState(null);

    useEffect(() => {
        // Verificar permisos usando el mismo criterio que la validación principal
        const hasAdminSystemPermission = user?.permissions?.some(perm => 
            perm.startsWith('admin-system:') || perm.startsWith('sales:')
        ) || user?.roles?.includes('super_admin');

        if (!hasAdminSystemPermission) {
            return;
        }
        
        fetchSystemStatus();
        
        // Auto-refresh cada 30 segundos
        const interval = setInterval(fetchSystemStatus, 30000);
        setRefreshInterval(interval);
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [user]);

    const fetchSystemStatus = async () => {
        try {
            // TODO: Conectar con APIs reales
            setTimeout(() => {
                setSystemStatus({
                    services: [
                        {
                            name: 'Auth API',
                            url: 'https://auth-api.dropux.co',
                            status: 'healthy',
                            responseTime: 45,
                            uptime: '99.9%',
                            lastCheck: new Date().toISOString(),
                            version: 'v1.2.3'
                        },
                        {
                            name: 'Sales API',
                            url: 'https://api-sales.dropux.co',
                            status: 'healthy',
                            responseTime: 32,
                            uptime: '99.8%',
                            lastCheck: new Date().toISOString(),
                            version: 'v2.1.0'
                        },
                        {
                            name: 'Control API',
                            url: 'https://api.dropux.co',
                            status: 'healthy',
                            responseTime: 28,
                            uptime: '99.9%',
                            lastCheck: new Date().toISOString(),
                            version: 'v1.8.5'
                        },
                        {
                            name: 'Products API',
                            url: 'https://products.dropux.co',
                            status: 'warning',
                            responseTime: 120,
                            uptime: '98.5%',
                            lastCheck: new Date().toISOString(),
                            version: 'v1.0.2'
                        },
                        {
                            name: 'Logs Service',
                            url: 'https://logs.dropux.co',
                            status: 'healthy',
                            responseTime: 38,
                            uptime: '99.7%',
                            lastCheck: new Date().toISOString(),
                            version: 'v1.0.0'
                        }
                    ],
                    metrics: {
                        totalRequests: 15647,
                        errorRate: 0.02,
                        avgResponseTime: 52,
                        activeUsers: 156,
                        dataTransfer: '2.3 GB',
                        memoryUsage: 68,
                        cpuUsage: 24
                    },
                    alerts: [
                        {
                            id: 1,
                            level: 'warning',
                            message: 'Products API response time elevated',
                            timestamp: '2025-08-28 10:15',
                            service: 'Products API'
                        },
                        {
                            id: 2,
                            level: 'info',
                            message: 'Database backup completed successfully',
                            timestamp: '2025-08-28 09:00',
                            service: 'Database'
                        }
                    ],
                    logs: [
                        {
                            id: 1,
                            timestamp: '2025-08-28 10:30:15',
                            level: 'INFO',
                            service: 'auth-api',
                            message: 'User login successful: admin@dropux.co',
                            ip: '192.168.1.100'
                        },
                        {
                            id: 2,
                            timestamp: '2025-08-28 10:28:32',
                            level: 'ERROR',
                            service: 'products-api',
                            message: 'Failed to fetch product data from ML API',
                            ip: '192.168.1.105'
                        },
                        {
                            id: 3,
                            timestamp: '2025-08-28 10:25:18',
                            level: 'INFO',
                            service: 'sales-api',
                            message: 'Order sync completed: 15 orders processed',
                            ip: '192.168.1.102'
                        }
                    ]
                });
                setLoading(false);
            }, 1200);
        } catch (error) {
            console.error('Error fetching system status:', error);
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'healthy': return 'status-healthy';
            case 'warning': return 'status-warning';
            case 'error': return 'status-error';
            default: return 'status-unknown';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'healthy': return '✅';
            case 'warning': return '⚠️';
            case 'error': return '❌';
            default: return '❓';
        }
    };

    const getLogLevelIcon = (level) => {
        switch (level) {
            case 'INFO': return '💡';
            case 'WARNING': return '⚠️';
            case 'ERROR': return '🚨';
            default: return '📝';
        }
    };

    const handleRefreshNow = () => {
        setLoading(true);
        fetchSystemStatus();
    };

    const handleServiceAction = (service, action) => {
        console.log(`${action} for ${service.name}`);
        // TODO: Implementar acciones reales
    };

    // Verificar permisos - usar sistema de permisos en lugar de roles hardcodeados
    const hasAdminSystemPermission = user?.permissions?.some(perm => 
        perm.startsWith('admin-system:') || perm.startsWith('sales:')
    ) || user?.roles?.includes('super_admin');

    if (!hasAdminSystemPermission) {
        return (
            <div className="admin-access-denied">
                <h2>🚫 Acceso Denegado</h2>
                <p>No tienes permisos para acceder al monitor del sistema.</p>
            </div>
        );
    }

    return (
        <div className="admin-system">
            {/* Header */}
            <div className="admin-system-header">
                <div>
                    <h1>⚡ Monitor del Sistema</h1>
                    <p>Estado en tiempo real de todos los servicios Dropux</p>
                </div>
                <div className="header-actions">
                    <button className="btn-refresh" onClick={handleRefreshNow} disabled={loading}>
                        🔄 {loading ? 'Actualizando...' : 'Actualizar'}
                    </button>
                </div>
            </div>

            {/* System Metrics */}
            <div className="system-metrics">
                <div className="metric-card">
                    <div className="metric-icon">📊</div>
                    <div className="metric-info">
                        <h3>{systemStatus.metrics.totalRequests?.toLocaleString() || 0}</h3>
                        <p>Peticiones Totales</p>
                    </div>
                </div>
                
                <div className="metric-card">
                    <div className="metric-icon">⚡</div>
                    <div className="metric-info">
                        <h3>{systemStatus.metrics.avgResponseTime || 0}ms</h3>
                        <p>Tiempo Promedio</p>
                    </div>
                </div>
                
                <div className="metric-card">
                    <div className="metric-icon">🔥</div>
                    <div className="metric-info">
                        <h3>{systemStatus.metrics.errorRate?.toFixed(2) || 0}%</h3>
                        <p>Tasa de Error</p>
                    </div>
                </div>
                
                <div className="metric-card">
                    <div className="metric-icon">👥</div>
                    <div className="metric-info">
                        <h3>{systemStatus.metrics.activeUsers || 0}</h3>
                        <p>Usuarios Activos</p>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon">💾</div>
                    <div className="metric-info">
                        <h3>{systemStatus.metrics.memoryUsage || 0}%</h3>
                        <p>Uso de Memoria</p>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon">🖥️</div>
                    <div className="metric-info">
                        <h3>{systemStatus.metrics.cpuUsage || 0}%</h3>
                        <p>Uso de CPU</p>
                    </div>
                </div>
            </div>

            {/* Services Status */}
            <div className="system-section">
                <h2>🔍 Estado de Servicios</h2>
                <div className="services-grid">
                    {systemStatus.services.map((service, index) => (
                        <div key={index} className={`service-card ${getStatusColor(service.status)}`}>
                            <div className="service-header">
                                <div className="service-title">
                                    <span className="service-icon">{getStatusIcon(service.status)}</span>
                                    <h3>{service.name}</h3>
                                    <span className="service-version">{service.version}</span>
                                </div>
                                <div className="service-actions">
                                    <button 
                                        className="btn-action"
                                        onClick={() => handleServiceAction(service, 'restart')}
                                        title="Reiniciar servicio"
                                    >
                                        🔄
                                    </button>
                                </div>
                            </div>
                            
                            <div className="service-details">
                                <div className="service-metric">
                                    <span className="metric-label">URL:</span>
                                    <span className="metric-value">{service.url}</span>
                                </div>
                                <div className="service-metric">
                                    <span className="metric-label">Respuesta:</span>
                                    <span className="metric-value">{service.responseTime}ms</span>
                                </div>
                                <div className="service-metric">
                                    <span className="metric-label">Uptime:</span>
                                    <span className="metric-value">{service.uptime}</span>
                                </div>
                                <div className="service-metric">
                                    <span className="metric-label">Última verificación:</span>
                                    <span className="metric-value">
                                        {new Date(service.lastCheck).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Grid */}
            <div className="system-content-grid">
                {/* Alerts */}
                <div className="system-section">
                    <h2>🚨 Alertas del Sistema</h2>
                    <div className="alerts-list">
                        {systemStatus.alerts.length > 0 ? systemStatus.alerts.map(alert => (
                            <div key={alert.id} className={`alert-item alert-${alert.level}`}>
                                <div className="alert-icon">
                                    {alert.level === 'warning' && '⚠️'}
                                    {alert.level === 'error' && '🚨'}
                                    {alert.level === 'info' && 'ℹ️'}
                                </div>
                                <div className="alert-content">
                                    <p className="alert-message">{alert.message}</p>
                                    <div className="alert-meta">
                                        <span className="alert-service">{alert.service}</span>
                                        <span className="alert-time">{alert.timestamp}</span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="no-alerts">
                                <span>✅ No hay alertas activas</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Logs */}
                <div className="system-section">
                    <h2>📋 Logs Recientes</h2>
                    <div className="logs-list">
                        {systemStatus.logs.map(log => (
                            <div key={log.id} className={`log-item log-${log.level.toLowerCase()}`}>
                                <div className="log-time">{log.timestamp}</div>
                                <div className="log-level">
                                    {getLogLevelIcon(log.level)}
                                    <span>{log.level}</span>
                                </div>
                                <div className="log-service">{log.service}</div>
                                <div className="log-message">{log.message}</div>
                                <div className="log-ip">{log.ip}</div>
                            </div>
                        ))}
                    </div>
                    <div className="logs-actions">
                        <button className="btn-secondary">📄 Ver Todos los Logs</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSystem;