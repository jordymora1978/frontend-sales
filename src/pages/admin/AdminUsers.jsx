import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminUsers.css';

const AdminUsers = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        if (!user?.roles?.includes('SUPER_ADMIN')) {
            return;
        }
        fetchUsers();
    }, [user]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('https://auth-api.dropux.co/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setUsers(data.users || []);
            } else {
                console.error('Failed to fetch users');
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
                        roles: ['SUPER_ADMIN'],
                        is_active: true,
                        created_at: '2024-01-15T00:00:00',
                        last_login: '2025-08-28T10:30:00'
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

    const handleToggleUserStatus = async (userId) => {
        try {
            const response = await fetch(`https://auth-api.dropux.co/users/${userId}/toggle-status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                setUsers(prev => prev.map(u => 
                    u.id === userId ? { ...u, is_active: !u.is_active } : u
                ));
            } else {
                console.error('Failed to toggle user status');
            }
        } catch (error) {
            console.error('Error toggling user status:', error);
        }
    };

    const handleUpdateUser = async (updatedUser) => {
        // TODO: API call
        setUsers(prev => prev.map(u => 
            u.id === updatedUser.id ? updatedUser : u
        ));
        setShowEditModal(false);
        setSelectedUser(null);
    };

    const getRoleColor = (roles) => {
        if (roles.includes('SUPER_ADMIN')) return 'role-super-admin';
        if (roles.includes('CLIENT_ADMIN')) return 'role-client-admin';
        return 'role-employee';
    };

    const getRoleLabel = (roles) => {
        if (roles.includes('SUPER_ADMIN')) return 'Super Admin';
        if (roles.includes('CLIENT_ADMIN')) return 'Admin Cliente';
        return 'Empleado';
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = roleFilter === 'all' || user.roles.includes(roleFilter);
        
        return matchesSearch && matchesRole;
    });

    // Verificar permisos
    if (!user?.roles?.includes('SUPER_ADMIN')) {
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
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="CLIENT_ADMIN">Admin Cliente</option>
                    <option value="EMPLOYEE">Empleado</option>
                </select>

                <div className="users-stats">
                    <span>Total: {filteredUsers.length}</span>
                    <span>Activos: {filteredUsers.filter(u => u.is_active).length}</span>
                    <span>Pendientes: {filteredUsers.filter(u => !u.is_active).length}</span>
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
                                <th>Empresa/País</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Fecha Registro</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} className={!user.is_active ? 'inactive' : ''}>
                                    <td>
                                        <div className="user-info">
                                            <div className="user-avatar">
                                                {user.first_name?.[0] || 'U'}{user.last_name?.[0] || 'S'}
                                            </div>
                                            <div className="user-details">
                                                <div className="user-name">
                                                    {user.first_name || 'Sin nombre'} {user.last_name || ''}
                                                </div>
                                                <div className="user-email">{user.email}</div>
                                                {user.phone && <div className="user-phone">📞 {user.phone}</div>}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="business-info">
                                            {user.company && <div className="company">🏢 {user.company}</div>}
                                            <div className="country">🌍 {user.country || 'No especificado'}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-badge ${getRoleColor(user.roles || [])}`}>
                                            {getRoleLabel(user.roles || [])}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                                            {user.is_active ? '✅ Activo' : '⛔ Pendiente'}
                                        </span>
                                    </td>
                                    <td>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
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
                                                title={user.is_active ? 'Desactivar' : 'Aprobar'}
                                            >
                                                {user.is_active ? '⛔' : '✅'}
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
        </div>
    );
};

const EditUserModal = ({ user, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        roles: user.roles,
        active: user.active
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate({ ...user, ...formData });
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
                        <label>Rol</label>
                        <select
                            value={formData.roles[0]}
                            onChange={(e) => setFormData(prev => ({ ...prev, roles: [e.target.value] }))}
                        >
                            <option value="EMPLOYEE">Empleado</option>
                            <option value="CLIENT_ADMIN">Admin Cliente</option>
                            <option value="SUPER_ADMIN">Super Admin</option>
                        </select>
                    </div>
                    
                    <div className="form-group checkbox">
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.active}
                                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                            />
                            Usuario activo
                        </label>
                    </div>
                    
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-primary">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminUsers;