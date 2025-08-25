import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Calendar, Plus, RefreshCw, Search, AlertCircle, CheckCircle } from 'lucide-react';
import apiService from '../../services/api';

const TRMPage = () => {
  const [rates, setRates] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: ''
  });
  const [newRate, setNewRate] = useState({
    country: '',
    currency: '',
    rate: '',
    source: 'manual'
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const countries = [
    { code: 'USD', name: 'Estados Unidos', currency: 'USD', flag: '🇺🇸' },
    { code: 'EUR', name: 'Eurozona', currency: 'EUR', flag: '🇪🇺' },
    { code: 'COP', name: 'Colombia', currency: 'COP', flag: '🇨🇴' },
    { code: 'CLP', name: 'Chile', currency: 'CLP', flag: '🇨🇱' },
    { code: 'PEN', name: 'Perú', currency: 'PEN', flag: '🇵🇪' }
  ];

  useEffect(() => {
    fetchCurrentRates();
  }, []);

  const fetchCurrentRates = async () => {
    setLoading(true);
    setError('');
    try {
      // Por ahora usando datos mock
      const mockRates = [
        {
          country: 'USD',
          country_name: 'Estados Unidos',
          currency: 'USD',
          rate: 4350.25,
          date: '2025-01-23',
          source: 'api',
          flag: '🇺🇸'
        },
        {
          country: 'COP',
          country_name: 'Colombia',
          currency: 'COP',
          rate: 1,
          date: '2025-01-23',
          source: 'manual',
          flag: '🇨🇴'
        },
        {
          country: 'CLP',
          country_name: 'Chile',
          currency: 'CLP',
          rate: 4.58,
          date: '2025-01-23',
          source: 'bank',
          flag: '🇨🇱'
        },
        {
          country: 'PEN',
          country_name: 'Perú',
          currency: 'PEN',
          rate: 1164.20,
          date: '2025-01-23',
          source: 'api',
          flag: '🇵🇪'
        }
      ];
      setRates(mockRates);
    } catch (error) {
      setError('Error al cargar las tasas actuales');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    if (!selectedCountry || !dateRange.start_date || !dateRange.end_date) {
      setError('Por favor selecciona país y rango de fechas');
      return;
    }

    setHistoryLoading(true);
    setError('');
    try {
      // Mock data para historial
      const mockHistory = [
        {
          date: '2025-01-23',
          country: selectedCountry,
          currency: countries.find(c => c.code === selectedCountry)?.currency,
          rate: 4350.25,
          source: 'api'
        },
        {
          date: '2025-01-22',
          country: selectedCountry,
          currency: countries.find(c => c.code === selectedCountry)?.currency,
          rate: 4348.50,
          source: 'manual'
        },
        {
          date: '2025-01-21',
          country: selectedCountry,
          currency: countries.find(c => c.code === selectedCountry)?.currency,
          rate: 4352.00,
          source: 'bank'
        }
      ];
      setHistory(mockHistory);
    } catch (error) {
      setError('Error al cargar el historial');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleAddRate = async () => {
    if (!newRate.country || !newRate.currency || !newRate.rate) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Simular guardado
      setSuccess('Tasa agregada exitosamente');
      setNewRate({ country: '', currency: '', rate: '', source: 'manual' });
      setShowAddForm(false);
      fetchCurrentRates();
    } catch (error) {
      setError('Error al agregar la tasa');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (rate, currency) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency === 'COP' ? 'COP' : 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(rate);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="trm-page p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">TRM - Tasas de Cambio</h1>
              <p className="text-gray-600">Gestión y seguimiento de tasas de cambio</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={fetchCurrentRates}
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Actualizar
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus size={16} />
              Agregar Tasa
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-center gap-3 p-4 mb-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 p-4 mb-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {/* Add Rate Form */}
      {showAddForm && (
        <div className="mb-6 p-6 bg-white rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Agregar Nueva Tasa</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
              <select 
                value={newRate.country}
                onChange={(e) => {
                  const country = countries.find(c => c.code === e.target.value);
                  setNewRate({
                    ...newRate, 
                    country: e.target.value,
                    currency: country?.currency || ''
                  });
                }}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar país</option>
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
              <input 
                type="text"
                value={newRate.currency}
                readOnly
                placeholder="Automático"
                className="w-full px-3 py-2 border rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tasa</label>
              <input 
                type="number"
                step="0.0001"
                value={newRate.rate}
                onChange={(e) => setNewRate({...newRate, rate: e.target.value})}
                placeholder="0.0000"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuente</label>
              <select 
                value={newRate.source}
                onChange={(e) => setNewRate({...newRate, source: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="manual">Manual</option>
                <option value="api">API Externa</option>
                <option value="bank">Banco</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button 
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setShowAddForm(false)}
            >
              Cancelar
            </button>
            <button 
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              onClick={handleAddRate}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Tasa'}
            </button>
          </div>
        </div>
      )}

      {/* Current Rates */}
      <div className="mb-6 p-6 bg-white rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Tasas Actuales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rates.map((rate) => (
            <div key={rate.country} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{rate.flag}</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">{rate.country_name}</h4>
                    <span className="text-sm text-gray-500">{rate.currency}</span>
                  </div>
                </div>
                <div className="p-2 bg-blue-100 rounded">
                  <DollarSign className="text-blue-600" size={16} />
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {formatCurrency(rate.rate, rate.currency)}
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(rate.date)}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  rate.source === 'manual' ? 'bg-yellow-100 text-yellow-700' :
                  rate.source === 'api' ? 'bg-green-100 text-green-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {rate.source.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History Section */}
      <div className="p-6 bg-white rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Historial de Tasas</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
            <select 
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar país</option>
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
            <input 
              type="date"
              value={dateRange.start_date}
              onChange={(e) => setDateRange({...dateRange, start_date: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
            <input 
              type="date"
              value={dateRange.end_date}
              onChange={(e) => setDateRange({...dateRange, end_date: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button 
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={fetchHistory}
              disabled={historyLoading}
            >
              <Search size={16} />
              {historyLoading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>

        {history.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">País</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Moneda</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tasa</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Fuente</th>
                </tr>
              </thead>
              <tbody>
                {history.map((rate, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{formatDate(rate.date)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span>{countries.find(c => c.code === rate.country)?.flag}</span>
                        {countries.find(c => c.code === rate.country)?.name}
                      </div>
                    </td>
                    <td className="py-3 px-4">{rate.currency}</td>
                    <td className="py-3 px-4 font-semibold text-blue-600">
                      {formatCurrency(rate.rate, rate.currency)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        rate.source === 'manual' ? 'bg-yellow-100 text-yellow-700' :
                        rate.source === 'api' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {rate.source.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TRMPage;