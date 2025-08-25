import React, { useState } from 'react';
import { 
  Database, 
  Upload, 
  Search, 
  Play, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Info,
  TrendingUp,
  FileText,
  Package,
  DollarSign,
  Truck
} from 'lucide-react';
import apiService from '../../services/api';

const ConsolidadorPage = () => {
  const [files, setFiles] = useState({
    drapify: null,
    logistics: null,
    aditionals: null,
    cxp: null
  });

  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStats, setProgressStats] = useState({
    processed: 0,
    total: 0,
    connected: 0,
    errors: 0
  });

  const [alerts, setAlerts] = useState([]);
  const [results, setResults] = useState(null);

  const [searchParams, setSearchParams] = useState({
    orderId: '',
    prealertId: '',
    assignment: '',
    account: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const [logisticsDate, setLogisticsDate] = useState({
    type: 'today',
    customDate: ''
  });

  const fileTypes = {
    drapify: {
      title: 'Archivo Principal (Drapify)',
      subtitle: 'Base del sistema - Obligatorio',
      icon: Database,
      required: true,
      description: 'Cada fila representa un pedido único identificado por order_id',
      color: '#3b82f6'
    },
    logistics: {
      title: 'Archivo Logistics',
      subtitle: 'Información logística - Opcional',
      icon: Truck,
      required: false,
      description: 'Se conecta mediante Reference = order_id',
      color: '#10b981',
      needsDate: true
    },
    aditionals: {
      title: 'Archivo Aditionals',
      subtitle: 'Costos adicionales - Opcional',
      icon: Package,
      required: false,
      description: 'Se conecta mediante Order Id = prealert_id',
      color: '#f59e0b'
    },
    cxp: {
      title: 'Archivo CXP',
      subtitle: 'Información financiera - Opcional',
      icon: DollarSign,
      required: false,
      description: 'Se conecta mediante Ref # = asignacion',
      color: '#8b5cf6'
    }
  };

  const accounts = [
    { value: 'TODOENCARGO-CO', label: 'TODOENCARGO-CO' },
    { value: 'MEGATIENDA SPA', label: 'MEGATIENDA SPA' },
    { value: 'MEGA TIENDAS PERUANAS', label: 'MEGA TIENDAS PERUANAS' },
    { value: 'DETODOPARATODOS', label: 'DETODOPARATODOS' },
    { value: 'COMPRAFACIL', label: 'COMPRAFACIL' },
    { value: 'COMPRA-YA', label: 'COMPRA-YA' },
    { value: 'FABORCARGO', label: 'FABORCARGO' },
    { value: 'VEENDELO', label: 'VEENDELO' }
  ];

  const addAlert = (type, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

  const handleFileSelect = (type, event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['.csv', '.xlsx', '.xls'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!validTypes.includes(fileExtension)) {
        addAlert('error', 'Solo se permiten archivos CSV o Excel (.csv, .xlsx, .xls)');
        return;
      }

      setFiles(prev => ({
        ...prev,
        [type]: file
      }));

      addAlert('success', `Archivo ${fileTypes[type].title} cargado correctamente`);
    }
  };

  const removeFile = (type) => {
    setFiles(prev => ({
      ...prev,
      [type]: null
    }));
    addAlert('info', `Archivo ${fileTypes[type].title} removido`);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getLogisticsDate = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    switch (logisticsDate.type) {
      case 'today':
        return today.toISOString().split('T')[0];
      case 'yesterday':
        return yesterday.toISOString().split('T')[0];
      case 'custom':
        return logisticsDate.customDate;
      default:
        return today.toISOString().split('T')[0];
    }
  };

  const processFiles = async () => {
    if (!files.drapify) {
      addAlert('error', 'El archivo Drapify es obligatorio para el procesamiento completo');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setProgressStats({ processed: 0, total: 0, connected: 0, errors: 0 });

    try {
      const formData = new FormData();
      
      Object.entries(files).forEach(([type, file]) => {
        if (file) {
          formData.append(type, file);
        }
      });

      if (files.logistics) {
        formData.append('logistics_date', getLogisticsDate());
      }

      // Simular procesamiento para demo
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const mockResult = {
        total_processed: 150,
        total_records: 150,
        connections_made: 120,
        errors: []
      };

      setResults(mockResult);
      setProgressStats({
        processed: mockResult.total_processed,
        total: mockResult.total_records,
        connected: mockResult.connections_made,
        errors: mockResult.errors?.length || 0
      });

      addAlert('success', `Procesamiento completado: ${mockResult.total_processed} registros procesados`);

    } catch (error) {
      console.error('Error processing files:', error);
      addAlert('error', 'Error al procesar los archivos: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const processPartialUpdate = async () => {
    const hasOptionalFiles = files.logistics || files.aditionals || files.cxp;
    
    if (!hasOptionalFiles) {
      addAlert('error', 'Debe cargar al menos un archivo opcional para actualización parcial');
      return;
    }

    setProcessing(true);
    setProgress(0);

    try {
      // Simular procesamiento para demo
      for (let i = 0; i <= 100; i += 15) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      const mockResult = {
        updated_records: 45,
        total_found: 50,
        connections_made: 45,
        errors: []
      };

      setResults(mockResult);
      setProgressStats({
        processed: mockResult.updated_records,
        total: mockResult.total_found,
        connected: mockResult.connections_made,
        errors: mockResult.errors?.length || 0
      });

      addAlert('success', `Actualización parcial completada: ${mockResult.updated_records} registros actualizados`);

    } catch (error) {
      console.error('Error in partial update:', error);
      addAlert('error', 'Error en la actualización parcial: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const searchRecords = async () => {
    const hasSearchParams = Object.values(searchParams).some(param => param.trim() !== '');
    
    if (!hasSearchParams) {
      addAlert('warning', 'Ingrese al menos un parámetro de búsqueda');
      return;
    }

    setSearching(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockResults = [
        {
          order_id: '123456',
          prealert_id: 'PR12345',
          asignacion: 'TDC123',
          account: 'TODOENCARGO-CO',
          has_logistics: true,
          updated_at: '2025-01-23T10:00:00Z'
        }
      ];

      setSearchResults(mockResults);
      addAlert('success', `Búsqueda completada: ${mockResults.length} registros encontrados`);

    } catch (error) {
      console.error('Error searching records:', error);
      addAlert('error', 'Error en la búsqueda: ' + error.message);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchParams({
      orderId: '',
      prealertId: '',
      assignment: '',
      account: ''
    });
    setSearchResults([]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Database className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Consolidador 2.0</h1>
            <p className="text-gray-600">Sistema de consolidación de órdenes</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-2 mb-6">
        {alerts.map(alert => (
          <div key={alert.id} className={`flex items-center gap-3 p-4 rounded-lg border ${
            alert.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
            alert.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
            alert.type === 'warning' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
            'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
            {alert.type === 'error' && <AlertCircle size={18} />}
            {alert.type === 'success' && <CheckCircle size={18} />}
            {(alert.type === 'info' || alert.type === 'warning') && <Info size={18} />}
            <span>{alert.message}</span>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="text-blue-600 mt-0.5" size={18} />
          <div className="text-blue-700">
            <strong>Modos de operación:</strong><br />
            • <strong>Consolidación Completa:</strong> Suba el archivo Drapify (obligatorio) + archivos opcionales<br />
            • <strong>Actualización Parcial:</strong> Solo archivos opcionales para actualizar registros existentes
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Upload size={20} />
          Cargar Archivos del Sistema
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(fileTypes).map(([type, config]) => {
            const file = files[type];
            const IconComponent = config.icon;

            return (
              <div key={type} className={`border-2 border-dashed rounded-lg p-4 transition-all ${
                file ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
              }`}>
                {config.required && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Obligatorio
                  </div>
                )}
                
                <div className="text-center">
                  <IconComponent className="mx-auto mb-2" style={{ color: config.color }} size={24} />
                  <h3 className="font-semibold text-gray-800 mb-1">{config.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{config.subtitle}</p>
                  <p className="text-xs text-gray-500 mb-3">{config.description}</p>

                  <input
                    type="file"
                    className="hidden"
                    id={`file-${type}`}
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => handleFileSelect(type, e)}
                  />

                  {file ? (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-green-700">{file.name}</div>
                      <div className="text-xs text-green-600">{formatFileSize(file.size)}</div>
                      <div className="flex items-center justify-center gap-2 text-xs text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Archivo cargado
                      </div>
                      <button 
                        className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                        onClick={() => removeFile(type)}
                      >
                        Remover
                      </button>
                    </div>
                  ) : (
                    <label htmlFor={`file-${type}`} className="cursor-pointer">
                      <div className="text-sm text-gray-500">
                        Haga clic o arrastre un archivo aquí<br />
                        <small>Formatos: CSV, Excel (.xlsx, .xls)</small>
                      </div>
                    </label>
                  )}

                  {/* Date selector for logistics */}
                  {type === 'logistics' && file && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <label className="text-xs font-medium text-gray-700 mb-2 block">
                        Fecha para registros Logistics:
                      </label>
                      <div className="flex gap-1 mb-2">
                        {['today', 'yesterday', 'custom'].map((dateType) => (
                          <button
                            key={dateType}
                            className={`text-xs px-2 py-1 rounded ${
                              logisticsDate.type === dateType 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => setLogisticsDate({ type: dateType, customDate: '' })}
                          >
                            {dateType === 'today' ? 'Hoy' : dateType === 'yesterday' ? 'Ayer' : 'Personalizada'}
                          </button>
                        ))}
                      </div>
                      {logisticsDate.type === 'custom' && (
                        <input
                          type="date"
                          className="text-xs w-full px-2 py-1 border rounded"
                          value={logisticsDate.customDate}
                          onChange={(e) => setLogisticsDate(prev => ({ ...prev, customDate: e.target.value }))}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Play size={20} />
          Procesar Archivos
        </h2>
        
        <div className="flex gap-4">
          <button 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              processing || !files.drapify 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            onClick={processFiles}
            disabled={processing || !files.drapify}
          >
            {processing ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Database size={16} />
                Consolidación Completa
              </>
            )}
          </button>

          <button 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              processing || (!files.logistics && !files.aditionals && !files.cxp)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
            onClick={processPartialUpdate}
            disabled={processing || (!files.logistics && !files.aditionals && !files.cxp)}
          >
            {processing ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Actualizando...
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                Actualización Parcial
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Section */}
      {processing && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <TrendingUp size={20} />
            Progreso del Procesamiento
          </h3>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{progressStats.processed}</div>
              <div className="text-sm text-gray-500">Procesados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{progressStats.total}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{progressStats.connected}</div>
              <div className="text-sm text-gray-500">Conectados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{progressStats.errors}</div>
              <div className="text-sm text-gray-500">Errores</div>
            </div>
          </div>
        </div>
      )}

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Search size={20} />
          Búsqueda de Registros
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 12345, 67890"
              value={searchParams.orderId}
              onChange={(e) => setSearchParams(prev => ({ ...prev, orderId: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prealert ID</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 54321"
              value={searchParams.prealertId}
              onChange={(e) => setSearchParams(prev => ({ ...prev, prealertId: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Asignación</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: TDC123"
              value={searchParams.assignment}
              onChange={(e) => setSearchParams(prev => ({ ...prev, assignment: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Cuenta</label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchParams.account}
              onChange={(e) => setSearchParams(prev => ({ ...prev, account: e.target.value }))}
            >
              <option value="">Todas las cuentas</option>
              {accounts.map(account => (
                <option key={account.value} value={account.value}>
                  {account.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              searching 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            onClick={searchRecords}
            disabled={searching}
          >
            {searching ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                <Search size={16} />
                Buscar
              </>
            )}
          </button>

          <button 
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={clearSearch}
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Results Section */}
      {(searchResults.length > 0 || results) && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <FileText size={20} />
            {searchResults.length > 0 ? 'Resultados de Búsqueda' : 'Resultados del Procesamiento'}
          </h2>

          {searchResults.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Prealert ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Asignación</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Cuenta</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Última Actualización</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((record, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{record.order_id || 'N/A'}</td>
                      <td className="py-3 px-4">{record.prealert_id || 'N/A'}</td>
                      <td className="py-3 px-4">{record.asignacion || 'N/A'}</td>
                      <td className="py-3 px-4">{record.account || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${record.has_logistics ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          <span className="text-sm">
                            {record.has_logistics ? 'Completo' : 'Parcial'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{record.updated_at ? new Date(record.updated_at).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : results && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                <CheckCircle size={18} />
                <span>
                  Procesamiento completado exitosamente: {results.total_processed} registros procesados
                </span>
              </div>
              
              {results.errors && results.errors.length > 0 && (
                <div className="flex items-center gap-3 p-4 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200">
                  <AlertCircle size={18} />
                  <span>
                    Se encontraron {results.errors.length} errores durante el procesamiento
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsolidadorPage;