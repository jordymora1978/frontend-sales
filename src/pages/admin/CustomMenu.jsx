import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AUTH_API_URL } from '../../config/api.js';
import { ENDPOINTS } from '../../config/endpoints.js';
import './CustomMenu.css';

// Páginas disponibles del sistema - ACTUALIZADA Septiembre 2025
const AVAILABLE_PAGES = {
    main: [
        { id: 'dashboard', name: 'Dashboard', icon: '📊', path: '/dashboard' },
        { id: 'orders2_0', name: 'Mis Ventas', icon: '🛒', path: '/orders2_0' },
        { id: 'customers', name: 'Mis Clientes', icon: '👥', path: '/customers' },
        { id: 'quotes', name: 'Mis Cotizaciones', icon: '📄', path: '/quotes' }
    ],
    config: [
        { id: 'mis-etiquetas', name: 'Mis Etiquetas', icon: '🏷️', path: '/mis-etiquetas' },
        { id: 'ml-stores', name: 'Mis Tiendas', icon: '🏪', path: '/ml-stores' },
        { id: 'apis-conexiones', name: 'APIs y Conexiones', icon: '🔗', path: '/apis-conexiones' },
        { id: 'ml-sync', name: 'Sincronizar Órdenes', icon: '🔄', path: '/ml-sync' }
    ],
    control: [
        { id: 'control-consolidador', name: 'Consolidador 2.0', icon: '📦', path: '/control-consolidador' },
        { id: 'control-validador', name: 'Validador', icon: '✅', path: '/control-validador' },
        { id: 'control-trm', name: 'TRM Monitor', icon: '💱', path: '/control-trm' },
        { id: 'control-reportes', name: 'Reportes', icon: '📊', path: '/control-reportes' },
        { id: 'control-gmail-drive', name: 'Gmail Drive', icon: '📧', path: '/control-gmail-drive' },
        { id: 'google-api', name: 'Google API', icon: '☁️', path: '/google-api' }
    ],
    products: [
        { id: 'catalogo-amazon', name: 'Catálogo Amazon', icon: '📦', path: '/catalogo-amazon' },
        { id: 'publicaciones-ml', name: 'Publicaciones ML', icon: '🛍️', path: '/publicaciones-ml' },
        { id: 'stock-proveedores', name: 'Stock Proveedores', icon: '🚚', path: '/stock-proveedores' }
    ],
    superadmin: [
        { id: 'admin-panel', name: 'Panel Admin', icon: '🎛️', path: '/admin' },
        { id: 'admin-users', name: 'Gestionar Usuarios', icon: '👥', path: '/admin/users' },
        { id: 'admin-system', name: 'Monitor del Sistema', icon: '⚙️', path: '/admin/system' },
        { id: 'custom-menu', name: 'Menú Personalizado', icon: '🎨', path: '/admin/custom-menu' },
        { id: 'private-pages', name: 'Páginas Privadas', icon: '🔒', path: '/admin/private-pages' }
    ]
};

// Menú por defecto para cada tipo de usuario (EXACTO a BD - Sep 2025)
const DEFAULT_ROLE_PERMISSIONS = {
    // SUPER_ADMIN: 22 módulos exactos de BD
    'super_admin': ['admin-panel', 'admin-system', 'admin-users', 'apis-conexiones', 'catalogo-amazon', 'control-consolidador', 'control-gmail-drive', 'control-reportes', 'control-trm', 'control-validador', 'custom-menu', 'customers', 'dashboard', 'google-api', 'mis-etiquetas', 'ml-stores', 'ml-sync', 'orders2_0', 'private-pages', 'publicaciones-ml', 'quotes', 'stock-proveedores'],
    // ADMIN: 11 módulos exactos de BD
    'admin': ['admin-panel', 'control-consolidador', 'control-gmail-drive', 'control-reportes', 'customers', 'dashboard', 'ml-stores', 'ml-sync', 'orders2_0', 'quotes', 'stock-proveedores'],
    // ASESOR: 4 módulos exactos de BD
    'asesor': ['customers', 'dashboard', 'orders2_0', 'quotes'],
    // MARKETPLACE: 4 módulos exactos de BD  
    'marketplace': ['dashboard', 'ml-stores', 'ml-sync', 'publicaciones-ml'],
    // DROPSHIPPER: 3 módulos exactos de BD
    'dropshipper': ['control-consolidador', 'dashboard', 'stock-proveedores'],
    // PROVEEDOR: 2 módulos exactos de BD
    'proveedor': ['dashboard', 'stock-proveedores']
};

