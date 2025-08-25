import React, { useState, useEffect } from 'react';
import { 
  Plus,
  Search,
  Filter,
  MoreVertical,
  X,
  Eye,
  Edit2,
  Copy,
  Download,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  DollarSign,
  User,
  Building,
  Hash,
  RefreshCw,
  ArrowUpDown,
  ChevronDown,
  Upload,
  Settings,
  TrendingUp,
  Percent,
  Timer,
  Mail,
  ShoppingCart,
  Target,
  Zap,
  Bell,
  MessageSquare,
  BarChart3,
  Filter as FilterIcon,
  Truck,
  Package,
  MapPin,
  Star,
  ExternalLink,
  Phone,
  CreditCard,
  Archive
} from 'lucide-react';

const OrdersPage2_0 = ({ onOpenModal, onSelectOrder }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState(new Set());

  // Estados de órdenes
  const orderStatuses = {
    aprobado: { label: 'Aprobado', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
    procesando: { label: 'Procesando', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    enviado: { label: 'Enviado', color: 'bg-blue-100 text-blue-800', icon: Truck },
    entregado: { label: 'Entregado', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2 },
    cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: XCircle },
    pendiente: { label: 'Pendiente', color: 'bg-gray-100 text-gray-800', icon: Clock }
  };

  // Enhanced mock data con estructura de órdenes
  useEffect(() => {
    const mockOrdersData = [
      {
        id: 'MLC-2025002',
        number: 'ORD-2025002',
        sku: 'B07XQXZXVZ',
        productTitle: '2 Zapatillas Deportivas Running Nike Air Max Revolution 5',
        productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
        customer: {
          name: 'Carlos Mendoza',
          email: 'carlos.mendoza@email.com',
          phone: '+56 9 8765 4321',
          document: 'RUT 10.509.928-2',
          rating: 4.8,
          totalOrders: 12,
          avatar: '/api/placeholder/32/32',
          industry: 'Particular',
          conversionRate: 85,
          avgResponseTime: 2.3
        },
        amount: 129990,
        currency: 'COP',
        status: 'aprobado',
        createdDate: '2025-01-14',
        lastActivity: '2025-01-22',
        validUntil: '2025-02-14',
        items: 2,
        minutesAgo: 45,
        orderStatus: {
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
          total: 129990,
          commission: 19485,
          net: 110492,
          profit: 32000,
          margin: 25
        },
        location: {
          country: 'CHILE',
          city: 'Santiago',
          region: 'Metropolitana'
        },
        priority: 'high',
        notes: 'Cliente frecuente, entrega rápida solicitada',
        tags: ['VIP', 'Urgente', 'Nike'],
        salesRep: 'Ana María López',
        probability: 95,
        timeline: [
          { date: '2025-01-14', action: 'Orden creada', user: 'Ana López' },
          { date: '2025-01-15', action: 'Pago confirmado', user: 'Sistema' },
          { date: '2025-01-16', action: 'Enviado', user: 'LogísticaBot' }
        ]
      },
      {
        id: 'MPE-2025003',
        number: 'ORD-2025003',
        sku: 'B089MXZ790',
        productTitle: 'Cámara Fotográfica Digital Canon EOS Rebel T100 Kit Completo',
        productImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop',
        customer: {
          name: 'Ana Rodriguez',
          email: 'ana.rodriguez@email.com',
          phone: '+51 987 654 321',
          document: 'DNI 42722765',
          rating: 4.5,
          totalOrders: 8,
          avatar: '/api/placeholder/32/32',
          industry: 'Fotografía',
          conversionRate: 92,
          avgResponseTime: 1.8
        },
        amount: 1850000,
        currency: 'COP',
        status: 'procesando',
        createdDate: '2025-01-13',
        lastActivity: '2025-01-23',
        validUntil: '2025-02-13',
        items: 5,
        minutesAgo: 120,
        orderStatus: {
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
          total: 1850000,
          commission: 277500,
          net: 1572500,
          profit: 450000,
          margin: 24
        },
        location: {
          country: 'PERÚ',
          city: 'Lima',
          region: 'Lima'
        },
        priority: 'medium',
        notes: 'Verificar documentos para importación',
        tags: ['Electrónicos', 'Alto Valor'],
        salesRep: 'Carlos Mendoza',
        probability: 80,
        timeline: [
          { date: '2025-01-13', action: 'Orden creada', user: 'Carlos Mendoza' },
          { date: '2025-01-14', action: 'Esperando verificación', user: 'Sistema' }
        ]
      },
      {
        id: 'MCO-2025004',
        number: 'ORD-2025004',
        sku: 'B0527GQ043',
        productTitle: 'Smart Watch Deportivo con Monitor de Frecuencia Cardiaca',
        productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
        customer: {
          name: 'Luis Perez',
          email: 'luis.perez@email.com',
          phone: '+57 300 123 4567',
          document: 'CC 89.012.345-7',
          rating: 5.0,
          totalOrders: 25,
          avatar: '/api/placeholder/32/32',
          industry: 'Tecnología',
          conversionRate: 95,
          avgResponseTime: 1.2
        },
        amount: 950000,
        currency: 'COP',
        status: 'entregado',
        createdDate: '2025-01-12',
        lastActivity: '2025-01-19',
        validUntil: '2025-02-12',
        items: 3,
        minutesAgo: 180,
        orderStatus: {
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
        tags: ['Completado', 'Cliente VIP', 'Wearables'],
        salesRep: 'Miguel Santos',
        probability: 100,
        timeline: [
          { date: '2025-01-12', action: 'Orden creada', user: 'Miguel Santos' },
          { date: '2025-01-13', action: 'Pago confirmado', user: 'Sistema' },
          { date: '2025-01-19', action: 'Entregado exitosamente', user: 'CourierBot' }
        ]
      }
    ];

    setTimeout(() => {
      setOrders(mockOrdersData);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrar y ordenar órdenes
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.number.includes(searchTerm) ||
        order.id.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesCountry = countryFilter === 'all' || order.location.country === countryFilter;
      
      return matchesSearch && matchesStatus && matchesCountry;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdDate);
          bValue = new Date(b.createdDate);
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'customer':
          aValue = a.customer.name.toLowerCase();
          bValue = b.customer.name.toLowerCase();
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Formatear tiempo transcurrido
  const formatTimeAgo = (minutes) => {
    if (minutes < 60) return `${minutes}min`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
    return `${Math.floor(minutes / 1440)}d`;
  };

  // Obtener bandera del país
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

  // Manejar selección múltiple
  const handleSelectOrder = (orderId) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map(o => o.id)));
    }
  };

  // Acciones de orden
  const handleOrderAction = (action, orderId) => {
    console.log(`Acción ${action} en orden ${orderId}`);
    if (action === 'messages' && onOpenModal && onSelectOrder) {
      const order = orders.find(o => o.id === orderId);
      onSelectOrder(order);
      onOpenModal('messages');
    }
    if (action === 'logistics' && onOpenModal && onSelectOrder) {
      const order = orders.find(o => o.id === orderId);
      onSelectOrder(order);
      onOpenModal('logistics');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-[10px] ml-[12px] mr-[12px]">

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex space-x-4">
          {/* Barra de búsqueda - 50% */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por ID, cliente, producto o número..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Botón de filtros avanzados - 50% */}
          <div className="flex-1 relative">
            <button
              className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <FilterIcon size={18} className="text-gray-600" />
              <span className="text-gray-700">Filtros</span>
            </button>

            {/* Dropdown de filtros avanzados */}
            {showAdvancedFilters && (
              <>
                {/* Overlay */}
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowAdvancedFilters(false)}
                />
                
                {/* Modal de filtros */}
                <div className="absolute top-full mt-2 right-0 left-0 bg-white border border-gray-300 rounded-lg shadow-lg z-20 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Filtros Avanzados</h3>
                    <button
                      onClick={() => setShowAdvancedFilters(false)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <X size={16} className="text-gray-400" />
                    </button>
                  </div>
                  
                  {/* Contenido de filtros - placeholder para futuro */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estados
                      </label>
                      <div className="text-sm text-gray-500">
                        (Configuración pendiente)
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Países
                      </label>
                      <div className="text-sm text-gray-500">
                        (Configuración pendiente)
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rango de fechas
                      </label>
                      <div className="text-sm text-gray-500">
                        (Configuración pendiente)
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monto
                      </label>
                      <div className="text-sm text-gray-500">
                        (Configuración pendiente)
                      </div>
                    </div>
                  </div>
                  
                  {/* Botones de acción */}
                  <div className="flex justify-between mt-6 pt-4 border-t">
                    <button className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm">
                      Limpiar filtros
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                      Aplicar
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Métricas Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Órdenes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Órdenes</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15% vs mes anterior
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Valor Total */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(orders.reduce((sum, o) => sum + o.amount, 0))}
                </p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Target className="h-3 w-3 mr-1" />
                  {orders.filter(o => o.status === 'entregado').length} completadas
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Órdenes Entregadas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tasa Entrega</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((orders.filter(o => o.status === 'entregado').length / orders.length) * 100)}%
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  {orders.filter(o => o.status === 'entregado').length} entregadas
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tiempo Promedio Procesamiento */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Timer className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tiempo Procesamiento</p>
                <p className="text-2xl font-bold text-gray-900">3.2 días</p>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  Promedio histórico
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header de selección con botones de acción */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0}
              onChange={handleSelectAll}
            />
            <span className="ml-2 text-sm text-gray-600">
              {selectedOrders.size > 0 ? `${selectedOrders.size} seleccionadas` : 'Seleccionar todas'}
            </span>
          </label>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button 
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              onClick={() => handleOrderAction('new')}
            >
              <Plus size={20} className="mr-2" />
              Nueva Orden
            </button>
            
            <button 
              className="inline-flex items-center px-3 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-colors"
              onClick={() => handleOrderAction('import')}
            >
              <Download size={18} className="mr-2" />
              Importar
            </button>
            
            <button 
              className="inline-flex items-center px-3 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-colors"
              disabled={selectedOrders.size === 0}
              onClick={() => handleOrderAction('export-selected')}
            >
              <Download size={18} className="mr-2" />
              Exportar ({selectedOrders.size})
            </button>
          </div>
        </div>
      </div>

      {/* Grid de órdenes en tarjetas - Estructura de Cotizaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOrders.map((order) => {
          const StatusIcon = orderStatuses[order.status].icon;
          
          const getPriorityColor = (priority) => {
            switch (priority) {
              case 'high': return 'border-l-4 border-red-500';
              case 'medium': return 'border-l-4 border-yellow-500';
              case 'low': return 'border-l-4 border-green-500';
              default: return 'border-l-4 border-blue-500';
            }
          };
          
          return (
            <div 
              key={order.id} 
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-lg transition-all duration-200 ${getPriorityColor(order.priority)}`}
            >
              {/* Header de la tarjeta */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <img 
                      src={order.productImage} 
                      alt={order.productTitle}
                      className="w-12 h-12 object-cover rounded-lg border-2 border-gray-200"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100?text=IMG';
                      }}
                    />
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                      order.priority === 'high' ? 'bg-red-500' : 
                      order.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
                        {order.productTitle}
                      </h3>
                      {order.amazon.prime && (
                        <Zap className="h-4 w-4 text-yellow-500" title="Amazon Prime" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 flex items-center">
                      <Hash className="h-3 w-3 mr-1" />
                      {order.id} • SKU: {order.sku}
                    </p>
                  </div>
                </div>
                
                {/* País y checkbox */}
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-xl">{getCountryFlag(order.location.country)}</div>
                    <div className="text-xs text-gray-500">{order.location.city}</div>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedOrders.has(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                    />
                  </label>
                </div>
              </div>

              {/* Estado y tiempo */}
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${orderStatuses[order.status].color}`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {orderStatuses[order.status].label}
                </span>
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{formatTimeAgo(order.minutesAgo)}</span>
                  {order.tags.slice(0, 1).map((tag, index) => (
                    <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cliente con avatar y métricas */}
              <div className="mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {order.customer.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {order.customer.name}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-gray-600">
                      <span>{order.customer.document}</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 mr-1" />
                        <span>{order.customer.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded mr-2">{order.customer.totalOrders} órdenes</span>
                  Industria: {order.customer.industry}
                </div>
              </div>

              {/* Financial y Logistics Info */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="text-green-600" size={14} />
                    <span className="text-xs font-medium text-green-700">Financiero</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-bold">{formatCurrency(order.amount)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Ganancia:</span>
                      <span className="font-bold text-green-600">{formatCurrency(order.financial.profit)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Margen:</span>
                      <span className="font-bold">{order.financial.margin}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="text-blue-600" size={14} />
                    <span className="text-xs font-medium text-blue-700">Logística</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Provider:</span>
                      <span className="font-bold">{order.logistics.provider2}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Estado:</span>
                      <span className="font-bold">{order.logistics.alert}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Entrega:</span>
                      <span className="font-bold">{order.logistics.estimatedDelivery}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fechas */}
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>Creada</span>
                    </div>
                    <p className="font-medium text-gray-900 mt-0.5">
                      {formatDate(order.createdDate)}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <User className="h-3 w-3" />
                      <span>Vendedor</span>
                    </div>
                    <p className="font-medium text-gray-900 mt-0.5">
                      {order.salesRep}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notas */}
              {order.notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="text-yellow-600 mt-0.5" size={14} />
                    <div>
                      <span className="text-xs font-medium text-yellow-700">Notas:</span>
                      <p className="text-xs text-yellow-600 mt-1">{order.notes}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Acciones profesionales */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-1">
                  <button
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    onClick={() => handleOrderAction('view', order.id)}
                    title="Ver detalle"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  <button
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                    onClick={() => handleOrderAction('messages', order.id)}
                    title="Mensajes"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                  
                  <button
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                    onClick={() => handleOrderAction('logistics', order.id)}
                    title="Logística"
                  >
                    <Truck className="h-4 w-4" />
                  </button>

                  <button
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    onClick={() => handleOrderAction('send-email', order.id)}
                    title="Enviar email"
                  >
                    <Mail className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    onClick={() => handleOrderAction('download', order.id)}
                    title="Descargar PDF"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  
                  <div className="relative group">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Estado vacío */}
      {filteredOrders.length === 0 && (
        <div className="col-span-full">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No se encontraron órdenes
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Ajusta tus filtros para ver más resultados'
                : 'Comienza creando tu primera orden'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <div className="mt-6">
                <button
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  onClick={() => handleOrderAction('new')}
                >
                  <Plus size={20} className="mr-2" />
                  Nueva Orden
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage2_0;