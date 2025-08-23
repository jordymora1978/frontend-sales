import React, { useState, useEffect, useCallback } from 'react';
import { Store, Plus, Trash2, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { SALES_API_URL } from '../config/api.js';

const ConnectStore = ({ user }) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    site_id: 'MCO',
    app_id: '',
    app_secret: '',
    store_name: ''
  });

  const API_URL = SALES_API_URL;

  const countries = [
    { code: 'MCO', name: 'Colombia', currency: 'COP', flag: '🇨🇴' },
    { code: 'MLC', name: 'Chile', currency: 'CLP', flag: '🇨🇱' },
    { code: 'MPE', name: 'Perú', currency: 'PEN', flag: '🇵🇪' },
    { code: 'MLA', name: 'Argentina', currency: 'ARS', flag: '🇦🇷' }
  ];

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get(`${API_URL}/api/ml/my-stores`, { headers });
      setStores(response.data.stores || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
      // Mock data for demo
      setStores([
        {
          id: 1,
          store_name: 'Todoencargo-co',
          site_id: 'MCO',
          status: 'active',
          created_at: '2025-08-15'
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.post(
        `${API_URL}/api/ml/stores/setup`,
        formData,
        { headers }
      );
      
      if (response.data.oauth_url) {
        // Open OAuth in popup
        const popup = window.open(
          response.data.oauth_url,
          'ml-oauth',
          'width=600,height=600,scrollbars=yes,resizable=yes'
        );
        
        // Listen for popup close or message
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            fetchStores(); // Refresh stores list
            setShowForm(false);
            setFormData({ site_id: 'MCO', app_id: '', app_secret: '', store_name: '' });
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error connecting store:', error);
      alert('Error al conectar tienda: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const deleteStore = async (storeId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta tienda?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      await axios.delete(`${API_URL}/api/ml/stores/${storeId}`, { headers });
      fetchStores();
    } catch (error) {
      console.error('Error deleting store:', error);
      alert('Error al eliminar tienda');
    }
  };

  const getCountryInfo = (siteId) => {
    return countries.find(c => c.code === siteId) || { name: siteId, flag: '🏳️', currency: 'USD' };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Store className="h-8 w-8 text-purple-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Tiendas MercadoLibre</h1>
                <p className="text-gray-600">Conecta y gestiona tus tiendas</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Nueva Tienda</span>
            </button>
          </div>
        </div>

        {/* Add Store Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Conectar Nueva Tienda</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País
                  </label>
                  <select
                    value={formData.site_id}
                    onChange={(e) => setFormData({ ...formData, site_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {countries.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Tienda
                  </label>
                  <input
                    type="text"
                    value={formData.store_name}
                    onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                    placeholder="Todoencargo-co"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    App ID
                  </label>
                  <input
                    type="text"
                    value={formData.app_id}
                    onChange={(e) => setFormData({ ...formData, app_id: e.target.value })}
                    placeholder="123456789"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    App Secret
                  </label>
                  <input
                    type="password"
                    value={formData.app_secret}
                    onChange={(e) => setFormData({ ...formData, app_secret: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6 flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition disabled:opacity-50"
                >
                  {loading ? 'Conectando...' : 'Conectar Tienda'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stores List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Tiendas Conectadas ({stores.length})
            </h2>
            <button
              onClick={fetchStores}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
            >
              <RefreshCw className={`h-4 w-4 ${loading && 'animate-spin'}`} />
              <span>Actualizar</span>
            </button>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : stores.length === 0 ? (
            <div className="text-center py-12">
              <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tiendas conectadas</h3>
              <p className="text-gray-600 mb-4">Conecta tu primera tienda de MercadoLibre</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
              >
                Conectar Tienda
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {stores.map((store) => {
                const country = getCountryInfo(store.site_id);
                return (
                  <div key={store.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{country.flag}</div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{store.store_name}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-500">
                              {country.name} ({store.site_id})
                            </span>
                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm text-gray-500">
                              Conectada: {store.created_at}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {store.status === 'active' ? (
                          <span className="flex items-center space-x-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Activa</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-1 text-yellow-600">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Pendiente</span>
                          </span>
                        )}
                        <button
                          onClick={() => deleteStore(store.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Eliminar tienda"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectStore;