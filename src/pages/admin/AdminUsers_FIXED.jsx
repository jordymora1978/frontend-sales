import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminUsers.css';
import { AUTH_API_URL } from '../../config/api';
import { ENDPOINTS } from '../../config/endpoints';

// Páginas disponibles por categoría
const AVAILABLE_PAGES = {
    main: [
        { id: 'dashboard', name: 'Dashboard', icon: '📊', path: '/' },
        { id: 'orders2_0', name: 'Órdenes 2.0', icon: '📋', path: '/orders2.0' },
        { id: 'customers', name: 'Clientes', icon: '👥', path: '/customers' }
    ],
    config: [
        { id: 'quotes', name: 'Cotizaciones', icon: '💰', path: '/quotes' },
        { id: 'ml-stores', name: 'Tiendas ML', icon: '🏪', path: '/ml-stores' },
        { id: 'ml-sync', name: 'ML Sync', icon: '🔄', path: '/ml-sync' }
    ],
    control: [
        { id: 'control-reportes', name: 'Reportes', icon: '📈', path: '/control/reportes' },
        { id: 'control-consolidador', name: 'Consolidador 2.0', icon: '⚙️', path: '/control/consolidador' },
        { id: 'control-validador', name: 'Validador', icon: '✅', path: '/control/validador' },
        { id: 'control-trm', name: 'TRM Control', icon: '💱', path: '/control/trm' },
        { id: 'control-gmail-drive', name: 'Gmail & Drive', icon: '📧', path: '/control/gmail-drive' }
    ],
    products: [
        { id: 'catalogo-amazon', name: 'Catálogo Amazon', icon: '📦', path: '/catalogo-amazon' },
        { id: 'publicaciones-ml', name: 'Publicaciones ML', icon: '🛍️', path: '/publicaciones-ml' },
        { id: 'stock-proveedores', name: 'Stock Proveedores', icon: '🚚', path: '/stock-proveedores' }
    ],
    superadmin: [
        { id: 'admin-panel', name: 'Panel Admin', icon: '🎛️', path: '/admin' },
        { id: 'admin-users', name: 'Gestión de Usuarios', icon: '👥', path: '/admin/users' },
        { id: 'admin-system', name: 'Monitor Sistema', icon: '⚙️', path: '/admin/system' },
        { id: 'apis-conexiones', name: 'APIs & Conexiones', icon: '🔗', path: '/apis-conexiones' },
        { id: 'mis-etiquetas', name: 'Mis Etiquetas', icon: '🏷️', path: '/mis-etiquetas' },
        { id: 'google-api', name: 'Google API', icon: '☁️', path: '/google-api' }
    ]
};

const DEFAULT_ROLE_PERMISSIONS = {
    super_admin: ['dashboard', 'orders2_0', 'customers', 'control-reportes', 'quotes', 'ml-stores', 'ml-sync', 'control-consolidador', 'control-validador', 'catalogo-amazon', 'publicaciones-ml', 'stock-proveedores', 'admin-panel', 'admin-users', 'admin-system', 'apis-conexiones', 'mis-etiquetas', 'control-trm', 'control-gmail-drive', 'google-api'],
    admin: ['dashboard', 'orders2_0', 'customers', 'control-reportes', 'quotes', 'ml-stores', 'ml-sync', 'control-consolidador', 'control-validador'],
    asesor: ['dashboard', 'customers', 'control-reportes', 'quotes'],
    marketplace: ['dashboard', 'orders2_0', 'customers', 'publicaciones-ml', 'ml-stores'],
    dropshipper: ['dashboard', 'orders2_0', 'customers', 'stock-proveedores', 'catalogo-amazon'],
    proveedor: ['dashboard', 'stock-proveedores', 'control-reportes']
};

