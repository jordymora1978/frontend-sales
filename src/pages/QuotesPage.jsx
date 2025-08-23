import React, { useState } from 'react';
import { Search, Plus, Filter, FileText, Calendar, User, Send, Edit, Eye, Trash2 } from 'lucide-react';

const QuotesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data para cotizaciones
  const mockQuotes = [
    {
      id: 'COT-2025001',
      clientName: 'Carlos Mendoza',
      clientEmail: 'carlos.mendoza@email.com',
      title: 'Cotización Auriculares Bluetooth Premium',
      products: [
        { name: 'Auriculares Bluetooth Premium', quantity: 2, price: 150000 },
        { name: 'Cargador Wireless', quantity: 1, price: 80000 }
      ],
      subtotal: 380000,
      taxes: 72200,
      total: 452200,
      status: 'pending',
      createdDate: '2025-01-20',
      validUntil: '2025-01-27',
      notes: 'Cliente interesado en descuento por volumen'
    },
    {
      id: 'COT-2025002',
      clientName: 'Ana Rodriguez',
      clientEmail: 'ana.rodriguez@email.com',
      title: 'Cotización Cámara Digital Kit',
      products: [
        { name: 'Cámara Digital Canon EOS', quantity: 1, price: 1200000 },
        { name: 'Lente 50mm', quantity: 1, price: 300000 },
        { name: 'Trípode Profesional', quantity: 1, price: 150000 }
      ],
      subtotal: 1650000,
      taxes: 313500,
      total: 1963500,
      status: 'approved',
      createdDate: '2025-01-18',
      validUntil: '2025-01-25',
      notes: 'Cliente requiere entrega en Lima'
    },
    {
      id: 'COT-2025003',
      clientName: 'Luis Perez',
      clientEmail: 'luis.perez@email.com',
      title: 'Cotización Smart Watch Deportivo',
      products: [
        { name: 'Smart Watch Deportivo', quantity: 3, price: 200000 }
      ],
      subtotal: 600000,
      taxes: 114000,
      total: 714000,
      status: 'expired',
      createdDate: '2025-01-10',
      validUntil: '2025-01-17',
      notes: 'Cotización para empresa, solicita factura'
    }
  ];

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { label: 'Pendiente', color: 'text-yellow-600 bg-yellow-100', icon: '⏳' },
      approved: { label: 'Aprobada', color: 'text-green-600 bg-green-100', icon: '✅' },
      expired: { label: 'Vencida', color: 'text-red-600 bg-red-100', icon: '❌' },
      rejected: { label: 'Rechazada', color: 'text-gray-600 bg-gray-100', icon: '🚫' }
    };
    return statusMap[status] || statusMap.pending;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const isExpiringSoon = (validUntil) => {
    const today = new Date();
    const expireDate = new Date(validUntil);
    const diffTime = expireDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  return (
    <div className="quotes-page p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cotizaciones</h1>
          <p className="text-gray-600">Gestiona tus cotizaciones y propuestas</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          Nueva Cotización
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar cotizaciones..."
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
              <option value="pending">Pendientes</option>
              <option value="approved">Aprobadas</option>
              <option value="expired">Vencidas</option>
              <option value="rejected">Rechazadas</option>
            </select>
            <button className="p-2 border rounded-lg hover:bg-gray-50">
              <Filter size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Lista de cotizaciones */}
      <div className="grid gap-6">
        {mockQuotes.map((quote) => {
          const statusInfo = getStatusInfo(quote.status);
          const expiringSoon = isExpiringSoon(quote.validUntil);
          
          return (
            <div key={quote.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              {/* Header de la cotización */}
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{quote.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        {statusInfo.icon} {statusInfo.label}
                      </span>
                      {expiringSoon && quote.status === 'pending' && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded text-xs font-medium">
                          ⚠️ Vence Pronto
                        </span>
                      )}
                    </div>
                    <h4 className="font-medium text-gray-700 mb-1">{quote.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User size={16} />
                        {quote.clientName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        Creada: {quote.createdDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        Válida hasta: {quote.validUntil}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(quote.total)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Subtotal: {formatCurrency(quote.subtotal)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Productos */}
              <div className="p-6 bg-gray-50">
                <h5 className="font-medium text-gray-700 mb-3">Productos cotizados:</h5>
                <div className="space-y-2">
                  {quote.products.map((product, index) => (
                    <div key={index} className="flex justify-between items-center py-2 px-3 bg-white rounded border">
                      <div className="flex-1">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-gray-500 ml-2">x{product.quantity}</span>
                      </div>
                      <div className="font-medium text-gray-800">
                        {formatCurrency(product.price * product.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer con notas y acciones */}
              <div className="p-6 border-t">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    {quote.notes && (
                      <div className="text-sm text-gray-600">
                        <FileText size={16} className="inline mr-1" />
                        <strong>Notas:</strong> {quote.notes}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                      <Send size={18} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Estado vacío */}
      {mockQuotes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FileText size={64} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No hay cotizaciones</h3>
          <p className="text-gray-600 mb-6">Comienza creando tu primera cotización</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Crear Cotización
          </button>
        </div>
      )}
    </div>
  );
};

export default QuotesPage;