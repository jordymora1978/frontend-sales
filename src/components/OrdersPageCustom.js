import React, { useState, useEffect } from 'react';
import { MessageSquare, Eye, Truck } from 'lucide-react';

const OrdersPageCustom = ({ onOpenModal, onSelectOrder }) => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  // Mock data basada en la imagen
  const mockOrdersData = [
    {
      id: 'MLC-2025002',
      sku: 'B07XQXZXVZ',
      productTitle: '2 apatillas Deportivas Running Nike Air Max Revolution 5',
      productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=70&h=70&fit=crop',
      minutesAgo: 45,
      customer: {
        name: 'Carlos Mendoza',
        document: 'RUT 105099282'
      },
      status: {
        main: 'APROBADO',
        shipping: 'ENVIADO'
      },
      logistics: {
        provider1: 'ANICAM',
        provider2: 'CHILEXPRESS',
        alert: 'PEÑALERTA'
      },
      purchase: {
        date: '2025-01-14',
        price: 129.99,
        currency: 'USD'
      },
      amazon: {
        available: true
      },
      financial: {
        total: 89990,
        commission: 13485,
        net: 76492
      },
      country: 'CHILE'
    },
    {
      id: 'MPE-2025003',
      sku: 'B089MXZ790',
      productTitle: 'Cámara Fotográfica Digital Canon EOS Rebel T100 Kit Completo',
      productImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=70&h=70&fit=crop',
      minutesAgo: 120,
      customer: {
        name: 'Ana Rodriguez',
        document: 'DNI 42722765'
      },
      status: {
        main: 'PROCESANDO',
        shipping: 'PENDIENTE'
      },
      logistics: {
        provider1: 'ANICAM',
        provider2: 'CHILEXPRESS',
        alert: 'PEÑALERTA'
      },
      purchase: {
        date: '2025-01-13',
        price: 599.99,
        currency: 'USD'
      },
      amazon: {
        available: true,
        gss: true
      },
      financial: {
        total: 1850.00,
        commission: 277.50,
        net: 1572.50
      },
      country: 'PERÚ'
    },
    {
      id: 'MCO-2025004',
      sku: 'B0527GQ043',
      productTitle: 'Smart Watch Deportivo con Monitor de Frecuencia Cardiaca',
      productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=70&h=70&fit=crop',
      minutesAgo: 180,
      customer: {
        name: 'Luis Perez',
        document: 'CC 890123457'
      },
      status: {
        main: 'ENVIADO',
        shipping: 'ENVIADO'
      },
      logistics: {
        provider1: 'ANICAM',
        provider2: 'CHILEXPRESS',
        alert: 'PEÑALERTA'
      },
      purchase: {
        date: '2025-01-12',
        price: 59.99,
        currency: 'USD'
      },
      amazon: {
        available: true,
        gss: true
      },
      financial: {
        total: 125000.00,
        commission: 18750.00,
        net: 106250.00
      },
      country: 'COLOMBIA'
    }
  ];

  useEffect(() => {
    setOrders(mockOrdersData);
    setTotalOrders(mockOrdersData.length);
  }, []);

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'aprobado': return 'status-approved';
      case 'procesando': return 'status-processing';
      case 'enviado': return 'status-shipped';
      case 'pendiente': return 'status-pending';
      default: return 'status-pending';
    }
  };

  const getCountryClass = (country) => {
    switch (country.toLowerCase()) {
      case 'chile': return 'market-chile';
      case 'perú': return 'market-peru';
      case 'colombia': return 'market-colombia';
      default: return 'market-chile';
    }
  };

  const formatCurrency = (amount, country) => {
    if (country === 'CHILE') {
      return `$${amount.toLocaleString('es-CL')}`;
    } else if (country === 'PERÚ') {
      return `S/ ${amount.toFixed(2).replace('.', ',')}`;
    } else if (country === 'COLOMBIA') {
      return `$ ${amount.toLocaleString('es-CO')},00`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `Hace ${minutes} minutos`;
    } else {
      const hours = Math.floor(minutes / 60);
      return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }
  };

  return (
    <div className="orders-page-custom">
      {/* Header con info de la orden actual */}
      {orders.length > 0 && (
        <div className="current-order-header">
          <div className="order-header-left">
            <h2 className="order-id">{orders[0].id}</h2>
            <p className="order-time">{formatTime(orders[0].minutesAgo)}</p>
          </div>
          <div className="order-header-right">
            <span className={`country-badge ${getCountryClass(orders[0].country)}`}>
              {orders[0].country}
            </span>
          </div>
        </div>
      )}

      {/* Grid de órdenes en tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders.map((order, index) => (
          <div key={order.id} className="order-card-custom">
            {/* Header de la orden */}
            <div className="order-card-header">
              <div className="order-info-left">
                <div className="order-id-badge">
                  <span className="order-number">{order.id}</span>
                </div>
                <div className="order-meta">
                  <span className="order-sku">{order.sku}</span>
                  <span className="order-title">{order.productTitle}</span>
                </div>
              </div>
              <div className="order-info-right">
                <span className={`country-badge-small ${getCountryClass(order.country)}`}>
                  {order.country}
                </span>
              </div>
            </div>

            {/* Contenido principal de la orden */}
            <div className="order-card-content">
              {/* Imagen y minutos */}
              <div className="product-section">
                <div className="product-image-container">
                  <img 
                    src={order.productImage} 
                    alt={order.productTitle}
                    className="product-image"
                  />
                  <div className="minutes-badge">{order.minutesAgo}m</div>
                </div>
              </div>

              {/* Información del cliente */}
              <div className="customer-section">
                <h5 className="customer-name">{order.customer.name}</h5>
                <p className="customer-document">{order.customer.document}</p>
                
                {/* Status badges */}
                <div className="status-badges">
                  <span className={`status-badge ${getStatusClass(order.status.main)}`}>
                    {order.status.main}
                  </span>
                  <span className={`status-badge ${getStatusClass(order.status.shipping)}`}>
                    {order.status.shipping}
                  </span>
                </div>

                {/* Logistics badges */}
                <div className="logistics-badges">
                  <span className="logistics-badge anicam">{order.logistics.provider1}</span>
                  <span className="logistics-badge chilexpress">{order.logistics.provider2}</span>
                  <span className="logistics-badge alert">{order.logistics.alert}</span>
                </div>
              </div>

              {/* Información de compra */}
              <div className="purchase-section">
                <div className="purchase-info">
                  <p className="purchase-date">Comprado {order.purchase.date}</p>
                  <p className="purchase-price">
                    ${order.purchase.price} {order.purchase.currency}
                  </p>
                  {order.amazon.available && (
                    <div className="amazon-info">
                      <a href="#" className="amazon-link">Ver en Amazon</a>
                      {order.amazon.gss && <span className="gss-badge">GSS</span>}
                    </div>
                  )}
                </div>
              </div>

              {/* Información financiera */}
              <div className="financial-section">
                <div className="financial-info">
                  <div className="total-amount">
                    {formatCurrency(order.financial.total, order.country)}
                  </div>
                  <div className="commission">
                    Comisión: {formatCurrency(order.financial.commission, order.country)}
                  </div>
                  <div className="net-amount">
                    Neto: {formatCurrency(order.financial.net, order.country)}
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="actions-section">
                <button 
                  className="action-btn primary"
                  onClick={() => {
                    if (onSelectOrder) onSelectOrder(order);
                    if (onOpenModal) onOpenModal('messages');
                  }}
                >
                  <MessageSquare size={14} />
                  Mensaje
                </button>
                <button 
                  className="action-btn secondary"
                  onClick={() => {
                    if (onSelectOrder) onSelectOrder(order);
                    if (onOpenModal) onOpenModal('logistics');
                  }}
                >
                  <Eye size={14} />
                  Ver Detalles
                </button>
                <button 
                  className="action-btn secondary"
                  onClick={() => {
                    if (onSelectOrder) onSelectOrder(order);
                    if (onOpenModal) onOpenModal('logistics');
                  }}
                >
                  <Truck size={14} />
                  Tracking
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="pagination-custom">
        <div className="pagination-info">
          Mostrando {orders.length} de {totalOrders} órdenes
        </div>
        <div className="pagination-controls">
          <button 
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            ‹
          </button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn">›</button>
        </div>
      </div>
    </div>
  );
};

export default OrdersPageCustom;