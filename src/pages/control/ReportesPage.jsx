import React, { useState, useEffect } from 'react';
import { 
  Download, 
  FileText, 
  Package, 
  RefreshCw, 
  Calendar,
  TrendingUp,
  BarChart3,
  FileSpreadsheet
} from 'lucide-react';

const ReportesPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState('megatienda-spa');
  const [dateMode, setDateMode] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setDateRange({
      startDate: firstDay.toISOString().split('T')[0],
      endDate: lastDay.toISOString().split('T')[0]
    });
    
    setSelectedMonth(String(now.getMonth() + 1).padStart(2, '0'));
    setSelectedYear(String(now.getFullYear()));
  }, []);

  useEffect(() => {
    if (dateMode === 'month' && selectedMonth && selectedYear) {
      const year = parseInt(selectedYear);
      const month = parseInt(selectedMonth) - 1;
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      setDateRange({
        startDate: firstDay.toISOString().split('T')[0],
        endDate: lastDay.toISOString().split('T')[0]
      });
    }
  }, [dateMode, selectedMonth, selectedYear]);

  const loadReport = async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      setError('Por favor seleccione las fechas');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simular carga de datos para demo
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock data para demo
      const mockMetrics = {
        total_registros: 1250,
        utilidad_total: 15750.50,
        aprobadas: 1100,
        refunded: 150,
        trm_chile: 990,
        trm_colombia: 4300,
        trm_peru: 3.75,
        total_socio: 2500.00,
        total_bodegal: 8900.25
      };

      const mockData = Array.from({ length: 50 }, (_, index) => ({
        fecha: '2025-01-23',
        asignacion: `TDC-${12345 + index}`,
        prealert_id: `PR-${67890 + index}`,
        order_id: `ORD-${11111 + index}`,
        order_status_meli: index % 10 === 0 ? 'refunded' : 'approved',
        account_name: ['TODOENCARGO-CO', 'MEGATIENDA SPA', 'FABORCARGO'][index % 3],
        Net_Received_COP: `$${(500 + index * 10).toFixed(2)}`,
        Declare_Value_USD: `$${(100 + index * 2).toFixed(2)}`,
        Meli_USD_Format: `$${(150 + index * 3).toFixed(2)}`,
        Amazon_Format: `$${(50 + index).toFixed(2)}`,
        Bodegal_Format: `$${(25 + index * 0.5).toFixed(2)}`,
        Socio_Format: `$${(30 + index * 0.8).toFixed(2)}`,
        Utilidad_Format: `$${(45 + index * 1.2).toFixed(2)}`,
        Utilidad_GSS: 45 + index * 1.2
      }));

      setData(mockData);
      setMetrics(mockMetrics);

    } catch (err) {
      setError('Error al conectar con el servidor: ' + err.message);
      setData([]);
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    try {
      // Simular exportación para demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('En producción se descargaría el reporte en formato Excel');
    } catch (err) {
      setError('Error al exportar: ' + err.message);
    }
  };

  const exportToCSV = async () => {
    try {
      // Simular exportación para demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('En producción se descargaría el reporte en formato CSV');
    } catch (err) {
      setError('Error al exportar: ' + err.message);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  const reportTypes = [
    { 
      value: 'reporte-global', 
      label: 'REPORTE GLOBAL',
      description: 'Consolidado de las 8 cuentas Mercado Libre',
      subtitle: '🌎 Todas las cuentas | Multi-moneda | Dual query'
    },
    { 
      value: 'reversiones-meli', 
      label: 'REVERSIONES MELI',
      description: 'Órdenes con status refunded y amz_order_id | Excluye FABORCARGO',
      subtitle: '⚠️ 7 cuentas | Cálculos de reversión por cuenta'
    },
    { 
      value: 'megatienda-spa', 
      label: 'MEGATIENDA SPA / VEENDELO',
      description: 'Proveedor: Chilexpress | País: Chile'
    },
    { 
      value: 'todoencargo-co', 
      label: 'TODOENCARGO-CO',
      description: 'Proveedor: Logística Colombia'
    },
    { 
      value: 'faborcargo', 
      label: 'FABORCARGO',
      description: 'Proveedor: Chilexpress | País: Chile | Campo: cxp_date',
      subtitle: '⚖️ Cálculo basado en peso con tabla GSS Logística'
    },
    { 
      value: 'dtpt-group', 
      label: 'DTPT GROUP',
      description: 'Proveedor: Anicam | País: Colombia | Campo: logistics_date',
      subtitle: 'Incluye: DETODOPARATODOS, COMPRAFACIL, COMPRA-YA'
    },
    { 
      value: 'mega-tiendas-peruanas', 
      label: 'MEGA TIENDAS PERUANAS',
      description: 'Proveedor: Anicam | País: Perú | Campo: logistics_date',
      subtitle: '🇵🇪 Cuenta única con TRM Perú y formato Soles (S/)'
    }
  ];

  const getCurrentReport = () => {
    return reportTypes.find(r => r.value === selectedReport) || reportTypes[0];
  };

  const months = [
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' }
  ];

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 2020; year <= currentYear + 1; year++) {
    years.push({ value: String(year), label: String(year) });
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <TrendingUp className="text-purple-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reportes de Utilidad</h1>
            <p className="text-gray-600">Generación de reportes financieros y estadísticas</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-4">
          {/* Period Mode Toggle */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                type="button"
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  dateMode === 'month' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setDateMode('month')}
              >
                Por Mes
              </button>
              <button
                type="button"
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  dateMode === 'custom' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setDateMode('custom')}
              >
                Personalizado
              </button>
            </div>
          </div>

          {/* Report Type Selector */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Reporte</label>
            <select 
              value={selectedReport} 
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {reportTypes.map(report => (
                <option key={report.value} value={report.value}>
                  {report.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Controls */}
          {dateMode === 'month' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {years.map(year => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
          
          {/* Generate Button */}
          <div className="flex items-end">
            <button 
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
              onClick={loadReport}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <FileText size={18} />
                  Generar
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Report Info */}
        <div className="bg-gray-50 rounded-lg p-3 border">
          <div className="text-sm">
            <span className="font-semibold text-gray-800">{getCurrentReport().label}:</span>
            <span className="text-gray-600 ml-2">{getCurrentReport().description}</span>
            {getCurrentReport().subtitle && (
              <div className="text-xs text-blue-600 mt-1">{getCurrentReport().subtitle}</div>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
          ⚠️ {error}
        </div>
      )}

      {/* Metrics Dashboard */}
      {metrics && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <BarChart3 size={20} />
            Métricas del Reporte
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{formatNumber(metrics.total_registros)}</div>
              <div className="text-sm text-gray-600">📊 Total Registros</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
              <div className="text-2xl font-bold text-green-600">${formatNumber(metrics.utilidad_total.toFixed(2))}</div>
              <div className="text-sm text-gray-600">💰 Utilidad Total</div>
            </div>
            
            <div className="bg-emerald-50 p-4 rounded-lg text-center border border-emerald-200">
              <div className="text-2xl font-bold text-emerald-600">{formatNumber(metrics.aprobadas)}</div>
              <div className="text-sm text-gray-600">✅ Aprobadas</div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
              <div className="text-2xl font-bold text-red-600">{formatNumber(metrics.refunded)}</div>
              <div className="text-sm text-gray-600">❌ Refunded</div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">${formatNumber(metrics.total_socio)}</div>
              <div className="text-sm text-gray-600">👥 Total Socio</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">${formatNumber(metrics.total_bodegal)}</div>
              <div className="text-sm text-gray-600">📦 Total Bodegal</div>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      {data.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Table Header with Export Buttons */}
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText size={20} />
              Detalle del Reporte
            </h3>
            <div className="flex gap-2">
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                onClick={exportToCSV}
              >
                <Download size={16} />
                CSV
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={exportToExcel}
              >
                <FileSpreadsheet size={16} />
                Excel
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">📅 Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">🏷️ Asignación</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">📋 Prealert ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">📦 Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">📊 Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">🏢 Cuenta</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">💵 Net Received</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">🟢 Declare Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">🟡 Meli USD</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">🟠 Amazon</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">🔵 Bodegal</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">🟣 Socio</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">⚪ Utilidad GSS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.slice(0, 20).map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{row.fecha}</td>
                    <td className="px-4 py-3 text-sm font-medium">{row.asignacion}</td>
                    <td className="px-4 py-3 text-sm">{row.prealert_id}</td>
                    <td className="px-4 py-3 text-sm">{row.order_id}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        row.order_status_meli === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {row.order_status_meli}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{row.account_name}</td>
                    <td className="px-4 py-3 text-sm font-medium">{row.Net_Received_COP}</td>
                    <td className="px-4 py-3 text-sm">{row.Declare_Value_USD}</td>
                    <td className="px-4 py-3 text-sm">{row.Meli_USD_Format}</td>
                    <td className="px-4 py-3 text-sm">{row.Amazon_Format}</td>
                    <td className="px-4 py-3 text-sm">{row.Bodegal_Format}</td>
                    <td className="px-4 py-3 text-sm">{row.Socio_Format}</td>
                    <td className={`px-4 py-3 text-sm font-medium ${
                      row.Utilidad_GSS < 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {row.Utilidad_Format}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Info */}
          <div className="p-4 bg-gray-50 border-t text-sm text-gray-600">
            📌 <strong>Resumen:</strong> Período del {dateRange.startDate} al {dateRange.endDate} | 
            Total registros mostrados: {Math.min(data.length, 20)} de {formatNumber(data.length)} | 
            TRM Colombia: ${formatNumber(metrics?.trm_colombia || 4300)} | 
            TRM Chile: ${formatNumber(metrics?.trm_chile || 990)} | 
            TRM Perú: ${formatNumber(metrics?.trm_peru || 3.75)}
          </div>
        </div>
      )}

      {/* No Data State */}
      {!loading && data.length === 0 && !error && (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No hay datos para mostrar</h3>
          <p className="text-gray-600">Seleccione un tipo de reporte y rango de fechas, luego presione "Generar"</p>
        </div>
      )}
    </div>
  );
};

export default ReportesPage;