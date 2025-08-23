import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const OrdersCollapsible = () => {
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
      
      {/* Selector de Tienda */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px' 
      }}>
        <select 
          value={selectedStore?.id || ''} 
          onChange={(e) => {
            const store = stores.find(s => s.id === parseInt(e.target.value));
            setSelectedStore(store);
          }}
          style={{ 
            padding: '8px', 
            marginRight: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        >
          {stores.map(store => (
            <option key={store.id} value={store.id}>
              {store.store_name} ({store.site_name})
            </option>
          ))}
        </select>
        
        <button 
          onClick={loadOrders}
          disabled={loading}
          style={{ 
            padding: '8px 20px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Cargando...' : 'Cargar Órdenes'}
        </button>
      </div>

      {/* Mensajes de Error */}
      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#fee', 
          color: '#c00',
          borderRadius: '4px',
          marginBottom: '20px' 
        }}>
          {error}
        </div>
      )}

      {/* Lista de Órdenes */}
      <div style={{ marginTop: '20px' }}>
        <h2>Órdenes ({orders.length})</h2>
        
        {orders.length === 0 && !loading && (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            color: '#666'
          }}>
            No hay órdenes. Haz clic en "Cargar Órdenes" para obtenerlas.
          </div>
        )}
        
        {orders.map((order) => (
          <div 
            key={order.id}
            style={{ 
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {/* HEADER - SIEMPRE VISIBLE */}
            <div 
              onClick={() => handleOrderClick(order.id)}
              style={{ 
                padding: '15px',
                backgroundColor: '#f8f9fa',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: expandedOrder === order.id ? '1px solid #ddd' : 'none',
                transition: 'background-color 0.2s',
                ':hover': {
                  backgroundColor: '#e9ecef'
                }
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '20px', color: '#666' }}>
                  {expandedOrder === order.id ? '▼' : '▶'}
                </span>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                  🛒 Orden #{order.id}
                </span>
                <span style={{ 
                  padding: '4px 8px',
                  backgroundColor: order.status === 'paid' ? '#d4edda' : '#fff3cd',
                  color: order.status === 'paid' ? '#155724' : '#856404',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {order.status?.toUpperCase()}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>
                  💰 ${order.total_amount || 0} {order.currency_id}
                </span>
                <span style={{ color: '#666', fontSize: '14px' }}>
                  📅 {new Date(order.date_created).toLocaleDateString()}
                </span>
                <span style={{ color: '#666', fontSize: '14px' }}>
                  📦 {order.order_items?.length || 0} items
                </span>
              </div>
            </div>

            {/* CONTENIDO EXPANDIDO */}
            {expandedOrder === order.id && (
              <div style={{ padding: '20px', backgroundColor: '#fff' }}>
                
                {/* SECCIÓN 1: FECHAS Y ESTADO - INFORMACIÓN COMPLETA */}
                <details style={{ marginBottom: '15px' }}>
                  <summary style={{ 
                    cursor: 'pointer',
                    padding: '10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    marginBottom: '10px'
                  }}>
                    📅 Fechas y Estado - INFORMACIÓN COMPLETA
                  </summary>
                  <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px', marginTop: '10px' }}>
                    
                    {/* Información Principal de la Orden */}
                    <div style={{ marginBottom: '15px', backgroundColor: '#e3f2fd', padding: '10px', borderRadius: '4px' }}>
                      <h5 style={{ margin: '0 0 10px 0' }}>📄 Información Principal</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                          <p><strong>ID de Orden:</strong> {order.id}</p>
                          <p><strong>Estado:</strong> {order.status}</p>
                          <p><strong>Detalle del Estado:</strong> {order.status_detail || 'N/A'}</p>
                          <p><strong>Canal:</strong> {order.channel || 'N/A'}</p>
                          <p><strong>Sitio:</strong> {order.site_id}</p>
                          <p><strong>Moneda:</strong> {order.currency_id}</p>
                        </div>
                        <div>
                          <p><strong>Total:</strong> ${order.total_amount} {order.currency_id}</p>
                          <p><strong>Pagado:</strong> ${order.paid_amount || 0}</p>
                          <p><strong>Comentarios:</strong> {order.comments || 'N/A'}</p>
                          <p><strong>Mediación:</strong> {order.mediation_id || 'N/A'}</p>
                          <p><strong>Cupon Aplicado:</strong> {order.coupon?.id || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Fechas Importantes */}
                    <div style={{ marginBottom: '15px', backgroundColor: '#f3e5f5', padding: '10px', borderRadius: '4px' }}>
                      <h5 style={{ margin: '0 0 10px 0' }}>📅 Cronología de la Orden</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                          <p><strong>Fecha Creación:</strong> {new Date(order.date_created).toLocaleString()}</p>
                          {order.date_closed && <p><strong>Fecha Cierre:</strong> {new Date(order.date_closed).toLocaleString()}</p>}
                          {order.last_updated && <p><strong>Última Actualización:</strong> {new Date(order.last_updated).toLocaleString()}</p>}
                          {order.expiration_date && <p><strong>Fecha Expiración:</strong> {new Date(order.expiration_date).toLocaleString()}</p>}
                        </div>
                        <div>
                          {order.manufacturing_ending_date && (
                            <p><strong>Fin Fabricación:</strong> {new Date(order.manufacturing_ending_date).toLocaleDateString()}</p>
                          )}
                          {order.date_first_printed && (
                            <p><strong>Primera Impresión:</strong> {new Date(order.date_first_printed).toLocaleString()}</p>
                          )}
                          {order.feedback?.sale && (
                            <p><strong>Fecha Feedback:</strong> {new Date(order.feedback.sale.date_created).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Información de Empaquetado y Logística */}
                    <div style={{ marginBottom: '15px', backgroundColor: '#e8f5e8', padding: '10px', borderRadius: '4px' }}>
                      <h5 style={{ margin: '0 0 10px 0' }}>📦 Empaquetado y Logística</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                          {order.pack_id && <p><strong>Pack ID:</strong> {order.pack_id} (Envío Agrupado)</p>}
                          {order.pickup_id && <p><strong>Pickup ID:</strong> {order.pickup_id}</p>}
                          {order.logistics_info?.fulfillment_type && (
                            <p><strong>Tipo de Fulfillment:</strong> {order.logistics_info.fulfillment_type}</p>
                          )}
                          {order.logistics_info?.handling_time && (
                            <p><strong>Tiempo de Manejo:</strong> {order.logistics_info.handling_time}</p>
                          )}
                        </div>
                        <div>
                          {order.logistics_info?.shipping_mode && (
                            <p><strong>Modo de Envío:</strong> {order.logistics_info.shipping_mode}</p>
                          )}
                          {order.logistics_info?.store_pick_up && (
                            <p><strong>Recogida en Tienda:</strong> {order.logistics_info.store_pick_up ? 'Sí' : 'No'}</p>
                          )}
                          {order.application_id && (
                            <p><strong>ID Aplicación:</strong> {order.application_id}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Tags y Contexto */}
                    {(order.tags || order.context) && (
                      <div style={{ marginBottom: '15px', backgroundColor: '#fff3e0', padding: '10px', borderRadius: '4px' }}>
                        <h5 style={{ margin: '0 0 10px 0' }}>🏷️ Tags y Contexto</h5>
                        {order.tags?.length > 0 && <p><strong>Tags:</strong> {order.tags.join(', ')}</p>}
                        {order.context && (
                          <div>
                            <p><strong>Contexto:</strong></p>
                            <div style={{ marginLeft: '15px' }}>
                              <p><strong>Canal:</strong> {order.context.channel}</p>
                              <p><strong>Sitio:</strong> {order.context.site}</p>
                              {order.context.flows && <p><strong>Flujos:</strong> {order.context.flows.join(', ')}</p>}
                              {order.context.application && <p><strong>Aplicación:</strong> {order.context.application}</p>}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Feedback */}
                    {order.feedback && (
                      <div style={{ marginBottom: '15px', backgroundColor: '#fce4ec', padding: '10px', borderRadius: '4px' }}>
                        <h5 style={{ margin: '0 0 10px 0' }}>💬 Feedback</h5>
                        {order.feedback.sale && (
                          <div>
                            <p><strong>Rating Venta:</strong> {order.feedback.sale.rating}</p>
                            <p><strong>Comentario:</strong> {order.feedback.sale.message || 'Sin comentarios'}</p>
                            <p><strong>Fecha:</strong> {new Date(order.feedback.sale.date_created).toLocaleString()}</p>
                            <p><strong>Estado:</strong> {order.feedback.sale.status}</p>
                          </div>
                        )}
                        {order.feedback.purchase && (
                          <div>
                            <p><strong>Rating Compra:</strong> {order.feedback.purchase.rating}</p>
                            <p><strong>Comentario Compra:</strong> {order.feedback.purchase.message || 'Sin comentarios'}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Cupon Información */}
                    {order.coupon && (
                      <div style={{ marginBottom: '15px', backgroundColor: '#e1f5fe', padding: '10px', borderRadius: '4px' }}>
                        <h5 style={{ margin: '0 0 10px 0' }}>🎫 Cupón Aplicado</h5>
                        <p><strong>ID Cupón:</strong> {order.coupon.id}</p>
                        <p><strong>Monto:</strong> ${order.coupon.amount}</p>
                        {order.coupon.used_date && <p><strong>Fecha de Uso:</strong> {new Date(order.coupon.used_date).toLocaleString()}</p>}
                      </div>
                    )}
                    
                    {/* Información Adicional que pueda existir */}
                    <details style={{ marginTop: '10px' }}>
                      <summary style={{ cursor: 'pointer', fontSize: '12px', color: '#666' }}>Ver todos los datos adicionales de la orden</summary>
                      <div style={{ marginTop: '8px', fontSize: '11px', backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '3px' }}>
                        {Object.entries(order).map(([key, value]) => {
                          // Excluir campos ya mostrados arriba
                          const excludedFields = ['id', 'status', 'status_detail', 'channel', 'site_id', 'currency_id', 'total_amount', 'paid_amount', 'comments', 'mediation_id', 'coupon', 'date_created', 'date_closed', 'last_updated', 'expiration_date', 'manufacturing_ending_date', 'date_first_printed', 'feedback', 'pack_id', 'pickup_id', 'logistics_info', 'application_id', 'tags', 'context', 'order_items', 'payments', 'shipping', 'buyer', 'taxes'];
                          if (!excludedFields.includes(key) && value !== null && value !== undefined && value !== '' && value !== 0) {
                            return (
                              <span key={key}><strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : String(value)}<br/></span>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </details>
                  </div>
                </details>

                {/* SECCIÓN 2: INFORMACIÓN FINANCIERA - ESTILO MERCADOPAGO */}
                <details style={{ marginBottom: '15px' }}>
                  <summary style={{ 
                    cursor: 'pointer',
                    padding: '10px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    marginBottom: '10px'
                  }}>
                    💰 Información Financiera e Impuestos
                  </summary>
                  <div style={{ padding: '15px', backgroundColor: '#ffffff', borderRadius: '4px', marginTop: '10px', border: '1px solid #e0e0e0' }}>
                    
                    {/* Header de la Operación */}
                    <div style={{ marginBottom: '20px', borderBottom: '1px solid #e0e0e0', paddingBottom: '15px' }}>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>Número de operación: {order.id}</h4>
                      <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                        Creada el {new Date(order.date_created).toLocaleDateString('es-ES', { day: '2-digit', month: 'long' })} - {new Date(order.date_created).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} hs
                      </p>
                    </div>
                    
                    {/* Items del Pedido */}
                    {order.order_items && order.order_items.map((item, idx) => (
                      <div key={idx} style={{ marginBottom: '10px', fontSize: '16px' }}>
                        <span style={{ color: '#333' }}>{item.title || item.item_title}</span>
                        <span style={{ float: 'right', fontWeight: 'bold' }}>${item.unit_price * item.quantity}</span>
                        <div style={{ clear: 'both' }}></div>
                      </div>
                    ))}
                    
                    {/* Impuestos */}
                    {order.taxes && (order.taxes.iva_amount > 0 || order.taxes.fuente_amount > 0 || order.taxes.ica_amount > 0) && (
                      <div style={{ marginBottom: '15px' }}>
                        <div style={{ fontSize: '16px', marginBottom: '5px' }}>
                          <span>Impuestos</span>
                          <span style={{ float: 'right', fontWeight: 'bold' }}>-${order.taxes.total_calculated_taxes?.toFixed(0) || ((order.taxes.iva_amount || 0) + (order.taxes.fuente_amount || 0) + (order.taxes.ica_amount || 0)).toFixed(0)}</span>
                          <div style={{ clear: 'both' }}></div>
                        </div>
                        
                        {/* Detalles de Impuestos */}
                        <div style={{ marginLeft: '0px', fontSize: '14px', color: '#666' }}>
                          {order.taxes.ica_amount > 0 && (
                            <div style={{ marginBottom: '2px' }}>
                              <span>Retención ICA:</span>
                              <span style={{ float: 'right' }}>-${order.taxes.ica_amount.toFixed(0)}</span>
                              <div style={{ clear: 'both' }}></div>
                            </div>
                          )}
                          {order.taxes.fuente_amount > 0 && (
                            <div style={{ marginBottom: '2px' }}>
                              <span>Retención en la Fuente:</span>
                              <span style={{ float: 'right' }}>-${order.taxes.fuente_amount.toFixed(0)}</span>
                              <div style={{ clear: 'both' }}></div>
                            </div>
                          )}
                          {order.taxes.iva_amount > 0 && (
                            <div style={{ marginBottom: '2px' }}>
                              <span>Retención Impuesto al Valor Agregado:</span>
                              <span style={{ float: 'right' }}>-${order.taxes.iva_amount.toFixed(0)}</span>
                              <div style={{ clear: 'both' }}></div>
                            </div>
                          )}
                        </div>
                        
                        <div style={{ fontSize: '12px', color: '#0066cc', marginTop: '5px' }}>
                          <a href="#" style={{ textDecoration: 'none' }}>Cómo se calculan los impuestos ajenos a Mercado Pago</a>
                        </div>
                      </div>
                    )}
                    
                    {/* Cargo por envío */}
                    {order.shipping && order.shipping.cost > 0 && (
                      <div style={{ fontSize: '16px', marginBottom: '10px' }}>
                        <span>Cargo por envío</span>
                        <span style={{ float: 'right', fontWeight: 'bold' }}>-${order.shipping.cost}</span>
                        <div style={{ clear: 'both' }}></div>
                      </div>
                    )}
                    
                    {/* Comisión ML (calcular de los items) */}
                    {order.order_items && (
                      <div style={{ fontSize: '16px', marginBottom: '15px' }}>
                        <span>Comisión por venta de Mercado Libre</span>
                        <span style={{ float: 'right', fontWeight: 'bold' }}>-${order.order_items.reduce((total, item) => total + (item.sale_fee || 0), 0).toFixed(0)}</span>
                        <div style={{ clear: 'both' }}></div>
                      </div>
                    )}
                    
                    {/* Total */}
                    <div style={{ 
                      borderTop: '1px solid #e0e0e0', 
                      paddingTop: '15px', 
                      fontSize: '18px', 
                      fontWeight: 'bold',
                      marginBottom: '15px'
                    }}>
                      <span>Total</span>
                      <span style={{ float: 'right' }}>${order.paid_amount || order.total_amount}</span>
                      <div style={{ clear: 'both' }}></div>
                    </div>
                    
                    {/* Estado del Cobro */}
                    <div style={{ 
                      backgroundColor: '#e8f5e8', 
                      padding: '10px', 
                      borderRadius: '4px',
                      marginBottom: '15px',
                      fontSize: '14px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        <span style={{ color: '#28a745', marginRight: '5px', fontSize: '16px' }}>✓</span>
                        <span style={{ fontWeight: 'bold' }}>Cobro aprobado</span>
                      </div>
                      <div style={{ color: '#666' }}>Este dinero ya está disponible.</div>
                    </div>
                    
                    {/* Medio de Pago */}
                    {order.payments && order.payments.length > 0 && (
                      <div>
                        <h5 style={{ marginBottom: '10px', fontSize: '16px' }}>Medio de pago</h5>
                        {order.payments.map((payment, idx) => (
                          <div key={idx} style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            marginBottom: '10px',
                            fontSize: '14px'
                          }}>
                            <span style={{ marginRight: '8px' }}>🔴🟡</span>
                            <span>{payment.payment_method_id} terminada en {payment.id.toString().slice(-4)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Datos Técnicos Expandibles */}
                    <details style={{ marginTop: '20px', borderTop: '1px solid #e0e0e0', paddingTop: '15px' }}>
                      <summary style={{ cursor: 'pointer', fontSize: '14px', color: '#0066cc' }}>Ver detalles técnicos completos</summary>
                      <div style={{ marginTop: '10px', fontSize: '12px', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                        
                        {/* Información de Pagos Completa */}
                        {order.payments && order.payments.map((payment, idx) => (
                          <div key={idx} style={{ marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                            <h6>Pago {idx + 1} - ID: {payment.id}</h6>
                            <p><strong>Estado:</strong> {payment.status} ({payment.status_detail})</p>
                            <p><strong>Monto:</strong> ${payment.transaction_amount} {payment.currency_id}</p>
                            <p><strong>Tipo:</strong> {payment.payment_type} - {payment.payment_method_id}</p>
                            <p><strong>Cuotas:</strong> {payment.installments}</p>
                            {payment.date_approved && <p><strong>Aprobado:</strong> {new Date(payment.date_approved).toLocaleString()}</p>}
                            
                            {/* Impuestos MercadoPago */}
                            {(payment.iva > 0 || payment.fuente > 0 || payment.ica > 0) && (
                              <div style={{ backgroundColor: '#fff3cd', padding: '5px', borderRadius: '3px', marginTop: '5px' }}>
                                <strong>Impuestos MercadoPago:</strong><br/>
                                IVA: ${payment.iva || 0} | FUENTE: ${payment.fuente || 0} | ICA: ${payment.ica || 0}
                              </div>
                            )}
                            
                            {/* Datos Financieros */}
                            {(payment.fee_amount > 0 || payment.net_received_amount > 0) && (
                              <div style={{ backgroundColor: '#e8f5e8', padding: '5px', borderRadius: '3px', marginTop: '5px' }}>
                                <strong>Financiero:</strong> Bruto: ${payment.gross_amount || 0} | Fee: ${payment.fee_amount || 0} | Neto: ${payment.net_received_amount || 0}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                </details>

                {/* SECCIÓN 3: DATOS DEL CLIENTE - INFORMACIÓN COMPLETA */}
                <details style={{ marginBottom: '15px' }}>
                  <summary style={{ 
                    cursor: 'pointer',
                    padding: '10px',
                    backgroundColor: '#17a2b8',
                    color: 'white',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    marginBottom: '10px'
                  }}>
                    👤 Datos del Cliente - INFORMACIÓN COMPLETA
                  </summary>
                  <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px', marginTop: '10px' }}>
                    {order.buyer ? (
                      <div>
                        {/* Información Básica del Cliente */}
                        <div style={{ marginBottom: '15px', backgroundColor: '#e8f4f8', padding: '10px', borderRadius: '4px' }}>
                          <h5 style={{ margin: '0 0 10px 0' }}>👤 Información Personal</h5>
                          <p><strong>ID de Usuario:</strong> {order.buyer.id}</p>
                          <p><strong>Nickname:</strong> {order.buyer.nickname}</p>
                          <p><strong>Email:</strong> {order.buyer.email || 'N/A'}</p>
                          <p><strong>Nombre Completo:</strong> {order.buyer.full_name || `${order.buyer.first_name || ''} ${order.buyer.last_name || ''}`.trim() || 'N/A'}</p>
                          <p><strong>Nombre:</strong> {order.buyer.first_name || 'N/A'}</p>
                          <p><strong>Apellido:</strong> {order.buyer.last_name || 'N/A'}</p>
                          <p><strong>Tipo de Usuario:</strong> {order.buyer.user_type || 'N/A'}</p>
                          <p><strong>País:</strong> {order.buyer.country_id || 'N/A'}</p>
                          <p><strong>Fecha de Registro:</strong> {order.buyer.registration_date ? new Date(order.buyer.registration_date).toLocaleString() : 'N/A'}</p>
                        </div>
                        
                        {/* Información de Contacto */}
                        <div style={{ marginBottom: '15px', backgroundColor: '#f0f8e8', padding: '10px', borderRadius: '4px' }}>
                          <h5 style={{ margin: '0 0 10px 0' }}>📞 Información de Contacto</h5>
                          
                          {/* Teléfono Principal */}
                          {order.buyer.phone && (
                            <div style={{ marginBottom: '8px' }}>
                              <strong>Teléfono Principal:</strong><br/>
                              <span>Código de Área: {order.buyer.phone.area_code || 'N/A'}</span><br/>
                              <span>Número: {order.buyer.phone.number || 'N/A'}</span><br/>
                              <span>Extensión: {order.buyer.phone.extension || 'N/A'}</span><br/>
                              <span>Verificado: {order.buyer.phone.verified ? 'Sí' : 'No'}</span><br/>
                              {order.buyer.phone_formatted && <span>Formato: {order.buyer.phone_formatted}</span>}<br/>
                              {order.buyer.client_number && <span>Número Cliente: {order.buyer.client_number}</span>}
                            </div>
                          )}
                          
                          {/* Teléfono Alternativo */}
                          {order.buyer.alternative_phone && Object.keys(order.buyer.alternative_phone).length > 0 && (
                            <div style={{ marginBottom: '8px' }}>
                              <strong>Teléfono Alternativo:</strong><br/>
                              <span>Código de Área: {order.buyer.alternative_phone.area_code || 'N/A'}</span><br/>
                              <span>Número: {order.buyer.alternative_phone.number || 'N/A'}</span><br/>
                              <span>Extensión: {order.buyer.alternative_phone.extension || 'N/A'}</span><br/>
                              <span>Verificado: {order.buyer.alternative_phone.verified ? 'Sí' : 'No'}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Información de Facturación */}
                        {order.buyer.billing_info && Object.keys(order.buyer.billing_info).length > 0 && (
                          <div style={{ marginBottom: '15px', backgroundColor: '#fff8e1', padding: '10px', borderRadius: '4px' }}>
                            <h5 style={{ margin: '0 0 10px 0' }}>💳 Información de Facturación</h5>
                            <p><strong>Tipo de Documento:</strong> {order.buyer.billing_info.doc_type || order.buyer.doc_type || 'N/A'}</p>
                            <p><strong>Número de Documento:</strong> {order.buyer.billing_info.doc_number || order.buyer.doc_number || 'N/A'}</p>
                            {Object.entries(order.buyer.billing_info).map(([key, value]) => {
                              if (key !== 'doc_type' && key !== 'doc_number' && value) {
                                return <p key={key}><strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}</p>
                              }
                              return null;
                            })}
                          </div>
                        )}
                        
                        {/* Dirección del Cliente */}
                        {order.buyer.address && Object.keys(order.buyer.address).length > 0 && (
                          <div style={{ marginBottom: '15px', backgroundColor: '#f3e5f5', padding: '10px', borderRadius: '4px' }}>
                            <h5 style={{ margin: '0 0 10px 0' }}>🏠 Dirección del Cliente</h5>
                            {Object.entries(order.buyer.address).map(([key, value]) => (
                              <p key={key}><strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}</p>
                            ))}
                          </div>
                        )}
                        
                        {/* Tags del Cliente */}
                        {order.buyer.tags && order.buyer.tags.length > 0 && (
                          <div style={{ marginBottom: '15px', backgroundColor: '#fce4ec', padding: '10px', borderRadius: '4px' }}>
                            <h5 style={{ margin: '0 0 10px 0' }}>🏷️ Tags del Cliente</h5>
                            <p><strong>Tags:</strong> {order.buyer.tags.join(', ')}</p>
                          </div>
                        )}
                        
                        {/* Información Adicional del Buyer que pueda existir */}
                        <div style={{ fontSize: '12px', color: '#666', backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
                          <strong>Datos Adicionales del Comprador:</strong><br/>
                          {Object.entries(order.buyer).map(([key, value]) => {
                            // Excluir campos ya mostrados arriba
                            const excludedFields = ['id', 'nickname', 'email', 'first_name', 'last_name', 'full_name', 'phone', 'alternative_phone', 'billing_info', 'address', 'tags', 'user_type', 'country_id', 'registration_date', 'doc_number', 'doc_type', 'client_number', 'phone_formatted'];
                            if (!excludedFields.includes(key) && value !== null && value !== undefined && value !== '') {
                              return (
                                <span key={key}><strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : String(value)}<br/></span>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    ) : (
                      <p>No hay información del comprador disponible</p>
                    )}
                  </div>
                </details>

                {/* SECCIÓN 4: ITEMS DEL PEDIDO - INFORMACIÓN COMPLETA */}
                <details style={{ marginBottom: '15px' }}>
                  <summary style={{ 
                    cursor: 'pointer',
                    padding: '10px',
                    backgroundColor: '#6f42c1',
                    color: 'white',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    marginBottom: '10px'
                  }}>
                    📦 Items del Pedido ({order.order_items?.length || 0}) - INFORMACIÓN COMPLETA
                  </summary>
                  <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px', marginTop: '10px' }}>
                    {order.order_items && order.order_items.length > 0 ? (
                      order.order_items.map((item, idx) => (
                        <div key={idx} style={{ 
                          backgroundColor: '#ffffff',
                          padding: '15px',
                          borderRadius: '4px',
                          marginBottom: '15px',
                          border: '1px solid #dee2e6'
                        }}>
                          <h4 style={{ margin: '0 0 10px 0', color: '#6f42c1' }}>Item {idx + 1}: {item.title || item.item_title}</h4>
                          
                          {/* Información Básica del Producto */}
                          <div style={{ marginBottom: '10px' }}>
                            <strong>🏷️ Información del Producto:</strong><br/>
                            <strong>ID Producto:</strong> {item.id || item.product_id}<br/>
                            <strong>SKU:</strong> {item.sku || item.seller_sku || item.seller_custom_field || 'N/A'}<br/>
                            <strong>ASIN:</strong> {item.asin || 'N/A'}<br/>
                            <strong>Categoría:</strong> {item.category_id}<br/>
                            <strong>Condición:</strong> {item.condition}<br/>
                            <strong>Tipo de Listing:</strong> {item.listing_type_id}<br/>
                            {item.permalink && <><strong>Enlace ML:</strong> <a href={item.permalink} target="_blank" rel="noopener noreferrer">Ver en ML</a><br/></>}
                            {item.picture_url && <><strong>Imagen:</strong> <a href={item.picture_url} target="_blank" rel="noopener noreferrer">Ver imagen</a><br/></>}
                          </div>
                          
                          {/* Información de Precios */}
                          <div style={{ marginBottom: '10px', backgroundColor: '#e8f5e8', padding: '8px', borderRadius: '4px' }}>
                            <strong>💰 Información de Precios:</strong><br/>
                            <strong>Cantidad:</strong> {item.quantity}<br/>
                            <strong>Precio Unitario:</strong> ${item.unit_price} {item.currency_id}<br/>
                            <strong>Precio Completo:</strong> ${item.full_unit_price || item.unit_price} {item.currency_id}<br/>
                            <strong>Comisión ML:</strong> ${item.sale_fee || 0}<br/>
                            <strong>Precio Neto:</strong> ${item.net_price || (item.unit_price - (item.sale_fee || 0)).toFixed(2)}<br/>
                            <strong>Total Item:</strong> ${(item.quantity * item.unit_price).toFixed(2)}<br/>
                            <strong>Total Neto:</strong> ${item.total_net_amount || (item.quantity * (item.unit_price - (item.sale_fee || 0))).toFixed(2)}<br/>
                            <strong>Purchase PPU:</strong> ${item.purchase_ppu || 'N/A'}<br/>
                          </div>
                          
                          {/* Información de Variaciones */}
                          {(item.variation_id || item.variation_attributes) && (
                            <div style={{ marginBottom: '10px', backgroundColor: '#fff3cd', padding: '8px', borderRadius: '4px' }}>
                              <strong>🔄 Variaciones:</strong><br/>
                              {item.variation_id && <><strong>ID Variación:</strong> {item.variation_id}<br/></>}
                              {item.variation_attributes && item.variation_attributes.length > 0 && (
                                <>
                                  <strong>Atributos:</strong><br/>
                                  {item.variation_attributes.map((attr, attrIdx) => (
                                    <span key={attrIdx}>- {attr.name}: {attr.value_name}<br/></span>
                                  ))}
                                </>
                              )}
                              {item.differential_pricing_id && <><strong>Pricing ID:</strong> {item.differential_pricing_id}<br/></>}
                            </div>
                          )}
                          
                          {/* Información de Catálogo y Atributos */}
                          {(item.catalog_product_id || item.domain_id || item.attributes) && (
                            <div style={{ marginBottom: '10px', backgroundColor: '#f0f8ff', padding: '8px', borderRadius: '4px' }}>
                              <strong>📋 Información de Catálogo:</strong><br/>
                              {item.catalog_product_id && <><strong>ID Catálogo:</strong> {item.catalog_product_id}<br/></>}
                              {item.domain_id && <><strong>Dominio:</strong> {item.domain_id}<br/></>}
                              {item.attributes && item.attributes.length > 0 && (
                                <>
                                  <strong>Atributos del producto:</strong><br/>
                                  {item.attributes.slice(0, 5).map((attr, attrIdx) => (
                                    <span key={attrIdx}>- {attr.name}: {attr.value_name || attr.value_struct?.unit || attr.values?.[0]?.name || 'N/A'}<br/></span>
                                  ))}
                                  {item.attributes.length > 5 && <span>... y {item.attributes.length - 5} más<br/></span>}
                                </>
                              )}
                            </div>
                          )}
                          
                          {/* Información Adicional */}
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {item.manufacturing_days && <><strong>Días Fabricación:</strong> {item.manufacturing_days}<br/></>}
                            {item.warranty && <><strong>Garantía:</strong> {item.warranty}<br/></>}
                            {item.description && <><strong>Descripción:</strong> {item.description.substring(0, 100)}...<br/></>}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No hay items en este pedido</p>
                    )}
                  </div>
                </details>

                {/* SECCIÓN 5: INFORMACIÓN DE ENVÍO - LOGISTICA COMPLETA */}
                <details style={{ marginBottom: '15px' }}>
                  <summary style={{ 
                    cursor: 'pointer',
                    padding: '10px',
                    backgroundColor: '#fd7e14',
                    color: 'white',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    marginBottom: '10px'
                  }}>
                    🚚 Información de Envío - LOGÍSTICA COMPLETA
                  </summary>
                  <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px', marginTop: '10px' }}>
                    {order.shipping ? (
                      <div>
                        {/* Información Básica de Envío */}
                        <div style={{ marginBottom: '15px', backgroundColor: '#e8f4fd', padding: '10px', borderRadius: '4px' }}>
                          <h5 style={{ margin: '0 0 10px 0' }}>📦 Información Básica</h5>
                          <p><strong>ID Envío:</strong> {order.shipping.id}</p>
                          <p><strong>Estado:</strong> {order.shipping.status}</p>
                          <p><strong>Sub-estado:</strong> {order.shipping.substatus || 'N/A'}</p>
                          <p><strong>Modo:</strong> {order.shipping.mode || 'N/A'}</p>
                          <p><strong>Creado desde:</strong> {order.shipping.created_from || 'N/A'}</p>
                          <p><strong>Costo Total:</strong> ${order.shipping.cost || 0} {order.shipping.currency_id || order.currency_id}</p>
                          <p><strong>Costo Base:</strong> ${order.shipping.base_cost || 0}</p>
                          <p><strong>Costo Seguro:</strong> ${order.shipping.insurance_cost || 0}</p>
                        </div>
                        
                        {/* Información Logística Expandida */}
                        <div style={{ marginBottom: '15px', backgroundColor: '#fff8e1', padding: '10px', borderRadius: '4px' }}>
                          <h5 style={{ margin: '0 0 10px 0' }}>🚛 Logística y Servicios</h5>
                          <p><strong>Tipo Logístico:</strong> {order.shipping.logistic_type || 'N/A'}</p>
                          <p><strong>Modo Logístico:</strong> {order.shipping.logistic_mode || 'N/A'}</p>
                          <p><strong>Dirección Logística:</strong> {order.shipping.logistic_direction || 'N/A'}</p>
                          <p><strong>Modo de Envío:</strong> {order.shipping.shipping_mode || 'N/A'}</p>
                          <p><strong>Tipo de Servicio:</strong> {order.shipping.service_type || 'N/A'}</p>
                          <p><strong>Tipo de Entrega:</strong> {order.shipping.delivery_type || 'N/A'}</p>
                          <p><strong>Método de Envío ID:</strong> {order.shipping.shipping_method_id || 'N/A'}</p>
                          <p><strong>ME1 Mode:</strong> {order.shipping.me1_mode || 'N/A'}</p>
                          <p><strong>ME2 Mode:</strong> {order.shipping.me2_mode || 'N/A'}</p>
                          <p><strong>Service ID:</strong> {order.shipping.service_id || 'N/A'}</p>
                        </div>
                        
                        {/* Fechas Importantes */}
                        <div style={{ marginBottom: '15px', backgroundColor: '#f3e5f5', padding: '10px', borderRadius: '4px' }}>
                          <h5 style={{ margin: '0 0 10px 0' }}>📅 Fechas del Envío</h5>
                          <p><strong>Fecha Creación:</strong> {order.shipping.date_created ? new Date(order.shipping.date_created).toLocaleString() : 'N/A'}</p>
                          <p><strong>Primera Impresión:</strong> {order.shipping.date_first_printed ? new Date(order.shipping.date_first_printed).toLocaleString() : 'N/A'}</p>
                          <p><strong>Fecha Envío:</strong> {order.shipping.date_shipped ? new Date(order.shipping.date_shipped).toLocaleString() : 'N/A'}</p>
                          <p><strong>Fecha Entrega:</strong> {order.shipping.date_delivered ? new Date(order.shipping.date_delivered).toLocaleString() : 'N/A'}</p>
                          
                          {/* Límite de Manejo Estimado */}
                          {order.shipping.estimated_handling_limit && (
                            <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
                              <strong>⏰ Límite de Manejo Estimado:</strong><br/>
                              {typeof order.shipping.estimated_handling_limit === 'object' ? (
                                <span>Fecha: {order.shipping.estimated_handling_limit.date || 'N/A'}</span>
                              ) : (
                                <span>{order.shipping.estimated_handling_limit}</span>
                              )}
                            </div>
                          )}
                          
                          {/* Tiempo de Entrega Estimado */}
                          {order.shipping.estimated_delivery_time && (
                            <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
                              <strong>📅 Tiempo de Entrega Estimado:</strong><br/>
                              {typeof order.shipping.estimated_delivery_time === 'object' ? (
                                Object.entries(order.shipping.estimated_delivery_time).map(([key, value]) => (
                                  <span key={key}>{key}: {value}<br/></span>
                                ))
                              ) : (
                                <span>{order.shipping.estimated_delivery_time}</span>
                              )}
                            </div>
                          )}
                          
                          {/* Entrega Final Estimada */}
                          {order.shipping.estimated_delivery_final && (
                            <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#e1f5fe', borderRadius: '4px' }}>
                              <strong>🏁 Entrega Final Estimada:</strong><br/>
                              {typeof order.shipping.estimated_delivery_final === 'object' ? (
                                Object.entries(order.shipping.estimated_delivery_final).map(([key, value]) => (
                                  <span key={key}>{key}: {value}<br/></span>
                                ))
                              ) : (
                                <span>{order.shipping.estimated_delivery_final}</span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Tracking */}
                        {(order.shipping.tracking_number || order.shipping.tracking_method) && (
                          <div style={{ marginBottom: '15px', backgroundColor: '#e8f5e8', padding: '10px', borderRadius: '4px' }}>
                            <h5 style={{ margin: '0 0 10px 0' }}>🗺️ Tracking</h5>
                            <p><strong>Número de Tracking:</strong> {order.shipping.tracking_number || 'N/A'}</p>
                            <p><strong>Método de Tracking:</strong> {order.shipping.tracking_method || 'N/A'}</p>
                          </div>
                        )}
                        
                        {/* Opción de Envío */}
                        {order.shipping.shipping_option && (
                          <div style={{ marginBottom: '15px', backgroundColor: '#fff3e0', padding: '10px', borderRadius: '4px' }}>
                            <h5 style={{ margin: '0 0 10px 0' }}>📦 Opción de Envío</h5>
                            <p><strong>Nombre:</strong> {order.shipping.shipping_option.name || 'N/A'}</p>
                            <p><strong>Costo:</strong> ${order.shipping.shipping_option.cost || 0}</p>
                            <p><strong>Método ID:</strong> {order.shipping.shipping_option.shipping_method_id || 'N/A'}</p>
                            
                            {/* Promesa de Entrega */}
                            {order.shipping.delivery_promise && (
                              <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f1f8e9', borderRadius: '4px' }}>
                                <strong>🤝 Promesa de Entrega:</strong><br/>
                                {typeof order.shipping.delivery_promise === 'object' ? (
                                  Object.entries(order.shipping.delivery_promise).map(([key, value]) => (
                                    <span key={key}>{key}: {value}<br/></span>
                                  ))
                                ) : (
                                  <span>{order.shipping.delivery_promise}</span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Información del Carrier */}
                        {order.shipping.carrier_info && Object.keys(order.shipping.carrier_info).length > 0 && (
                          <div style={{ marginBottom: '15px', backgroundColor: '#fce4ec', padding: '10px', borderRadius: '4px' }}>
                            <h5 style={{ margin: '0 0 10px 0' }}>🚚 Información del Transportista</h5>
                            {Object.entries(order.shipping.carrier_info).map(([key, value]) => (
                              <p key={key}><strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}</p>
                            ))}
                          </div>
                        )}
                        
                        {/* Dirección del Receptor - COMPLETAMENTE EXPANDIDA */}
                        {order.shipping.receiver_address && (
                          <div style={{ marginBottom: '15px', backgroundColor: '#f3e5f5', padding: '10px', borderRadius: '4px' }}>
                            <h5 style={{ margin: '0 0 10px 0' }}>📍 Dirección de Entrega COMPLETA</h5>
                            <p><strong>Destinatario:</strong> {order.shipping.receiver_address.receiver_name || 'N/A'}</p>
                            <p><strong>Teléfono:</strong> {order.shipping.receiver_address.receiver_phone || 'N/A'}</p>
                            <p><strong>Dirección:</strong> {order.shipping.receiver_address.address_line || 'N/A'}</p>
                            <p><strong>Calle:</strong> {order.shipping.receiver_address.street_name || 'N/A'} {order.shipping.receiver_address.street_number || ''}</p>
                            <p><strong>Ciudad:</strong> {order.shipping.receiver_address.city || 'N/A'}</p>
                            <p><strong>Estado:</strong> {order.shipping.receiver_address.state || 'N/A'}</p>
                            <p><strong>País:</strong> {order.shipping.receiver_address.country || 'N/A'}</p>
                            <p><strong>Barrio:</strong> {order.shipping.receiver_address.neighborhood || 'N/A'}</p>
                            <p><strong>Municipio:</strong> {order.shipping.receiver_address.municipality || 'N/A'}</p>
                            <p><strong>Código Postal:</strong> {order.shipping.receiver_address.zip_code || 'N/A'}</p>
                            {order.shipping.receiver_address.comment && (
                              <p><strong>Comentarios:</strong> {order.shipping.receiver_address.comment}</p>
                            )}
                            {(order.shipping.receiver_address.latitude || order.shipping.receiver_address.longitude) && (
                              <p><strong>Coordenadas:</strong> {order.shipping.receiver_address.latitude}, {order.shipping.receiver_address.longitude}</p>
                            )}
                          </div>
                        )}
                        
                        {/* Tags y Información Adicional */}
                        {(order.shipping.tags || order.shipping.dimensions || order.shipping.return_details) && (
                          <div style={{ marginBottom: '15px', backgroundColor: '#f1f8e9', padding: '10px', borderRadius: '4px' }}>
                            <h5 style={{ margin: '0 0 10px 0' }}>🏷️ Información Adicional</h5>
                            {order.shipping.tags && order.shipping.tags.length > 0 && (
                              <p><strong>Tags:</strong> {order.shipping.tags.join(', ')}</p>
                            )}
                            {order.shipping.dimensions && (
                              <p><strong>Dimensiones:</strong> {typeof order.shipping.dimensions === 'object' ? JSON.stringify(order.shipping.dimensions) : order.shipping.dimensions}</p>
                            )}
                            {order.shipping.return_details && Object.keys(order.shipping.return_details).length > 0 && (
                              <div>
                                <strong>Detalles de Devolución:</strong><br/>
                                {Object.entries(order.shipping.return_details).map(([key, value]) => (
                                  <span key={key}>{key}: {typeof value === 'object' ? JSON.stringify(value) : value}<br/></span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Estados de Envío */}
                        <div>
                          <h5>📋 Estados e Historial de Envío</h5>
                          <p><strong>Estado Actual:</strong> {order.shipping.status}</p>
                          <p><strong>Sub-estado:</strong> {order.shipping.substatus || 'N/A'}</p>
                          {order.shipping.status_history && order.shipping.status_history.length > 0 && (
                            <div>
                              <p><strong>Historial de Estados:</strong></p>
                              {order.shipping.status_history.map((status, idx) => (
                                <div key={idx} style={{ 
                                  backgroundColor: '#ffffff',
                                  padding: '8px',
                                  borderRadius: '3px',
                                  marginBottom: '5px',
                                  border: '1px solid #dee2e6'
                                }}>
                                  <strong>{status.status}</strong> - {new Date(status.date_created).toLocaleString()}
                                  {status.comments && <><br/><em>Comentarios: {status.comments}</em></>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p>No hay información de envío disponible</p>
                    )}
                  </div>
                </details>
                
                {/* Botón para ver JSON completo */}
                <details style={{ marginTop: '20px' }}>
                  <summary style={{ 
                    cursor: 'pointer',
                    padding: '10px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}>
                    Ver datos JSON completos
                  </summary>
                  <pre style={{ 
                    marginTop: '10px',
                    padding: '15px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    fontSize: '12px',
                    overflow: 'auto',
                    maxHeight: '400px'
                  }}>
                    {JSON.stringify(order, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersCollapsible;