import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AUTH_API_URL } from '../../config/api.js';
import { ENDPOINTS } from '../../config/endpoints.js';
import './Roles.css';

// Clasificación de roles por tipo de usuario
const USER_TYPES = {
    administrative: ['super_admin', 'admin', 'asesor'],
    system: ['marketplace', 'dropshipper', 'proveedor']
};

const Roles = () => {
    const { user, refreshUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('administrative');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [toggleLoading, setToggleLoading] = useState(null);
    const [saveStatus, setSaveStatus] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const hasAdminUsersPermission = (
            user?.roles?.includes('super_admin') ||
            user?.role_permissions?.includes('admin-users') ||
            user?.roles?.includes('admin') ||
            user?.permissions?.some(perm => 
                perm.startsWith('admin-users:') || perm.startsWith('sales:')
            )
        );

        if (!hasAdminUsersPermission) {
            return;
        }
        
        fetchUsers();
    }, [user]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const localResponse = await fetch(`${AUTH_API_URL}${ENDPOINTS.ADMIN.USERS}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (localResponse.ok) {
                const localData = await localResponse.json();
                setUsers(localData.users || []);
            } else {
                // Fallback to mock data for development
                setUsers([
                    {
                        id: 1,
                        first_name: 'Jordy',
                        last_name: 'Mora',
                        email: 'jordy@dropux.co',
                        user_type: 'super_admin',
                        is_active: true,
                        is_verified: true,
                        created_at: '2024-01-01'
                    }
                ]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(`${AUTH_API_URL}${ENDPOINTS.ADMIN.USERS}/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setUsers(prev => prev.filter(u => u.id !== userId));
            } else {
                console.warn('API not available, removing from local state only');
                setUsers(prev => prev.filter(u => u.id !== userId));
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            setUsers(prev => prev.filter(u => u.id !== userId));
        }
        
        setShowDeleteModal(false);
        setUserToDelete(null);
    };

    const handleToggleUserStatus = async (userId) => {
        setToggleLoading(userId);
        
        // Cambio inmediato en la UI
        setUsers(prev => prev.map(u => 
            u.id === userId ? { ...u, is_active: !u.is_active } : u
        ));
        
        try {
            const response = await fetch(`${AUTH_API_URL}${ENDPOINTS.ADMIN.USERS}/${userId}/toggle-status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                console.warn('API not available, using local state only');
            }
        } catch (error) {
            console.error('Error toggling user status:', error);
        } finally {
            setToggleLoading(null);
        }
    };

    const handleUpdateUser = async (updatedUser) => {
        setIsSaving(true);
        setSaveStatus('saving');
        
        try {
            // Llamada a la API
            const response = await fetch(`${AUTH_API_URL}/admin/assign-role?user_id=${updatedUser.id}&role_name=${updatedUser.user_type}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                // Actualizar UI solo si la API responde correctamente
                setUsers(prev => prev.map(u => 
                    u.id === updatedUser.id ? { ...updatedUser, is_verified: true } : u
                ));
                setShowEditModal(false);
                setSelectedUser(null);
                setSaveStatus('success');
                setTimeout(() => setSaveStatus(null), 3000);
                console.log('✅ Role updated successfully');
            } else {
                const errorData = await response.text();
                console.error('❌ Failed to update role in database:', errorData);
                setSaveStatus('error');
                setTimeout(() => setSaveStatus(null), 5000);
            }
        } catch (error) {
            console.error('❌ Error updating user role:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 5000);
        } finally {
            setIsSaving(false);
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
        }
        
        // Filtrar por rol específico
        const matchesRole = roleFilter === 'all' || user.user_type === roleFilter;
        
        return matchesSearch && matchesTab && matchesRole;
    });

    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        setRoleFilter('all'); // Reset role filter when changing tabs
    };

    return (
        <div className="admin-users-container">
            <div className="header-section">
                <h2 className="page-title">👥 Gestión de roles</h2>
                <p className="page-subtitle">Administra usuarios administrativos y del sistema</p>
            </div>

            {/* Navegación entre tipos de usuarios */}
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'administrative' ? 'active' : ''}`}
                    onClick={() => handleTabChange('administrative')}
                >
                    👨‍💼 Usuarios Administrativos
                </button>
                <button
                    className={`tab-button ${activeTab === 'system' ? 'active' : ''}`}
                    onClick={() => handleTabChange('system')}
                >
                    🏪 Usuarios del Sistema
                </button>
            </div>

            {/* Controles de filtrado */}
            <div className="controls-section">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="🔍 Buscar usuarios..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-container">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="role-filter"
                    >
                        <option value="all">📋 Todos los roles</option>
                        {activeTab === 'administrative' && (
                            <>
                                <option value="super_admin">🔐 Super Admin</option>
                                <option value="admin">👨‍💼 Administrador</option>
                                <option value="asesor">📞 Asesor</option>
                            </>
                        )}
                        {activeTab === 'system' && (
                            <>
                                <option value="marketplace">🏪 Marketplace</option>
                                <option value="dropshipper">📦 Dropshipper</option>
                                <option value="proveedor">🚚 Proveedor</option>
                            </>
                        )}
                    </select>
                </div>
            </div>

            {/* Tabla de usuarios */}
            <div className="users-section">
                {loading ? (
                    <div className="loading-state">⏳ Cargando usuarios...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="empty-state">
                        <p>No se encontraron usuarios con los filtros aplicados</p>
                    </div>
                ) : (
                    <div className="users-table-container">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Email</th>
                                    <th>País</th>
                                    <th>Rol</th>
                                    <th>Fecha Registro</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="user-row">
                                        <td className="user-name-cell">
                                            <div className="user-avatar">
                                                {user.first_name?.[0]}{user.last_name?.[0]}
                                            </div>
                                            <span className="user-name">
                                                {user.first_name} {user.last_name}
                                            </span>
                                        </td>
                                        <td className="user-email-cell">
                                            {user.email}
                                        </td>
                                        <td className="user-country-cell">
                                            {user.country || 'No especificado'}
                                        </td>
                                        <td className="user-role-cell">
                                            <span className={`role-badge ${getRoleColor(user.user_type)}`}>
                                                {getRoleLabel(user.user_type)}
                                            </span>
                                        </td>
                                        <td className="user-date-cell">
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'No disponible'}
                                        </td>
                                        <td className="actions-cell">
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-action btn-edit"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowEditModal(true);
                                                    }}
                                                    title="Editar usuario"
                                                >
                                                    ✏️
                                                </button>
                                                
                                                <button
                                                    className={`btn-action btn-toggle ${user.is_active ? 'deactivate' : 'activate'}`}
                                                    onClick={() => handleToggleUserStatus(user.id)}
                                                    disabled={toggleLoading === user.id}
                                                    title={user.is_active ? 'Desactivar usuario' : 'Activar usuario'}
                                                >
                                                    {toggleLoading === user.id 
                                                        ? '⏳' 
                                                        : user.is_active ? '🚫' : '✅'
                                                    }
                                                </button>
                                                
                                                {user.user_type !== 'super_admin' && (
                                                    <button
                                                        className="btn-action btn-delete"
                                                        onClick={() => {
                                                            setUserToDelete(user);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        title="Eliminar usuario"
                                                    >
                                                        🗑️
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal de Edición */}
            {showEditModal && selectedUser && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>✏️ Editar Usuario</h3>
                            <button 
                                className="modal-close"
                                onClick={() => setShowEditModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Email:</label>
                                <input 
                                    type="email" 
                                    value={selectedUser.email} 
                                    disabled 
                                    className="form-input disabled"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Nombre:</label>
                                <input 
                                    type="text" 
                                    value={`${selectedUser.first_name} ${selectedUser.last_name}`} 
                                    disabled 
                                    className="form-input disabled"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Rol:</label>
                                <select 
                                    value={selectedUser.user_type || 'asesor'}
                                    onChange={(e) => setSelectedUser(prev => ({
                                        ...prev, 
                                        user_type: e.target.value
                                    }))}
                                    className="form-select"
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
                        </div>
                        
                        <div className="modal-actions">
                            <button 
                                className="btn-cancel"
                                onClick={() => setShowEditModal(false)}
                            >
                                🚫 Cancelar
                            </button>
                            <button 
                                className="btn-save"
                                onClick={() => handleUpdateUser(selectedUser)}
                                disabled={isSaving}
                            >
                                {isSaving ? '⏳ Guardando...' : '💾 Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Eliminación */}
            {showDeleteModal && userToDelete && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>🗑️ Eliminar Usuario</h3>
                        </div>
                        
                        <div className="modal-body">
                            <p>¿Estás seguro de que deseas eliminar a:</p>
                            <div className="user-to-delete">
                                <strong>{userToDelete.first_name} {userToDelete.last_name}</strong>
                                <br />
                                <small>{userToDelete.email}</small>
                            </div>
                            <p><strong>Esta acción no se puede deshacer.</strong></p>
                        </div>
                        
                        <div className="modal-actions">
                            <button 
                                className="btn-cancel"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                ↩️ Cancelar
                            </button>
                            <button 
                                className="btn-delete-confirm"
                                onClick={() => handleDeleteUser(userToDelete.id)}
                            >
                                🗑️ Eliminar Usuario
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notificaciones de estado */}
            {saveStatus === 'success' && (
                <div className="save-status success">✅ Usuario actualizado correctamente</div>
            )}
            {saveStatus === 'error' && (
                <div className="save-status error">❌ Error al actualizar usuario. Verifica tu conexión.</div>
            )}
            {saveStatus === 'saving' && (
                <div className="save-status saving">⏳ Actualizando usuario...</div>
            )}
        </div>
    );
};

export default Roles;