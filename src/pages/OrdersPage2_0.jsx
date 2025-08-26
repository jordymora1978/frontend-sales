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
  Weight,
  CheckCircle,
  FileText,
  MapPin,
  Star,
  ExternalLink,
  Phone,
  CreditCard,
  Archive,
  Info,
  ChevronLeft,
  ChevronRight,
  Tag
} from 'lucide-react';

const OrdersPage2_0 = ({ onOpenModal, onSelectOrder }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [financeExpanded, setFinanceExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showAmazonOrderModal, setShowAmazonOrderModal] = useState(false);
  const [selectedOrderForAmazon, setSelectedOrderForAmazon] = useState(null);
  const [tempAmazonOrders, setTempAmazonOrders] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [orderPopup, setOrderPopup] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(12); // 12 órdenes por página
  const [quickSearch, setQuickSearch] = useState('');
  const [universalFilter, setUniversalFilter] = useState('all');
  const [activeTagFilters, setActiveTagFilters] = useState([]);
  const [tagSearchTerm, setTagSearchTerm] = useState('');
  const [showTagCreatorModal, setShowTagCreatorModal] = useState(false);

  // Función para actualizar tags de una orden
  const updateOrderTags = (orderId, newTags) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, tags: newTags }
          : order
      )
    );
  };

  // Función para agregar tag
  const addTagToOrder = async (orderId, tag) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const currentTags = order.tags || [];
    if (currentTags.includes(tag)) return; // Ya existe
    
    const newTags = [...currentTags, tag];
    updateOrderTags(orderId, newTags);
    
    // TODO: Llamada al backend
    console.log(`API Call: POST /orders/${orderId}/tags`, { tag });
  };

  // Función para eliminar tag
  const removeTagFromOrder = async (orderId, tag) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const currentTags = order.tags || [];
    const newTags = currentTags.filter(t => t !== tag);
    updateOrderTags(orderId, newTags);
    
    // TODO: Llamada al backend
    console.log(`API Call: DELETE /orders/${orderId}/tags/${tag}`);
  };
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('blue');
  const [customTagColors, setCustomTagColors] = useState({});
  
  // Estados IA - Filtros y análisis inteligente
  const [showIATags, setShowIATags] = useState(false); // Mostrar etiquetas IA
  const [selectedIATags, setSelectedIATags] = useState([]); // Etiquetas IA seleccionadas
  const [isAnalyzing, setIsAnalyzing] = useState(false); // Estado de análisis en progreso
  const [lastAnalysisTags, setLastAnalysisTags] = useState([]); // Etiquetas encontradas en último análisis
  
  // Etiquetas IA predefinidas
  const predefinedIATags = [
    'Intención de Cancelar',
    'Pide Factura',
    'Duda con Envío',
    'Garantía',
    'Precio Competencia',
    'Stock Agotado',
    'Cambio de Dirección',
    'Reclamo Calidad'
  ];


  // Función para togglear etiqueta IA
  const toggleIATag = (tag) => {
    setSelectedIATags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  // Función para limpiar filtros IA
  const clearIAFilters = () => {
    setSelectedIATags([]);
    setShowIATags(false);
  };

  // Mock data de mensajes MercadoLibre por orden
  const mockMLMessages = {
    1: ["Hola, necesito la factura de mi pedido urgente", "¿Cuándo me llega?"],
    2: ["Quiero cancelar mi orden por favor", "Ya no lo necesito"],
    3: ["¿Cuándo llega mi pedido?", "Necesito que llegue antes del viernes"],
    4: ["El producto llegó defectuoso", "Quiero garantía", "No funciona bien"],
    5: ["Vi el mismo producto más barato en otra tienda", "¿Pueden igualar el precio?"],
    6: ["¿Tienen stock del producto en negro?", "El que pedí está agotado"],
    7: ["Me mudé, necesito cambiar la dirección", "Nueva dirección: Calle 123"],
    8: ["El producto no es lo que esperaba", "La calidad es mala", "Quiero devolverlo"]
  };

  // Función de análisis inteligente de mensajes ML
  const analyzeMLMessages = (messages) => {
    const detectedTags = [];
    const allMessages = messages.join(' ').toLowerCase();
    
    console.log('🔬 Analizando mensajes:', messages);
    console.log('📄 Texto completo:', allMessages);

    // Patrones de detección inteligente
    const patterns = {
      'Intención de Cancelar': ['cancelar', 'ya no lo necesito', 'no quiero', 'anular'],
      'Pide Factura': ['factura', 'invoice', 'recibo', 'comprobante', 'necesito factura'],
      'Duda con Envío': ['cuándo llega', 'cuándo me llega', 'envío', 'entrega', 'tracking'],
      'Garantía': ['defectuoso', 'garantía', 'no funciona', 'dañado', 'roto'],
      'Precio Competencia': ['más barato', 'mejor precio', 'igualar precio', 'competencia'],
      'Stock Agotado': ['stock', 'agotado', 'disponible', 'tienen', 'hay'],
      'Cambio de Dirección': ['cambiar dirección', 'nueva dirección', 'mudé', 'mudar'],
      'Reclamo Calidad': ['calidad mala', 'no esperaba', 'decepcionado', 'devolverlo']
    };

    // Detectar patrones
    Object.entries(patterns).forEach(([tag, keywords]) => {
      const hasPattern = keywords.some(keyword => allMessages.includes(keyword));
      if (hasPattern) {
        detectedTags.push(tag);
        console.log(`✅ Patrón detectado: ${tag} (palabras clave encontradas)`);
      }
    });
    
    console.log('🏷️ Tags finales detectados:', detectedTags);
    return detectedTags;
  };

  // Función principal de análisis IA (cuando se hace click al robot)
  const runIntelligentAnalysis = async () => {
    console.log('🤖 Iniciando análisis IA...');
    console.log('📊 Órdenes disponibles:', orders.length);
    console.log('📝 Mock messages:', Object.keys(mockMLMessages).length);
    
    // Prueba rápida de la función analyzeMLMessages
    console.log('🧪 Prueba rápida de analyzeMLMessages:');
    const testMessages = ["Hola, necesito la factura de mi pedido urgente", "¿Cuándo me llega?"];
    const testResult = analyzeMLMessages(testMessages);
    console.log('🔬 Resultado de prueba:', testResult);
    
    if (isAnalyzing) {
      console.log('⚠️ Análisis ya en progreso');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Simular tiempo de análisis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const foundTags = [];
      const updatedOrders = [...orders];
      
      console.log('🔍 Analizando mensajes por orden...');
      
      // Analizar cada orden que tiene mensajes simulados
      Object.entries(mockMLMessages).forEach(([orderIndex, messages]) => {
        const orderIdx = parseInt(orderIndex) - 1;
        console.log(`📋 Analizando orden ${orderIndex} (índice ${orderIdx}):`, messages);
        
        if (updatedOrders[orderIdx]) {
          const detectedTags = analyzeMLMessages(messages);
          console.log(`🏷️ Etiquetas detectadas para orden ${orderIndex}:`, detectedTags);
          
          if (detectedTags.length > 0) {
            // Agregar etiquetas detectadas a la orden
            const existingTags = updatedOrders[orderIdx].tags || [];
            const newTags = detectedTags.filter(tag => !existingTags.includes(tag));
            
            if (newTags.length > 0) {
              updatedOrders[orderIdx].tags = [...existingTags, ...newTags];
              foundTags.push(...newTags);
              console.log(`✅ Agregadas ${newTags.length} nuevas etiquetas a orden ${orderIndex}`);
            }
          }
        } else {
          console.log(`❌ No se encontró orden en índice ${orderIdx}`);
        }
      });
      
      // Actualizar órdenes con nuevas etiquetas
      setOrders(updatedOrders);
      console.log('📦 Órdenes actualizadas con etiquetas');
      
      // Actualizar etiquetas encontradas en el último análisis (sin duplicados)
      const uniqueFoundTags = [...new Set(foundTags)];
      setLastAnalysisTags(uniqueFoundTags);
      console.log('🎯 Etiquetas únicas encontradas:', uniqueFoundTags);
      
      // Mostrar automáticamente la barra con las etiquetas encontradas
      if (uniqueFoundTags.length > 0) {
        setShowIATags(true);
        console.log('📊 Mostrando barra de etiquetas IA');
      } else {
        console.log('⚠️ No se detectaron etiquetas nuevas');
      }
      
      console.log(`🤖 Análisis IA completado: ${uniqueFoundTags.length} tipos de etiquetas detectadas`);
      
    } catch (error) {
      console.error('❌ Error en análisis IA:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 🚀 SISTEMA DE ETIQUETAS AUTOMÁTICAS BASADO EN REGLAS DE NEGOCIO
  const applyBusinessRules = (orders) => {
    console.log('🔧 Aplicando reglas de negocio automáticas...');
    
    const updatedOrders = orders.map(order => {
      const newTags = [...(order.tags || [])];
      const today = new Date();
      
      // REGLA 1: Envío Crítico - más de 4 días desde la compra
      if (order.purchaseDate) {
        const purchaseDate = new Date(order.purchaseDate);
        const daysDiff = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff >= 4 && !newTags.includes('Envío Crítico')) {
          newTags.push('Envío Crítico');
          console.log(`🚨 Orden ${order.id}: Envío crítico (${daysDiff} días)`);
        }
      }
      
      // REGLA 2: Alto Valor - productos >$500
      if (order.total && order.total > 500 && !newTags.includes('Alto Valor')) {
        newTags.push('Alto Valor');
        console.log(`💎 Orden ${order.id}: Alto valor ($${order.total})`);
      }
      
      // REGLA 3: Cliente VIP - más de 10 órdenes previas
      if (order.customer?.previousOrders && order.customer.previousOrders >= 10 && !newTags.includes('Cliente VIP')) {
        newTags.push('Cliente VIP');
        console.log(`👑 Orden ${order.id}: Cliente VIP (${order.customer.previousOrders} órdenes)`);
      }
      
      // REGLA 4: Margen Bajo - menos del 15%
      if (order.profitMargin && order.profitMargin < 15 && !newTags.includes('Margen Bajo')) {
        newTags.push('Margen Bajo');
        console.log(`📉 Orden ${order.id}: Margen bajo (${order.profitMargin}%)`);
      }
      
      // REGLA 5: Producto Apple - requiere manejo especial
      if (order.productTitle?.toLowerCase().includes('iphone') || 
          order.productTitle?.toLowerCase().includes('macbook') ||
          order.productTitle?.toLowerCase().includes('apple')) {
        if (!newTags.includes('Apple Product')) {
          newTags.push('Apple Product');
          console.log(`🍎 Orden ${order.id}: Producto Apple`);
        }
      }
      
      // REGLA 6: Destino Internacional - requiere documentación
      if (order.location?.country && 
          !['COLOMBIA', 'colombia'].includes(order.location.country) && 
          !newTags.includes('Internacional')) {
        newTags.push('Internacional');
        console.log(`🌍 Orden ${order.id}: Destino internacional (${order.location.country})`);
      }
      
      return { ...order, tags: newTags };
    });
    
    return updatedOrders;
  };

  // Función para aplicar reglas automáticas
  const runBusinessRulesAnalysis = () => {
    console.log('🔧 Iniciando análisis de reglas de negocio...');
    const updatedOrders = applyBusinessRules(orders);
    setOrders(updatedOrders);
    
    // Contar etiquetas aplicadas
    const appliedTags = new Set();
    updatedOrders.forEach(order => {
      if (order.tags) {
        order.tags.forEach(tag => appliedTags.add(tag));
      }
    });
    
    console.log(`✅ Reglas aplicadas: ${appliedTags.size} tipos de etiquetas automáticas`);
  };

  // Debug: mostrar cambios en customTagColors
  useEffect(() => {
    console.log('🎨 customTagColors updated:', customTagColors);
  }, [customTagColors]);

  // Sistema de colores para etiquetas
  const tagColorOptions = [
    { name: 'blue', label: 'Azul', classes: 'bg-blue-50 text-blue-700 border-blue-200' },
    { name: 'red', label: 'Rojo', classes: 'bg-red-50 text-red-700 border-red-200' },
    { name: 'yellow', label: 'Amarillo', classes: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    { name: 'green', label: 'Verde', classes: 'bg-green-50 text-green-700 border-green-200' },
    { name: 'purple', label: 'Púrpura', classes: 'bg-purple-50 text-purple-700 border-purple-200' },
    { name: 'pink', label: 'Rosa', classes: 'bg-pink-50 text-pink-700 border-pink-200' },
    { name: 'indigo', label: 'Índigo', classes: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { name: 'gray', label: 'Gris', classes: 'bg-gray-50 text-gray-700 border-gray-200' },
    { name: 'yellow', label: 'Amarillo', classes: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    { name: 'teal', label: 'Verde azulado', classes: 'bg-teal-50 text-teal-700 border-teal-200' }
  ];

  const tagColors = {
    'Urgente': 'bg-red-50 text-red-700 border-red-200',
    'VIP': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Premium': 'bg-blue-50 text-blue-700 border-blue-200',
    'Amazon': 'bg-purple-50 text-purple-700 border-purple-200',
    'Nuevo': 'bg-green-50 text-green-700 border-green-200',
    'Descuento': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Express': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Mayorista': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'Reembolso': 'bg-pink-50 text-pink-700 border-pink-200',
    'Aventura': 'bg-teal-50 text-teal-700 border-teal-200',
    'Tecnología': 'bg-blue-50 text-blue-700 border-blue-200',
    'Apple': 'bg-gray-50 text-gray-700 border-gray-200',
    'GoPro': 'bg-gray-50 text-gray-700 border-gray-200',
    'Dyson': 'bg-gray-50 text-gray-700 border-gray-200',
    'default': 'bg-gray-50 text-gray-700 border-gray-200'
  };

  const getTagColor = (tag) => {
    // Primero buscar en colores personalizados, luego en predefinidos
    return customTagColors[tag] || tagColors[tag] || tagColors['default'];
  };

  const toggleTagFilter = (tag) => {
    if (activeTagFilters.includes(tag)) {
      setActiveTagFilters(activeTagFilters.filter(t => t !== tag));
    } else {
      setActiveTagFilters([...activeTagFilters, tag]);
    }
  };

  const createNewTag = () => {
    console.log('🔍 createNewTag called');
    console.log('🔍 newTagName:', newTagName);
    console.log('🔍 newTagColor:', newTagColor);
    
    if (newTagName.trim()) {
      const tagName = newTagName.trim();
      const selectedColorOption = tagColorOptions.find(c => c.name === newTagColor);
      
      console.log('🔍 tagName:', tagName);
      console.log('🔍 selectedColorOption:', selectedColorOption);
      
      if (selectedColorOption) {
        console.log('🔍 About to update customTagColors');
        
        // Agregar la nueva etiqueta al estado de colores personalizados
        setCustomTagColors(prev => {
          const newColors = {
            ...prev,
            [tagName]: selectedColorOption.classes
          };
          console.log('🔍 New customTagColors:', newColors);
          return newColors;
        });
        
        // Cerrar modal y limpiar campos
        setShowTagCreatorModal(false);
        setNewTagName('');
        setNewTagColor('blue');
        
        // Mostrar mensaje de éxito
        console.log(`✅ Nueva etiqueta creada: "${tagName}" con color ${selectedColorOption.label}`);
        
        // Opcional: agregar automáticamente a los filtros activos
        // setActiveTagFilters(prev => [...prev, tagName]);
      } else {
        console.log('❌ selectedColorOption not found');
      }
    } else {
      console.log('❌ newTagName is empty');
    }
  };

  // Estados de órdenes (Estado de Compra)
  const orderStatuses = {
    aprobado: { label: 'Aprobado', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
    procesando: { label: 'Procesando', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: XCircle },
    mediacion: { label: 'Mediación', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
    pendiente: { label: 'Pendiente', color: 'bg-gray-100 text-gray-800', icon: Clock }
  };

  // Estados de envío (Estado del Envío Local)
  const shippingStatuses = {
    pendiente: { label: 'Pendiente', color: 'bg-gray-100 text-gray-700', icon: Clock },
    enviado: { label: 'Enviado', color: 'bg-blue-100 text-blue-700', icon: Truck },
    entregado: { label: 'Entregado', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 }
  };

  // Función para formatear tiempo en formato corto (10M, 2H, 4D)
  const formatTimeShort = (minutesAgo) => {
    if (minutesAgo < 60) {
      return `${minutesAgo}M`;
    } else if (minutesAgo < 1440) { // menos de 24 horas
      const hours = Math.floor(minutesAgo / 60);
      return `${hours}H`;
    } else {
      const days = Math.floor(minutesAgo / 1440);
      return `${days}D`;
    }
  };

  // Función para obtener color según tiempo transcurrido
  const getTimeColor = (minutesAgo) => {
    return 'bg-blue-500'; // Azul del sistema
  };

  // Función para obtener colores de fondo de tarjeta según estado
  const getStatusCardColors = (status) => {
    const statusColors = {
      aprobado: { bg: 'bg-green-50', iconColor: 'text-green-600', textColor: 'text-green-700' },
      procesando: { bg: 'bg-yellow-50', iconColor: 'text-yellow-600', textColor: 'text-yellow-700' },
      enviado: { bg: 'bg-blue-50', iconColor: 'text-blue-600', textColor: 'text-blue-700' },
      entregado: { bg: 'bg-emerald-50', iconColor: 'text-emerald-600', textColor: 'text-emerald-700' },
      cancelado: { bg: 'bg-red-50', iconColor: 'text-red-600', textColor: 'text-red-700' },
      pendiente: { bg: 'bg-gray-50', iconColor: 'text-gray-600', textColor: 'text-gray-700' }
    };
    return statusColors[status] || statusColors.pendiente;
  };

  // Funciones para manejar el popup de información de orden
  const handleOrderInfoClick = (order, event) => {
    if (orderPopup === order.id) {
      setOrderPopup(null);
    } else {
      setOrderPopup(order.id);
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseMove = (event) => {
    if (orderPopup) {
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleClickOutside = () => {
    setOrderPopup(null);
  };

  // Efecto para agregar listener de mouse global
  useEffect(() => {
    if (orderPopup) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [orderPopup]);

  // Enhanced mock data con estructura de órdenes
  useEffect(() => {
    const mockOrdersData = [
      {
        id: 'MGA-PE4998',
        number: 'ORD-2025002',
        orderNumber: '2000012784807490',
        sku: 'B07XQXZXVZ',
        productTitle: 'iPhone 15 Pro 256GB Space Black',
        productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
        customer: {
          name: 'Carlos Mendoza',
          email: 'carlos.mendoza@email.com',
          phone: '+56 9 8765 4321',
          document: 'RUT 10.509.928-2',
          rating: 4.8,
          totalOrders: 12,
          previousOrders: 15,
          avatar: '/api/placeholder/32/32',
          industry: 'Particular',
          conversionRate: 85,
          avgResponseTime: 2.3
        },
        amount: 129990,
        total: 850,
        profitMargin: 12.5,
        currency: 'COP',
        status: 'aprobado',
        shippingStatus: 'enviado',
        createdDate: '2025-01-14',
        purchaseDate: '2025-01-20', // Hace 6 días - debería generar "Envío Crítico"
        lastActivity: '2025-01-22',
        validUntil: '2025-02-14',
        items: 2,
        minutesAgo: 45,
        location: {
          country: 'CHILE',
          city: 'Santiago'
        },
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
        productTitle: 'Cámara Canon EOS Rebel T100 Digital SLR Kit Completo Lente...',
        productImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop',
        customer: {
          name: 'Ana Rodriguez',
          email: 'ana.rodriguez@email.com',
          phone: '+51 987 654 321',
          document: 'DNI 42722765',
          rating: 4.5,
          totalOrders: 8,
          previousOrders: 8,
          avatar: '/api/placeholder/32/32',
          industry: 'Fotografía',
          conversionRate: 92,
          avgResponseTime: 1.8
        },
        amount: 1850000,
        total: 1850,
        profitMargin: 8.5, // Margen bajo - debería generar etiqueta
        currency: 'COP',
        status: 'procesando',
        shippingStatus: 'pendiente',
        createdDate: '2025-01-13',
        purchaseDate: '2025-01-22', // Hace 4 días - debería generar "Envío Crítico"
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
        productTitle: 'Reloj Inteligente Deportivo Monitor Cardiaco Bluetooth GPS...',
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
        status: 'cancelado',
        shippingStatus: 'pendiente',
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
      },
      {
        id: 'MLA-2025005',
        number: 'ORD-2025005',
        sku: 'B08XYZ123',
        productTitle: 'Apple iPhone 15 Pro 128GB Natural Titanium Libre Garantía...',
        productImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop',
        customer: {
          name: 'Sofia Martinez',
          email: 'sofia.martinez@email.com',
          phone: '+54 11 2345 6789',
          document: 'DNI 35.678.901',
          rating: 4.8,
          totalOrders: 12,
          avatar: '/api/placeholder/32/32',
          industry: 'Diseño Gráfico',
          conversionRate: 88,
          avgResponseTime: 2.1
        },
        amount: 1499000,
        currency: 'ARS',
        status: 'aprobado',
        shippingStatus: 'enviado',
        createdDate: '2025-01-20',
        lastActivity: '2025-01-23',
        validUntil: '2025-02-20',
        items: 1,
        minutesAgo: 45,
        orderStatus: { main: 'APROBADO', shipping: 'ENVIADO', payment: 'PAGADO' },
        logistics: {
          provider1: 'ANICAM',
          provider2: 'MERCADOENVIOS',
          trackingNumber: 'ME456789123',
          alert: 'EN_TRANSITO',
          estimatedDelivery: '2025-01-25',
          deliveredDate: null
        },
        purchase: {
          date: '2025-01-20',
          time: '10:30',
          price: 999.99,
          currency: 'USD',
          paymentMethod: 'MercadoPago'
        },
        amazon: { available: true, stock: 8, prime: true },
        financial: { total: 1499000, commission: 224850, net: 1274150, profit: 350000, margin: 23 },
        location: { country: 'ARGENTINA', city: 'Buenos Aires', region: 'Capital Federal' },
        priority: 'high',
        notes: 'Cliente Premium - Entrega express solicitada',
        tags: ['Premium', 'Express', 'iPhone'],
        salesRep: 'Carlos Rodriguez',
        probability: 95
      },
      {
        id: 'MLC-2025006',
        number: 'ORD-2025006',
        sku: 'B09ABC456',
        productTitle: 'Samsung Galaxy S24 Ultra 512GB Phantom Black 5G Liberado...',
        productImage: 'https://images.unsplash.com/photo-1610792516286-524726503fb2?w=100&h=100&fit=crop',
        customer: {
          name: 'Diego Fernandez',
          email: 'diego.fernandez@email.com',
          phone: '+56 9 8765 4321',
          document: 'RUT 18.123.456-7',
          rating: 4.2,
          totalOrders: 6,
          avatar: '/api/placeholder/32/32',
          industry: 'Marketing',
          conversionRate: 75,
          avgResponseTime: 3.2
        },
        amount: 1850000,
        currency: 'CLP',
        status: 'procesando',
        shippingStatus: 'pendiente',
        createdDate: '2025-01-21',
        lastActivity: '2025-01-23',
        validUntil: '2025-02-21',
        items: 1,
        minutesAgo: 120,
        orderStatus: { main: 'PROCESANDO', shipping: 'PENDIENTE', payment: 'PENDIENTE' },
        logistics: {
          provider1: 'ANICAM',
          provider2: 'CHILEXPRESS',
          trackingNumber: null,
          alert: 'PREALERTA',
          estimatedDelivery: '2025-01-28',
          deliveredDate: null
        },
        purchase: {
          date: '2025-01-21',
          time: '14:15',
          price: 1249.99,
          currency: 'USD',
          paymentMethod: 'Credit Card'
        },
        amazon: { available: true, stock: 15, prime: false },
        financial: { total: 1850000, commission: 277500, net: 1572500, profit: 420000, margin: 23 },
        location: { country: 'CHILE', city: 'Santiago', region: 'Metropolitana' },
        priority: 'medium',
        notes: 'Cliente nuevo - Verificar datos de entrega',
        tags: ['Nuevo', 'Samsung', 'Ultra'],
        salesRep: 'Ana Lopez',
        probability: 80
      },
      {
        id: 'MCO-2025007',
        number: 'ORD-2025007',
        sku: 'B07DEF789',
        productTitle: 'MacBook Air M2 13" 256GB Space Gray Chip Apple Silicon...',
        productImage: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=100&h=100&fit=crop',
        customer: {
          name: 'Valentina Castro',
          email: 'valentina.castro@email.com',
          phone: '+57 301 234 5678',
          document: 'CC 52.345.678-9',
          rating: 5.0,
          totalOrders: 18,
          avatar: '/api/placeholder/32/32',
          industry: 'Arquitectura',
          conversionRate: 92,
          avgResponseTime: 1.5
        },
        amount: 4200000,
        currency: 'COP',
        status: 'aprobado',
        shippingStatus: 'entregado',
        createdDate: '2025-01-18',
        lastActivity: '2025-01-22',
        validUntil: '2025-02-18',
        items: 1,
        minutesAgo: 1440,
        orderStatus: { main: 'ENTREGADO', shipping: 'ENTREGADO', payment: 'PAGADO' },
        logistics: {
          provider1: 'ANICAM',
          provider2: 'COORDINADORA',
          trackingNumber: 'COO987654321',
          alert: 'COMPLETADO',
          estimatedDelivery: '2025-01-22',
          deliveredDate: '2025-01-22'
        },
        purchase: {
          date: '2025-01-18',
          time: '09:20',
          price: 1299.99,
          currency: 'USD',
          paymentMethod: 'Bank Transfer'
        },
        amazon: { available: true, stock: 5, prime: true },
        financial: { total: 4200000, commission: 630000, net: 3570000, profit: 850000, margin: 20 },
        location: { country: 'COLOMBIA', city: 'Medellín', region: 'Antioquia' },
        priority: 'high',
        notes: 'Entrega exitosa - Cliente VIP muy satisfecho',
        tags: ['VIP', 'MacBook', 'Completado'],
        salesRep: 'Miguel Santos',
        probability: 100
      },
      {
        id: 'MPE-2025008',
        number: 'ORD-2025008',
        sku: 'B08GHI012',
        productTitle: 'Sony WH-1000XM5 Audífonos Inalámbricos Noise Cancelling...',
        productImage: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=100&h=100&fit=crop',
        customer: {
          name: 'Roberto Silva',
          email: 'roberto.silva@email.com',
          phone: '+51 987 123 456',
          document: 'DNI 78.901.234',
          rating: 3.8,
          totalOrders: 4,
          avatar: '/api/placeholder/32/32',
          industry: 'Música',
          conversionRate: 65,
          avgResponseTime: 4.1
        },
        amount: 850000,
        currency: 'PEN',
        status: 'cancelado',
        shippingStatus: 'pendiente',
        createdDate: '2025-01-19',
        lastActivity: '2025-01-22',
        validUntil: '2025-02-19',
        items: 1,
        minutesAgo: 720,
        orderStatus: { main: 'CANCELADO', shipping: 'PENDIENTE', payment: 'CANCELADO' },
        logistics: {
          provider1: 'ANICAM',
          provider2: 'SERPOST',
          trackingNumber: null,
          alert: 'CANCELADO',
          estimatedDelivery: null,
          deliveredDate: null
        },
        purchase: {
          date: '2025-01-19',
          time: '16:40',
          price: 349.99,
          currency: 'USD',
          paymentMethod: 'PayPal'
        },
        amazon: { available: true, stock: 20, prime: true },
        financial: { total: 850000, commission: 0, net: 0, profit: 0, margin: 0 },
        location: { country: 'PERU', city: 'Lima', region: 'Lima' },
        priority: 'low',
        notes: 'Cancelado por cliente - Problemas de pago',
        tags: ['Cancelado', 'Sony', 'Audio'],
        salesRep: 'Laura Mendez',
        probability: 0
      },
      {
        id: 'MLA-2025009',
        number: 'ORD-2025009',
        sku: 'B09JKL345',
        productTitle: 'Nintendo Switch OLED Modelo Blanco 64GB Consola Portátil...',
        productImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
        customer: {
          name: 'Camila Rojas',
          email: 'camila.rojas@email.com',
          phone: '+54 11 3456 7890',
          document: 'DNI 29.456.789',
          rating: 4.6,
          totalOrders: 15,
          avatar: '/api/placeholder/32/32',
          industry: 'Gaming',
          conversionRate: 85,
          avgResponseTime: 2.8
        },
        amount: 750000,
        currency: 'ARS',
        status: 'aprobado',
        shippingStatus: 'enviado',
        createdDate: '2025-01-22',
        lastActivity: '2025-01-23',
        validUntil: '2025-02-22',
        items: 1,
        minutesAgo: 30,
        orderStatus: { main: 'APROBADO', shipping: 'ENVIADO', payment: 'PAGADO' },
        logistics: {
          provider1: 'ANICAM',
          provider2: 'MERCADOENVIOS',
          trackingNumber: 'ME789456123',
          alert: 'EN_TRANSITO',
          estimatedDelivery: '2025-01-24',
          deliveredDate: null
        },
        purchase: {
          date: '2025-01-22',
          time: '11:55',
          price: 349.99,
          currency: 'USD',
          paymentMethod: 'MercadoPago'
        },
        amazon: { available: true, stock: 12, prime: false },
        financial: { total: 750000, commission: 112500, net: 637500, profit: 180000, margin: 24 },
        location: { country: 'ARGENTINA', city: 'Córdoba', region: 'Córdoba' },
        priority: 'medium',
        notes: 'Regalo de cumpleaños - Empaque especial',
        tags: ['Regalo', 'Nintendo', 'Gaming'],
        salesRep: 'Pedro Garcia',
        probability: 90
      },
      {
        id: 'MLC-2025010',
        number: 'ORD-2025010',
        sku: 'B07MNO678',
        productTitle: 'iPad Pro 11" M2 128GB Wi-Fi Space Gray Apple Pencil...',
        productImage: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100&h=100&fit=crop',
        customer: {
          name: 'Andrés Morales',
          email: 'andres.morales@email.com',
          phone: '+56 9 7654 3210',
          document: 'RUT 15.789.012-3',
          rating: 4.9,
          totalOrders: 22,
          avatar: '/api/placeholder/32/32',
          industry: 'Educación',
          conversionRate: 95,
          avgResponseTime: 1.3
        },
        amount: 2100000,
        currency: 'CLP',
        status: 'procesando',
        shippingStatus: 'pendiente',
        createdDate: '2025-01-23',
        lastActivity: '2025-01-23',
        validUntil: '2025-02-23',
        items: 2,
        minutesAgo: 90,
        orderStatus: { main: 'PROCESANDO', shipping: 'PENDIENTE', payment: 'PENDIENTE' },
        logistics: {
          provider1: 'ANICAM',
          provider2: 'CHILEXPRESS',
          trackingNumber: null,
          alert: 'DOCUMENTOS',
          estimatedDelivery: '2025-01-30',
          deliveredDate: null
        },
        purchase: {
          date: '2025-01-23',
          time: '08:45',
          price: 899.99,
          currency: 'USD',
          paymentMethod: 'Credit Card'
        },
        amazon: { available: true, stock: 7, prime: true },
        financial: { total: 2100000, commission: 315000, net: 1785000, profit: 450000, margin: 21 },
        location: { country: 'CHILE', city: 'Valparaíso', region: 'Valparaíso' },
        priority: 'high',
        notes: 'Cliente educador - Descuento aplicado',
        tags: ['Educación', 'iPad', 'Descuento'],
        salesRep: 'Maria Elena',
        probability: 88
      },
      {
        id: 'MCO-2025011',
        number: 'ORD-2025011',
        sku: 'B08PQR901',
        productTitle: 'Xiaomi Redmi Note 13 Pro 256GB Midnight Black Dual SIM...',
        productImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop',
        customer: {
          name: 'Isabella Torres',
          email: 'isabella.torres@email.com',
          phone: '+57 302 345 6789',
          document: 'CC 43.567.890-1',
          rating: 4.1,
          totalOrders: 9,
          avatar: '/api/placeholder/32/32',
          industry: 'Fotografía',
          conversionRate: 78,
          avgResponseTime: 2.9
        },
        amount: 1200000,
        currency: 'COP',
        status: 'aprobado',
        shippingStatus: 'pendiente',
        createdDate: '2025-01-23',
        lastActivity: '2025-01-23',
        validUntil: '2025-02-23',
        items: 1,
        minutesAgo: 15,
        orderStatus: { main: 'APROBADO', shipping: 'PENDIENTE', payment: 'PAGADO' },
        logistics: {
          provider1: 'ANICAM',
          provider2: 'COORDINADORA',
          trackingNumber: 'COO654321987',
          alert: 'PREALERTA',
          estimatedDelivery: '2025-01-26',
          deliveredDate: null
        },
        purchase: {
          date: '2025-01-23',
          time: '15:20',
          price: 299.99,
          currency: 'USD',
          paymentMethod: 'Nequi'
        },
        amazon: { available: true, stock: 18, prime: false },
        financial: { total: 1200000, commission: 180000, net: 1020000, profit: 250000, margin: 21 },
        location: { country: 'COLOMBIA', city: 'Cali', region: 'Valle del Cauca' },
        priority: 'medium',
        notes: 'Recién aprobado - Preparar envío',
        tags: ['Nuevo', 'Xiaomi', 'Fotografía'],
        salesRep: 'Carlos Rodriguez',
        probability: 85
      },
      {
        id: 'MPE-2025012',
        number: 'ORD-2025012',
        sku: 'B09STU234',
        productTitle: 'Bose QuietComfort 45 Headphones Noise Cancelling Wireless...',
        productImage: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&h=100&fit=crop',
        customer: {
          name: 'Francisco Vega',
          email: 'francisco.vega@email.com',
          phone: '+51 987 654 321',
          document: 'DNI 65.432.109',
          rating: 4.7,
          totalOrders: 11,
          avatar: '/api/placeholder/32/32',
          industry: 'Producción Musical',
          conversionRate: 89,
          avgResponseTime: 2.2
        },
        amount: 950000,
        currency: 'PEN',
        status: 'aprobado',
        shippingStatus: 'enviado',
        createdDate: '2025-01-20',
        lastActivity: '2025-01-22',
        validUntil: '2025-02-20',
        items: 1,
        minutesAgo: 360,
        orderStatus: { main: 'APROBADO', shipping: 'ENVIADO', payment: 'PAGADO' },
        logistics: {
          provider1: 'ANICAM',
          provider2: 'SERPOST',
          trackingNumber: 'SP123456789',
          alert: 'EN_TRANSITO',
          estimatedDelivery: '2025-01-24',
          deliveredDate: null
        },
        purchase: {
          date: '2025-01-20',
          time: '13:30',
          price: 329.99,
          currency: 'USD',
          paymentMethod: 'Credit Card'
        },
        amazon: { available: true, stock: 9, prime: true },
        financial: { total: 950000, commission: 142500, net: 807500, profit: 220000, margin: 23 },
        location: { country: 'PERU', city: 'Arequipa', region: 'Arequipa' },
        priority: 'medium',
        notes: 'Cliente profesional de audio',
        tags: ['Audio', 'Profesional', 'Bose'],
        salesRep: 'Ana Lopez',
        probability: 92
      },
      {
        id: 'MLA-2025013',
        number: 'ORD-2025013',
        sku: 'B07VWX567',
        productTitle: 'Samsung 55" QLED 4K Smart TV QN55Q70A HDR Quantum Dot...',
        productImage: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=100&h=100&fit=crop',
        customer: {
          name: 'Gabriela Herrera',
          email: 'gabriela.herrera@email.com',
          phone: '+54 11 4567 8901',
          document: 'DNI 31.234.567',
          rating: 4.4,
          totalOrders: 7,
          avatar: '/api/placeholder/32/32',
          industry: 'Entretenimiento',
          conversionRate: 82,
          avgResponseTime: 3.1
        },
        amount: 1850000,
        currency: 'ARS',
        status: 'procesando',
        shippingStatus: 'pendiente',
        createdDate: '2025-01-22',
        lastActivity: '2025-01-23',
        validUntil: '2025-02-22',
        items: 1,
        minutesAgo: 240,
        orderStatus: { main: 'PROCESANDO', shipping: 'PENDIENTE', payment: 'PENDIENTE' },
        logistics: {
          provider1: 'ANICAM',
          provider2: 'MERCADOENVIOS',
          trackingNumber: null,
          alert: 'PREALERTA',
          estimatedDelivery: '2025-01-28',
          deliveredDate: null
        },
        purchase: {
          date: '2025-01-22',
          time: '19:45',
          price: 799.99,
          currency: 'USD',
          paymentMethod: 'Bank Transfer'
        },
        amazon: { available: true, stock: 3, prime: false },
        financial: { total: 1850000, commission: 277500, net: 1572500, profit: 380000, margin: 21 },
        location: { country: 'ARGENTINA', city: 'Rosario', region: 'Santa Fe' },
        priority: 'low',
        notes: 'TV grande - Coordinar entrega especial',
        tags: ['TV', 'Samsung', 'QLED'],
        salesRep: 'Pedro Garcia',
        probability: 75
      },
      {
        id: 'MLC-2025014',
        number: 'ORD-2025014',
        sku: 'B08YZA890',
        productTitle: 'Apple Watch Series 9 GPS 45mm Midnight Aluminum Case...',
        productImage: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=100&h=100&fit=crop',
        customer: {
          name: 'Joaquín Mendoza',
          email: 'joaquin.mendoza@email.com',
          phone: '+56 9 8901 2345',
          document: 'RUT 12.345.678-9',
          rating: 5.0,
          totalOrders: 28,
          avatar: '/api/placeholder/32/32',
          industry: 'Deportes',
          conversionRate: 96,
          avgResponseTime: 1.1
        },
        amount: 850000,
        currency: 'CLP',
        status: 'aprobado',
        shippingStatus: 'entregado',
        createdDate: '2025-01-17',
        lastActivity: '2025-01-21',
        validUntil: '2025-02-17',
        items: 1,
        minutesAgo: 2880,
        orderStatus: { main: 'ENTREGADO', shipping: 'ENTREGADO', payment: 'PAGADO' },
        logistics: {
          provider1: 'ANICAM',
          provider2: 'CHILEXPRESS',
          trackingNumber: 'CHX987654321',
          alert: 'COMPLETADO',
          estimatedDelivery: '2025-01-21',
          deliveredDate: '2025-01-21'
        },
        purchase: {
          date: '2025-01-17',
          time: '07:15',
          price: 399.99,
          currency: 'USD',
          paymentMethod: 'Credit Card'
        },
        amazon: { available: true, stock: 14, prime: true },
        financial: { total: 850000, commission: 127500, net: 722500, profit: 195000, margin: 23 },
        location: { country: 'CHILE', city: 'Concepción', region: 'Biobío' },
        priority: 'high',
        notes: 'Cliente VIP - Entrega perfecta como siempre',
        tags: ['VIP', 'Apple Watch', 'Deportes'],
        salesRep: 'Maria Elena',
        probability: 100
      },
      {
        id: 'MCO-2025015',
        number: 'ORD-2025015',
        sku: 'B09BCD123',
        productTitle: 'Lenovo ThinkPad E15 Intel i7 16GB RAM 512GB SSD Windows...',
        productImage: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=100&h=100&fit=crop',
        customer: {
          name: 'Natalia Campos',
          email: 'natalia.campos@email.com',
          phone: '+57 303 456 7890',
          document: 'CC 87.654.321-0',
          rating: 4.3,
          totalOrders: 5,
          avatar: '/api/placeholder/32/32',
          industry: 'Ingeniería',
          conversionRate: 73,
          avgResponseTime: 3.8
        },
        amount: 2800000,
        currency: 'COP',
        status: 'cancelado',
        shippingStatus: 'pendiente',
        createdDate: '2025-01-21',
        lastActivity: '2025-01-23',
        validUntil: '2025-02-21',
        items: 1,
        minutesAgo: 480,
        orderStatus: { main: 'CANCELADO', shipping: 'PENDIENTE', payment: 'CANCELADO' },
        logistics: {
          provider1: 'ANICAM',
          provider2: 'COORDINADORA',
          trackingNumber: null,
          alert: 'CANCELADO',
          estimatedDelivery: null,
          deliveredDate: null
        },
        purchase: {
          date: '2025-01-21',
          time: '12:00',
          price: 899.99,
          currency: 'USD',
          paymentMethod: 'Credit Card'
        },
        amazon: { available: true, stock: 6, prime: false },
        financial: { total: 2800000, commission: 0, net: 0, profit: 0, margin: 0 },
        location: { country: 'COLOMBIA', city: 'Barranquilla', region: 'Atlántico' },
        priority: 'medium',
        notes: 'Cancelado - Cliente encontró mejor precio',
        tags: ['Cancelado', 'Lenovo', 'Laptop'],
        salesRep: 'Miguel Santos',
        probability: 0
      },
      {
        id: 'MPE-2025016',
        number: 'ORD-2025016',
        sku: 'B07EFG456',
        productTitle: 'GoPro HERO12 Black Cámara de Acción 5.3K Ultra HD...',
        productImage: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop',
        customer: {
          name: 'Ricardo Espinoza',
          email: 'ricardo.espinoza@email.com',
          phone: '+51 987 321 654',
          document: 'DNI 87.321.654',
          rating: 4.6,
          totalOrders: 13,
          avatar: '/api/placeholder/32/32',
          industry: 'Turismo Aventura',
          conversionRate: 86,
          avgResponseTime: 2.4
        },
        amount: 1650000,
        currency: 'PEN',
        status: 'aprobado',
        shippingStatus: 'pendiente',
        createdDate: '2025-01-23',
        lastActivity: '2025-01-23',
        validUntil: '2025-02-23',
        items: 1,
        minutesAgo: 75,
        orderStatus: { main: 'APROBADO', shipping: 'PENDIENTE', payment: 'PAGADO' },
        logistics: {
          provider1: 'ANICAM',
          provider2: 'SERPOST',
          trackingNumber: 'SP987321654',
          alert: 'DOCUMENTOS',
          estimatedDelivery: '2025-01-27',
          deliveredDate: null
        },
        purchase: {
          date: '2025-01-23',
          time: '14:05',
          price: 499.99,
          currency: 'USD',
          paymentMethod: 'PayPal'
        },
        amazon: { available: true, stock: 11, prime: true },
        financial: { total: 1650000, commission: 247500, net: 1402500, profit: 350000, margin: 21 },
        location: { country: 'PERU', city: 'Cusco', region: 'Cusco' },
        priority: 'high',
        notes: 'Para expedición al Machu Picchu',
        tags: ['Aventura', 'GoPro', 'Turismo'],
        salesRep: 'Laura Mendez',
        probability: 90
      },
      {
        id: 'MLA-2025017',
        number: 'ORD-2025017',
        sku: 'B08HIJ789',
        productTitle: 'Dyson V15 Detect Aspiradora Inalámbrica Láser Technology...',
        productImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop',
        customer: {
          name: 'Lucia Ramirez',
          email: 'lucia.ramirez@email.com',
          phone: '+54 11 5678 9012',
          document: 'DNI 26.789.012',
          rating: 4.8,
          totalOrders: 19,
          avatar: '/api/placeholder/32/32',
          industry: 'Hogar',
          conversionRate: 91,
          avgResponseTime: 1.9
        },
        amount: 1450000,
        currency: 'ARS',
        status: 'procesando',
        shippingStatus: 'pendiente',
        createdDate: '2025-01-23',
        lastActivity: '2025-01-23',
        validUntil: '2025-02-23',
        items: 1,
        minutesAgo: 180,
        orderStatus: { main: 'PROCESANDO', shipping: 'PENDIENTE', payment: 'PENDIENTE' },
        logistics: {
          provider1: 'ANICAM',
          provider2: 'MERCADOENVIOS',
          trackingNumber: null,
          alert: 'PREALERTA',
          estimatedDelivery: '2025-01-29',
          deliveredDate: null
        },
        purchase: {
          date: '2025-01-23',
          time: '10:15',
          price: 699.99,
          currency: 'USD',
          paymentMethod: 'Credit Card'
        },
        amazon: { available: true, stock: 4, prime: true },
        financial: { total: 1450000, commission: 217500, net: 1232500, profit: 320000, margin: 22 },
        location: { country: 'ARGENTINA', city: 'La Plata', region: 'Buenos Aires' },
        priority: 'medium',
        notes: 'Producto premium para el hogar',
        tags: ['Hogar', 'Dyson', 'Premium'],
        salesRep: 'Pedro Garcia',
        probability: 83
      },
      {
        id: 'MLC-2025018',
        number: 'ORD-2025018',
        sku: 'B09KLM012',
        productTitle: 'DJI Mini 4 Pro Drone 4K HDR Video Obstacle Avoidance...',
        productImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        customer: {
          name: 'Esteban Soto',
          email: 'esteban.soto@email.com',
          phone: '+56 9 9012 3456',
          document: 'RUT 19.012.345-6',
          rating: 4.2,
          totalOrders: 8,
          avatar: '/api/placeholder/32/32',
          industry: 'Producción Audiovisual',
          conversionRate: 79,
          avgResponseTime: 2.7
        },
        amount: 2200000,
        currency: 'CLP',
        status: 'aprobado',
        shippingStatus: 'enviado',
        createdDate: '2025-01-21',
        lastActivity: '2025-01-23',
        validUntil: '2025-02-21',
        items: 1,
        minutesAgo: 300,
        orderStatus: { main: 'APROBADO', shipping: 'ENVIADO', payment: 'PAGADO' },
        logistics: {
          provider1: 'ANICAM',
          provider2: 'CHILEXPRESS',
          trackingNumber: 'CHX321654987',
          alert: 'EN_TRANSITO',
          estimatedDelivery: '2025-01-25',
          deliveredDate: null
        },
        purchase: {
          date: '2025-01-21',
          time: '16:30',
          price: 1199.99,
          currency: 'USD',
          paymentMethod: 'Bank Transfer'
        },
        amazon: { available: true, stock: 2, prime: false },
        financial: { total: 2200000, commission: 330000, net: 1870000, profit: 480000, margin: 22 },
        location: { country: 'CHILE', city: 'La Serena', region: 'Coquimbo' },
        priority: 'high',
        notes: 'Drone profesional - Manejar con cuidado',
        tags: ['Profesional', 'DJI', 'Drone'],
        salesRep: 'Carlos Rodriguez',
        probability: 88
      },
      {
        id: 'MCO-2025019',
        number: 'ORD-2025019',
        sku: 'B07NOP345',
        productTitle: 'Fitbit Charge 6 Fitness Tracker GPS Built-in Heart Rate...',
        productImage: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=100&h=100&fit=crop',
        customer: {
          name: 'Alejandra Cruz',
          email: 'alejandra.cruz@email.com',
          phone: '+57 304 567 8901',
          document: 'CC 76.543.210-9',
          rating: 4.9,
          totalOrders: 16,
          avatar: '/api/placeholder/32/32',
          industry: 'Fitness',
          conversionRate: 93,
          avgResponseTime: 1.4
        },
        amount: 650000,
        currency: 'COP',
        status: 'aprobado',
        shippingStatus: 'entregado',
        createdDate: '2025-01-19',
        lastActivity: '2025-01-22',
        validUntil: '2025-02-19',
        items: 1,
        minutesAgo: 1320,
        orderStatus: { main: 'ENTREGADO', shipping: 'ENTREGADO', payment: 'PAGADO' },
        logistics: {
          provider1: 'ANICAM',
          provider2: 'COORDINADORA',
          trackingNumber: 'COO456789123',
          alert: 'COMPLETADO',
          estimatedDelivery: '2025-01-22',
          deliveredDate: '2025-01-22'
        },
        purchase: {
          date: '2025-01-19',
          time: '09:40',
          price: 199.99,
          currency: 'USD',
          paymentMethod: 'Daviplata'
        },
        amazon: { available: true, stock: 16, prime: true },
        financial: { total: 650000, commission: 97500, net: 552500, profit: 145000, margin: 22 },
        location: { country: 'COLOMBIA', city: 'Bucaramanga', region: 'Santander' },
        priority: 'medium',
        notes: 'Cliente fitness muy satisfecha',
        tags: ['Fitness', 'Fitbit', 'Completado'],
        salesRep: 'Ana Lopez',
        probability: 100
      },
      {
        id: 'MPE-2025020',
        number: 'ORD-2025020',
        sku: 'B08QRS678',
        productTitle: 'Kindle Paperwhite 11va Generación 8GB Waterproof E-reader...',
        productImage: 'https://images.unsplash.com/photo-1592498741405-dee-caa5-6a1e-77a8?w=100&h=100&fit=crop',
        customer: {
          name: 'Mateo Paredes',
          email: 'mateo.paredes@email.com',
          phone: '+51 987 876 543',
          document: 'DNI 54.321.098',
          rating: 4.5,
          totalOrders: 14,
          avatar: '/api/placeholder/32/32',
          industry: 'Literatura',
          conversionRate: 87,
          avgResponseTime: 2.0
        },
        amount: 420000,
        currency: 'PEN',
        status: 'procesando',
        shippingStatus: 'pendiente',
        createdDate: '2025-01-23',
        lastActivity: '2025-01-23',
        validUntil: '2025-02-23',
        items: 1,
        minutesAgo: 60,
        orderStatus: { main: 'PROCESANDO', shipping: 'PENDIENTE', payment: 'PENDIENTE' },
        logistics: {
          provider1: 'ANICAM',
          provider2: 'SERPOST',
          trackingNumber: null,
          alert: 'PREALERTA',
          estimatedDelivery: '2025-01-26',
          deliveredDate: null
        },
        purchase: {
          date: '2025-01-23',
          time: '14:40',
          price: 139.99,
          currency: 'USD',
          paymentMethod: 'Credit Card'
        },
        amazon: { available: true, stock: 22, prime: true },
        financial: { total: 420000, commission: 63000, net: 357000, profit: 95000, margin: 23 },
        location: { country: 'PERU', city: 'Trujillo', region: 'La Libertad' },
        priority: 'low',
        notes: 'Para leer durante viajes',
        tags: ['Lectura', 'Kindle', 'Amazon'],
        salesRep: 'Laura Mendez',
        probability: 80
      },
      {
        id: 'MLA-2025021',
        number: 'ORD-2025021',
        sku: 'B09TUV901',
        productTitle: 'Meta Quest 3 VR Headset 128GB All-in-One Virtual Reality...',
        productImage: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=100&h=100&fit=crop',
        customer: {
          name: 'Valeria Gutierrez',
          email: 'valeria.gutierrez@email.com',
          phone: '+54 11 6789 0123',
          document: 'DNI 32.456.789',
          rating: 4.0,
          totalOrders: 3,
          avatar: '/api/placeholder/32/32',
          industry: 'Gaming',
          conversionRate: 68,
          avgResponseTime: 4.2
        },
        amount: 1380000,
        currency: 'ARS',
        status: 'cancelado',
        shippingStatus: 'pendiente',
        createdDate: '2025-01-22',
        lastActivity: '2025-01-23',
        validUntil: '2025-02-22',
        items: 1,
        minutesAgo: 420,
        orderStatus: { main: 'CANCELADO', shipping: 'PENDIENTE', payment: 'CANCELADO' },
        logistics: {
          provider1: 'ANICAM',
          provider2: 'MERCADOENVIOS',
          trackingNumber: null,
          alert: 'CANCELADO',
          estimatedDelivery: null,
          deliveredDate: null
        },
        purchase: {
          date: '2025-01-22',
          time: '20:15',
          price: 599.99,
          currency: 'USD',
          paymentMethod: 'MercadoPago'
        },
        amazon: { available: true, stock: 1, prime: false },
        financial: { total: 1380000, commission: 0, net: 0, profit: 0, margin: 0 },
        location: { country: 'ARGENTINA', city: 'Mendoza', region: 'Mendoza' },
        priority: 'low',
        notes: 'Cancelado - Producto muy caro',
        tags: ['Cancelado', 'VR', 'Meta Quest'],
        salesRep: 'Pedro Garcia',
        probability: 0
      },
      {
        id: 'MLC-2025022',
        number: 'ORD-2025022',
        sku: 'B07WXY234',
        productTitle: 'Canon EOS R6 Mark II Mirrorless Camera Body 24.2MP Full...',
        productImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=100&h=100&fit=crop',
        customer: {
          name: 'Sebastián Lagos',
          email: 'sebastian.lagos@email.com',
          phone: '+56 9 0123 4567',
          document: 'RUT 14.567.890-1',
          rating: 4.7,
          totalOrders: 21,
          avatar: '/api/placeholder/32/32',
          industry: 'Fotografía Profesional',
          conversionRate: 94,
          avgResponseTime: 1.6
        },
        amount: 4800000,
        currency: 'CLP',
        status: 'aprobado',
        shippingStatus: 'pendiente',
        createdDate: '2025-01-23',
        lastActivity: '2025-01-23',
        validUntil: '2025-02-23',
        items: 1,
        minutesAgo: 25,
        orderStatus: { main: 'APROBADO', shipping: 'PENDIENTE', payment: 'PAGADO' },
        logistics: {
          provider1: 'ANICAM',
          provider2: 'CHILEXPRESS',
          trackingNumber: 'CHX654987321',
          alert: 'DOCUMENTOS',
          estimatedDelivery: '2025-01-28',
          deliveredDate: null
        },
        purchase: {
          date: '2025-01-23',
          time: '15:35',
          price: 2499.99,
          currency: 'USD',
          paymentMethod: 'Bank Transfer'
        },
        amazon: { available: true, stock: 1, prime: false },
        financial: { total: 4800000, commission: 720000, net: 4080000, profit: 950000, margin: 20 },
        location: { country: 'CHILE', city: 'Puerto Montt', region: 'Los Lagos' },
        priority: 'high',
        notes: 'Equipo profesional - Manejar con extremo cuidado',
        tags: ['Profesional', 'Canon', 'Fotografía'],
        salesRep: 'Maria Elena',
        probability: 95
      },
      {
        id: 'MCO-2025023',
        number: 'ORD-2025023',
        sku: 'B08ZAB567',
        productTitle: 'Microsoft Surface Pro 9 13" Touch Intel i7 16GB 512GB...',
        productImage: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=100&h=100&fit=crop',
        customer: {
          name: 'Carmen Delgado',
          email: 'carmen.delgado@email.com',
          phone: '+57 305 678 9012',
          document: 'CC 65.432.109-8',
          rating: 4.4,
          totalOrders: 10,
          avatar: '/api/placeholder/32/32',
          industry: 'Diseño Digital',
          conversionRate: 81,
          avgResponseTime: 2.8
        },
        amount: 3200000,
        currency: 'COP',
        status: 'procesando',
        shippingStatus: 'pendiente',
        createdDate: '2025-01-23',
        lastActivity: '2025-01-23',
        validUntil: '2025-02-23',
        items: 1,
        minutesAgo: 150,
        orderStatus: { main: 'PROCESANDO', shipping: 'PENDIENTE', payment: 'PENDIENTE' },
        logistics: {
          provider1: 'ANICAM',
          provider2: 'COORDINADORA',
          trackingNumber: null,
          alert: 'PREALERTA',
          estimatedDelivery: '2025-01-30',
          deliveredDate: null
        },
        purchase: {
          date: '2025-01-23',
          time: '12:30',
          price: 1299.99,
          currency: 'USD',
          paymentMethod: 'Credit Card'
        },
        amazon: { available: true, stock: 3, prime: true },
        financial: { total: 3200000, commission: 480000, net: 2720000, profit: 650000, margin: 20 },
        location: { country: 'COLOMBIA', city: 'Cartagena', region: 'Bolívar' },
        priority: 'medium',
        notes: 'Para diseño profesional - Verificar specs',
        tags: ['Diseño', 'Microsoft', 'Surface'],
        salesRep: 'Miguel Santos',
        probability: 82
      },
      {
        id: 'MPE-2025024',
        number: 'ORD-2025024',
        sku: 'B09CDE890',
        productTitle: 'Beats Studio Buds True Wireless Earbuds Active Noise...',
        productImage: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=100&h=100&fit=crop',
        customer: {
          name: 'Rodrigo Flores',
          email: 'rodrigo.flores@email.com',
          phone: '+51 987 234 567',
          document: 'DNI 98.765.432',
          rating: 3.9,
          totalOrders: 6,
          avatar: '/api/placeholder/32/32',
          industry: 'Música',
          conversionRate: 71,
          avgResponseTime: 3.5
        },
        amount: 480000,
        currency: 'PEN',
        status: 'aprobado',
        shippingStatus: 'enviado',
        createdDate: '2025-01-22',
        lastActivity: '2025-01-23',
        validUntil: '2025-02-22',
        items: 1,
        minutesAgo: 210,
        orderStatus: { main: 'APROBADO', shipping: 'ENVIADO', payment: 'PAGADO' },
        logistics: {
          provider1: 'ANICAM',
          provider2: 'SERPOST',
          trackingNumber: 'SP234567890',
          alert: 'EN_TRANSITO',
          estimatedDelivery: '2025-01-25',
          deliveredDate: null
        },
        purchase: {
          date: '2025-01-22',
          time: '11:20',
          price: 149.99,
          currency: 'USD',
          paymentMethod: 'PayPal'
        },
        amazon: { available: true, stock: 19, prime: true },
        financial: { total: 480000, commission: 72000, net: 408000, profit: 110000, margin: 23 },
        location: { country: 'PERU', city: 'Piura', region: 'Piura' },
        priority: 'low',
        notes: 'Para estudio de grabación personal',
        tags: ['Audio', 'Beats', 'Wireless'],
        salesRep: 'Laura Mendez',
        probability: 85
      },
      {
        id: 'MLA-2025025',
        number: 'ORD-2025025',
        sku: 'B08FGH123',
        productTitle: 'Tesla Model Y Wireless Phone Charger Pad 15W Fast Charging...',
        productImage: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=100&h=100&fit=crop',
        customer: {
          name: 'Patricio Vargas',
          email: 'patricio.vargas@email.com',
          phone: '+54 11 7890 1234',
          document: 'DNI 28.901.234',
          rating: 4.6,
          totalOrders: 17,
          avatar: '/api/placeholder/32/32',
          industry: 'Automotriz',
          conversionRate: 89,
          avgResponseTime: 2.3
        },
        amount: 320000,
        currency: 'ARS',
        status: 'aprobado',
        shippingStatus: 'entregado',
        createdDate: '2025-01-21',
        lastActivity: '2025-01-23',
        validUntil: '2025-02-21',
        items: 1,
        minutesAgo: 600,
        orderStatus: { main: 'ENTREGADO', shipping: 'ENTREGADO', payment: 'PAGADO' },
        logistics: {
          provider1: 'ANICAM',
          provider2: 'MERCADOENVIOS',
          trackingNumber: 'ME567890234',
          alert: 'COMPLETADO',
          estimatedDelivery: '2025-01-23',
          deliveredDate: '2025-01-23'
        },
        purchase: {
          date: '2025-01-21',
          time: '17:50',
          price: 79.99,
          currency: 'USD',
          paymentMethod: 'MercadoPago'
        },
        amazon: { available: true, stock: 25, prime: true },
        financial: { total: 320000, commission: 48000, net: 272000, profit: 85000, margin: 27 },
        location: { country: 'ARGENTINA', city: 'Mar del Plata', region: 'Buenos Aires' },
        priority: 'low',
        notes: 'Accesorio Tesla entregado perfectamente',
        tags: ['Tesla', 'Accesorio', 'Completado'],
        salesRep: 'Carlos Rodriguez',
        probability: 100
      },
      {
        id: 'MLC-2025026',
        number: 'ORD-2025026',
        sku: 'B07IJK456',
        productTitle: 'Logitech MX Master 3S Wireless Mouse Advanced Precise...',
        productImage: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=100&h=100&fit=crop',
        customer: {
          name: 'Fernanda Reyes',
          email: 'fernanda.reyes@email.com',
          phone: '+56 9 1234 5678',
          document: 'RUT 16.234.567-8',
          rating: 4.8,
          totalOrders: 24,
          avatar: '/api/placeholder/32/32',
          industry: 'Programación',
          conversionRate: 95,
          avgResponseTime: 1.2
        },
        amount: 280000,
        currency: 'CLP',
        status: 'aprobado',
        shippingStatus: 'pendiente',
        createdDate: '2025-01-23',
        lastActivity: '2025-01-23',
        validUntil: '2025-02-23',
        items: 1,
        minutesAgo: 10,
        orderStatus: { main: 'APROBADO', shipping: 'PENDIENTE', payment: 'PAGADO' },
        logistics: {
          provider1: 'ANICAM',
          provider2: 'CHILEXPRESS',
          trackingNumber: 'CHX789012345',
          alert: 'PREALERTA',
          estimatedDelivery: '2025-01-25',
          deliveredDate: null
        },
        purchase: {
          date: '2025-01-23',
          time: '15:50',
          price: 99.99,
          currency: 'USD',
          paymentMethod: 'Credit Card'
        },
        amazon: { available: true, stock: 13, prime: true },
        financial: { total: 280000, commission: 42000, net: 238000, profit: 75000, margin: 27 },
        location: { country: 'CHILE', city: 'Temuco', region: 'Araucanía' },
        priority: 'medium',
        notes: 'Desarrolladora de software - Cliente frecuente',
        tags: ['Tech', 'Logitech', 'Programación'],
        salesRep: 'Maria Elena',
        probability: 92
      }
    ];

    setTimeout(() => {
      setOrders(mockOrdersData);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrar y ordenar órdenes
  const allFilteredOrders = orders
    .filter(order => {
      // Búsqueda general (searchTerm + quickSearch)
      const searchQuery = (searchTerm + ' ' + quickSearch).toLowerCase();
      const matchesSearch = 
        order.productTitle.toLowerCase().includes(searchQuery) ||
        order.customer.name.toLowerCase().includes(searchQuery) ||
        order.number.toLowerCase().includes(searchQuery) ||
        order.id.toLowerCase().includes(searchQuery) ||
        order.location.city.toLowerCase().includes(searchQuery) ||
        order.location.country.toLowerCase().includes(searchQuery);
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesCountry = countryFilter === 'all' || order.location.country === countryFilter;
      
      // Filtro de etiquetas
      const matchesTags = activeTagFilters.length === 0 || 
        (order.tags && activeTagFilters.every(tag => order.tags.includes(tag)));
      
      // Filtro universal
      let matchesUniversalFilter = true;
      switch (universalFilter) {
        case 'high-priority':
          matchesUniversalFilter = order.priority === 'high';
          break;
        case 'today':
          matchesUniversalFilter = new Date(order.createdDate).toDateString() === new Date().toDateString();
          break;
        case 'this-week':
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          matchesUniversalFilter = new Date(order.createdDate) >= weekAgo;
          break;
        case 'vip-customers':
          matchesUniversalFilter = order.tags && order.tags.includes('VIP');
          break;
        case 'pending-payment':
          matchesUniversalFilter = order.orderStatus && order.orderStatus.payment === 'PENDIENTE';
          break;
        default:
          matchesUniversalFilter = true;
      }
      
      return matchesSearch && matchesStatus && matchesCountry && matchesTags && matchesUniversalFilter;
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

  // Calcular paginación
  const totalPages = Math.ceil(allFilteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  
  // Filtrado normal sin IA
  const sortedFilteredOrders = allFilteredOrders;
    
  const filteredOrders = sortedFilteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Cambiar página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, countryFilter, quickSearch, universalFilter]);

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
      'PERU': '🇵🇪',
      'PERÚ': '🇵🇪',
      'COLOMBIA': '🇨🇴',
      'ECUADOR': '🇪🇨',
      'MEXICO': '🇲🇽',
      'ARGENTINA': '🇦🇷'
    };
    return flags[country] || '🇺🇳'; // Flag por defecto si no encuentra el país específico
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
    if (selectedOrders.size === allFilteredOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(allFilteredOrders.map(o => o.id)));
    }
  };

  // Funciones para manejo de órdenes de Amazon
  const handleAddAmazonOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    setSelectedOrderForAmazon(order);
    setTempAmazonOrders(order?.amazonOrders || []);
    setShowAmazonOrderModal(true);
  };

  const handleAddNewAmazonOrder = () => {
    const newOrder = {
      id: Date.now(),
      orderNumber: '',
      isPrimary: tempAmazonOrders.length === 0,
      createdAt: new Date().toISOString()
    };
    setTempAmazonOrders([...tempAmazonOrders, newOrder]);
  };

  const handleUpdateAmazonOrder = (id, orderNumber) => {
    setTempAmazonOrders(prev => 
      prev.map(order => 
        order.id === id ? {...order, orderNumber} : order
      )
    );
  };

  const handleSetPrimaryOrder = (id) => {
    setTempAmazonOrders(prev => 
      prev.map(order => ({
        ...order,
        isPrimary: order.id === id
      }))
    );
  };

  const handleRemoveAmazonOrder = (id) => {
    setTempAmazonOrders(prev => {
      const filtered = prev.filter(order => order.id !== id);
      // Si eliminamos la principal, hacer la primera como principal
      if (filtered.length > 0 && !filtered.some(o => o.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const handleSaveAmazonOrders = () => {
    // Actualizar la orden con las nuevas órdenes de Amazon
    console.log('Guardando órdenes:', tempAmazonOrders);
    // Simular actualización de la orden con las nuevas órdenes
    const updatedOrders = orders.map(order => 
      order.id === selectedOrderForAmazon.id 
        ? {
            ...order, 
            amazonOrders: tempAmazonOrders.filter(ao => ao.orderNumber.trim()),
            amazonOrderId: tempAmazonOrders.find(o => o.isPrimary)?.orderNumber
          }
        : order
    );
    console.log('Orden actualizada:', updatedOrders.find(o => o.id === selectedOrderForAmazon.id));
    
    setShowAmazonOrderModal(false);
    setSelectedOrderForAmazon(null);
    setTempAmazonOrders([]);
  };

  const handlePackageClick = (amazonOrderId) => {
    if (amazonOrderId) {
      const amazonUrl = `https://www.amazon.com/gp/your-account/order-details?orderID=${amazonOrderId}`;
      window.open(amazonUrl, '_blank');
    } else {
      console.log('No hay número de orden de Amazon asignado');
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


      {/* Métricas Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Órdenes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-lg">
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
              <div className="p-3 bg-green-50 rounded-lg">
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
              <div className="p-3 bg-purple-50 rounded-lg">
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
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Timer className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tiempo Procesamiento</p>
                <p className="text-2xl font-bold text-gray-900">3.2 días</p>
                <p className="text-xs text-yellow-600 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  Promedio histórico
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOOLBAR SIMPLE - Solo Búsqueda y Filtros Avanzados */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center gap-4">
          
          {/* Búsqueda Principal */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar órdenes, clientes, productos..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
            />
          </div>

          {/* Botón Filtros Avanzados */}
          <button
            onClick={() => setShowAdvancedFilters(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-colors duration-200"
          >
            <Filter className="h-4 w-4" />
            Filtros Avanzados
          </button>

          {/* Contador de Resultados */}
          <div className="text-sm text-gray-600 font-medium hidden sm:block flex-1">
            {allFilteredOrders.length} resultados
          </div>

          {/* Lado Derecho - Controles de Vista e Import/Export */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Grid View */}
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors duration-200 ${
                viewMode === 'grid'
                  ? 'text-blue-600 bg-blue-100'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              }`}
              title="Vista en cuadrícula"
            >
              <span className="block w-4 h-4 text-xs leading-none">⊞</span>
            </button>

            {/* List View */}
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors duration-200 ${
                viewMode === 'list'
                  ? 'text-blue-600 bg-blue-100'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              }`}
              title="Vista en lista"
            >
              <span className="block w-4 h-4 text-xs leading-none">☰</span>
            </button>

            {/* Separador */}
            <div className="w-px h-4 bg-gray-300 mx-1"></div>

            {/* Importar */}
            <button
              onClick={() => handleOrderAction('import')}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors duration-200"
              title="Importar órdenes"
            >
              <Download className="h-4 w-4" />
            </button>

            {/* Exportar */}
            <button
              onClick={() => handleOrderAction('export-selected')}
              className={`p-1.5 rounded transition-colors duration-200 ${
                selectedOrders.size > 0 
                  ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-200' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              title={`Exportar ${selectedOrders.size > 0 ? `${selectedOrders.size} órdenes` : 'selecciona órdenes'}`}
              disabled={selectedOrders.size === 0}
            >
              <Upload className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL FILTROS AVANZADOS */}
      {showAdvancedFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Header del Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Filtros Avanzados</h2>
              <button
                onClick={() => setShowAdvancedFilters(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 space-y-6">
              
              {/* Estados */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Estado de la Orden</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['aprobado', 'procesando', 'enviado', 'entregado', 'cancelado', 'pendiente'].map((status) => (
                    <label key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                        checked={statusFilter === status}
                        onChange={(e) => setStatusFilter(e.target.checked ? status : 'all')}
                      />
                      <span className="text-sm text-gray-700 capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Países */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Países</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { code: 'COLOMBIA', flag: '🇨🇴', name: 'Colombia' },
                    { code: 'CHILE', flag: '🇨🇱', name: 'Chile' },
                    { code: 'PERU', flag: '🇵🇪', name: 'Perú' },
                    { code: 'ECUADOR', flag: '🇪🇨', name: 'Ecuador' },
                    { code: 'ARGENTINA', flag: '🇦🇷', name: 'Argentina' },
                    { code: 'MEXICO', flag: '🇲🇽', name: 'México' }
                  ].map((country) => (
                    <label key={country.code} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                        checked={countryFilter === country.code}
                        onChange={(e) => setCountryFilter(e.target.checked ? country.code : 'all')}
                      />
                      <span className="text-sm text-gray-700">{country.flag} {country.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rango de Fechas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Rango de Fechas</label>
                <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="all">Todas las fechas</option>
                  <option value="today">Hoy</option>
                  <option value="yesterday">Ayer</option>
                  <option value="week">Esta semana</option>
                  <option value="month">Este mes</option>
                  <option value="quarter">Último trimestre</option>
                </select>
              </div>

              {/* Etiquetas */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Etiquetas {activeTagFilters.length > 0 && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {activeTagFilters.length} seleccionada{activeTagFilters.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </label>
                  {activeTagFilters.length > 0 && (
                    <button
                      onClick={() => setActiveTagFilters([])}
                      className="text-xs text-red-600 hover:text-red-800 transition-colors"
                    >
                      Limpiar etiquetas
                    </button>
                  )}
                </div>
                
                {/* Etiquetas seleccionadas actualmente */}
                {activeTagFilters.length > 0 && (
                  <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-xs text-blue-700 mb-1">Filtros activos:</div>
                    <div className="flex flex-wrap gap-1">
                      {activeTagFilters.map((tag, idx) => (
                        <span key={idx} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getTagColor(tag)}`}>
                          {tag}
                          <button
                            onClick={() => setActiveTagFilters(activeTagFilters.filter(t => t !== tag))}
                            className="ml-1 hover:text-red-600 transition-colors"
                          >
                            <X className="h-2 w-2" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Buscador de Etiquetas con Autocompletado */}
                <div className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar etiquetas..."
                      value={tagSearchTerm || ''}
                      onChange={(e) => setTagSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  
                  {/* Sugerencias de Etiquetas */}
                  {tagSearchTerm && tagSearchTerm.length > 0 && (() => {
                    const allTags = [...new Set(orders.flatMap(order => order.tags || []))];
                    const filteredTags = allTags.filter(tag => 
                      tag.toLowerCase().includes(tagSearchTerm.toLowerCase()) &&
                      !activeTagFilters.includes(tag)
                    ).sort();
                    
                    return filteredTags.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredTags.slice(0, 8).map((tag, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setActiveTagFilters([...activeTagFilters, tag]);
                              setTagSearchTerm('');
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between group transition-colors"
                          >
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getTagColor(tag)} group-hover:opacity-80`}>
                              {tag}
                            </span>
                            <Plus className="h-3 w-3 text-gray-400 group-hover:text-blue-600" />
                          </button>
                        ))}
                        
                        {/* Mostrar "crear nueva etiqueta" si no existe */}
                        {!allTags.some(tag => tag.toLowerCase() === tagSearchTerm.toLowerCase()) && tagSearchTerm.trim().length > 0 && (
                          <button
                            onClick={() => {
                              setActiveTagFilters([...activeTagFilters, tagSearchTerm.trim()]);
                              setTagSearchTerm('');
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center justify-between group transition-colors border-t border-gray-100"
                          >
                            <span className="text-sm text-gray-700">
                              Crear "<span className="font-medium text-blue-600">{tagSearchTerm.trim()}</span>"
                            </span>
                            <Plus className="h-3 w-3 text-blue-500" />
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </div>
                
                {/* Mensaje si no hay etiquetas */}
                {orders.every(order => !order.tags || order.tags.length === 0) && (
                  <div className="text-center py-4 text-gray-500 text-sm mt-4">
                    <Tag className="h-6 w-6 mx-auto mb-2 text-gray-300" />
                    <p>No hay etiquetas disponibles</p>
                    <p className="text-xs mt-1">Escribe arriba para crear una nueva</p>
                  </div>
                )}
              </div>

              {/* Rango de Valores */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Rango de Valores</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Mínimo</label>
                    <input
                      type="number"
                      placeholder="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Máximo</label>
                    <input
                      type="number"
                      placeholder="10000"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setCountryFilter('all');
                  setActiveTagFilters([]);
                  setTagSearchTerm('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Limpiar Todo
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAdvancedFilters(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowAdvancedFilters(false)}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BARRA DELGADA - Selección y Controles de Vista */}
      <div className="bg-white border border-gray-200 rounded-md px-4 py-2 mb-4 mt-1 flex items-center justify-between">
        
        {/* Lado Izquierdo - Selección de Órdenes */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              checked={selectedOrders.size === allFilteredOrders.length && allFilteredOrders.length > 0}
              onChange={handleSelectAll}
            />
            Seleccionar todas ({selectedOrders.size})
          </label>
          
          {selectedOrders.size > 0 && (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-300">
              <span className="text-xs text-gray-500">{selectedOrders.size} seleccionadas</span>
              <button
                onClick={() => setSelectedOrders(new Set())}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Limpiar
              </button>
            </div>
          )}
          
          {/* Etiquetas Activas como Filtros */}
          {activeTagFilters.length > 0 && (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-300">
              <span className="text-xs text-gray-500">Filtros:</span>
              {activeTagFilters.map((tag, idx) => (
                <span 
                  key={idx}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getTagColor(tag)}`}
                >
                  {tag}
                  <button
                    onClick={() => setActiveTagFilters(activeTagFilters.filter(t => t !== tag))}
                    className="hover:text-red-600 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                onClick={() => setActiveTagFilters([])}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Lado Derecho - Info de Selección */}
        <div className="text-xs text-gray-500">
          {selectedOrders.size > 0 && (
            <span>{selectedOrders.size} de {allFilteredOrders.length} seleccionadas</span>
          )}
        </div>
      </div>

      {/* Barra IA delgada */}
      <div className="bg-white border border-gray-200 rounded-md px-4 py-2 mb-4 mt-1 flex items-center justify-between">
          {/* Lado izquierdo - Etiquetas */}
          <div className="flex items-center gap-2 flex-1">
            {/* Placeholder text cuando no hay etiquetas */}
            {!showIATags && selectedIATags.length === 0 && (
              <span className="text-xs text-purple-600 italic">
                Analizar mensajes de clientes con IA
              </span>
            )}
          </div>

          {/* Lado derecho - Botones IA */}
          <div className="flex items-center gap-1">
            {/* Botón Reglas Automáticas */}
            <button
              onClick={runBusinessRulesAnalysis}
              className="p-1 rounded transition-all duration-200 hover:bg-green-100 text-green-600"
              title="Aplicar reglas de negocio automáticas"
            >
              <Zap className="h-4 w-4" />
            </button>
            
            {/* Botón Robot IA */}
            <button
              onClick={runIntelligentAnalysis}
              className={`text-xl p-1 rounded transition-all duration-200 ${
                isAnalyzing
                  ? 'bg-blue-200 text-blue-700 shadow-sm animate-pulse'
                  : showIATags || selectedIATags.length > 0 
                    ? 'bg-purple-200 text-purple-700 shadow-sm' 
                    : 'hover:bg-purple-100 text-purple-600'
              }`}
              title={isAnalyzing ? "Analizando mensajes ML..." : "Analizar mensajes con IA"}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : '🤖'}
            </button>
          </div>

          {/* Etiquetas IA */}
          {showIATags && (
            <>
              <div className="flex items-center gap-1 flex-wrap">
                {lastAnalysisTags.map(tag => {
                  // Contar cuántas órdenes tienen esta etiqueta
                  const tagCount = orders.filter(order => order.tags?.includes(tag)).length;
                  
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleIATag(tag)}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ${
                        selectedIATags.includes(tag)
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-white border border-purple-300 text-purple-700 hover:bg-purple-100'
                      }`}
                    >
                      {tag} {tagCount}
                    </button>
                  );
                })}
              </div>

              {/* Botón Limpiar */}
              {selectedIATags.length > 0 && (
                <button
                  onClick={clearIAFilters}
                  className="ml-auto px-2 py-0.5 bg-white border border-purple-300 text-purple-700 rounded text-xs font-medium hover:bg-purple-100 transition-colors duration-200"
                >
                  Limpiar
                </button>
              )}
            </>
          )}

          {/* Contador de filtros activos */}
          {!showIATags && selectedIATags.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-purple-700 font-medium">
                {selectedIATags.length} filtros IA:
              </span>
              <div className="flex gap-1">
                {selectedIATags.map(tag => {
                  const tagCount = orders.filter(order => order.tags?.includes(tag)).length;
                  return (
                    <span key={tag} className="px-2 py-0.5 bg-purple-600 text-white rounded-full text-xs font-medium">
                      {tag} {tagCount}
                    </span>
                  );
                })}
              </div>
              <button
                onClick={clearIAFilters}
                className="ml-2 text-xs text-purple-700 hover:text-purple-900 underline"
              >
                Limpiar
              </button>
            </div>
          )}
      </div>

      {/* Vista de órdenes - Grid o Lista */}
      <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "grid grid-cols-1 gap-4"}>
        {filteredOrders.map((order, index) => {
          const StatusIcon = orderStatuses[order.status].icon;
          const orderNumber = (currentPage - 1) * ordersPerPage + index + 1;
          
          const getPriorityColor = (priority) => {
            switch (priority) {
              case 'high': return 'border border-gray-400';
              case 'medium': return 'border border-gray-300';
              case 'low': return 'border border-gray-200';
              default: return 'border border-gray-250';
            }
          };
          
          return (
            <div 
              key={order.id} 
              className={`bg-white rounded-lg shadow-sm p-4 md:p-5 hover:shadow-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer relative ${getPriorityColor(order.priority)}`}
            >

              {/* Número de orden minimalista */}
              <div className="absolute top-3 left-3 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                #{orderNumber}
              </div>
              {/* Header de la tarjeta */}
              {/* OPCIÓN 4: Layout de Tarjetas Pequeñas */}
              <div className="mb-4">
                {/* Header único con producto e info principal */}
                <div className="bg-blue-50 border border-blue-200 rounded-t-lg p-3">
                  <div className="flex items-start space-x-3">
                    {/* Checkbox de selección */}
                    <label className="flex items-center mt-1">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedOrders.has(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                      />
                    </label>
                    
                    {/* Imagen real del producto */}
                    <div className="relative">
                      <img 
                        src={order.productImage} 
                        alt={order.productTitle}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/48x48/f3f4f6/6b7280?text=IMG';
                        }}
                      />
                      {/* Indicador de tiempo transcurrido */}
                      <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full ${getTimeColor(order.minutesAgo)} flex items-center justify-center`}>
                        <span className="text-[10px] font-bold text-white leading-none">
                          {formatTimeShort(order.minutesAgo)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Información del producto compacta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 mr-3">
                          {/* Estados de la orden arriba del producto */}
                          <div className="flex gap-2 mb-1">
                            {/* Estado de Compra */}
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${orderStatuses[order.status].color}`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {orderStatuses[order.status].label}
                            </span>
                            
                            {/* Estado de Envío */}
                            {(() => {
                              const ShippingIcon = shippingStatuses[order.shippingStatus]?.icon || Clock;
                              return (
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${shippingStatuses[order.shippingStatus]?.color || 'bg-gray-100 text-gray-800'}`}>
                                  <ShippingIcon className="h-3 w-3 mr-1" />
                                  {shippingStatuses[order.shippingStatus]?.label || 'Pendiente'}
                                </span>
                              );
                            })()}
                          </div>
                          <h3 className="text-sm font-bold text-gray-900 truncate">
                            {order.productTitle}
                          </h3>
                          
                          {/* ID y Order Number en la misma línea */}
                          <div className="text-xs mt-1">
                            <div className="flex items-center">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                {order.id}
                              </span>
                              <span className="ml-2 text-gray-500">Order # </span>
                              <a 
                                href={`#order/${order.orderNumber || '2000012784807490'}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
                                title={`Ver orden: ${order.orderNumber || '2000012784807490'}`}
                              >
                                {order.orderNumber || '2000012784807490'}
                              </a>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOrderInfoClick(order, e);
                                }}
                                className="ml-1 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                title="Ver información completa"
                              >
                                <Info className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Ubicación alineada a la misma altura */}
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-lg mr-1">{getCountryFlag(order.location.country)}</span>
                          <span className="text-xs text-gray-600 font-medium">{order.location.city}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel Logístico arriba - Visual Tracker */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-1.5 mb-2">
                <div className="flex items-center gap-1 mb-1">
                  <Truck className="text-blue-600" size={12} />
                  <span className="text-xs font-medium text-blue-700">Logística:</span>
                  
                  {/* Badges de Proveedores Logísticos */}
                  {/* Anicam - Colombia y Perú */}
                  {(order.location?.country === 'COLOMBIA' || order.location?.country === 'PERÚ') && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">
                      Anicam
                    </span>
                  )}
                  
                  {/* Chilexpress - Chile */}
                  {order.location?.country === 'CHILE' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-100 text-violet-900">
                      Chilexpress
                    </span>
                  )}
                  
                  {/* Fallback para otros países o datos no disponibles */}
                  {(!order.location?.country || (order.location?.country !== 'COLOMBIA' && order.location?.country !== 'PERÚ' && order.location?.country !== 'CHILE')) && (
                    <div className="flex gap-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">
                        Anicam
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-100 text-violet-900">
                        Chilexpress
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Progress Tracker - Desktop */}
                <div className="hidden md:block">
                  <div className="flex items-center justify-between relative">
                    {/* Background Line */}
                    <div className="absolute top-3 left-3 right-3 h-0.5 bg-gray-200"></div>
                    
                    {/* Active Progress Line - Based on current state */}
                    <div className="absolute top-3 left-3 h-0.5 bg-blue-500" style={{width: '33%'}}></div>
                    
                    {/* Status Icons and Labels */}
                    <div className="flex flex-col items-center relative z-10">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mb-0.5">
                        <Package className="text-white" size={12} />
                      </div>
                      <span className="text-[10px] font-medium text-blue-600">Prealertado</span>
                    </div>
                    
                    <div className="flex flex-col items-center relative z-10">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mb-0.5">
                        <svg className="text-white" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                        </svg>
                      </div>
                      <span className="text-[10px] font-medium text-blue-600">En Miami</span>
                    </div>
                    
                    <div className="flex flex-col items-center relative z-10">
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center mb-0.5">
                        <Truck className="text-gray-500" size={12} />
                      </div>
                      <span className="text-[10px] text-gray-500">En Ruta</span>
                    </div>
                    
                    <div className="flex flex-col items-center relative z-10">
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center mb-0.5">
                        <svg className="text-gray-500" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                        </svg>
                      </div>
                      <span className="text-[10px] text-gray-500">Entregado</span>
                    </div>
                  </div>
                </div>
                
                {/* Progress Tracker - Mobile Vertical */}
                <div className="block md:hidden">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <Package className="text-white" size={10} />
                      </div>
                      <span className="text-xs font-medium text-blue-600">Prealertado</span>
                      <div className="flex-1 h-px bg-blue-500"></div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg className="text-white" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-blue-600">En Miami</span>
                      <div className="flex-1 h-px bg-blue-500"></div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                        <Truck className="text-gray-500" size={10} />
                      </div>
                      <span className="text-xs text-gray-500">En Ruta</span>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                        <svg className="text-gray-500" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                        </svg>
                      </div>
                      <span className="text-xs text-gray-500">Entregado</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid inferior - Proveedor y Financiero */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 mb-3">
                {/* Panel Proveedor - Minimalista */}
                <div className="bg-white rounded-lg border border-gray-200 p-3 relative">
                  {/* Botón + para agregar orden - Esquina superior derecha */}
                  <div className="absolute top-2 right-2">
                    <button 
                      onClick={() => handleAddAmazonOrder(order.id)}
                      className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                      title="Agregar número de orden de Amazon"
                    >
                      <Plus 
                        size={12} 
                        className="text-blue-500 hover:text-blue-600" 
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between pr-8">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg cursor-pointer ${
                        (order.amazonOrders && order.amazonOrders.length > 0) ? 'bg-green-50' : 'bg-orange-50'
                      }`} onClick={() => {
                        const primaryOrder = order.amazonOrders?.find(ao => ao.isPrimary);
                        handlePackageClick(primaryOrder?.orderNumber);
                      }}>
                        <Package className={`h-4 w-4 ${
                          (order.amazonOrders && order.amazonOrders.length > 0) ? 'text-green-600' : 'text-orange-600'
                        }`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Amazon : B07IJK456</p>
                        <p className="text-xs text-gray-600">12 Agosto 2025</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">$12.97</p>
                      <p className="text-xs text-gray-600">{order.weightLbs || '1.1 lbs'}</p>
                    </div>
                  </div>
                </div>

                {/* Panel Financiero - Minimalista */}
                <div className="bg-white rounded-lg border border-gray-200 p-3 relative">
                  {/* Info icon with tooltip - Esquina superior derecha */}
                  <div className="absolute top-2 right-2">
                    <button 
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                      onClick={() => setShowTooltip(!showTooltip)}
                      className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                    >
                      <Info 
                        size={12} 
                        className="text-blue-500 hover:text-blue-600" 
                      />
                    </button>
                    
                    {/* Tooltip */}
                    {showTooltip && (
                      <div className="absolute right-0 top-6 z-50 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 animate-in fade-in-0 zoom-in-95 duration-200">
                        {/* Tooltip Arrow */}
                        <div className="absolute -top-1 right-3 w-2 h-2 bg-white border-l border-t border-gray-200 rotate-45"></div>
                        
                        <div className="text-xs font-semibold text-gray-700 mb-2">Desglose Financiero</div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-600">💰 Precio producto</span>
                            <span className="text-xs font-medium text-gray-700">{formatCurrency(150000)}</span>
                          </div>
                          
                          <div className="border-l-2 border-red-200 pl-2 space-y-0.5 ml-1">
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500">📊 Cargos venta</span>
                              <span className="text-xs text-red-600">-{formatCurrency(18000)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500">📦 Envío local</span>
                              <span className="text-xs text-red-600">-{formatCurrency(5000)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500">🏛️ Impuestos</span>
                              <span className="text-xs text-red-600">-{formatCurrency(2200)}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-100 pt-0.5">
                              <span className="text-xs font-medium text-gray-600">💸 Subtotal</span>
                              <span className="text-xs font-medium text-gray-700">{formatCurrency(124800)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500">✈️ Cargos int.</span>
                              <span className="text-xs text-red-600">-{formatCurrency(79000)}</span>
                            </div>
                          </div>
                          
                          <div className="bg-green-50 rounded-md p-1.5 mt-2 border border-green-200">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-semibold text-green-700">💚 Utilidad Final</span>
                              <span className="text-xs font-bold text-green-600">{formatCurrency(45800)} (30%)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pr-8">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <DollarSign className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Utilidad</p>
                        <p className="text-xs text-gray-600">{formatCurrency(45800)} (30%)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(124800)}</p>
                      <p className="text-xs text-gray-600">Neto</p>
                    </div>
                  </div>
                </div>
              </div>


              {/* Panel de Mensajería Multicanal */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="text-blue-600" size={14} />
                    <span className="text-xs font-medium text-blue-700">Mensajería</span>
                  </div>
                  
                  {/* Switch de canales ML/WhatsApp */}
                  <div className="flex bg-white rounded border overflow-hidden">
                    <button className="px-2 py-1 text-xs bg-blue-500 text-white">
                      📨 ML
                    </button>
                    <button className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-50">
                      💬 WA
                    </button>
                  </div>
                </div>
                
                {/* Último mensaje del cliente */}
                <div className="bg-white border border-gray-200 rounded p-2 mb-2">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="text-gray-600" size={10} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-700">Cliente</span>
                        <span className="text-xs text-gray-500">hace 2h</span>
                      </div>
                      <p className="text-xs text-gray-800 line-clamp-2">
                        Hola, ¿podrían confirmarme cuándo llegará mi pedido? Ya pasaron 3 días desde que lo comprè...
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Campo de respuesta compacto */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Escribir respuesta..."
                    className="flex-1 text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    onClick={() => handleOrderAction('expand-chat', order.id)}
                    title="Expandir conversación"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                    </svg>
                  </button>
                  <button
                    className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                    onClick={() => handleOrderAction('send-message', order.id)}
                    title="Enviar mensaje"
                  >
                    <Send className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Etiquetas en línea horizontal delgada */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Tag className="text-purple-600" size={14} />
                    <span className="text-xs font-medium text-purple-700">Etiquetas:</span>
                  </div>
                  
                  {/* Etiquetas en la misma línea */}
                  <div className="flex flex-wrap gap-1 flex-1">
                  {order.tags && order.tags.length > 0 ? (
                    order.tags.map((tag, index) => (
                      <div key={index} className="flex items-center group">
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium border border-dashed border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-400 transition-all cursor-pointer rounded-full">
                          {tag}
                          <button 
                            className="ml-1 text-current opacity-0 group-hover:opacity-100 hover:bg-white hover:bg-opacity-20 rounded-full p-0.5 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTagFromOrder(order.id, tag);
                            }}
                            title={`Eliminar ${tag}`}
                          >
                            <X className="h-2 w-2" />
                          </button>
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500 italic">Sin etiquetas asignadas</span>
                  )}
                  </div>
                  
                  {/* Botón para agregar nueva etiqueta al final de la línea */}
                  <button 
                    className="p-1 text-purple-600 hover:bg-purple-100 rounded transition-colors flex-shrink-0"
                    onClick={() => setShowTagCreatorModal(true)}
                    title="Agregar etiqueta"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>


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

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {indexOfFirstOrder + 1} a {Math.min(indexOfLastOrder, allFilteredOrders.length)} de {allFilteredOrders.length} órdenes
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Botón anterior */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft size={16} className="mr-1" />
                Anterior
              </button>

              {/* Números de página */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                  // Mostrar solo algunas páginas alrededor de la actual
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          pageNum === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    pageNum === currentPage - 3 ||
                    pageNum === currentPage + 3
                  ) {
                    return (
                      <span key={pageNum} className="px-2 py-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Botón siguiente */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Siguiente
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREADOR DE ETIQUETAS */}
      {showTagCreatorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            
            {/* Header del Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Crear Nueva Etiqueta</h2>
              <button
                onClick={() => {
                  setShowTagCreatorModal(false);
                  setNewTagName('');
                  setNewTagColor('blue');
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 space-y-6">
              
              {/* Nombre de la Etiqueta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la etiqueta
                </label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newTagName.trim()) {
                      createNewTag();
                    }
                  }}
                  placeholder="Ej: Prioritario, Seguimiento..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={20}
                  autoFocus
                />
                <div className="text-xs text-gray-500 mt-1">
                  {newTagName.length}/20 caracteres
                </div>
              </div>

              {/* Selector de Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Color de la etiqueta
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {tagColorOptions.map((colorOption) => (
                    <button
                      key={colorOption.name}
                      onClick={() => setNewTagColor(colorOption.name)}
                      className={`relative p-2 rounded-lg border-2 transition-all ${
                        newTagColor === colorOption.name 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      title={colorOption.label}
                    >
                      <div className={`w-full h-8 rounded ${colorOption.classes.split(' ')[0]} flex items-center justify-center`}>
                        <span className={`text-xs font-medium ${colorOption.classes.split(' ')[1]}`}>
                          Aa
                        </span>
                      </div>
                      {newTagColor === colorOption.name && (
                        <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-0.5">
                          <CheckCircle2 className="h-3 w-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vista Previa */}
              {newTagName.trim() && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vista previa
                  </label>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                      tagColorOptions.find(c => c.name === newTagColor)?.classes || 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {newTagName.trim()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer del Modal */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => {
                  setShowTagCreatorModal(false);
                  setNewTagName('');
                  setNewTagColor('blue');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={createNewTag}
                disabled={!newTagName.trim()}
                className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
                  newTagName.trim()
                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                    : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                }`}
              >
                Crear Etiqueta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup de información que sigue al mouse */}
      {orderPopup && (
        <div 
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${mousePosition.x + 10}px`,
            top: `${mousePosition.y - 10}px`,
          }}
        >
          <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-sm">
            {(() => {
              const order = orders.find(o => o.id === orderPopup);
              return order ? (
                <div className="space-y-1">
                  <div className="font-semibold text-gray-900">{order.id}</div>
                  <div className="text-gray-600">Order #</div>
                  <div className="font-medium text-blue-600">{order.orderNumber || '2000012784807490'}</div>
                </div>
              ) : null;
            })()}
          </div>
        </div>
      )}

      {/* Modal de Órdenes Amazon - Empresarial */}
      {showAmazonOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Órdenes Amazon</h3>
                <button
                  onClick={() => setShowAmazonOrderModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">Gestiona las órdenes de compra para este producto</p>
            </div>

            {/* Body */}
            <div className="px-6 py-4">
              {/* Lista de órdenes */}
              <div className="space-y-3 mb-4">
                {tempAmazonOrders.map((amazonOrder, index) => (
                  <div key={amazonOrder.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      {/* Badge de prioridad */}
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        amazonOrder.isPrimary 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {amazonOrder.isPrimary ? 'Principal' : `#${index + 1}`}
                      </div>
                      
                      {/* Input de número de orden */}
                      <input
                        type="text"
                        value={amazonOrder.orderNumber}
                        onChange={(e) => handleUpdateAmazonOrder(amazonOrder.id, e.target.value)}
                        placeholder="113-7676721-8816259"
                        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      
                      {/* Link clickeable si tiene número */}
                      {amazonOrder.orderNumber.trim() && (
                        <a
                          href={`https://www.amazon.com/gp/your-account/order-details?orderID=${amazonOrder.orderNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 hover:bg-blue-100 rounded text-blue-600 transition-colors"
                          title="Ver orden en Amazon"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                      
                      {/* Acciones */}
                      <div className="flex gap-1">
                        {!amazonOrder.isPrimary && (
                          <button
                            onClick={() => handleSetPrimaryOrder(amazonOrder.id)}
                            className="p-1 hover:bg-blue-100 rounded text-blue-600" 
                            title="Marcar como principal"
                          >
                            <Star size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveAmazonOrder(amazonOrder.id)}
                          className="p-1 hover:bg-red-100 rounded text-red-600"
                          title="Eliminar orden"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Botón agregar nueva orden */}
                <button
                  onClick={handleAddNewAmazonOrder}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  <Plus size={16} className="inline mr-2" />
                  Agregar nueva orden
                </button>
              </div>

              {/* Info */}
              {tempAmazonOrders.length > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-700">
                    📍 La orden <strong>Principal</strong> será la que abra Amazon al hacer clic en la caja.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAmazonOrderModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveAmazonOrders}
                disabled={!tempAmazonOrders.some(o => o.orderNumber.trim())}
                className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
                  tempAmazonOrders.some(o => o.orderNumber.trim())
                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                    : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                }`}
              >
                Guardar Órdenes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage2_0;