function AdminUsers() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rolePermissions, setRolePermissions] = useState(DEFAULT_ROLE_PERMISSIONS);
    const [restrictedPages, setRestrictedPages] = useState([]);
    const [originalRestrictedPages, setOriginalRestrictedPages] = useState([]);
    const [permissionsLoading, setPermissionsLoading] = useState(true);

    // Función de mapeo
    const pageNameToId = (pageName) => {
        const allPages = Object.values(AVAILABLE_PAGES).flat();
        const page = allPages.find(p => p.name === pageName);
        return page ? page.id : pageName;
    };

    const pageIdToName = (pageId) => {
        const allPages = Object.values(AVAILABLE_PAGES).flat();
        const page = allPages.find(p => p.id === pageId);
        return page ? page.name : pageId;
    };

    // FUNCIÓN SIMPLE PARA CARGAR PÁGINAS RESTRINGIDAS
    const loadRestrictedPages = async () => {
        try {
            console.log('💪 [SIMPLE FIX] Loading restricted pages from server...');
            
            const response = await fetch(`${AUTH_API_URL}${ENDPOINTS.ADMIN.ROLE_PERMISSIONS}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('💪 [SIMPLE FIX] Server response:', data);
                
                if (data.restricted_pages && Array.isArray(data.restricted_pages)) {
                    // Convertir nombres a IDs
                    const pageIds = data.restricted_pages.map(pageName => {
                        const id = pageNameToId(pageName);
                        console.log('💪 [SIMPLE FIX] Converting:', pageName, '→', id);
                        return id;
                    });
                    
                    console.log('💪 [SIMPLE FIX] Setting restricted pages:', pageIds);
                    setRestrictedPages(pageIds);
                    setOriginalRestrictedPages([...pageIds]);
                    
                    return true;
                } else {
                    console.log('💪 [SIMPLE FIX] No restricted pages found');
                    setRestrictedPages([]);
                    setOriginalRestrictedPages([]);
                    return false;
                }
            } else {
                console.error('💪 [SIMPLE FIX] Server error:', response.status);
                return false;
            }
        } catch (error) {
            console.error('💪 [SIMPLE FIX] Network error:', error);
            return false;
        }
    };

    // FUNCIÓN SIMPLE PARA GUARDAR
    const saveRestrictedPages = async (restrictedPagesData) => {
        try {
            // Convertir IDs a nombres
            const pageNames = restrictedPagesData.map(pageId => pageIdToName(pageId));
            console.log('💪 [SIMPLE FIX] Saving pages:', pageNames);
            
            const response = await fetch(`${AUTH_API_URL}${ENDPOINTS.ADMIN.SAVE_RESTRICTED_PAGES}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pageNames)
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('💪 [SIMPLE FIX] Save successful:', data);
                return true;
            } else {
                console.error('💪 [SIMPLE FIX] Save failed:', response.status);
                return false;
            }
        } catch (error) {
            console.error('💪 [SIMPLE FIX] Save error:', error);
            return false;
        }
    };

    // CARGAR AL INICIAR
    useEffect(() => {
        console.log('💪 [SIMPLE FIX] Component mounted, loading data...');
        
        const loadData = async () => {
            await loadRestrictedPages();
            setPermissionsLoading(false);
            setLoading(false);
        };
        
        loadData();
    }, []);

    // Manejar drag & drop para agregar páginas a restringidas
    const handleDropOnRestricted = (pageId) => {
        if (!restrictedPages.includes(pageId)) {
            const newRestrictedPages = [...restrictedPages, pageId];
            setRestrictedPages(newRestrictedPages);
            
            // Guardar inmediatamente
            saveRestrictedPages(newRestrictedPages);
        }
    };

    // Remover página de restringidas
    const removePageFromRestricted = (pageId) => {
        const newRestrictedPages = restrictedPages.filter(id => id !== pageId);
        setRestrictedPages(newRestrictedPages);
        
        // Guardar inmediatamente
        saveRestrictedPages(newRestrictedPages);
    };

    if (loading || permissionsLoading) {
        return <div className="loading">Cargando...</div>;
    }

    return (
        <div className="admin-users">
            <h1>Gestión de Usuarios</h1>
            
            <div className="permissions-section">
                <h2>🚫 Páginas Restringidas</h2>
                <div className="restricted-pages-container">
                    {restrictedPages.length === 0 ? (
                        <div className="empty-restricted">
                            <span>📋 Arrastra páginas aquí para restringirlas</span>
                        </div>
                    ) : (
                        restrictedPages.map(pageId => {
                            const allPages = Object.values(AVAILABLE_PAGES).flat();
                            const page = allPages.find(p => p.id === pageId);
                            if (!page) return null;
                            
                            return (
                                <div key={pageId} className="page-chip restricted">
                                    <span>{page.icon}{page.name}❌</span>
                                    <button
                                        onClick={() => removePageFromRestricted(pageId)}
                                        className="remove-btn"
                                    >
                                        ✕
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="available-pages">
                <h3>Páginas Disponibles</h3>
                {Object.entries(AVAILABLE_PAGES).map(([category, pages]) => (
                    <div key={category} className="category-section">
                        <h4>{category.toUpperCase()}</h4>
                        <div className="pages-grid">
                            {pages.map(page => (
                                <div
                                    key={page.id}
                                    className="page-chip available"
                                    draggable
                                    onDragEnd={() => handleDropOnRestricted(page.id)}
                                    onClick={() => handleDropOnRestricted(page.id)}
                                >
                                    <span>{page.icon}{page.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminUsers;