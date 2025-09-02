import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AUTH_API_URL } from '../../config/api.js';
import { ENDPOINTS } from '../../config/endpoints.js';
import './AdminUsers.css';

// Páginas disponibles del sistema
const AVAILABLE_PAGES = {
    main: [
        { id: 'dashboard', name: 'Dashboard', icon: '📊', path: '/dashboard' },
        { id: 'orders2_0', name: 'Mis Ventas', icon: '🛒', path: '/orders2_0' },
        { id: 'customers', name: 'Mis Clientes', icon: '👥', path: '/customers' },
        { id: 'control-reportes', name: 'Mis Reportes', icon: '📈', path: '/control-reportes' },
        { id: 'quotes', name: 'Cotizaciones', icon: '📄', path: '/quotes' }
    ],
    config: [
        { id: 'ml-stores', name: 'Mis Tiendas', icon: '🏪', path: '/ml-stores' },
        { id: 'ml-sync', name: 'Sincronizar Órdenes', icon: '🔄', path: '/ml-sync' },
        { id: 'apis-conexiones', name: 'APIs y Conexiones', icon: '🔗', path: '/apis-conexiones' },
        { id: 'mis-etiquetas', name: 'Mis Etiquetas', icon: '🏷️', path: '/mis-etiquetas' }
    ],
    control: [
        { id: 'control-consolidador', name: 'Consolidador 2.0', icon: '📦', path: '/control-consolidador' },
        { id: 'control-validador', name: 'Validador', icon: '✅', path: '/control-validador' },
        { id: 'control-trm', name: 'TRM Monitor', icon: '💱', path: '/control-trm' },
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
        { id: 'admin-users', name: 'Gestión de Usuarios', icon: '👥', path: '/admin/users' },
        { id: 'admin-system', name: 'Monitor Sistema', icon: '⚙️', path: '/admin/system' }
    ]
};

// Clasificación de roles por tipo de usuario
const USER_TYPES = {
    administrative: ['super_admin', 'admin', 'asesor'],
    system: ['marketplace', 'dropshipper', 'proveedor']
};

// Permisos por defecto para cada rol
const DEFAULT_ROLE_PERMISSIONS = {
    // Usuarios Administrativos
    'super_admin': [...Object.values(AVAILABLE_PAGES).flat().map(p => p.id)], // Super Admin tiene acceso a TODO
    'admin': ['dashboard', 'orders2_0', 'customers', 'control-reportes', 'quotes', 'ml-stores', 'ml-sync', 'control-consolidador', 'control-validador'],
    'asesor': ['dashboard', 'customers', 'control-reportes', 'quotes'],
    
    // Usuarios del Sistema  
    'marketplace': ['dashboard', 'orders2_0', 'customers', 'publicaciones-ml', 'ml-stores'],
    'dropshipper': ['dashboard', 'orders2_0', 'customers', 'stock-proveedores', 'catalogo-amazon'],
    'proveedor': ['dashboard', 'stock-proveedores', 'control-reportes']
};

