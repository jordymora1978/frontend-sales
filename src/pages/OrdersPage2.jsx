import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Eye, 
  Send, 
  Truck, 
  Calendar, 
  User, 
  Package,
  DollarSign,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  ExternalLink,
  Phone,
  Mail,
  CreditCard,
  Archive
} from 'lucide-react';

const OrdersPage2 = ({ onOpenModal, onSelectOrder }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Enhanced mock data con más detalles profesionales
  const mockOrdersData = [
    {
      id: 'MLC-2025002',
      sku: 'B07XQXZXVZ',
      productTitle: '2 Zapatillas Deportivas Running Nike Air Max Revolution 5',
      productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
      minutesAgo: 45,
      customer: {
        name: 'Carlos Mendoza',
        email: 'carlos.mendoza@email.com',
        phone: '+56 9 8765 4321',
        document: 'RUT 10.509.928-2',
        rating: 4.8,
        totalOrders: 12
      },
      status: {
        main: 'APROBADO',
        shipping: 'ENVIADO',
        payment: 'PAGADO'
      },
      logistics: {
        provider1: 'ANICAM',
        provider2: 'CHILEXPRESS',
        trackingNumber: 'CHX789456123',
        alert: 'PREALERTA',
        estimatedDelivery: '2025-01-25'
      },
      purchase: {
        date: '2025-01-14',
        time: '14:30',
        price: 129.99,
        currency: 'USD',
        paymentMethod: 'Credit Card'
      },
      amazon: {
        available: true,
        stock: 15,
        prime: true
      },
      financial: {
        total: 89990,
        commission: 13485,
        net: 76492,
        profit: 32000,
        margin: 36
      },
      location: {
        country: 'CHILE',
        city: 'Santiago',
        region: 'Metropolitana'
      },
      priority: 'high',
      notes: 'Cliente frecuente, entrega rápida solicitada',
      tags: ['VIP', 'Urgente', 'Nike']
    },
    {
      id: 'MPE-2025003',
      sku: 'B089MXZ790',
      productTitle: 'Cámara Fotográfica Digital Canon EOS Rebel T100 Kit Completo',
      productImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop',
      minutesAgo: 120,
      customer: {
        name: 'Ana Rodriguez',
        email: 'ana.rodriguez@email.com',
        phone: '+51 987 654 321',
        document: 'DNI 42722765',
        rating: 4.5,
        totalOrders: 8
      },
      status: {
        main: 'PROCESANDO',
        shipping: 'PENDIENTE',
        payment: 'VERIFICANDO'
      },
      logistics: {
        provider1: 'ANICAM',
        provider2: 'SERPOST',
        trackingNumber: 'pending',
        alert: 'DOCUMENTOS',
        estimatedDelivery: '2025-01-28'
      },
      purchase: {
        date: '2025-01-13',
        time: '09:15',
        price: 599.99,
        currency: 'USD',
        paymentMethod: 'Bank Transfer'
      },
      amazon: {
        available: true,
        stock: 3,
        prime: false,
        gss: true
      },
      financial: {
        total: 1850.00,
        commission: 277.50,
        net: 1572.50,
        profit: 450.00,
        margin: 24
      },
      location: {
        country: 'PERÚ',
        city: 'Lima',
        region: 'Lima'
      },
      priority: 'medium',
      notes: 'Verificar documentos para importación',
      tags: ['Electrónicos', 'Alto Valor']
    },
    {
      id: 'MCO-2025004',
      sku: 'B0527GQ043',
      productTitle: 'Smart Watch Deportivo con Monitor de Frecuencia Cardiaca',
      productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
      minutesAgo: 180,
      customer: {
        name: 'Luis Perez',
        email: 'luis.perez@email.com',
        phone: '+57 300 123 4567',
        document: 'CC 89.012.345-7',
        rating: 5.0,
        totalOrders: 25
      },
      status: {
        main: 'ENTREGADO',
        shipping: 'ENTREGADO',
        payment: 'PAGADO'
      },
      logistics: {
        provider1: 'ANICAM',
        provider2: 'COORDINADORA',
        trackingNumber: 'COO123789456',
        alert: 'COMPLETADO',
        estimatedDelivery: '2025-01-20',
        deliveredDate: '2025-01-19'
      },
      purchase: {
        date: '2025-01-12',
        time: '16:45',
        price: 249.99,
        currency: 'USD',
        paymentMethod: 'Credit Card'
      },
      amazon: {
        available: true,
        stock: 25,
        prime: true
      },
      financial: {
        total: 950000,
        commission: 142500,
        net: 807500,
        profit: 250000,
        margin: 26
      },
      location: {
        country: 'COLOMBIA',
        city: 'Bogotá',
        region: 'Cundinamarca'
      },
      priority: 'low',
      notes: 'Entrega exitosa - Cliente muy satisfecho',
      tags: ['Completado', 'Cliente VIP', 'Wearables']
    }
  ];

  const getStatusInfo = (status) => {
    const statusMap = {
      'APROBADO': { color: 'text-green-600 bg-green-100 border-green-200', icon: CheckCircle },
      'PROCESANDO': { color: 'text-yellow-600 bg-yellow-100 border-yellow-200', icon: Clock },
      'ENVIADO': { color: 'text-blue-600 bg-blue-100 border-blue-200', icon: Truck },
      'ENTREGADO': { color: 'text-emerald-600 bg-emerald-100 border-emerald-200', icon: CheckCircle },
      'PAGADO': { color: 'text-green-600 bg-green-100 border-green-200', icon: CreditCard },
      'VERIFICANDO': { color: 'text-orange-600 bg-orange-100 border-orange-200', icon: AlertCircle },
      'PENDIENTE': { color: 'text-gray-600 bg-gray-100 border-gray-200', icon: Clock }
    };
    return statusMap[status] || { color: 'text-gray-600 bg-gray-100 border-gray-200', icon: AlertCircle };
  };

  const getPriorityInfo = (priority) => {
    const priorityMap = {
      high: { color: 'border-l-red-500 bg-red-50', badge: 'bg-red-500' },
      medium: { color: 'border-l-yellow-500 bg-yellow-50', badge: 'bg-yellow-500' },
      low: { color: 'border-l-green-500 bg-green-50', badge: 'bg-green-500' }
    };
    return priorityMap[priority] || priorityMap.medium;
  };

  const formatCurrency = (amount, currency = 'COP') => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTimeAgo = (minutes) => {
    if (minutes < 60) return `${minutes}min`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
    return `${Math.floor(minutes / 1440)}d`;
  };

  const getCountryFlag = (country) => {
    const flags = {
      'CHILE': '🇨🇱',
      'PERÚ': '🇵🇪',
      'COLOMBIA': '🇨🇴',
      'ECUADOR': '🇪🇨',
      'MEXICO': '🇲🇽'
    };
    return flags[country] || '🌎';
  };

  const filteredOrders = mockOrdersData.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || order.status.main === filterStatus;
    const matchesCountry = filterCountry === 'all' || order.location.country === filterCountry;
    
    return matchesSearch && matchesStatus && matchesCountry;
  });

  return (
    <div className="orders-page-2 p-6 bg-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Órdenes de Venta</h1>
            <p className="text-gray-600">Gestión profesional de órdenes y seguimiento completo</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-lg border shadow-sm">
              <span className="text-sm text-gray-600">Total Órdenes: </span>
              <span className="font-bold text-blue-600">{filteredOrders.length}</span>
            </div>
            <div className="flex bg-white rounded-lg border overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
              >
                Lista
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por ID, cliente o producto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="APROBADO">Aprobado</option>
              <option value="PROCESANDO">Procesando</option>
              <option value="ENVIADO">Enviado</option>
              <option value="ENTREGADO">Entregado</option>
            </select>
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los países</option>
              <option value="CHILE">🇨🇱 Chile</option>
              <option value="PERÚ">🇵🇪 Perú</option>
              <option value="COLOMBIA">🇨🇴 Colombia</option>
            </select>
            <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={20} className="text-gray-600" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Orders Display */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6' : 'space-y-4'}>
        {filteredOrders.map((order) => {
          const statusInfo = getStatusInfo(order.status.main);
          const priorityInfo = getPriorityInfo(order.priority);
          const StatusIcon = statusInfo.icon;

          return (
            <div 
              key={order.id} 
              className={`bg-white rounded-lg lg:rounded-xl shadow-sm border-l-4 hover:shadow-lg transition-all duration-200 ${priorityInfo.color}`}
            >
              {/* Header Card */}
              <div className="p-4 lg:p-6">
                <div className="flex justify-between items-start mb-3 lg:mb-4">
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="relative">
                      <img 
                        src={order.productImage} 
                        alt={order.productTitle}
                        className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100?text=IMG';
                        }}
                      />
                      <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full ${priorityInfo.badge}`}></div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-base text-gray-800">{order.id}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                          <StatusIcon size={12} className="inline mr-1" />
                          {order.status.main}
                        </span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          <Clock size={12} className="inline mr-1" />
                          {formatTimeAgo(order.minutesAgo)}
                        </span>
                      </div>
                      <p className="text-gray-700 font-medium text-base line-clamp-2">{order.productTitle}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">SKU: {order.sku}</span>
                        {order.tags.map(tag => (
                          <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Country Flag */}
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <span className="text-2xl">{getCountryFlag(order.location.country)}</span>
                      <div className="text-right">
                        <div className="font-bold text-gray-800">{order.location.country}</div>
                        <div className="text-sm text-gray-500">{order.location.city}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {order.customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{order.customer.name}</div>
                        <div className="text-sm text-gray-600">{order.customer.document}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end mb-1">
                        <Star className="text-yellow-400 fill-current" size={14} />
                        <span className="text-sm font-medium">{order.customer.rating}</span>
                      </div>
                      <div className="text-xs text-gray-500">{order.customer.totalOrders} órdenes</div>
                    </div>
                  </div>
                </div>

                {/* Financial & Logistics Info */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="text-green-600" size={16} />
                      <span className="text-sm font-medium text-green-700">Financiero</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-bold">{formatCurrency(order.financial.total)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Ganancia:</span>
                        <span className="font-bold text-green-600">{formatCurrency(order.financial.profit)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Margen:</span>
                        <span className="font-bold">{order.financial.margin}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="text-blue-600" size={16} />
                      <span className="text-sm font-medium text-blue-700">Logística</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Provider:</span>
                        <span className="font-bold">{order.logistics.provider2}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Estado:</span>
                        <span className="font-bold">{order.logistics.alert}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Entrega:</span>
                        <span className="font-bold">{order.logistics.estimatedDelivery}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {order.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="text-yellow-600 mt-0.5" size={14} />
                      <div>
                        <span className="text-sm font-medium text-yellow-700">Notas:</span>
                        <p className="text-sm text-yellow-600 mt-1">{order.notes}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onSelectOrder && onSelectOrder(order);
                        onOpenModal && onOpenModal('messages');
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <MessageSquare size={14} />
                      Mensajes
                    </button>
                    <button
                      onClick={() => {
                        onSelectOrder && onSelectOrder(order);
                        onOpenModal && onOpenModal('logistics');
                      }}
                      className="flex items-center gap-2 px-6 py-3 lg:px-3 lg:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-base lg:text-sm min-h-[44px] lg:min-h-auto"
                    >
                      <Eye size={14} />
                      Ver
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 lg:px-3 lg:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-base lg:text-sm min-h-[44px] lg:min-h-auto">
                      <Send size={14} />
                      Enviar
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} />
                    <span>{order.purchase.date} - {order.purchase.time}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No se encontraron órdenes</h3>
          <p className="text-gray-500">Ajusta los filtros o términos de búsqueda</p>
        </div>
      )}

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <button className="px-6 py-3 lg:px-3 lg:py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 text-base lg:text-sm min-h-[44px] lg:min-h-auto" disabled={currentPage === 1}>
              Anterior
            </button>
            <span className="px-6 py-3 lg:px-4 lg:py-2 bg-blue-100 text-blue-700 rounded-lg font-medium text-base lg:text-sm min-h-[44px] lg:min-h-auto flex items-center">
              Página {currentPage}
            </span>
            <button className="px-6 py-3 lg:px-3 lg:py-2 border rounded-lg hover:bg-gray-50 text-base lg:text-sm min-h-[44px] lg:min-h-auto">
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage2;