// Función de mapeo mejorada para páginas (maneja nombres e IDs de BD)
const pageNameToId = (pageNameOrId) => {
    const allPages = Object.values(AVAILABLE_PAGES).flat();
    
    // Primero buscar por ID exacto (caso más común)
    let page = allPages.find(p => p.id === pageNameOrId);
    if (page) return page.id;
    
    // Luego buscar por nombre exacto
    page = allPages.find(p => p.name === pageNameOrId);
    if (page) return page.id;
    
    // Mapeos especiales para nombres de BD y legacy
    const legacyMappings = {
        // Nombres actuales que pueden estar en BD
        'Cotizaciones': 'quotes',
        'Mis Cotizaciones': 'quotes',
        'Dashboard': 'dashboard',
        'Mis Clientes': 'customers',
        'Clientes': 'customers',
        'Mis Ventas': 'orders2_0',
        'Órdenes Pro': 'orders2_0',
        'Mis Tiendas': 'ml-stores',
        'Publicaciones ML': 'publicaciones-ml',
        'Sincronizar Órdenes': 'ml-sync',
        'Consolidador 2.0': 'control-consolidador',
        'Stock Proveedores': 'stock-proveedores',
        'Mis Etiquetas': 'mis-etiquetas',
        'APIs y Conexiones': 'apis-conexiones',
        'Validador': 'control-validador',
        'TRM Monitor': 'control-trm',
        'Reportes': 'control-reportes',
        'Gmail Drive': 'control-gmail-drive',
        'Google API': 'google-api',
        'Catálogo Amazon': 'catalogo-amazon',
        'Panel Admin': 'admin-panel',
        'Gestionar Usuarios': 'admin-users',
        'Gestión de Usuarios': 'admin-users',
        'Monitor del Sistema': 'admin-system',
        'Monitor Sistema': 'admin-system',
        'Menú Personalizado': 'custom-menu',
        'Páginas Privadas': 'private-pages'
    };
    
    const mappedId = legacyMappings[pageNameOrId];
    if (mappedId) return mappedId;
    
    // Si no se encuentra, devolver null (será filtrado)
    console.warn(`⚠️ Página no encontrada en AVAILABLE_PAGES: "${pageNameOrId}"`);
    return null;
};

const pageIdToName = (pageId) => {
    const allPages = Object.values(AVAILABLE_PAGES).flat();
    const page = allPages.find(p => p.id === pageId);
    return page ? page.name : pageId;
};