const AdminUsers = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('administrative');
    const [selectedRole, setSelectedRole] = useState('admin');
    const [draggedPage, setDraggedPage] = useState(null);
    const [rolePermissions, setRolePermissions] = useState(DEFAULT_ROLE_PERMISSIONS);
    const [originalRolePermissions, setOriginalRolePermissions] = useState(DEFAULT_ROLE_PERMISSIONS);
    const [userPermissions, setUserPermissions] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [toggleLoading, setToggleLoading] = useState(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [permissionsLoading, setPermissionsLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState(null); // 'saving' | 'success' | 'error' | null

    // 🔧 PAGES RESTRICTED FIX - SOLO ESTA PARTE ES NUEVA
    const [restrictedPages, setRestrictedPages] = useState([]);
    const [originalRestrictedPages, setOriginalRestrictedPages] = useState([]);

    // Función de mapeo para páginas restringidas
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

    // 🔧 FIXED: Función simple para cargar páginas restringidas
    const loadRestrictedPagesFixed = async () => {
        try {
            console.log('🔧 [FIXED] Loading restricted pages from server...');
            
            const response = await fetch(`${AUTH_API_URL}${ENDPOINTS.ADMIN.ROLE_PERMISSIONS}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('🔧 [FIXED] Server response:', data);
                
                if (data.restricted_pages && Array.isArray(data.restricted_pages)) {
                    // Convertir nombres a IDs
                    const pageIds = data.restricted_pages.map(pageName => {
                        const id = pageNameToId(pageName);
                        console.log('🔧 [FIXED] Converting:', pageName, '→', id);
                        return id;
                    });
                    
                    console.log('🔧 [FIXED] Setting restricted pages:', pageIds);
                    setRestrictedPages(pageIds);
                    setOriginalRestrictedPages([...pageIds]);
                    
                    return true;
                } else {
                    console.log('🔧 [FIXED] No restricted pages found');
                    setRestrictedPages([]);
                    setOriginalRestrictedPages([]);
                    return false;
                }
            } else {
                console.error('🔧 [FIXED] Server error:', response.status);
                return false;
            }
        } catch (error) {
            console.error('🔧 [FIXED] Network error:', error);
            return false;
        }
    };

    // 🔧 FIXED: Función simple para guardar páginas restringidas  
    const saveRestrictedPagesFixed = async (restrictedPagesData) => {
        try {
            // Convertir IDs a nombres
            const pageNames = restrictedPagesData.map(pageId => pageIdToName(pageId));
            console.log('🔧 [FIXED] Saving pages:', pageNames);
            
            const response = await fetch(`${AUTH_API_URL}${ENDPOINTS.ADMIN.SAVE_RESTRICTED_PAGES}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pageNames)
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('🔧 [FIXED] Save successful:', data);
                return true;
            } else {
                console.error('🔧 [FIXED] Save failed:', response.status);
                return false;
            }
        } catch (error) {
            console.error('🔧 [FIXED] Save error:', error);
            return false;
        }
    };

    // 🔧 FIXED: Manejar drag & drop para páginas restringidas
    const handleDropOnRestrictedFixed = (pageId) => {
        if (!restrictedPages.includes(pageId)) {
            const newRestrictedPages = [...restrictedPages, pageId];
            setRestrictedPages(newRestrictedPages);
            
            // Guardar inmediatamente
            saveRestrictedPagesFixed(newRestrictedPages);
        }
    };

    // 🔧 FIXED: Remover página de restringidas
    const removePageFromRestrictedFixed = (pageId) => {
        const newRestrictedPages = restrictedPages.filter(id => id !== pageId);
        setRestrictedPages(newRestrictedPages);
        
        // Guardar inmediatamente
        saveRestrictedPagesFixed(newRestrictedPages);
    };
    // FIN DEL FIX DE PÁGINAS RESTRINGIDAS

    useEffect(() => {
        // Verificar permisos usando el mismo criterio que la validación principal
        const hasAdminUsersPermission = user?.permissions?.some(perm => 
            perm.startsWith('admin-users:') || perm.startsWith('sales:')
        ) || user?.roles?.includes('super_admin');

        if (!hasAdminUsersPermission) {
            return;
        }
        
        console.log('📡 Loading data from server...');
        Promise.all([
            fetchUsers(),
            fetchRolePermissions(),
            loadRestrictedPagesFixed() // 🔧 FIXED: Cargar páginas restringidas
        ]).catch(error => {
            console.error('Error loading data:', error);
            setLoading(false);
            setPermissionsLoading(false);
        });
    }, [user]);

    const fetchRolePermissions = async () => {
        try {
            console.log('🔍 Fetching role permissions...');
            
            const response = await fetch(`${AUTH_API_URL}${ENDPOINTS.ADMIN.ROLE_PERMISSIONS}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                
                if (data.permissions && Object.keys(data.permissions).length > 0 && !data.permissions.null) {
                    // Filtrar cualquier entrada null
                    const cleanPermissions = {};
                    Object.entries(data.permissions).forEach(([role, perms]) => {
                        if (role && role !== 'null') {
                            cleanPermissions[role] = perms;
                        }
                    });
                    
                    if (Object.keys(cleanPermissions).length > 0) {
                        setRolePermissions(cleanPermissions);
                        setOriginalRolePermissions(JSON.parse(JSON.stringify(cleanPermissions)));
                        console.log('✅ Loaded saved permissions from database');
                    } else {
                        setRolePermissions(DEFAULT_ROLE_PERMISSIONS);
                        setOriginalRolePermissions(JSON.parse(JSON.stringify(DEFAULT_ROLE_PERMISSIONS)));
                        console.log('📋 Using default permissions (no valid saved data)');
                    }
                    
                    setPermissionsLoading(false);
                } else {
                    // Usar permisos por defecto
                    setRolePermissions(DEFAULT_ROLE_PERMISSIONS);
                    setOriginalRolePermissions(JSON.parse(JSON.stringify(DEFAULT_ROLE_PERMISSIONS)));
                    console.log('📋 Using default permissions');
                    setPermissionsLoading(false);
                }
            } else {
                // Si falla la API, usar permisos por defecto
                setRolePermissions(DEFAULT_ROLE_PERMISSIONS);
                console.log('📋 Using default permissions (API error)');
                setPermissionsLoading(false);
            }
        } catch (error) {
            console.error('Error fetching role permissions:', error);
            // En caso de error, usar permisos por defecto
            setRolePermissions(DEFAULT_ROLE_PERMISSIONS);
            console.log('📋 Network error - using default permissions');
            setPermissionsLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            console.log('⚡ Fetching users...');
            
            const localResponse = await fetch(`${AUTH_API_URL}${ENDPOINTS.ADMIN.USERS}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('API Response status:', localResponse.status);
            
            if (localResponse.ok) {
                const localData = await localResponse.json();
                console.log('Users received:', localData.users?.length || 0);
                setUsers(localData.users || []);
            } else {
                console.error('API Error:', localResponse.statusText);
                // Fallback to mock data for development
                setUsers([
                    {
                        id: 'e86a0348-acda-43ba-8a7e-2d0bbcb9627',
                        email: 'admin@dropux.co',
                        first_name: 'Super',
                        last_name: 'Admin',
                        country: 'Colombia',
                        phone: null,
                        company: null,
                        user_type: 'super_admin',
                        is_active: true,
                        is_verified: true,
                        created_at: '2024-01-15T00:00:00',
                        last_login: '2025-08-28T10:30:00'
                    },
                    {
                        id: 'pending-user-1',
                        email: 'empleado@dropux.co',
                        first_name: 'Juan',
                        last_name: 'Pérez',
                        country: null,
                        phone: null,
                        company: null,
                        user_type: null,
                        is_active: true,
                        is_verified: false,
                        created_at: '2025-09-01T10:00:00',
                        last_login: null
                    }
                ]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const saveRolePermissions = async (role, permissions) => {
        try {
            console.log(`🚀 API Call: Saving ${permissions.length} permissions for role ${role}`);
            console.log(`📤 Permissions data:`, permissions);
            
            const response = await fetch(`${AUTH_API_URL}${ENDPOINTS.ADMIN.SAVE_ROLE_PERMISSIONS}?role_name=${role}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(permissions)
            });
            
            console.log(`📡 API Response status:`, response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ API Success for ${role}:`, data);
                return data;
            } else {
                const errorData = await response.text();
                console.error(`❌ API Error for ${role}:`, response.status, errorData);
                return false;
            }
        } catch (error) {
            console.error(`💥 Network Error saving permissions for ${role}:`, error);
            return false;
        }
    };

    const handleEditUser = (userToEdit) => {
        // 🛡️ PROTECCIÓN SUPER ADMIN: Solo Super Admin puede editar otros Super Admin
        const currentUserIsSuperAdmin = user?.roles?.includes('super_admin') || 
                                       user?.user_type === 'super_admin' ||
                                       user?.permissions?.some(p => p.includes('super_admin'));
        
        const targetUserIsSuperAdmin = userToEdit?.user_type === 'super_admin' ||
                                      userToEdit?.roles?.includes('super_admin');
        
        // Si el usuario a editar es Super Admin y el usuario actual NO es Super Admin
        if (targetUserIsSuperAdmin && !currentUserIsSuperAdmin) {
            alert('🚫 Acceso Denegado\n\nSolo un Super Admin puede editar a otro Super Admin.\n\nContacta al administrador del sistema si necesitas realizar cambios.');
            return;
        }
        
        setSelectedUser(userToEdit);
        setShowEditModal(true);
    };

    const handleDeleteUser = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const confirmDeleteUser = async (userId) => {
        try {
            // Intentar API real primero
            const response = await fetch(`https://auth-api.dropux.co/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                // Intentar con localhost
                const localResponse = await fetch(`${AUTH_API_URL}${ENDPOINTS.ADMIN.USERS}/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!localResponse.ok) {
                    console.warn('API not available, deleting locally only');
                }
            }
            
            // Eliminar del estado local
            setUsers(prev => prev.filter(u => u.id !== userId));
            setShowDeleteModal(false);
            setUserToDelete(null);
            
        } catch (error) {
            console.error('Error deleting user:', error);
            // Aún así eliminar localmente para demo
            setUsers(prev => prev.filter(u => u.id !== userId));
            setShowDeleteModal(false);
            setUserToDelete(null);
        }
    };

    const handleToggleUserStatus = async (userId) => {
        // Cambio inmediato en la UI
        setUsers(prev => prev.map(u => 
            u.id === userId ? { ...u, is_active: !u.is_active } : u
        ));
        
        // API call en background (sin blocking UI)
        try {
            const response = await fetch(`https://auth-api.dropux.co/users/${userId}/toggle-status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                // Intentar con localhost
                const localResponse = await fetch(`${AUTH_API_URL}${ENDPOINTS.ADMIN.USERS}/${userId}/toggle-status`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!localResponse.ok) {
                    console.warn('API not available, using local state only');
                }
            }
        } catch (error) {
            console.error('Error toggling user status:', error);
        }
    };

    const handleUpdateUser = async (updatedUser) => {
        // CAMBIO INMEDIATO - Actualizar UI instantáneamente
        setUsers(prev => prev.map(u => 
            u.id === updatedUser.id ? { ...updatedUser, is_verified: true } : u
        ));
        setShowEditModal(false);
        setSelectedUser(null);
        
        // API call en background (sin blocking UI)
        try {
            console.log('🔄 Updating user role:', updatedUser.id, 'to:', updatedUser.user_type);
            
            const response = await fetch(`https://auth-api.dropux.co/admin/assign-role?user_id=${updatedUser.id}&role_name=${updatedUser.user_type}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                console.log('Production API failed, trying localhost...');
                const localResponse = await fetch(`${AUTH_API_URL}/admin/assign-role?user_id=${updatedUser.id}&role_name=${updatedUser.user_type}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (localResponse.ok) {
                    console.log('✅ Role updated successfully in database');
                } else {
                    console.error('❌ Failed to update role in database');
                    const errorText = await localResponse.text();
                    console.error('Error response:', errorText);
                }
            } else {
                console.log('✅ Role updated successfully in production database');
            }
        } catch (error) {
            console.error('❌ Error updating user role:', error);
        }
    };

    const getRoleColor = (userType) => {
        switch (userType) {
            case 'super_admin': return 'role-super-admin';
            case 'admin': return 'role-admin';
            case 'asesor': return 'role-operator';
            case 'marketplace': return 'role-viewer';
            case 'dropshipper': return 'role-viewer';
            case 'proveedor': return 'role-viewer';
            default: return 'role-pending';
        }
    };

    const getRoleLabel = (userType) => {
        switch (userType) {
            case 'super_admin': return 'Super Admin';
            case 'admin': return 'Administrador';
            case 'asesor': return 'Asesor';
            case 'marketplace': return 'Marketplace';
            case 'dropshipper': return 'Dropshipper';
            case 'proveedor': return 'Proveedor';
            default: return 'Pendiente de Rol';
        }
    };

    // Función para asignar rol por defecto a usuarios sin rol
    const getUserWithDefaultRole = (user) => {
        if (!user.user_type || user.user_type === null) {
            return { ...user, user_type: 'asesor', is_verified: false };
        }
        return user;
    };

    const filteredUsers = users.map(getUserWithDefaultRole).filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filtrar por pestaña activa
        let matchesTab = false;
        if (activeTab === 'administrative') {
            matchesTab = USER_TYPES.administrative.includes(user.user_type);
        } else if (activeTab === 'system') {
            matchesTab = USER_TYPES.system.includes(user.user_type);
        } else {
            matchesTab = true; // Para pestaña de permisos, mostrar todos
        }
        
        // Filtrar por rol específico
        const matchesRole = roleFilter === 'all' || 
                           user.user_type === roleFilter;
        
        return matchesSearch && matchesTab && matchesRole;
    });

    // Drag & Drop functions
    const handleDragStart = (e, page) => {
        setDraggedPage(page);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDropOnRole = (e, targetRole) => {
        e.preventDefault();
        if (draggedPage && !rolePermissions[targetRole].includes(draggedPage.id)) {
            const newPermissions = [...(rolePermissions[targetRole] || []), draggedPage.id];
            
            setRolePermissions(prev => ({
                ...prev,
                [targetRole]: newPermissions
            }));
            
            // Guardar en background sin bloquear UI
            saveRolePermissions(targetRole, newPermissions).catch(err => {
                console.error('Background save failed:', err);
            });
        }
        setDraggedPage(null);
    };

    const handleDropOnUser = (e, userId) => {
        e.preventDefault();
        if (draggedPage) {
            setUserPermissions(prev => ({
                ...prev,
                [userId]: [...(prev[userId] || []), draggedPage.id]
            }));
        }
        setDraggedPage(null);
    };

    // 🔧 FIXED: Función para páginas restringidas con drag & drop
    const handleDropOnRestricted = (e) => {
        e.preventDefault();
        if (draggedPage && !restrictedPages.includes(draggedPage.id)) {
            handleDropOnRestrictedFixed(draggedPage.id);
            
            // Remover de todos los roles excepto super_admin
            const updatedRolePermissions = { ...rolePermissions };
            Object.keys(updatedRolePermissions).forEach(role => {
                if (role !== 'super_admin') {
                    updatedRolePermissions[role] = updatedRolePermissions[role].filter(pageId => pageId !== draggedPage.id);
                }
            });
            setRolePermissions(updatedRolePermissions);
        }
        setDraggedPage(null);
    };

    const removePageFromRole = (pageId, role) => {
        console.log(`🗑️ Removing page ${pageId} from role ${role}`);
        const newPermissions = (rolePermissions[role] || []).filter(id => id !== pageId);
        
        setRolePermissions(prev => ({
            ...prev,
            [role]: newPermissions
        }));
        
        saveRolePermissions(role, newPermissions).then(result => {
            console.log(`✅ Saved in background:`, result);
        }).catch(err => {
            console.error(`❌ Background save failed:`, err);
        });
    };

    const removePageFromUser = (pageId, userId) => {
        setUserPermissions(prev => ({
            ...prev,
            [userId]: (prev[userId] || []).filter(id => id !== pageId)
        }));
    };

    // Verificar si una página está restringida
    const isPageRestricted = (pageId) => {
        return restrictedPages.includes(pageId);
    };

    // Obtener páginas disponibles filtradas según el usuario
    const getAvailablePages = () => {
        const allPages = { ...AVAILABLE_PAGES };
        
        const isSuperAdmin = user?.roles?.includes('super_admin') || 
                            user?.user_type === 'super_admin' ||
                            user?.permissions?.some(p => p.includes('super_admin'));
        
        // Si NO es super_admin, filtrar páginas restringidas
        if (!isSuperAdmin && restrictedPages.length > 0) {
            Object.keys(allPages).forEach(category => {
                allPages[category] = allPages[category].filter(page => 
                    !restrictedPages.includes(page.id)
                );
            });
        }
        
        return allPages;
    };

    // Obtener roles visibles según el usuario
    const getVisibleRoles = () => {
        const allRoles = Object.keys(rolePermissions || DEFAULT_ROLE_PERMISSIONS);
        
        const isSuperAdmin = user?.roles?.includes('super_admin') || 
                            user?.user_type === 'super_admin' ||
                            user?.permissions?.some(p => p.includes('super_admin'));
        
        // Si no es super_admin, ocultar el rol super_admin
        if (!isSuperAdmin) {
            return allRoles.filter(role => role !== 'super_admin');
        }
        
        return allRoles;
    };

    // Función para guardar todos los cambios pendientes
    const handleSaveChanges = async () => {
        if (!hasUnsavedChanges) return;
        
        setSaveStatus('saving');
        setIsSaving(true);
        
        try {
            // Obtener todos los roles que han cambiado
            const changedRoles = [];
            Object.keys(rolePermissions).forEach(role => {
                const current = JSON.stringify(rolePermissions[role] || []);
                const original = JSON.stringify(originalRolePermissions[role] || []);
                if (current !== original) {
                    changedRoles.push({
                        role,
                        permissions: rolePermissions[role] || []
                    });
                }
            });
            
            // Guardar páginas restringidas si han cambiado
            const restrictedChanged = JSON.stringify(restrictedPages) !== JSON.stringify(originalRestrictedPages);
            
            console.log(`💾 Saving changes: ${changedRoles.length} roles, restricted changed: ${restrictedChanged}`);
            
            // Ejecutar guardados en paralelo
            const savePromises = [];
            
            // Guardar permisos de roles
            changedRoles.forEach(({ role, permissions }) => {
                savePromises.push(
                    saveRolePermissions(role, permissions).then(result => {
                        if (result === false) throw new Error(`Failed to save role ${role}`);
                        return { type: 'role', role, success: true };
                    })
                );
            });
            
            // 🔧 FIXED: Guardar páginas restringidas
            if (restrictedChanged) {
                savePromises.push(
                    saveRestrictedPagesFixed(restrictedPages).then(result => {
                        if (result === false) throw new Error('Failed to save restricted pages');
                        return { type: 'restricted', success: true };
                    })
                );
            }
            
            // Esperar a que todos se guarden
            const results = await Promise.all(savePromises);
            
            // ✅ TODO GUARDADO EXITOSAMENTE
            setHasUnsavedChanges(false);
            setOriginalRolePermissions(JSON.parse(JSON.stringify(rolePermissions)));
            setOriginalRestrictedPages(JSON.parse(JSON.stringify(restrictedPages)));
            setSaveStatus('success');
            
            console.log('🎉 All changes saved successfully:', results);
            
            // Ocultar notificación de éxito después de 3 segundos
            setTimeout(() => setSaveStatus(null), 3000);
            
        } catch (error) {
            console.error('💥 Error saving changes:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 5000);
        } finally {
            setIsSaving(false);
        }
    };

    // Detectar cambios para mostrar botón de guardar
    useEffect(() => {
        const hasPermissionChanges = () => {
            const currentRoles = Object.keys(rolePermissions || {});
            const originalRoles = Object.keys(originalRolePermissions || {});
            
            if (currentRoles.length !== originalRoles.length) return true;
            
            for (const role of currentRoles) {
                const current = rolePermissions[role] || [];
                const original = originalRolePermissions[role] || [];
                
                if (current.length !== original.length) return true;
                if (current.some(page => !original.includes(page))) return true;
            }
            return false;
        };
        
        const hasRestrictedChanges = () => {
            if (restrictedPages.length !== originalRestrictedPages.length) return true;
            return restrictedPages.some(page => !originalRestrictedPages.includes(page));
        };
        
        const hasChanges = hasPermissionChanges() || hasRestrictedChanges();
        setHasUnsavedChanges(hasChanges);
    }, [rolePermissions, originalRolePermissions, restrictedPages, originalRestrictedPages]);

    // Reset filter when changing tabs
    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        setRoleFilter('all');
    };

    // Verificar permisos de acceso
    const isSuperAdmin = user?.roles?.includes('super_admin') || 
                        user?.user_type === 'super_admin' ||
                        user?.permissions?.some(p => p.includes('super_admin'));
                        
    const hasAdminUsersPermission = user?.permissions?.some(perm => 
        perm.startsWith('admin-users:') || perm.startsWith('sales:')
    ) || isSuperAdmin;

    if (!hasAdminUsersPermission) {
        return (
            <div className="admin-access-denied">
                <h2>🚫 Acceso Denegado</h2>
                <p>No tienes permisos para acceder a la gestión de usuarios.</p>
            </div>
        );
    }

    return (
        <div className="admin-users">
            {/* Header */}
            <div className="admin-users-header">
                <div>
                    <h1>👥 Gestión de Usuarios</h1>
                    <p>Administrar todos los usuarios del ecosistema Dropux</p>
                </div>
                <button className="btn-primary">
                    ➕ Nuevo Usuario
                </button>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                <button 
                    className={`tab-button ${activeTab === 'administrative' ? 'active' : ''}`}
                    onClick={() => handleTabChange('administrative')}
                >
                    👑 Usuarios Administrativos
                </button>
                <button 
                    className={`tab-button ${activeTab === 'system' ? 'active' : ''}`}
                    onClick={() => handleTabChange('system')}
                >
                    👥 Usuarios del Sistema
                </button>
                <button 
                    className={`tab-button ${activeTab === 'permissions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('permissions')}
                >
                    🔒 Permisos por Rol
                </button>
            </div>

            {/* Tab Content */}
            {(activeTab === 'administrative' || activeTab === 'system') && (
                <>
                    {/* Filters */}
                    <div className="users-filters">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="🔍 Buscar usuarios..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <select 
                            value={roleFilter} 
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="role-filter"
                        >
                            <option value="all">Todos los roles</option>
                            {activeTab === 'administrative' ? (
                                <>
                                    <option value="super_admin">Super Admin</option>
                                    <option value="admin">Administrador</option>
                                    <option value="asesor">Asesor</option>
                                </>
                            ) : activeTab === 'system' ? (
                                <>
                                    <option value="marketplace">Marketplace</option>
                                    <option value="dropshipper">Dropshipper</option>
                                    <option value="proveedor">Proveedor</option>
                                </>
                            ) : (
                                <>
                                    <optgroup label="Administrativos">
                                        <option value="super_admin">Super Admin</option>
                                        <option value="admin">Administrador</option>
                                        <option value="asesor">Asesor</option>
                                    </optgroup>
                                    <optgroup label="Sistema">
                                        <option value="marketplace">Marketplace</option>
                                        <option value="dropshipper">Dropshipper</option>
                                        <option value="proveedor">Proveedor</option>
                                    </optgroup>
                                </>
                            )}
                        </select>

                        <div className="users-stats">
                            <span>Total: {filteredUsers.length}</span>
                            <span>Activos: {filteredUsers.filter(u => u.is_active).length}</span>
                            <span>Pendientes: {filteredUsers.filter(u => !u.is_verified).length}</span>
                        </div>
                    </div>

                    {/* Users Table */}
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Cargando usuarios...</p>
                        </div>
                    ) : (
                        <div className="users-table-container">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>Usuario</th>
                                        <th>País</th>
                                        <th>Rol</th>
                                        <th>Fecha Registro</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(tableUser => (
                                        <tr key={tableUser.id} className={!tableUser.is_active ? 'inactive' : ''}>
                                            <td>
                                                <div className="user-cell">
                                                    <div className="user-avatar">
                                                        {tableUser.first_name?.[0] || 'U'}{tableUser.last_name?.[0] || 'S'}
                                                    </div>
                                                    <div className="user-details">
                                                        <div className="user-name">
                                                            {tableUser.first_name || 'Sin nombre'} {tableUser.last_name || ''}
                                                        </div>
                                                        <div className="user-email">{tableUser.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="business-cell">
                                                    🌍 {tableUser.country || 'Colombia'}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`role-badge ${getRoleColor(tableUser.user_type)}`}>
                                                    {getRoleLabel(tableUser.user_type)}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="date-cell">
                                                    {tableUser.created_at ? new Date(tableUser.created_at).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="user-actions">
                                                    {(() => {
                                                        // 🛡️ PROTECCIÓN SUPER ADMIN: Verificar si se puede editar este usuario
                                                        const currentUserIsSuperAdmin = user?.roles?.includes('super_admin') || 
                                                                                       user?.user_type === 'super_admin' ||
                                                                                       user?.permissions?.some(p => p.includes('super_admin'));
                                                        
                                                        const targetUserIsSuperAdmin = tableUser?.user_type === 'super_admin' ||
                                                                                      tableUser?.roles?.includes('super_admin');
                                                        
                                                        const canEdit = !targetUserIsSuperAdmin || currentUserIsSuperAdmin;
                                                        
                                                        return (
                                                            <button 
                                                                className={`btn-action edit ${!canEdit ? 'disabled' : ''}`}
                                                                onClick={() => canEdit ? handleEditUser(tableUser) : null}
                                                                title={canEdit ? "Editar usuario" : "🚫 Solo Super Admin puede editar Super Admin"}
                                                                disabled={!canEdit}
                                                            >
                                                                ✏️
                                                            </button>
                                                        );
                                                    })()}
                                                    
                                                    <button 
                                                        className={`btn-action ${tableUser.is_active ? 'deactivate' : 'activate'}`}
                                                        onClick={() => handleToggleUserStatus(tableUser.id)}
                                                        title={tableUser.is_active ? 'Desactivar usuario' : 'Activar usuario'}
                                                    >
                                                        {tableUser.is_active ? '✅' : '⛔'}
                                                    </button>
                                                    <button 
                                                        className="btn-action delete"
                                                        onClick={() => handleDeleteUser(tableUser)}
                                                        title="Eliminar usuario"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Edit User Modal */}
                    {showEditModal && selectedUser && (
                        <EditUserModal 
                            user={selectedUser}
                            onClose={() => setShowEditModal(false)}
                            onUpdate={handleUpdateUser}
                        />
                    )}

                    {showDeleteModal && userToDelete && (
                        <DeleteUserModal 
                            user={userToDelete}
                            onClose={() => setShowDeleteModal(false)}
                            onConfirm={confirmDeleteUser}
                        />
                    )}
                </>
            )}

            {/* Permissions Tab */}
            {activeTab === 'permissions' && (
                <div className="permissions-panel">
                    {/* Available Pages */}
                    <div className="permissions-section">
                        <h3>📄 Páginas Disponibles</h3>
                        <p>Arrastra las páginas hacia los roles para asignar permisos</p>
                        
                        {Object.entries(getAvailablePages()).map(([category, pages]) => (
                            <div key={category} className="page-category">
                                <h4>{category === 'main' ? '🏠 Principal' : 
                                    category === 'config' ? '⚙️ Configuración' : 
                                    category === 'control' ? '📊 Control Suite' : 
                                    category === 'products' ? '📦 Products Suite' : '👑 Super Admin'}</h4>
                                <div className="page-grid">
                                    {pages.map(page => (
                                        <div
                                            key={page.id}
                                            className="page-card"
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, page)}
                                        >
                                            <span className="page-icon">{page.icon}</span>
                                            <span className="page-name">{page.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        
                        {/* 🔧 FIXED: Páginas Restringidas - Solo visible para super_admin */}
                        {user?.roles?.includes('super_admin') && (
                            <div className="restricted-pages-section">
                                <h4>🚫 Páginas Restringidas</h4>
                                <p>Solo Super Admin puede asignar estas páginas</p>
                                <div 
                                    className="restricted-pages-container"
                                    onDragOver={handleDragOver}
                                    onDrop={handleDropOnRestricted}
                                >
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
                                                <div key={pageId} className="restricted-page">
                                                    <span className="page-icon">{page.icon}</span>
                                                    <span className="page-name">{page.name}</span>
                                                    <button
                                                        onClick={() => removePageFromRestrictedFixed(pageId)}
                                                        className="remove-btn"
                                                        title="Quitar restricción"
                                                    >
                                                        ❌️
                                                    </button>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Role Permissions */}
                    <div className="permissions-section">
                        <div className="permissions-header">
                            <h3>🔒 Permisos por Rol</h3>
                            {hasUnsavedChanges && (
                                <button 
                                    className="save-changes-btn"
                                    onClick={handleSaveChanges}
                                    disabled={isSaving}
                                >
                                    {saveStatus === 'saving' ? '⏳ Guardando...' : '💾 Guardar Cambios'}
                                </button>
                            )}
                            
                            {/* Notificaciones de estado */}
                            {saveStatus === 'success' && (
                                <div className="save-notification success">
                                    <span>✅ Cambios guardados exitosamente</span>
                                </div>
                            )}
                            
                            {saveStatus === 'error' && (
                                <div className="save-notification error">
                                    <span>❌ Error al guardar. Intenta de nuevo.</span>
                                </div>
                            )}
                        </div>
                        <div className="roles-grid">
                            {permissionsLoading ? (
                                <div className="permissions-loading">
                                    <div className="spinner"></div>
                                    <p>Cargando permisos...</p>
                                </div>
                            ) : (
                                getVisibleRoles().map(role => {
                                    const permissions = rolePermissions?.[role] || [];
                                    return (
                                        <div
                                            key={role}
                                            className="role-container"
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDropOnRole(e, role)}
                                        >
                                            <div className="role-header">
                                                <h4>{role === 'super_admin' ? '👑 Super Admin' : 
                                                    role === 'admin' ? '🛡️ Administrador' : 
                                                    role === 'asesor' ? '👨‍💼 Asesor' : 
                                                    role === 'marketplace' ? '🏪 Marketplace' :
                                                    role === 'dropshipper' ? '📦 Dropshipper' :
                                                    role === 'proveedor' ? '🚚 Proveedor' : role}</h4>
                                                <span className="permission-count">{permissions && Array.isArray(permissions) ? permissions.length : 0} páginas</span>
                                            </div>
                                            <div className="assigned-pages">
                                                {(permissions || []).map(pageId => {
                                                    const allPages = Object.values(AVAILABLE_PAGES).flat();
                                                    const page = allPages.find(p => p.id === pageId);
                                                    if (!page && !['admin', 'admin/users', 'admin/system'].includes(pageId)) return null;
                                                    
                                                    return (
                                                        <div key={pageId} className="assigned-page">
                                                            <span>{page?.icon || '⚙️'}</span>
                                                            <span>{page?.name || pageId}</span>
                                                            <button
                                                                onClick={() => removePageFromRole(pageId, role)}
                                                                className="remove-btn"
                                                                title="Quitar página"
                                                            >
                                                                ✖️
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Modal components
const EditUserModal = ({ user, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        user_type: user.user_type,
        is_active: user.is_active
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Cambio inmediato
        onUpdate({ ...user, ...formData });
        
        // Cerrar modal inmediatamente
        setTimeout(() => {
            onClose();
        }, 100);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>✏️ Editar Usuario</h2>
                    <button className="modal-close" onClick={onClose}>✖️</button>
                </div>
                
                <form onSubmit={handleSubmit} className="edit-user-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                value={formData.first_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Apellido</label>
                            <input
                                type="text"
                                value={formData.last_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Tipo de Usuario</label>
                        <select
                            value={formData.user_type || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, user_type: e.target.value }))}
                        >
                            <option value="">Sin Asignar</option>
                            <optgroup label="Usuarios Administrativos">
                                <option value="super_admin">Super Admin</option>
                                <option value="admin">Administrador</option>
                                <option value="asesor">Asesor</option>
                            </optgroup>
                            <optgroup label="Usuarios del Sistema">
                                <option value="marketplace">Marketplace</option>
                                <option value="dropshipper">Dropshipper</option>
                                <option value="proveedor">Proveedor</option>
                            </optgroup>
                        </select>
                    </div>
                    
                    <div className="form-group checkbox">
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.is_active}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                            />
                            Usuario activo
                        </label>
                    </div>
                    
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-primary" disabled={isLoading}>
                            {isLoading ? '⏳ Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DeleteUserModal = ({ user, onClose, onConfirm }) => {
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const requiredText = 'ELIMINAR';
    
    const handleConfirm = async () => {
        if (confirmText !== requiredText) return;
        
        setIsDeleting(true);
        await onConfirm(user.id);
        setIsDeleting(false);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>🗑️ Eliminar Usuario</h2>
                    <button className="modal-close" onClick={onClose}>✖️</button>
                </div>
                
                <div className="delete-user-form">
                    <div className="warning-message">
                        <div className="warning-icon">⚠️</div>
                        <div>
                            <h3>¡Esta acción no se puede deshacer!</h3>
                            <p>Vas a eliminar permanentemente al usuario:</p>
                            <div className="user-to-delete">
                                <strong>{user.first_name} {user.last_name}</strong>
                                <div className="email">{user.email}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="confirmation-input">
                        <label>
                            Para confirmar, escribe <strong>{requiredText}</strong> en el campo de abajo:
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder={`Escribe "${requiredText}"`}
                            className="confirm-input"
                        />
                    </div>
                    
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button 
                            type="button" 
                            className="btn-danger"
                            disabled={confirmText !== requiredText || isDeleting}
                            onClick={handleConfirm}
                        >
                            {isDeleting ? '🗑️ Eliminando...' : '🗑️ Eliminar Usuario'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;