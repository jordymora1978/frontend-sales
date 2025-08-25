import React, { useState, useEffect } from 'react';
import { 
  Plus,
  FileText,
  Search,
  Filter,
  MoreVertical,
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
  Filter as FilterIcon
} from 'lucide-react';

const QuotesPage = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedQuotes, setSelectedQuotes] = useState(new Set());

  // Estados de cotizaciones
  const quoteStatuses = {
    draft: { label: 'Borrador', color: 'bg-gray-100 text-gray-800', icon: FileText },
    sent: { label: 'Enviada', color: 'bg-blue-100 text-blue-800', icon: Send },
    viewed: { label: 'Vista', color: 'bg-yellow-100 text-yellow-800', icon: Eye },
    approved: { label: 'Aprobada', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
    rejected: { label: 'Rechazada', color: 'bg-red-100 text-red-800', icon: XCircle },
    expired: { label: 'Expirada', color: 'bg-orange-100 text-orange-800', icon: Clock },
    converted: { label: 'Convertida', color: 'bg-purple-100 text-purple-800', icon: CheckCircle2 }
  };

  // Enhanced mock data para desarrollo - Nivel Enterprise
  useEffect(() => {
    const mockQuotes = [
      {
        id: 'COT-001',
        number: 'COT-2025001',
        title: 'Sistema de Gestión Empresarial ERP',
        client: {
          name: 'Empresa ABC S.A.S.',
          contact: 'Juan Pérez',
          email: 'juan.perez@empresa-abc.com',
          avatar: '/api/placeholder/32/32',
          industry: 'Manufactura',
          conversionRate: 85,
          avgResponseTime: 2.3
        },
        amount: 155000000,
        currency: 'COP',
        status: 'sent',
        createdDate: '2025-08-20',
        validUntil: '2025-09-20',
        items: 12,
        products: [
          'ERP Core Module', 'Inventory Management', 'Financial Reports', 'User Training'
        ],
        notes: 'Incluye implementación completa y capacitación por 6 meses',
        lastActivity: '2025-08-22',
        salesRep: 'Ana María López',
        priority: 'high',
        probability: 75,
        daysToExpiry: 28,
        tags: ['ERP', 'Enterprise', 'High-Value'],
        timeline: [
          { date: '2025-08-20', action: 'Cotización creada', user: 'Ana López' },
          { date: '2025-08-21', action: 'Enviada al cliente', user: 'Sistema' },
          { date: '2025-08-22', action: 'Cliente abrió PDF', user: 'Sistema' }
        ]
      },
      {
        id: 'COT-002',
        number: 'COT-2025002',
        title: 'Plataforma E-commerce Omnicanal',
        client: {
          name: 'Retail XYZ Ltda',
          contact: 'María García',
          email: 'maria.garcia@retailxyz.com',
          avatar: '/api/placeholder/32/32',
          industry: 'Retail',
          conversionRate: 92,
          avgResponseTime: 1.8
        },
        amount: 250000000,
        currency: 'COP',
        status: 'approved',
        createdDate: '2025-08-18',
        validUntil: '2025-09-18',
        items: 15,
        products: [
          'E-commerce Platform', 'Mobile App', 'Payment Gateway', 'Analytics Dashboard'
        ],
        notes: 'Proyecto estratégico de transformación digital',
        lastActivity: '2025-08-23',
        salesRep: 'Carlos Mendoza',
        priority: 'critical',
        probability: 95,
        daysToExpiry: 25,
        tags: ['E-commerce', 'Digital Transform', 'Strategic'],
        timeline: [
          { date: '2025-08-18', action: 'Cotización creada', user: 'Carlos Mendoza' },
          { date: '2025-08-19', action: 'Presentación realizada', user: 'Carlos Mendoza' },
          { date: '2025-08-23', action: 'Cliente aprobó cotización', user: 'Sistema' }
        ]
      },
      {
        id: 'COT-003',
        number: 'COT-2025003',
        title: 'App Móvil Corporativa iOS/Android',
        client: {
          name: 'TechCorp S.A.',
          contact: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@techcorp.com',
          avatar: '/api/placeholder/32/32',
          industry: 'Tecnología',
          conversionRate: 68,
          avgResponseTime: 3.5
        },
        amount: 87500000,
        currency: 'COP',
        status: 'draft',
        createdDate: '2025-08-22',
        validUntil: '2025-09-22',
        items: 8,
        products: [
          'Mobile App Development', 'Backend API', 'Admin Panel'
        ],
        notes: 'En revisión técnica - Esperando especificaciones finales',
        lastActivity: '2025-08-22',
        salesRep: 'Diana Torres',
        priority: 'medium',
        probability: 60,
        daysToExpiry: 31,
        tags: ['Mobile', 'iOS', 'Android'],
        timeline: [
          { date: '2025-08-22', action: 'Cotización creada', user: 'Diana Torres' }
        ]
      },
      {
        id: 'COT-004',
        number: 'COT-2025004',
        title: 'Sistema CRM + Marketing Automation',
        client: {
          name: 'Growth Marketing Inc',
          contact: 'Sofia Ramírez',
          email: 'sofia@growthmarketing.com',
          avatar: '/api/placeholder/32/32',
          industry: 'Marketing',
          conversionRate: 73,
          avgResponseTime: 2.1
        },
        amount: 125000000,
        currency: 'COP',
        status: 'viewed',
        createdDate: '2025-08-15',
        validUntil: '2025-09-15',
        items: 10,
        products: [
          'CRM System', 'Email Marketing', 'Lead Scoring', 'Analytics'
        ],
        notes: 'Cliente mostró interés alto, programar follow-up',
        lastActivity: '2025-08-21',
        salesRep: 'Miguel Santos',
        priority: 'high',
        probability: 80,
        daysToExpiry: 22,
        tags: ['CRM', 'Marketing', 'Automation'],
        timeline: [
          { date: '2025-08-15', action: 'Cotización creada', user: 'Miguel Santos' },
          { date: '2025-08-16', action: 'Enviada al cliente', user: 'Sistema' },
          { date: '2025-08-21', action: 'Cliente revisó cotización', user: 'Sistema' }
        ]
      },
      {
        id: 'COT-005',
        number: 'COT-2025005',
        title: 'Migración a Cloud + DevOps',
        client: {
          name: 'Legacy Systems Corp',
          contact: 'Roberto Vásquez',
          email: 'roberto@legacysystems.com',
          avatar: '/api/placeholder/32/32',
          industry: 'Servicios TI',
          conversionRate: 45,
          avgResponseTime: 4.2
        },
        amount: 95000000,
        currency: 'COP',
        status: 'expired',
        createdDate: '2025-07-20',
        validUntil: '2025-08-20',
        items: 6,
        products: [
          'Cloud Migration', 'DevOps Setup', 'Monitoring Tools'
        ],
        notes: 'Cotización expirada - Requiere renovación con nuevos precios',
        lastActivity: '2025-08-10',
        salesRep: 'Patricia Luna',
        priority: 'low',
        probability: 25,
        daysToExpiry: -4,
        tags: ['Cloud', 'DevOps', 'Migration'],
        timeline: [
          { date: '2025-07-20', action: 'Cotización creada', user: 'Patricia Luna' },
          { date: '2025-07-22', action: 'Enviada al cliente', user: 'Sistema' },
          { date: '2025-08-20', action: 'Cotización expirada', user: 'Sistema' }
        ]
      },
      {
        id: 'COT-006',
        number: 'COT-2025006',
        title: 'Business Intelligence Dashboard',
        client: {
          name: 'Data Insights LLC',
          contact: 'Amanda Foster',
          email: 'amanda@datainsights.com',
          avatar: '/api/placeholder/32/32',
          industry: 'Consultoría',
          conversionRate: 81,
          avgResponseTime: 1.9
        },
        amount: 65000000,
        currency: 'COP',
        status: 'rejected',
        createdDate: '2025-08-10',
        validUntil: '2025-09-10',
        items: 5,
        products: [
          'BI Dashboard', 'Data Warehouse', 'Reporting Tools'
        ],
        notes: 'Cliente rechazó por presupuesto - Crear versión lite',
        lastActivity: '2025-08-19',
        salesRep: 'Andrés Herrera',
        priority: 'medium',
        probability: 15,
        daysToExpiry: 17,
        tags: ['BI', 'Analytics', 'Dashboard'],
        timeline: [
          { date: '2025-08-10', action: 'Cotización creada', user: 'Andrés Herrera' },
          { date: '2025-08-11', action: 'Enviada al cliente', user: 'Sistema' },
          { date: '2025-08-19', action: 'Cliente rechazó cotización', user: 'Sistema' }
        ]
      }
    ];

    setTimeout(() => {
      setQuotes(mockQuotes);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrar y ordenar cotizaciones
  const filteredQuotes = quotes
    .filter(quote => {
      const matchesSearch = 
        quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.number.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
      
      return matchesSearch && matchesStatus;
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
        case 'client':
          aValue = a.client.name.toLowerCase();
          bValue = b.client.name.toLowerCase();
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

  // Manejar selección múltiple
  const handleSelectQuote = (quoteId) => {
    const newSelected = new Set(selectedQuotes);
    if (newSelected.has(quoteId)) {
      newSelected.delete(quoteId);
    } else {
      newSelected.add(quoteId);
    }
    setSelectedQuotes(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedQuotes.size === filteredQuotes.length) {
      setSelectedQuotes(new Set());
    } else {
      setSelectedQuotes(new Set(filteredQuotes.map(q => q.id)));
    }
  };

  // Acciones de cotización
  const handleQuoteAction = (action, quoteId) => {
    console.log(`Acción ${action} en cotización ${quoteId}`);
    // Aquí se implementarían las acciones reales
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Cargando cotizaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cotizaciones</h1>
            <p className="text-gray-600 mt-1">
              Gestiona y da seguimiento a todas tus cotizaciones empresariales
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button 
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              onClick={() => handleQuoteAction('new')}
            >
              <Plus size={20} className="mr-2" />
              Nueva Cotización
            </button>
            
            <div className="flex space-x-2">
              <button 
                className="inline-flex items-center px-3 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-colors"
                onClick={() => handleQuoteAction('import')}
              >
                <Download size={18} className="mr-2" />
                Importar
              </button>
              
              <button 
                className="inline-flex items-center px-3 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-colors"
                disabled={selectedQuotes.size === 0}
                onClick={() => handleQuoteAction('export-selected')}
              >
                <Download size={18} className="mr-2" />
                Exportar ({selectedQuotes.size})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Barra de búsqueda */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por título, cliente o número..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filtro de estado */}
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              {Object.entries(quoteStatuses).map(([key, status]) => (
                <option key={key} value={key}>{status.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          
          {/* Ordenamiento */}
          <div className="flex space-x-2">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Fecha</option>
              <option value="amount">Monto</option>
              <option value="client">Cliente</option>
              <option value="status">Estado</option>
            </select>
            
            <button
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <ArrowUpDown className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Enterprise Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Cotizaciones */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cotizaciones</p>
                <p className="text-2xl font-bold text-gray-900">{quotes.length}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% vs mes anterior
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Valor Total Pendiente */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valor Pendiente</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(quotes.filter(q => ['sent', 'viewed'].includes(q.status))
                    .reduce((sum, q) => sum + q.amount, 0))}
                </p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Target className="h-3 w-3 mr-1" />
                  {quotes.filter(q => ['sent', 'viewed'].includes(q.status)).length} cotizaciones
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tasa de Conversión */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Percent className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tasa Conversión</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((quotes.filter(q => q.status === 'approved').length / quotes.length) * 100)}%
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  {quotes.filter(q => q.status === 'approved').length} aprobadas
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tiempo Promedio Respuesta */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Timer className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tiempo Respuesta</p>
                <p className="text-2xl font-bold text-gray-900">2.4 días</p>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  Promedio histórico
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header de selección */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={selectedQuotes.size === filteredQuotes.length && filteredQuotes.length > 0}
              onChange={handleSelectAll}
            />
            <span className="ml-2 text-sm text-gray-600">
              {selectedQuotes.size > 0 ? `${selectedQuotes.size} seleccionadas` : 'Seleccionar todas'}
            </span>
          </label>
        </div>
      </div>

      {/* Grid de cotizaciones en tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuotes.map((quote) => {
          const StatusIcon = quoteStatuses[quote.status].icon;
          
          const getDaysToExpiry = (validUntil) => {
            const today = new Date();
            const expiryDate = new Date(validUntil);
            const diffTime = expiryDate - today;
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          };

          const getPriorityColor = (priority) => {
            switch (priority) {
              case 'critical': return 'border-l-4 border-red-500';
              case 'high': return 'border-l-4 border-orange-500';
              case 'medium': return 'border-l-4 border-yellow-500';
              case 'low': return 'border-l-4 border-gray-500';
              default: return 'border-l-4 border-blue-500';
            }
          };

          const daysToExpiry = getDaysToExpiry(quote.validUntil);
          
          return (
            <div 
              key={quote.id} 
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-lg transition-all duration-200 ${getPriorityColor(quote.priority)}`}
            >
              {/* Header de la tarjeta con alertas */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 bg-blue-50 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
                        {quote.title}
                      </h3>
                      {daysToExpiry <= 3 && daysToExpiry > 0 && (
                        <AlertCircle className="h-4 w-4 text-orange-500" title="Expira pronto" />
                      )}
                      {daysToExpiry <= 0 && (
                        <XCircle className="h-4 w-4 text-red-500" title="Expirada" />
                      )}
                      {quote.amount >= 200000000 && (
                        <DollarSign className="h-4 w-4 text-green-500" title="Alto valor" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 flex items-center">
                      <Hash className="h-3 w-3 mr-1" />
                      {quote.number}
                    </p>
                  </div>
                </div>
                
                {/* Checkbox y probabilidad */}
                <div className="flex items-center space-x-2">
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded-full font-medium text-gray-700">
                    {quote.probability}%
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedQuotes.has(quote.id)}
                      onChange={() => handleSelectQuote(quote.id)}
                    />
                  </label>
                </div>
              </div>

              {/* Estado y prioridad */}
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${quoteStatuses[quote.status].color}`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {quoteStatuses[quote.status].label}
                </span>
                <div className="flex items-center space-x-2">
                  {quote.tags.slice(0, 2).map((tag, index) => (
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
                      {quote.client.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {quote.client.name}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-gray-600">
                      <span>{quote.client.contact}</span>
                      <span className="text-green-600">★ {quote.client.conversionRate}%</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded mr-2">{quote.client.industry}</span>
                  Respuesta: {quote.client.avgResponseTime}d
                </div>
              </div>

              {/* Monto con productos */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(quote.amount)}
                    </p>
                    <p className="text-xs text-gray-600">
                      {quote.items} productos/servicios
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Vendedor</p>
                    <p className="text-xs font-medium text-gray-900">{quote.salesRep}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {quote.products.slice(0, 2).map((product, index) => (
                      <span key={index} className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded truncate max-w-24">
                        {product}
                      </span>
                    ))}
                    {quote.products.length > 2 && (
                      <span className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded">
                        +{quote.products.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Fechas con countdown */}
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>Creada</span>
                    </div>
                    <p className="font-medium text-gray-900 mt-0.5">
                      {formatDate(quote.createdDate)}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>Expira</span>
                    </div>
                    <p className={`font-medium mt-0.5 ${
                      daysToExpiry <= 0 ? 'text-red-600' : 
                      daysToExpiry <= 3 ? 'text-orange-600' : 'text-gray-900'
                    }`}>
                      {daysToExpiry <= 0 ? 'Expirada' : 
                       daysToExpiry === 1 ? 'Mañana' :
                       `${daysToExpiry} días`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Acciones profesionales */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-1">
                  <button
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    onClick={() => handleQuoteAction('view', quote.id)}
                    title="Ver detalle"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  <button
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                    onClick={() => handleQuoteAction('edit', quote.id)}
                    title="Editar"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  
                  <button
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                    onClick={() => handleQuoteAction('duplicate', quote.id)}
                    title="Duplicar"
                  >
                    <Copy className="h-4 w-4" />
                  </button>

                  <button
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    onClick={() => handleQuoteAction('send-email', quote.id)}
                    title="Enviar email"
                  >
                    <Mail className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    onClick={() => handleQuoteAction('download', quote.id)}
                    title="Descargar PDF"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  
                  {quote.status === 'approved' && (
                    <button
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                      onClick={() => handleQuoteAction('convert', quote.id)}
                      title="Convertir a orden"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  )}
                  
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
      {filteredQuotes.length === 0 && (
        <div className="col-span-full">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No se encontraron cotizaciones
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Ajusta tus filtros para ver más resultados'
                : 'Comienza creando tu primera cotización'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <div className="mt-6">
                <button
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  onClick={() => handleQuoteAction('new')}
                >
                  <Plus size={20} className="mr-2" />
                  Nueva Cotización
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotesPage;