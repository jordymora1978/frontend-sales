import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AUTH_API_URL } from '../../config/api.js';
import { ENDPOINTS } from '../../config/endpoints.js';
import './PrivatePages.css';

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

const PrivatePages = () => {
    const { user } = useAuth();
    const [restrictedPages, setRestrictedPages] = useState([]);
    const [originalRestrictedPages, setOriginalRestrictedPages] = useState([]);
    const [draggedPage, setDraggedPage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);

    // Verificar si es Super Admin
    const isSuperAdmin = user?.roles?.includes('super_admin') || user?.user_type === 'super_admin';

    useEffect(() => {
        if (isSuperAdmin) {
            loadData();
        }
    }, [isSuperAdmin]);

    const loadData = async () => {
        setLoading(true);
        await loadRestrictedPages();
        setLoading(false);
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

    // Cargar páginas restringidas globalmente
    const loadRestrictedPages = async () => {
        try {
            const response = await fetch(`${AUTH_API_URL}${ENDPOINTS.ADMIN.ROLE_PERMISSIONS}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Datos de la API:', data); // Debug
                
                if (data.restricted_pages && Array.isArray(data.restricted_pages)) {
                    console.log('Páginas restringidas de API:', data.restricted_pages); // Debug
                    // Filtrar solo páginas válidas
                    const pageIds = data.restricted_pages
                        .map(pageName => pageNameToId(pageName))
                        .filter(id => id !== null);
                    setRestrictedPages(pageIds);
                    setOriginalRestrictedPages([...pageIds]);
                } else {
                    setRestrictedPages([]);
                    setOriginalRestrictedPages([]);
                }
            }
        } catch (error) {
            console.error('Error loading restricted pages:', error);
        }
    };



    // Guardar páginas restringidas globalmente
    const saveRestrictedPages = async (restrictedPagesData) => {
        try {
            const pageNames = restrictedPagesData.map(pageId => pageIdToName(pageId));
            
            const response = await fetch(`${AUTH_API_URL}${ENDPOINTS.ADMIN.SAVE_RESTRICTED_PAGES}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(pageNames)
            });
            
            if (response.ok) {
                setSaveStatus('success');
                setTimeout(() => setSaveStatus(null), 3000);
                return true;
            } else {
                setSaveStatus('error');
                setTimeout(() => setSaveStatus(null), 5000);
                return false;
            }
        } catch (error) {
            console.error('Error saving restricted pages:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 5000);
            return false;
        }
    };


    // Funciones drag & drop
    const handleDragStart = (e, page) => {
        setDraggedPage(page);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    // Drop en módulos restringidos globales
    const handleDropOnRestricted = (e) => {
        e.preventDefault();
        if (!draggedPage) return;

        if (!restrictedPages.includes(draggedPage.id)) {
            const newRestrictedPages = [...restrictedPages, draggedPage.id];
            setRestrictedPages(newRestrictedPages);
            saveRestrictedPages(newRestrictedPages);
        }
        setDraggedPage(null);
    };


    // Remover página de restringidas globales
    const removePageFromRestricted = (pageId) => {
        const newRestrictedPages = restrictedPages.filter(id => id !== pageId);
        setRestrictedPages(newRestrictedPages);
        saveRestrictedPages(newRestrictedPages);
    };


    if (!isSuperAdmin) {
        return (
            <div className="admin-users-container">
                <div className="permission-denied">
                    <h2>🚫 Acceso Denegado</h2>
                    <p>Solo los Super Administradores pueden gestionar páginas privadas.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-users-container">
            <div className="header-section">
                <h2 className="page-title">🔐 Páginas Privadas</h2>
                <p className="page-subtitle">Gestiona restricciones de acceso a módulos del sistema</p>
            </div>

            {loading && (
                <div className="loading-state">⏳ Cargando configuraciones...</div>
            )}

            {/* Módulos Restringidos Globalmente */}
            <div className="restricted-modules-section">
                <h3>🚫 Módulos Restringidos Globalmente</h3>
                <p>Solo Super Admin puede asignar estos módulos a cualquier usuario</p>
                <div 
                    className="restricted-modules-container"
                    onDragOver={handleDragOver}
                    onDrop={handleDropOnRestricted}
                >
                    {restrictedPages.length === 0 ? (
                        <div className="empty-restricted">
                            <span>📋 Arrastra módulos aquí para restringirlos globalmente</span>
                        </div>
                    ) : (
                        restrictedPages.map(pageId => {
                            const allPages = Object.values(AVAILABLE_PAGES).flat();
                            const page = allPages.find(p => p.id === pageId);
                            if (!page) return null;
                            
                            return (
                                <div key={pageId} className="restricted-module">
                                    <span className="module-icon">{page.icon}</span>
                                    <span className="module-name">{page.name}</span>
                                    <button
                                        onClick={() => removePageFromRestricted(pageId)}
                                        className="remove-btn"
                                        title="Quitar restricción global"
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
                <h3>📄 Módulos Disponibles</h3>
                <p>Arrastra los módulos hacia las zonas de restricción</p>
                
                {Object.entries(AVAILABLE_PAGES).map(([category, pages]) => {
                    // Filtrar páginas restringidas para usuarios no super_admin
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


            {/* Estado de guardado */}
            {saveStatus === 'success' && (
                <div className="save-status success">✅ Cambios guardados correctamente</div>
            )}
            {saveStatus === 'error' && (
                <div className="save-status error">❌ Error al guardar cambios</div>
            )}
        </div>
    );
};

export default PrivatePages;