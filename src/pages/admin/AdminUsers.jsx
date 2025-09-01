import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
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

    useEffect(() => {
        if (!user?.roles?.includes('super_admin')) {
            return;
        }
        fetchUsers();
        fetchRolePermissions();
    }, [user]);

    // Detectar cambios en los permisos para mostrar el botón de guardar
    useEffect(() => {
        const hasChanges = JSON.stringify(rolePermissions) !== JSON.stringify(originalRolePermissions);
        setHasUnsavedChanges(hasChanges);
        
        if (hasChanges) {
            console.log('🔄 Changes detected in permissions');
        }
    }, [rolePermissions, originalRolePermissions]);

    const fetchRolePermissions = async () => {
        try {
            const response = await fetch('http://localhost:8004/admin/role-permissions', {
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
                        setOriginalRolePermissions(JSON.parse(JSON.stringify(cleanPermissions))); // Copia profunda
                        console.log('✅ Loaded saved permissions from database');
                    } else {
                        // Si no hay permisos válidos, usar los por defecto
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
            setPermissionsLoading(false);
        }
    };

    const saveRolePermissions = async (role, permissions) => {
        try {
            console.log(`🚀 API Call: Saving ${permissions.length} permissions for role ${role}`);
            console.log(`📤 Permissions data:`, permissions);
            
            const response = await fetch(`http://localhost:8004/admin/save-role-permissions?role_name=${role}`, {
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

    const fetchUsers = async () => {
        try {
            console.log('Fetching users...');
            const authToken = localStorage.getItem('auth_token');
            console.log('Auth token:', authToken ? 'Present' : 'Missing');
            
            // Intentar con localhost para desarrollo primero
            const localResponse = await fetch('http://localhost:8004/admin/users', {
                headers: {
                    'Content-Type': 'application/json'
                    // No enviamos auth token por ahora para testing
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

    const handleEditUser = (user) => {
        setSelectedUser(user);
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
                const localResponse = await fetch(`http://localhost:8004/admin/users/${userId}`, {
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
                const localResponse = await fetch(`http://localhost:8004/admin/users/${userId}/toggle-status`, {
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
        
        // API call en background (sin blocking UI) - CORREGIDO: usar ruta correcta v2
        try {
            console.log('🔄 Updating user role:', updatedUser.id, 'to:', updatedUser.user_type);
            
            // RUTA CORREGIDA: /admin/assign-role con parámetros query
            const response = await fetch(`https://auth-api.dropux.co/admin/assign-role?user_id=${updatedUser.id}&role_name=${updatedUser.user_type}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                console.log('Production API failed, trying localhost...');
                // Intentar con localhost - RUTA CORREGIDA
                const localResponse = await fetch(`http://localhost:8004/admin/assign-role?user_id=${updatedUser.id}&role_name=${updatedUser.user_type}`, {
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
            // Usuarios sin rol se asignan como 'asesor' por defecto (administrativos)
            return { ...user, user_type: 'asesor', is_verified: false };
        }
        return user;
    };

    const filteredUsers = users.map(getUserWithDefaultRole).filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filtrar por pestaña activa - CORREGIDO: separación correcta de usuarios
        let matchesTab = false;
        if (activeTab === 'administrative') {
            // Administrativos: super_admin, admin, asesor (incluyendo sin rol que se asignan como asesor)
            matchesTab = USER_TYPES.administrative.includes(user.user_type);
        } else if (activeTab === 'system') {
            // Sistema: marketplace, dropshipper, proveedor
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

    const handleDropOnRole = async (e, targetRole) => {
        e.preventDefault();
        if (draggedPage && !rolePermissions[targetRole].includes(draggedPage.id)) {
            const newPermissions = [...(rolePermissions[targetRole] || []), draggedPage.id];
            
            // Actualizar UI inmediatamente
            setRolePermissions(prev => ({
                ...prev,
                [targetRole]: newPermissions
            }));
            
            // Guardar en base de datos
            await saveRolePermissions(targetRole, newPermissions);
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

    const removePageFromRole = async (pageId, role) => {
        console.log(`🗑️ Removing page ${pageId} from role ${role}`);
        const newPermissions = (rolePermissions[role] || []).filter(id => id !== pageId);
        console.log(`📋 New permissions for ${role}:`, newPermissions);
        
        // Actualizar UI inmediatamente
        setRolePermissions(prev => ({
            ...prev,
            [role]: newPermissions
        }));
        
        // Guardar en base de datos
        console.log(`💾 Saving permissions for ${role}...`);
        const result = await saveRolePermissions(role, newPermissions);
        console.log(`✅ Save result:`, result);
    };

    const removePageFromUser = (pageId, userId) => {
        setUserPermissions(prev => ({
            ...prev,
            [userId]: (prev[userId] || []).filter(id => id !== pageId)
        }));
    };

    // Función para guardar todos los cambios pendientes
    const handleSaveChanges = async () => {
        if (!hasUnsavedChanges) return;
        
        setIsSaving(true);
        console.log('💾 Saving all permission changes...');
        
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
            
            console.log(`🔄 Found ${changedRoles.length} roles with changes:`, changedRoles.map(r => r.role));
            
            // Guardar cada rol modificado
            const savePromises = changedRoles.map(({ role, permissions }) => 
                saveRolePermissions(role, permissions)
            );
            
            const results = await Promise.all(savePromises);
            const allSuccess = results.every(result => result !== false);
            
            if (allSuccess) {
                console.log('✅ All changes saved successfully');
                // Actualizar las permissions originales para reflejar el nuevo estado guardado
                setOriginalRolePermissions(JSON.parse(JSON.stringify(rolePermissions)));
                setHasUnsavedChanges(false);
            } else {
                console.error('❌ Some changes failed to save');
                alert('Error: No se pudieron guardar todos los cambios. Revisa la consola para más detalles.');
            }
        } catch (error) {
            console.error('💥 Error saving changes:', error);
            alert('Error: No se pudieron guardar los cambios. Revisa la conexión con la base de datos.');
        } finally {
            setIsSaving(false);
        }
    };

    // Reset filter when changing tabs
    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        setRoleFilter('all');
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
                            {filteredUsers.map(user => (
                                <tr key={user.id} className={!user.is_active ? 'inactive' : ''}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar">
                                                {user.first_name?.[0] || 'U'}{user.last_name?.[0] || 'S'}
                                            </div>
                                            <div className="user-details">
                                                <div className="user-name">
                                                    {user.first_name || 'Sin nombre'} {user.last_name || ''}
                                                </div>
                                                <div className="user-email">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="business-cell">
                                            🌍 {user.country || 'Colombia'}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-badge ${getRoleColor(user.user_type)}`}>
                                            {getRoleLabel(user.user_type)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="date-cell">
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="user-actions">
                                            <button 
                                                className="btn-action edit"
                                                onClick={() => handleEditUser(user)}
                                                title="Editar usuario"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                className={`btn-action ${user.is_active ? 'deactivate' : 'activate'}`}
                                                onClick={() => handleToggleUserStatus(user.id)}
                                                title={user.is_active ? 'Desactivar usuario' : 'Activar usuario'}
                                            >
                                                {user.is_active ? '✅' : '⛔'}
                                            </button>
                                            <button 
                                                className="btn-action delete"
                                                onClick={() => handleDeleteUser(user)}
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
                        
                        {Object.entries(AVAILABLE_PAGES).map(([category, pages]) => (
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
                                    {isSaving ? '💾 Guardando...' : '💾 Guardar Cambios'}
                                </button>
                            )}
                        </div>
                        <div className="roles-grid">
                            {permissionsLoading ? (
                                <div className="permissions-loading">
                                    <div className="spinner"></div>
                                    <p>Cargando permisos...</p>
                                </div>
                            ) : (
                                Object.entries(rolePermissions || DEFAULT_ROLE_PERMISSIONS).map(([role, permissions]) => (
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
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const EditUserModal = ({ user, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        user_type: user.user_type,
        is_active: user.is_active
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

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