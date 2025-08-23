import React, { useState } from 'react';
import { User, Package, Truck, Eye, MessageSquare, ExternalLink, Sun, Moon, ShoppingCart, Users, Settings, BarChart3, X, Send, HelpCircle, MapPin, FileText, Edit3, Save, Store, Plus, CheckCircle, Globe, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SalesDashboard = () => {
  const { user, logout } = useAuth();

  // Dashboard states  
  const [theme, setTheme] = useState('light');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  // const [currentPage, setCurrentPage] = useState(1); // Comentado temporalmente
  const [activeTab, setActiveTab] = useState('orders');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalTab, setModalTab] = useState('messages');
  const [messageInput, setMessageInput] = useState('');
  const [isEditingPublication, setIsEditingPublication] = useState(false);
  // const [publicationData, setPublicationData] = useState({}); // Comentado temporalmente
  
  // ML Stores states
  const [mlStores] = useState([]);

  const handleLogout = () => {
    logout();
  };

  // Datos de ejemplo para el dashboard
  const mockOrders = [
    {
      id: 'MCO-2025001',
      marketplaceBadge: 'colombia',
      productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop',
      sku: 'B08NP2DYQR',
      productTitle: 'Auriculares Bluetooth Inalámbricos con Cancelación de Ruido Premium',
      mercadoLibreLink: 'https://articulo.mercadolibre.com.co/MCO-123456789-auriculares-bluetooth-inalambricos-cancelacion-ruido-premium',
      status: 'pending',
      shippingStatus: 'processing',
      customerName: 'María González',
      customerDocument: 'CC 9012051577',
      price: 189500,
      commission: 28425,
      netAmount: 161075,
      amazonDate: '2025-01-15',
      amazonPrice: 89.99,
      amazonLink: 'https://amazon.com/dp/B08NP2DYQR',
      amazonGSS: true,
      minutesAgo: 15,
      quantity: 1,
      dateCreated: '2025-01-15 14:30:00'
    },
    {
      id: 'MLC-2025002',
      marketplaceBadge: 'chile',
      productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop',
      sku: 'B07XQXZXVZ',
      productTitle: 'Zapatillas Deportivas Running Nike Air Max Revolution 5',
      mercadoLibreLink: 'https://articulo.mercadolibre.cl/MLC-987654321-zapatillas-deportivas-running-nike-air-max-revolution-5',
      status: 'approved',
      shippingStatus: 'shipped',
      customerName: 'Carlos Mendoza',
      customerDocument: 'RUT 105099282',
      customerPhone: '+56 9 8765 4321',
      customerEmail: 'carlos.mendoza@email.com',
      price: 89990,
      commission: 13498,
      netAmount: 76492,
      amazonDate: '2025-01-14',
      amazonPrice: 129.99,
      amazonLink: 'https://amazon.com/dp/B07XQXZXVZ',
      amazonGSS: false,
      minutesAgo: 45,
      quantity: 1,
      dateCreated: '2025-01-15 13:45:00'
    },
    {
      id: 'MPE-2025003',
      marketplaceBadge: 'peru',
      productImage: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=80&h=80&fit=crop',
      sku: 'B09KMVXT7W',
      productTitle: 'Cámara Fotográfica Digital Canon EOS Rebel T100 Kit Completo',
      mercadoLibreLink: 'https://articulo.mercadolibre.com.pe/MPE-555666777-camara-fotografica-digital-canon-eos-rebel-t100-kit-completo',
      status: 'processing',
      shippingStatus: 'pending',
      customerName: 'Ana Rodríguez',
      customerDocument: 'DNI 42722765',
      customerPhone: '+51 987 654 321',
      customerEmail: 'ana.rodriguez@email.com',
      price: 1850,
      commission: 277.5,
      netAmount: 1572.5,
      amazonDate: '2025-01-13',
      amazonPrice: 599.99,
      amazonLink: 'https://amazon.com/dp/B09KMVXT7W',
      amazonGSS: true,
      minutesAgo: 120,
      quantity: 1,
      dateCreated: '2025-01-15 12:30:00'
    },
    {
      id: 'MCO-2025004',
      marketplaceBadge: 'colombia',
      productImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop',
      sku: 'B08Z7GQXM2',
      productTitle: 'Smart Watch Deportivo con Monitor de Frecuencia Cardíaca',
      mercadoLibreLink: 'https://articulo.mercadolibre.com.co/MCO-444555666-smart-watch-deportivo-monitor-frecuencia-cardiaca',
      status: 'shipped',
      shippingStatus: 'shipped',
      customerName: 'Luis Pérez',
      customerDocument: 'CC 8901234567',
      customerPhone: '+57 301 987 6543',
      customerEmail: 'luis.perez@email.com',
      price: 125000,
      commission: 18750,
      netAmount: 106250,
      amazonDate: '2025-01-12',
      amazonPrice: 59.99,
      amazonLink: 'https://amazon.com/dp/B08Z7GQXM2',
      amazonGSS: true,
      minutesAgo: 180,
      quantity: 2,
      dateCreated: '2025-01-15 11:30:00'
    }
  ];

  // Datos de ejemplo para el modal
  const mockMessages = {
    'MCO-2025001': [
      { id: 1, sender: 'customer', text: 'Hola, ¿cuando llegará mi pedido?', time: '10:30 AM', date: '2025-01-15' },
      { id: 2, sender: 'seller', text: 'Buenos días! Su pedido fue despachado hoy y llegará en 3-5 días hábiles.', time: '10:45 AM', date: '2025-01-15' },
      { id: 3, sender: 'customer', text: '¿Puedo rastrear el envío?', time: '11:00 AM', date: '2025-01-15' },
      { id: 4, sender: 'seller', text: 'Por supuesto! Le comparto el número de guía: ANI-CO-789456123', time: '11:15 AM', date: '2025-01-15' },
      { id: 5, sender: 'customer', text: 'Perfecto, muchas gracias!', time: '11:20 AM', date: '2025-01-15' }
    ],
    'MLC-2025002': [
      { id: 1, sender: 'customer', text: '¿El producto es original?', time: '09:00 AM', date: '2025-01-14' },
      { id: 2, sender: 'seller', text: 'Sí, todos nuestros productos son 100% originales con garantía.', time: '09:30 AM', date: '2025-01-14' },
      { id: 3, sender: 'customer', text: 'Excelente, ya realicé el pago', time: '10:00 AM', date: '2025-01-14' }
    ]
  };

  const mockQuestions = {
    'MCO-2025001': [
      { id: 1, question: '¿El producto incluye garantía?', answer: 'Sí, incluye garantía de 12 meses.', time: '2 días atrás', answered: true },
      { id: 2, question: '¿Es compatible con iPhone?', answer: 'Sí, es compatible con iPhone y Android.', time: '3 días atrás', answered: true },
      { id: 3, question: '¿Viene con estuche de carga?', answer: 'Pendiente de respuesta...', time: '5 horas atrás', answered: false }
    ],
    'MLC-2025002': [
      { id: 1, question: '¿Qué tallas tienen disponibles?', answer: 'Disponible en tallas 38-44.', time: '1 día atrás', answered: true },
      { id: 2, question: '¿El color es igual a la foto?', answer: 'Sí, los colores son exactos a las fotos.', time: '2 días atrás', answered: true }
    ]
  };

  const mockLogistics = {
    'MCO-2025001': {
      provider: 'ANICAM',
      tracking: 'ANI-CO-789456123',
      status: 'En tránsito',
      steps: [
        { status: 'Orden recibida', date: '2025-01-15 08:00', completed: true, location: 'Bogotá, Colombia' },
        { status: 'En centro de distribución', date: '2025-01-15 12:00', completed: true, location: 'Bogotá, Colombia' },
        { status: 'En camino', date: '2025-01-16 08:00', completed: true, location: 'Medellín, Colombia' },
        { status: 'En reparto', date: '2025-01-17 10:00', completed: false, location: 'Medellín, Colombia' },
        { status: 'Entregado', date: 'Estimado: 2025-01-18', completed: false, location: 'Destino final' }
      ]
    },
    'MLC-2025002': {
      provider: 'CHILEXPRESS',
      tracking: 'CHX-CL-456789321',
      status: 'Entregado',
      steps: [
        { status: 'Orden recibida', date: '2025-01-13 09:00', completed: true, location: 'Santiago, Chile' },
        { status: 'Procesado en bodega', date: '2025-01-13 14:00', completed: true, location: 'Santiago, Chile' },
        { status: 'En tránsito', date: '2025-01-14 08:00', completed: true, location: 'Valparaíso, Chile' },
        { status: 'En oficina de destino', date: '2025-01-14 16:00', completed: true, location: 'Valparaíso, Chile' },
        { status: 'Entregado', date: '2025-01-15 11:30', completed: true, location: 'Valparaíso, Chile' }
      ]
    },
    'MLM-2025003': {
      provider: 'ANICAM',
      tracking: 'ANI-PE-321654987',
      status: 'Procesando',
      steps: [
        { status: 'Orden recibida', date: '2025-01-15 10:00', completed: true, location: 'Lima, Perú' },
        { status: 'En preparación', date: '2025-01-15 14:00', completed: false, location: 'Lima, Perú' },
        { status: 'Listo para envío', date: 'Pendiente', completed: false, location: 'Lima, Perú' },
        { status: 'En tránsito', date: 'Pendiente', completed: false, location: '' },
        { status: 'Entregado', date: 'Pendiente', completed: false, location: '' }
      ]
    }
  };

  // Datos de ejemplo para publicaciones
  const mockPublications = {
    'MCO-2025001': {
      nombre: 'Auriculares Bluetooth Inalámbricos con Cancelación de Ruido Premium',
      precio: 189500,
      moneda: 'COP',
      tipoPublicacion: 'Premium',
      diasEntrega: '3-5 días hábiles',
      categoria: 'Electrónicos > Audio > Auriculares',
      estado: 'Activa',
      stock: 25,
      descripcion: 'Auriculares inalámbricos de alta calidad con tecnología de cancelación de ruido activa. Batería de larga duración hasta 30 horas. Sonido Hi-Fi con drivers de 40mm. Compatibles con iOS y Android.',
      plantilla: 'ELECTRONICA_PREMIUM'
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Logo y título */}
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Dashboard</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Gestión de ventas MercadoLibre</p>
                </div>
              </div>

              {/* User info y acciones */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Cambiar tema"
                >
                  {theme === 'light' ? (
                    <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  )}
                </button>

                <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                  <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.email || 'Usuario'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.role || 'user'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Órdenes Hoy</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Clientes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <Package className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Productos</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">89</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900">
                  <BarChart3 className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ingresos</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">$12.4K</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs y filtros */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'orders'
                        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Órdenes
                  </button>
                  <button
                    onClick={() => setActiveTab('ml-stores')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'ml-stores'
                        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Tiendas ML
                  </button>
                </div>

                {/* Filtros y búsqueda */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setActiveFilter('all')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeFilter === 'all'
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Todas
                    </button>
                    <button
                      onClick={() => setActiveFilter('pending')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeFilter === 'pending'
                          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Pendientes
                    </button>
                    <button
                      onClick={() => setActiveFilter('processing')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeFilter === 'processing'
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Procesando
                    </button>
                    <button
                      onClick={() => setActiveFilter('shipped')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeFilter === 'shipped'
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Enviadas
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar órdenes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-64 pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido de tabs */}
            <div className="p-6">
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow bg-gray-50 dark:bg-gray-700"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex items-start space-x-4">
                          <img
                            src={order.productImage}
                            alt={order.productTitle}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                                  {order.productTitle}
                                </h3>
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    ID: {order.id}
                                  </span>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    SKU: {order.sku}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  Cliente: {order.customerName}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  Documento: {order.customerDocument}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <span
                                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                                    order.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                      : order.status === 'approved'
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                      : order.status === 'processing'
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                                  }`}
                                >
                                  {order.status === 'pending' && 'Pendiente'}
                                  {order.status === 'approved' && 'Aprobada'}
                                  {order.status === 'processing' && 'Procesando'}
                                  {order.status === 'shipped' && 'Enviada'}
                                </span>
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                  order.marketplaceBadge === 'colombia'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                    : order.marketplaceBadge === 'chile'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                    : order.marketplaceBadge === 'peru'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                                }`}>
                                  <Globe className="w-3 h-3 mr-1" />
                                  {order.marketplaceBadge.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              ${order.price.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Comisión: ${order.commission.toLocaleString()}
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                              Neto: ${order.netAmount.toLocaleString()}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowMessageModal(true);
                                setModalTab('messages');
                              }}
                              className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors flex items-center"
                            >
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Mensajes
                            </button>
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowMessageModal(true);
                                setModalTab('logistics');
                              }}
                              className="px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors flex items-center"
                            >
                              <Truck className="w-4 h-4 mr-1" />
                              Logística
                            </button>
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowMessageModal(true);
                                setModalTab('publication');
                              }}
                              className="px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-lg transition-colors flex items-center"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Ver Publicación
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'ml-stores' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Tiendas MercadoLibre Conectadas
                    </h3>
                    <button
                      onClick={() => setShowConnectML(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Conectar Tienda
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mlStores.length === 0 ? (
                      <div className="col-span-full text-center py-12">
                        <Store className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                          No hay tiendas conectadas
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Conecta tu primera tienda de MercadoLibre para comenzar
                        </p>
                      </div>
                    ) : (
                      mlStores.map((store) => (
                        <div
                          key={store.id}
                          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                                <Store className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  {store.nickname}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  ID: {store.ml_user_id}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                  store.active
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                }`}
                              >
                                {store.active ? 'Activa' : 'Inactiva'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                            <p><span className="font-medium">País:</span> {store.site_id}</p>
                            <p><span className="font-medium">Conectada:</span> {new Date(store.created_at).toLocaleDateString()}</p>
                          </div>

                          <div className="flex justify-between items-center">
                            <button
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm flex items-center"
                            >
                              <RefreshCw className="w-4 h-4 mr-1" />
                              Sincronizar
                            </button>
                            <button
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium text-sm"
                            >
                              Desconectar
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Modal de detalles de orden */}
        {showMessageModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Orden {selectedOrder.id}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedOrder.productTitle}
                  </p>
                </div>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setModalTab('messages')}
                  className={`px-6 py-3 text-sm font-medium transition-colors flex items-center ${
                    modalTab === 'messages'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Mensajes
                </button>
                <button
                  onClick={() => setModalTab('questions')}
                  className={`px-6 py-3 text-sm font-medium transition-colors flex items-center ${
                    modalTab === 'questions'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Preguntas
                </button>
                <button
                  onClick={() => setModalTab('logistics')}
                  className={`px-6 py-3 text-sm font-medium transition-colors flex items-center ${
                    modalTab === 'logistics'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Logística
                </button>
                <button
                  onClick={() => setModalTab('publication')}
                  className={`px-6 py-3 text-sm font-medium transition-colors flex items-center ${
                    modalTab === 'publication'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Publicación
                </button>
                <button
                  onClick={() => setModalTab('techspecs')}
                  className={`px-6 py-3 text-sm font-medium transition-colors flex items-center ${
                    modalTab === 'techspecs'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Especificaciones
                </button>
              </div>

              <div className="p-6 max-h-96 overflow-y-auto">
                {modalTab === 'messages' && (
                  <div className="space-y-4">
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {(mockMessages[selectedOrder.id] || []).map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender === 'seller' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.sender === 'seller'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p className="text-xs mt-1 opacity-75">
                              {message.time} - {message.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Escribir mensaje..."
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {modalTab === 'questions' && (
                  <div className="space-y-4">
                    {(mockQuestions[selectedOrder.id] || []).map((question) => (
                      <div
                        key={question.id}
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {question.question}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              question.answered
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            }`}
                          >
                            {question.answered ? 'Respondida' : 'Pendiente'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {question.answer}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {question.time}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {modalTab === 'logistics' && (
                  <div className="space-y-6">
                    {mockLogistics[selectedOrder.id] && (
                      <>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                Estado del Envío
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Proveedor: {mockLogistics[selectedOrder.id].provider}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Guía: {mockLogistics[selectedOrder.id].tracking}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 text-sm font-medium rounded-full ${
                                mockLogistics[selectedOrder.id].status === 'Entregado'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                  : mockLogistics[selectedOrder.id].status === 'En tránsito'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                              }`}
                            >
                              {mockLogistics[selectedOrder.id].status}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {mockLogistics[selectedOrder.id].steps.map((step, index) => (
                            <div key={index} className="flex items-center space-x-4">
                              <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                                step.completed
                                  ? 'bg-green-500'
                                  : 'bg-gray-300 dark:bg-gray-600'
                              }`}>
                                {step.completed && (
                                  <CheckCircle className="w-4 h-4 text-white" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className={`font-medium ${
                                  step.completed
                                    ? 'text-gray-900 dark:text-white'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                  {step.status}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {step.date}
                                </p>
                                {step.location && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    <MapPin className="w-3 h-3 inline mr-1" />
                                    {step.location}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {modalTab === 'publication' && (
                  <div className="space-y-6">
                    {mockPublications[selectedOrder.id] && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Datos de la Publicación
                          </h4>
                          <button
                            onClick={() => setIsEditingPublication(!isEditingPublication)}
                            className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                          >
                            {isEditingPublication ? (
                              <Save className="w-4 h-4 mr-1" />
                            ) : (
                              <Edit3 className="w-4 h-4 mr-1" />
                            )}
                            {isEditingPublication ? 'Guardar' : 'Editar'}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Nombre del Producto
                            </label>
                            {isEditingPublication ? (
                              <input
                                type="text"
                                defaultValue={mockPublications[selectedOrder.id].nombre}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                            ) : (
                              <p className="text-gray-900 dark:text-white">
                                {mockPublications[selectedOrder.id].nombre}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Precio
                            </label>
                            {isEditingPublication ? (
                              <input
                                type="number"
                                defaultValue={mockPublications[selectedOrder.id].precio}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                            ) : (
                              <p className="text-gray-900 dark:text-white">
                                ${mockPublications[selectedOrder.id].precio.toLocaleString()} {mockPublications[selectedOrder.id].moneda}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Tipo de Publicación
                            </label>
                            <p className="text-gray-900 dark:text-white">
                              {mockPublications[selectedOrder.id].tipoPublicacion}
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Días de Entrega
                            </label>
                            <p className="text-gray-900 dark:text-white">
                              {mockPublications[selectedOrder.id].diasEntrega}
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Categoría
                            </label>
                            <p className="text-gray-900 dark:text-white">
                              {mockPublications[selectedOrder.id].categoria}
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Stock
                            </label>
                            {isEditingPublication ? (
                              <input
                                type="number"
                                defaultValue={mockPublications[selectedOrder.id].stock}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                            ) : (
                              <p className="text-gray-900 dark:text-white">
                                {mockPublications[selectedOrder.id].stock} unidades
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Descripción
                          </label>
                          {isEditingPublication ? (
                            <textarea
                              defaultValue={mockPublications[selectedOrder.id].descripcion}
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          ) : (
                            <p className="text-gray-900 dark:text-white">
                              {mockPublications[selectedOrder.id].descripcion}
                            </p>
                          )}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex space-x-4">
                            <a
                              href={selectedOrder.mercadoLibreLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Ver en MercadoLibre
                            </a>
                            <a
                              href={selectedOrder.amazonLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 flex items-center"
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Ver en Amazon
                            </a>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Plantilla: {mockPublications[selectedOrder.id].plantilla}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {modalTab === 'techspecs' && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Especificaciones Técnicas
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">SKU:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">{selectedOrder.sku}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Cantidad:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">{selectedOrder.quantity}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Precio Amazon:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">${selectedOrder.amazonPrice}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Fecha Amazon:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">{selectedOrder.amazonDate}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Amazon GSS:</span>
                          <span className={`ml-2 ${selectedOrder.amazonGSS ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {selectedOrder.amazonGSS ? 'Sí' : 'No'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Creada:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">{selectedOrder.dateCreated}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesDashboard;