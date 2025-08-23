import React, { useState } from 'react';
import { Search, Plus, Filter, Mail, Phone, MapPin, Calendar, Edit, Trash2, Eye, Users } from 'lucide-react';

const CustomersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data para clientes
  const mockCustomers = [
    {
      id: 1,
      name: 'Carlos Mendoza',
      email: 'carlos.mendoza@email.com',
      phone: '+57 300 123 4567',
      location: 'Bogotá, Colombia',
      totalOrders: 15,
      totalSpent: 2450000,
      lastOrder: '2025-01-20',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Ana Rodriguez',
      email: 'ana.rodriguez@email.com',
      phone: '+51 987 654 321',
      location: 'Lima, Perú',
      totalOrders: 8,
      totalSpent: 890000,
      lastOrder: '2025-01-18',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b86d46b4?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Luis Perez',
      email: 'luis.perez@email.com',
      phone: '+56 9 8765 4321',
      location: 'Santiago, Chile',
      totalOrders: 22,
      totalSpent: 3200000,
      lastOrder: '2025-01-15',
      status: 'inactive',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    }
  ];

  const getStatusColor = (status) => {
    return status === 'active' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="customers-page p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
          <p className="text-gray-600">Gestiona tu base de clientes</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          Nuevo Cliente
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
            <button className="p-2 border rounded-lg hover:bg-gray-50">
              <Filter size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Lista de clientes */}
      <div className="grid gap-4">
        {mockCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              {/* Información del cliente */}
              <div className="flex items-center gap-4">
                <img
                  src={customer.avatar}
                  alt={customer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{customer.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center gap-1">
                      <Mail size={16} />
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone size={16} />
                      {customer.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      {customer.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Estado */}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(customer.status)}`}>
                {customer.status === 'active' ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{customer.totalOrders}</div>
                <div className="text-sm text-gray-500">Órdenes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(customer.totalSpent)}
                </div>
                <div className="text-sm text-gray-500">Total Gastado</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-800">
                  <Calendar size={16} className="inline mr-1" />
                  {customer.lastOrder}
                </div>
                <div className="text-sm text-gray-500">Última Orden</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="text-sm text-gray-500">Acciones</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estado vacío */}
      {mockCustomers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Users size={64} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No hay clientes</h3>
          <p className="text-gray-600 mb-6">Comienza agregando tu primer cliente</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Agregar Cliente
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;