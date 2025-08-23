import React, { useState, useEffect } from 'react';
import { 
  Package, Store, RefreshCw, CheckCircle, AlertCircle, 
  Clock, DollarSign, User, Calendar, ExternalLink,
  ShoppingCart, TrendingUp, Filter, Download
} from 'lucide-react';
import apiService from '../services/api';
import MLOrders from '../components/MLOrders.js';
import './MLOrdersSync.css';

const MLOrdersSync = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [syncStats, setSyncStats] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // cards or table

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener tiendas conectadas
      const response = await apiService.getMLStores();
      setStores(response || []);
      
      // Auto-seleccionar primera tienda si hay una
      if (response && response.length > 0) {
        const activeStore = response.find(s => s.is_connected) || response[0];
        setSelectedStore(activeStore);
      }
    } catch (error) {
      console.error('Error loading stores:', error);
      setError('Error al cargar las tiendas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncOrders = async () => {
    if (!selectedStore) {
      setError('Por favor selecciona una tienda primero');
      return;
    }

    try {
      setSyncLoading(true);
      setError(null);
      setSuccessMessage('');
      
      // Llamar endpoint de sincronización
      const response = await apiService.request(`/api/ml/stores/${selectedStore.id}/sync-orders`, {
        method: 'POST'
      });
      
      setSyncStats(response);
      setSuccessMessage(`✅ Sincronización exitosa: ${response.orders_synced || 0} órdenes procesadas`);
      
      // Recargar el componente de órdenes
      if (window.mlOrdersRef) {
        window.mlOrdersRef.loadOrders();
      }
    } catch (error) {
      console.error('Error syncing orders:', error);
      setError('Error al sincronizar: ' + error.message);
    } finally {
      setSyncLoading(false);
    }
  };

  const handleUpdateOrders = async () => {
    if (!selectedStore) {
      setError('Por favor selecciona una tienda primero');
      return;
    }

    try {
      setUpdateLoading(true);
      setError(null);
      setSuccessMessage('');
      
      // Llamar endpoint de actualización
      const response = await apiService.request(`/api/ml/stores/${selectedStore.id}/update-orders`, {
        method: 'POST'
      });
      
      setSyncStats(response);
      setSuccessMessage(`🔄 Actualización exitosa: ${response.orders_updated || 0} órdenes actualizadas de ${response.total_existing || 0} existentes`);
      
      // Recargar el componente de órdenes
      if (window.mlOrdersRef) {
        window.mlOrdersRef.loadOrders();
      }
    } catch (error) {
      console.error('Error updating orders:', error);
      setError('Error al actualizar órdenes: ' + error.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleRefreshToken = async (storeId) => {
    try {
      const response = await apiService.request(`/api/ml/refresh-token/${storeId}`, {
        method: 'POST'
      });
      setSuccessMessage('✅ Token actualizado exitosamente');
      loadStores(); // Recargar tiendas
    } catch (error) {
      setError('Error al actualizar token: ' + error.message);
    }
  };

  const getStoreStatusColor = (store) => {
    if (!store.is_connected) return '#dc3545';
    if (store.token_expires_at) {
      const expiry = new Date(store.token_expires_at);
      const now = new Date();
      const hoursLeft = (expiry - now) / (1000 * 60 * 60);
      if (hoursLeft < 24) return '#ffc107'; // Warning - expires soon
    }
    return '#28a745'; // Connected and healthy
  };

  return (
    <div className="ml-orders-sync-page">
      {/* Header */}
      <div className="sync-header">
        <div className="header-content">
          <div className="header-title">
            <Package size={32} className="header-icon" />
            <div>
              <h1>Sincronización de Órdenes MercadoLibre</h1>
              <p className="header-subtitle">
                Importa y gestiona tus órdenes de MercadoLibre en tiempo real
              </p>
            </div>
          </div>
          
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={handleSyncOrders}
              disabled={!selectedStore || syncLoading || updateLoading}
            >
              {syncLoading ? (
                <>
                  <RefreshCw size={18} className="spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <RefreshCw size={18} />
                  Sincronizar Ahora
                </>
              )}
            </button>
            
            <button 
              className="btn btn-secondary ml-2"
              onClick={handleUpdateOrders}
              disabled={!selectedStore || syncLoading || updateLoading}
              title="Actualiza las órdenes ya sincronizadas para detectar cambios"
            >
              {updateLoading ? (
                <>
                  <Download size={18} className="spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Actualizar Órdenes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        {syncStats && (
          <div className="sync-stats-bar">
            <div className="stat-item">
              <span className="stat-label">Órdenes Sincronizadas</span>
              <span className="stat-value">{syncStats.orders_synced || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total en Sistema</span>
              <span className="stat-value">{syncStats.total_orders || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Última Sincronización</span>
              <span className="stat-value">
                {new Date().toLocaleTimeString('es-CO')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          {successMessage}
        </div>
      )}

      {/* Store Selector */}
      <div className="store-selector-section">
        <h2 className="section-title">
          <Store size={20} />
          Selecciona una Tienda
        </h2>
        
        {loading ? (
          <div className="loading-container">
            <RefreshCw size={32} className="spin" />
            <p>Cargando tiendas...</p>
          </div>
        ) : stores.length === 0 ? (
          <div className="no-stores-message">
            <AlertCircle size={48} />
            <h3>No hay tiendas conectadas</h3>
            <p>Primero debes conectar una tienda de MercadoLibre</p>
            <button className="btn btn-primary">
              Conectar Tienda
            </button>
          </div>
        ) : (
          <div className="stores-grid">
            {stores.map((store) => (
              <div 
                key={store.id}
                className={`store-card ${selectedStore?.id === store.id ? 'selected' : ''}`}
                onClick={() => setSelectedStore(store)}
              >
                <div className="store-card-header">
                  <div className="store-info">
                    <h3>{store.store_name || store.nickname}</h3>
                    <p className="store-site">{store.site_name} ({store.site_id})</p>
                  </div>
                  <div 
                    className="store-status"
                    style={{ backgroundColor: getStoreStatusColor(store) }}
                  >
                    {store.is_connected ? 'Conectada' : 'Desconectada'}
                  </div>
                </div>
                
                <div className="store-card-body">
                  <div className="store-meta">
                    <div className="meta-item">
                      <User size={14} />
                      <span>{store.ml_nickname || 'N/A'}</span>
                    </div>
                    <div className="meta-item">
                      <Calendar size={14} />
                      <span>
                        {store.connected_at 
                          ? new Date(store.connected_at).toLocaleDateString('es-CO')
                          : 'No conectada'}
                      </span>
                    </div>
                  </div>
                  
                  {store.is_connected && (
                    <div className="store-actions">
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRefreshToken(store.id);
                        }}
                      >
                        <RefreshCw size={14} />
                        Actualizar Token
                      </button>
                    </div>
                  )}
                </div>
                
                {selectedStore?.id === store.id && (
                  <div className="store-selected-indicator">
                    <CheckCircle size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders Display */}
      {selectedStore && selectedStore.is_connected && (
        <div className="orders-section">
          <div className="section-header">
            <h2 className="section-title">
              <ShoppingCart size={20} />
              Órdenes de {selectedStore.store_name || selectedStore.nickname}
            </h2>
            
            <div className="view-toggle">
              <button 
                className={`toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
                onClick={() => setViewMode('cards')}
              >
                Vista Tarjetas
              </button>
              <button 
                className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
              >
                Vista Tabla
              </button>
            </div>
          </div>
          
          {/* Componente MLOrders existente */}
          <MLOrders 
            store={selectedStore} 
            viewMode={viewMode}
            ref={(ref) => window.mlOrdersRef = ref}
          />
        </div>
      )}

      {/* Help Section */}
      <div className="help-section">
        <h3>¿Cómo funciona la sincronización?</h3>
        <div className="help-grid">
          <div className="help-card">
            <div className="help-number">1</div>
            <h4>Selecciona Tienda</h4>
            <p>Elige la tienda de MercadoLibre de la que quieres importar órdenes</p>
          </div>
          <div className="help-card">
            <div className="help-number">2</div>
            <h4>Sincroniza</h4>
            <p>Haz clic en "Sincronizar Ahora" para importar las últimas órdenes</p>
          </div>
          <div className="help-card">
            <div className="help-number">3</div>
            <h4>Gestiona</h4>
            <p>Ve y administra todas tus órdenes en un solo lugar</p>
          </div>
        </div>
        
        <div className="help-note">
          <AlertCircle size={16} />
          <p>
            <strong>Nota:</strong> La sincronización trae las últimas 50 órdenes por defecto. 
            Para sincronización completa, contacta al administrador.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MLOrdersSync;