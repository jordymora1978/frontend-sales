import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const SincOrdersMeli = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null); // Solo una orden expandida a la vez

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const response = await apiService.getMLStores();
      setStores(response || []);
      if (response && response.length > 0) {
        setSelectedStore(response[0]);
      }
    } catch (error) {
      setError('Error loading stores: ' + error.message);
    }
  };

  const loadOrders = async () => {
    if (!selectedStore) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.request(`/api/ml/stores/${selectedStore.id}/orders`);
      setOrders(response.orders || []);
    } catch (error) {
      setError('Error loading orders: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (orderId) => {
    // Si la orden ya está expandida, la colapsa. Si no, la expande
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>📦 Órdenes MercadoLibre - Vista Colapsable</h1>
      
      {/* Store Selector */}
      <div style={{ marginBottom: '20px' }}>
        <label>Tienda: </label>
        <select 
          value={selectedStore?.id || ''} 
          onChange={(e) => {
            const store = stores.find(s => s.id === parseInt(e.target.value));
            setSelectedStore(store);
          }}
          style={{ padding: '5px', marginRight: '10px' }}
        >
          {stores.map(store => (
            <option key={store.id} value={store.id}>
              {store.nickname}
            </option>
          ))}
        </select>
        <button 
          onClick={loadOrders} 
          disabled={loading || !selectedStore}
          style={{ 
            padding: '5px 15px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '3px',
            cursor: loading || !selectedStore ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Cargando...' : 'Cargar Órdenes'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {/* Orders List */}
      {orders.length > 0 && (
        <div>
          <h3>Total de órdenes: {orders.length}</h3>
          {orders.map(order => (
            <div 
              key={order.id} 
              style={{ 
                marginBottom: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                overflow: 'hidden'
              }}
            >
              {/* Order Header - Clickable */}
              <div 
                onClick={() => handleOrderClick(order.id)}
                style={{ 
                  padding: '15px',
                  backgroundColor: expandedOrder === order.id ? '#f0f8ff' : '#f9f9f9',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  ':hover': {
                    backgroundColor: '#e9e9e9'
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>#{order.id}</strong> - {order.buyer?.nickname || 'Sin nombre'}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ 
                      padding: '3px 8px', 
                      backgroundColor: order.status === 'paid' ? '#28a745' : '#6c757d',
                      color: 'white',
                      borderRadius: '3px',
                      fontSize: '12px'
                    }}>
                      {order.status}
                    </span>
                    <span style={{ fontWeight: 'bold' }}>
                      ${order.total_amount?.toFixed(2) || '0.00'}
                    </span>
                    <span style={{ fontSize: '20px' }}>
                      {expandedOrder === order.id ? '▼' : '▶'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Details - Expandible */}
              {expandedOrder === order.id && (
                <div style={{ 
                  padding: '15px',
                  backgroundColor: '#ffffff',
                  borderTop: '1px solid #ddd'
                }}>
                  <h4>Detalles de la Orden</h4>
                  
                  {/* Customer Info */}
                  <div style={{ marginBottom: '15px' }}>
                    <strong>Cliente:</strong><br />
                    Nombre: {order.buyer?.first_name} {order.buyer?.last_name}<br />
                    Email: {order.buyer?.email || 'No disponible'}<br />
                    Teléfono: {order.buyer?.phone?.number || 'No disponible'}
                  </div>

                  {/* Items */}
                  <div style={{ marginBottom: '15px' }}>
                    <strong>Productos:</strong>
                    {order.order_items?.map((item, index) => (
                      <div key={index} style={{ 
                        padding: '10px',
                        backgroundColor: '#f9f9f9',
                        marginTop: '5px',
                        borderRadius: '3px'
                      }}>
                        <div>{item.item?.title || 'Sin título'}</div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          Cantidad: {item.quantity} | 
                          Precio: ${item.unit_price?.toFixed(2) || '0.00'} | 
                          Total: ${(item.quantity * item.unit_price).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping */}
                  {order.shipping && (
                    <div style={{ marginBottom: '15px' }}>
                      <strong>Envío:</strong><br />
                      {order.shipping.receiver_address && (
                        <>
                          {order.shipping.receiver_address.street_name} {order.shipping.receiver_address.street_number}<br />
                          {order.shipping.receiver_address.city?.name}, {order.shipping.receiver_address.state?.name}<br />
                          CP: {order.shipping.receiver_address.zip_code}
                        </>
                      )}
                    </div>
                  )}

                  {/* Payment */}
                  <div>
                    <strong>Pago:</strong><br />
                    Total: ${order.total_amount?.toFixed(2) || '0.00'}<br />
                    Estado: {order.status}<br />
                    Fecha: {new Date(order.date_created).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* No Orders Message */}
      {!loading && orders.length === 0 && selectedStore && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '5px',
          textAlign: 'center',
          color: '#666'
        }}>
          No se encontraron órdenes. Haz clic en "Cargar Órdenes" para buscar.
        </div>
      )}
    </div>
  );
};

export default SincOrdersMeli;