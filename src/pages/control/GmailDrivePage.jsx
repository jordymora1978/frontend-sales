import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Plus, 
  RefreshCw, 
  Download, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Eye, 
  EyeOff, 
  Search, 
  Filter,
  FileText,
  Database
} from 'lucide-react';

const GmailDrivePage = () => {
  const [connections, setConnections] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [invoiceFilter, setInvoiceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [newConnection, setNewConnection] = useState({
    email: '',
    app_password: '',
    search_query: 'has:attachment filetype:pdf',
    enabled: true
  });

  useEffect(() => {
    fetchConnections();
    fetchInvoices();
  }, []);

  const fetchConnections = async () => {
    setLoading(true);
    setError('');
    try {
      // Simular datos para demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockConnections = [
        {
          email: 'admin@dropux.co',
          status: 'connected',
          total_emails: 1250,
          processed_today: 25,
          last_sync: '2025-01-23T10:30:00Z'
        },
        {
          email: 'facturas@proveedor.com',
          status: 'connected',
          total_emails: 850,
          processed_today: 15,
          last_sync: '2025-01-23T09:15:00Z'
        }
      ];
      
      setConnections(mockConnections);
    } catch (error) {
      setError('Error al cargar las conexiones de Gmail');
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      // Simular datos para demo
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockInvoices = [
        {
          filename: 'factura_proveedor_001.pdf',
          email_subject: 'Factura Nro. 001 - Enero 2025',
          sender: 'facturas@proveedor.com',
          date_received: '2025-01-23T08:30:00Z',
          file_size: 245760,
          processed: true
        },
        {
          filename: 'invoice_supplier_002.pdf',
          email_subject: 'Invoice #002 - Products January',
          sender: 'billing@supplier.com',
          date_received: '2025-01-23T07:15:00Z',
          file_size: 189440,
          processed: false
        },
        {
          filename: 'recibo_servicio_123.pdf',
          email_subject: 'Recibo de Servicios Mes Enero',
          sender: 'servicios@empresa.com',
          date_received: '2025-01-22T16:45:00Z',
          file_size: 98304,
          processed: true
        }
      ];
      
      setInvoices(mockInvoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const handleAddConnection = async () => {
    if (!newConnection.email || !newConnection.app_password) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Simular conexión para demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess('Cuenta Gmail conectada exitosamente');
      setNewConnection({ 
        email: '', 
        app_password: '', 
        search_query: 'has:attachment filetype:pdf', 
        enabled: true 
      });
      setShowAddForm(false);
      fetchConnections();
    } catch (error) {
      setError('Error al conectar Gmail');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (email = null) => {
    setSyncing(true);
    setError('');
    setSuccess('');
    try {
      // Simular sincronización para demo
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setSuccess(`Sincronización completada - Encontrados: 15 emails | Nuevas facturas: 3`);
      fetchConnections();
      fetchInvoices();
    } catch (error) {
      setError('Error al sincronizar Gmail');
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = async (email) => {
    if (!window.confirm(`¿Estás seguro de desconectar la cuenta ${email}?`)) {
      return;
    }

    try {
      // Simular desconexión para demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Cuenta Gmail desconectada exitosamente');
      fetchConnections();
    } catch (error) {
      setError('Error al desconectar Gmail');
    }
  };

  const handleDownload = async (filename) => {
    try {
      // Simular descarga para demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`En producción se descargaría: ${filename}`);
      setSuccess('Descarga iniciada exitosamente');
    } catch (error) {
      setError('Error al descargar la factura');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-yellow-600" />;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      connected: 'Conectado',
      disconnected: 'Desconectado',
      error: 'Error'
    };
    return statusMap[status] || status;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${Math.round(bytes / (1024 * 1024))} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.email_subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.sender.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      invoiceFilter === 'all' || 
      (invoiceFilter === 'processed' && invoice.processed) ||
      (invoiceFilter === 'unprocessed' && !invoice.processed);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Mail className="text-green-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Gmail Drive</h1>
              <p className="text-gray-600">Descarga automática de facturas desde Gmail</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-medium transition-colors ${
                syncing 
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSync()}
              disabled={syncing}
            >
              <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
              {syncing ? 'Sincronizando...' : 'Sincronizar Todo'}
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus size={16} />
              Conectar Gmail
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-center gap-3 p-4 mb-6 bg-red-50 text-red-700 rounded-lg border border-red-200">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 p-4 mb-6 bg-green-50 text-green-700 rounded-lg border border-green-200">
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Add Connection Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Conectar Nueva Cuenta Gmail</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email de Gmail *</label>
                <input 
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newConnection.email}
                  onChange={(e) => setNewConnection({...newConnection, email: e.target.value})}
                  placeholder="ejemplo@gmail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña de Aplicación *</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={newConnection.app_password}
                    onChange={(e) => setNewConnection({...newConnection, app_password: e.target.value})}
                    placeholder="xxxx xxxx xxxx xxxx"
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <small className="text-gray-500 text-xs mt-1">
                  Generar en: Configuración Google → Seguridad → Contraseñas de aplicación
                </small>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Consulta de Búsqueda</label>
              <input 
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={newConnection.search_query}
                onChange={(e) => setNewConnection({...newConnection, search_query: e.target.value})}
                placeholder="has:attachment filetype:pdf"
              />
              <small className="text-gray-500 text-xs mt-1">
                Ej: has:attachment filetype:pdf from:proveedor@empresa.com
              </small>
            </div>
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setShowAddForm(false)}
              >
                Cancelar
              </button>
              <button 
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
                onClick={handleAddConnection}
                disabled={loading}
              >
                {loading ? 'Conectando...' : 'Conectar Gmail'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gmail Connections */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Database size={20} />
          Cuentas Gmail Conectadas
        </h3>
        {connections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connections.map((connection) => (
              <div key={connection.email} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold text-gray-800">{connection.email}</div>
                    <div className="flex items-center gap-2 text-sm">
                      {getStatusIcon(connection.status)}
                      <span className="text-gray-600">{getStatusText(connection.status)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => handleSync(connection.email)}
                      disabled={syncing}
                      title="Sincronizar esta cuenta"
                    >
                      <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
                    </button>
                    <button 
                      className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      onClick={() => handleDisconnect(connection.email)}
                      title="Desconectar cuenta"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total emails:</span>
                    <strong className="text-gray-800">{connection.total_emails}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Procesados hoy:</span>
                    <strong className="text-gray-800">{connection.processed_today}</strong>
                  </div>
                  {connection.last_sync && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Última sync:</span>
                      <strong className="text-gray-800">{formatDate(connection.last_sync)}</strong>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Mail size={48} className="mx-auto text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-800 mb-2">No hay cuentas Gmail conectadas</h4>
            <p className="text-gray-600 mb-4">
              Conecta una cuenta para comenzar a descargar facturas automáticamente.
            </p>
            <button 
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mx-auto"
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={16} />
              Conectar Primera Cuenta
            </button>
          </div>
        )}
      </div>

      {/* Invoice List */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText size={20} />
            Facturas Descargadas
          </h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg">
              <Search size={16} className="text-gray-400" />
              <input 
                type="text"
                className="border-none outline-none bg-transparent text-sm"
                placeholder="Buscar facturas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg">
              <Filter size={16} className="text-gray-400" />
              <select 
                className="border-none outline-none bg-transparent text-sm"
                value={invoiceFilter}
                onChange={(e) => setInvoiceFilter(e.target.value)}
              >
                <option value="all">Todas</option>
                <option value="processed">Procesadas</option>
                <option value="unprocessed">Sin procesar</option>
              </select>
            </div>
          </div>
        </div>

        {filteredInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Archivo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asunto del Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remitente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tamaño</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.map((invoice, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="text-lg">📄</div>
                        <span className="text-sm font-medium text-gray-800">
                          {invoice.filename}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-800 max-w-xs truncate">
                        {invoice.email_subject}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{invoice.sender}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(invoice.date_received)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatFileSize(invoice.file_size)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        invoice.processed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.processed ? 'Procesada' : 'Sin procesar'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-green-600"
                        onClick={() => handleDownload(invoice.filename)}
                        title="Descargar factura"
                      >
                        <Download size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📄</div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">No hay facturas</h4>
            <p className="text-gray-600">
              {invoiceFilter === 'all' 
                ? 'Aún no se han descargado facturas. Sincroniza una cuenta para comenzar.'
                : `No hay facturas ${invoiceFilter === 'processed' ? 'procesadas' : 'sin procesar'}.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GmailDrivePage;