const CustomMenu = () => {
    const { user } = useAuth();
    const [selectedRole, setSelectedRole] = useState('admin');
    const [rolePermissions, setRolePermissions] = useState(DEFAULT_ROLE_PERMISSIONS);
    const [originalRolePermissions, setOriginalRolePermissions] = useState(DEFAULT_ROLE_PERMISSIONS);
    const [draggedPage, setDraggedPage] = useState(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    const [restrictedPages, setRestrictedPages] = useState([]);

    // 🚀 Debug: Verificar match de roles con BD
    useEffect(() => {
        console.log('🔍 [DEBUG] Verificando match de roles con BD:');
        Object.entries(DEFAULT_ROLE_PERMISSIONS).forEach(([role, permissions]) => {
            const allPages = Object.values(AVAILABLE_PAGES).flat();
            const foundPages = permissions.filter(id => allPages.find(p => p.id === id));
            const notFoundPages = permissions.filter(id => !allPages.find(p => p.id === id));
            
            console.log(`📊 ${role.toUpperCase()}: ${permissions.length} módulos definidos, ${foundPages.length} encontrados`);
            if (notFoundPages.length > 0) {
                console.warn(`⚠️ ${role}: Páginas NO encontradas:`, notFoundPages);
            }
        });
    }, []);

    // 🚀 Cargar permisos y páginas restringidas desde el servidor
    useEffect(() => {
        loadRolePermissions();
        loadRestrictedPages();
    }, []);

    // Cargar páginas restringidas globalmente
    const loadRestrictedPages = async () => {
        try {
            const response = await fetch(`${AUTH_API_URL}${ENDPOINTS.ADMIN.ROLE_PERMISSIONS}`);
            
            if (response.ok) {
                const data = await response.json();
                
                if (data.restricted_pages && Array.isArray(data.restricted_pages)) {
                    // Filtrar solo páginas válidas y mapear a IDs
                    const pageIds = data.restricted_pages
                        .map(pageName => pageNameToId(pageName))
                        .filter(id => id !== null);
                    setRestrictedPages(pageIds);
                } else {
                    setRestrictedPages([]);
                }
            }
        } catch (error) {
            console.error('Error loading restricted pages:', error);
            setRestrictedPages([]);
        }
    };

    const loadRolePermissions = async () => {
        try {
            const response = await fetch(`${AUTH_API_URL}${ENDPOINTS.ADMIN.GET_ROLE_PERMISSIONS}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setRolePermissions(prev => ({ ...prev, ...data.permissions }));
                    setOriginalRolePermissions(prev => ({ ...prev, ...data.permissions }));
                }
            }
        } catch (error) {
            console.error('Error loading role permissions:', error);
        }
    };

    // 🚀 Guardar cambios en el servidor
    const saveRolePermissions = async () => {
        setIsSaving(true);
        setSaveStatus('saving');
        
        try {
            const response = await fetch(`${AUTH_API_URL}${ENDPOINTS.ADMIN.UPDATE_ROLE_PERMISSIONS}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    role_name: selectedRole,
                    permissions: rolePermissions[selectedRole]
                })
            });

            if (response.ok) {
                setOriginalRolePermissions(prev => ({
                    ...prev,
                    [selectedRole]: [...rolePermissions[selectedRole]]
                }));
                setHasUnsavedChanges(false);
                setSaveStatus('success');
                setTimeout(() => setSaveStatus(null), 3000);
            } else {
                setSaveStatus('error');
                setTimeout(() => setSaveStatus(null), 5000);
            }
        } catch (error) {
            console.error('Error saving role permissions:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 5000);
        } finally {
            setIsSaving(false);
        }
    };

    // 🚀 Funciones drag & drop
    const handleDragStart = (e, page) => {
        setDraggedPage(page);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetZone) => {
        e.preventDefault();
        if (!draggedPage) return;

        const currentPermissions = rolePermissions[selectedRole] || [];
        const hasPermission = currentPermissions.includes(draggedPage.id);

        if (targetZone === 'allowed' && !hasPermission) {
            setRolePermissions(prev => ({
                ...prev,
                [selectedRole]: [...currentPermissions, draggedPage.id]
            }));
            setHasUnsavedChanges(true);
        }

        setDraggedPage(null);
    };

    const removePage = (pageId) => {
        const currentPermissions = rolePermissions[selectedRole] || [];
        setRolePermissions(prev => ({
            ...prev,
            [selectedRole]: currentPermissions.filter(id => id !== pageId)
        }));
        setHasUnsavedChanges(true);
    };

    const getRoleName = (role) => {
        switch (role) {
            case 'super_admin': return 'Super Admin';
            case 'admin': return 'Administrador';
            case 'asesor': return 'Asesor';
            case 'marketplace': return 'Marketplace';
            case 'dropshipper': return 'Dropshipper';
            case 'proveedor': return 'Proveedor';
            default: return 'Usuario';
        }
    };

    // 🚀 Cambio de rol
    const handleRoleChange = (role) => {
        if (hasUnsavedChanges) {
            const confirm = window.confirm('¿Descartar cambios no guardados?');
            if (!confirm) return;
        }
        setSelectedRole(role);
        setHasUnsavedChanges(false);
        setSaveStatus(null);
    };

    const currentPermissions = rolePermissions[selectedRole] || [];
    const allowedPages = Object.values(AVAILABLE_PAGES).flat().filter(page => currentPermissions.includes(page.id));
    const deniedPages = Object.values(AVAILABLE_PAGES).flat().filter(page => !currentPermissions.includes(page.id));

    return (
        <div className="admin-users-container">
            <div className="header-section">
                <h2 className="page-title">📋 Menú Personalizado</h2>
                <p className="page-subtitle">Configura qué páginas puede ver cada rol de usuario</p>
            </div>

            {/* Selector de Rol */}
            <div className="role-selector-section">
                <label className="role-label">Configurar permisos para:</label>
                <select 
                    className="role-select"
                    value={selectedRole}
                    onChange={(e) => handleRoleChange(e.target.value)}
                >
                    <optgroup label="👨‍💼 Usuarios Administrativos">
                        <option value="super_admin">Super Admin</option>
                        <option value="admin">Administrador</option>
                        <option value="asesor">Asesor</option>
                    </optgroup>
                    <optgroup label="🏪 Usuarios del Sistema">
                        <option value="marketplace">Marketplace</option>
                        <option value="dropshipper">Dropshipper</option>
                        <option value="proveedor">Proveedor</option>
                    </optgroup>
                </select>
            </div>

            {/* Menú del Rol */}
            <div className="role-menu-section">
                <h3>🎯 Menú de {getRoleName(selectedRole)}</h3>
                <p>Páginas que aparecerán en el menú de este rol</p>
                <div 
                    className="role-menu-container"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'allowed')}
                >
                    {allowedPages.length === 0 ? (
                        <div className="empty-menu">
                            <span>📋 Arrastra páginas aquí para agregarlas al menú</span>
                        </div>
                    ) : (
                        allowedPages.map(page => {
                            return (
                                <div key={page.id} className="menu-page">
                                    <span className="page-icon">{page.icon}</span>
                                    <span className="page-name">{page.name}</span>
                                    <button
                                        onClick={() => removePage(page.id)}
                                        className="remove-btn"
                                        title="Quitar del menú"
                                    >
                                        ❌
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Módulos Disponibles */}
            <div className="permissions-section">
                <h3>📄 Páginas Disponibles</h3>
                <p>Arrastra las páginas hacia el menú del rol seleccionado</p>
                
                {Object.entries(AVAILABLE_PAGES).map(([category, pages]) => {
                    // Filtrar páginas restringidas para usuarios no super_admin
                    const isSuperAdmin = user?.roles?.includes('super_admin') || user?.user_type === 'super_admin';
                    const visiblePages = isSuperAdmin 
                        ? pages 
                        : pages.filter(page => !restrictedPages.includes(page.id));
                    
                    // Solo mostrar categoría si tiene páginas visibles
                    if (visiblePages.length === 0) return null;
                    
                    return (
                        <div key={category} className="page-category">
                            <h4>
                                {category === 'main' ? '🏠 Principal' : 
                                 category === 'config' ? '⚙️ Configuración' : 
                                 category === 'control' ? '📊 Control Suite' : 
                                 category === 'products' ? '📦 Products Suite' : '👑 Super Admin'}
                            </h4>
                            <div className="modules-grid">
                                {visiblePages.map(page => (
                                    <div
                                        key={page.id}
                                        className="menu-page"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, page)}
                                    >
                                        <span className="page-icon">{page.icon}</span>
                                        <span className="page-name">{page.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Botones de Acción */}
            <div className="actions-section">
                {hasUnsavedChanges && (
                    <div className="unsaved-changes-warning">
                        ⚠️ Tienes cambios sin guardar
                    </div>
                )}
                
                <div className="action-buttons">
                    <button
                        className="btn-save"
                        onClick={saveRolePermissions}
                        disabled={!hasUnsavedChanges || isSaving}
                    >
                        {isSaving ? '⏳ Guardando...' : '💾 Guardar Cambios'}
                    </button>
                    
                    {hasUnsavedChanges && (
                        <button
                            className="btn-cancel"
                            onClick={() => {
                                setRolePermissions(originalRolePermissions);
                                setHasUnsavedChanges(false);
                                setSaveStatus(null);
                            }}
                        >
                            🚫 Descartar
                        </button>
                    )}
                </div>

                {saveStatus === 'success' && (
                    <div className="save-status success">✅ Cambios guardados correctamente</div>
                )}
                {saveStatus === 'error' && (
                    <div className="save-status error">❌ Error al guardar cambios</div>
                )}
            </div>
        </div>
    );
};

export default CustomMenu;