import React, { useState, useEffect } from 'react';
import { X, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PremiumSidebar, { ThemeProvider as PremiumThemeProvider } from './PremiumSidebar';
import PremiumHeader from './PremiumHeader';
import OrdersPage2_0 from '../pages/OrdersPage2_0';
import ConnectMLStore from './ConnectMLStore.jsx';
import CustomersPage from '../pages/CustomersPage';
import QuotesPage from '../pages/QuotesPage';
import QuotesPageComponent from './QuotesPage';
import SalesDashboardPage from '../pages/SalesDashboardPage';
import MLOrdersSync from '../pages/MLOrdersSync';
import ConsolidadorPage from '../pages/control/ConsolidadorPage';
import ValidadorPage from '../pages/control/ValidadorPage';
import TRMPage from '../pages/control/TRMPage';
import ReportesPage from '../pages/control/ReportesPage';
import GmailDrivePage from '../pages/control/GmailDrivePage';
import SincOrdersMeli from '../pages/SincOrdersMeli';
import GoogleAPI from '../pages/GoogleAPI';
import apiService from '../services/api';

const SalesDashboardUnified = () => {
  const { user, logout } = useAuth();
  
  // Navigation state
  const [activeTab, setActiveTab] = useState('orders2'); // Inicia en Órdenes Pro
  
  // Sidebar collapse state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Modal states
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalTab, setModalTab] = useState('messages');
  const [messageInput, setMessageInput] = useState('');
  const [isEditingPublication, setIsEditingPublication] = useState(false);
  
  // ML Stores states
  const [showConnectML, setShowConnectML] = useState(false);
  const [mlStores, setMLStores] = useState([]);

  // Detect mobile/responsive
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load ML stores
  useEffect(() => {
    loadMLStores();
  }, []);

  const loadMLStores = async () => {
    try {
      const response = await apiService.get('/api/ml/my-stores');
      if (response.success) {
        setMLStores(response.data || []);
      }
    } catch (error) {
      console.error('Error loading ML stores:', error);
    }
  };

  const deleteMLStore = async (storeId) => {
    try {
      const response = await apiService.delete(`/api/ml/stores/${storeId}`);
      if (response.success) {
        await loadMLStores();
      }
    } catch (error) {
      console.error('Error deleting ML store:', error);
    }
  };

  const handleMLConnectionSuccess = () => {
    setShowConnectML(false);
    loadMLStores();
  };

  // Mock data para modales
  const mockMessages = {
    'MLC-2025002': [
      {
        id: 1,
        sender: 'Cliente',
        message: 'Hola, quería saber cuándo llega mi pedido',
        timestamp: '2025-01-22 14:30',
        isCustomer: true
      },
      {
        id: 2,
        sender: 'Vendedor',
        message: 'Hola! Tu pedido está en camino, llegará mañana entre 9-12pm',
        timestamp: '2025-01-22 14:45',
        isCustomer: false
      }
    ]
  };

  const mockLogistics = {
    'MLC-2025002': {
      provider: 'CHILEXPRESS',
      trackingNumber: 'CHX789456123',
      status: 'EN_TRANSITO',
      lastUpdate: '2025-01-22 10:00',
      estimatedDelivery: '2025-01-25',
      timeline: [
        { status: 'Orden confirmada', date: '2025-01-20 16:00', completed: true, location: 'Santiago, Chile' },
        { status: 'En preparación', date: '2025-01-21 09:00', completed: true, location: 'Centro Distribución' },
        { status: 'En tránsito', date: '2025-01-22 10:00', completed: true, location: 'Ruta a destino' },
        { status: 'Entrega programada', date: '2025-01-25 12:00', completed: false, location: 'Dirección cliente' }
      ]
    }
  };

  // Render main content based on active tab
  const renderMainContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          {/* OrdersPageCustom removed 
            onOpenModal={(tab) => {
              setShowMessageModal(true);
              setModalTab(tab);
            }}
            onSelectOrder={(order) => setSelectedOrder(order)}
          />
        );
      case 'orders2':
        return (
          {/* OrdersPage2 removed 
            onOpenModal={(tab) => {
              setShowMessageModal(true);
              setModalTab(tab);
            }}
            onSelectOrder={(order) => setSelectedOrder(order)}
          />
        );
      case 'orders-custom':
        return <div className="p-6"><p className="text-gray-600">Página de órdenes personalizadas ha sido removida.</p></div>;
      case 'orders2':
        return <div className="p-6"><p className="text-gray-600">Página OrdersPage2 ha sido removida.</p></div>;
      case 'orders2_0':
        return (
          {/* OrdersPage2 removed_0 
            onOpenModal={(tab) => {
              setShowMessageModal(true);
              setModalTab(tab);
            }}
            onSelectOrder={(order) => setSelectedOrder(order)}
          />
        );
      case 'customers':
        return <CustomersPage />;
      case 'quotes':
        return <QuotesPageComponent />;
      case 'dashboard':
        return <SalesDashboardPage />;
      case 'ml-stores':
        return (
          <div className="ml-stores-page p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Tiendas MercadoLibre</h1>
                <p className="text-gray-600">Gestiona tus conexiones con MercadoLibre</p>
              </div>
              <button 
                onClick={() => setShowConnectML(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Conectar Tienda
              </button>
            </div>
            <MLOrdersSync mlStores={mlStores} onDeleteStore={deleteMLStore} />
          </div>
        );
      case 'control-consolidador':
        return <ConsolidadorPage />;
      case 'control-validador':
        return <ValidadorPage />;
      case 'control-trm':
        return <TRMPage />;
      case 'control-reportes':
        return <ReportesPage />;
      case 'control-gmail-drive':
        return <GmailDrivePage />;
      case 'ml-sync':
        return <SincOrdersMeli />;
      case 'google-api':
        return <GoogleAPI />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Bienvenido al Hub Dropux!</h2>
              <p className="text-gray-600">Selecciona una opción del menú para comenzar</p>
            </div>
          </div>
        );
    }
  };

  return (
    <PremiumThemeProvider>
      <div className="flex h-screen bg-gray-50" style={{margin: 0, padding: 0, gap: 0}}>
        {/* PremiumSidebar */}
        <PremiumSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isMobile={isMobile}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col content-area" style={{margin: 0, padding: 0}}>
          {/* PremiumHeader */}
          <PremiumHeader 
            activeTab={activeTab}
            onToggleMobileSidebar={() => setShowMobileMenu(!showMobileMenu)}
          />

          {/* Page Content - SCROLLABLE */}
          <main className="flex-1 overflow-auto">
            {renderMainContent()}
          </main>
        </div>

        {/* Connect ML Store Modal */}
        {showConnectML && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative">
              <ConnectMLStore 
                onClose={() => setShowConnectML(false)}
                onSuccess={handleMLConnectionSuccess}
              />
            </div>
          </div>
        )}

        {/* Messages/Logistics Modal */}
        {showMessageModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] m-4 flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">
                  {modalTab === 'messages' ? '💬 Mensajes' : '🚚 Logística'} - {selectedOrder.id}
                </h2>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Tabs */}
              <div className="flex border-b bg-gray-50">
                <button
                  onClick={() => setModalTab('messages')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    modalTab === 'messages'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  💬 Mensajes
                </button>
                <button
                  onClick={() => setModalTab('logistics')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    modalTab === 'logistics'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  🚚 Logística
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-hidden">
                {modalTab === 'messages' ? (
                  <div className="h-full flex flex-col">
                    {/* Messages List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {mockMessages[selectedOrder.id]?.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isCustomer ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                              message.isCustomer
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-blue-500 text-white'
                            }`}
                          >
                            <div className="font-medium text-sm mb-1">{message.sender}</div>
                            <div>{message.message}</div>
                            <div className="text-xs mt-1 opacity-75">{message.timestamp}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Message Input */}
                    <div className="border-t p-4">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          placeholder="Escribe tu mensaje..."
                          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Enviar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Tracking Info */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="font-bold text-blue-800 mb-3">📦 Información de Envío</h3>
                        <div className="space-y-2">
                          <div><strong>Proveedor:</strong> {mockLogistics[selectedOrder.id]?.provider}</div>
                          <div><strong>Tracking:</strong> {mockLogistics[selectedOrder.id]?.trackingNumber}</div>
                          <div><strong>Estado:</strong> {mockLogistics[selectedOrder.id]?.status}</div>
                          <div><strong>Entrega estimada:</strong> {mockLogistics[selectedOrder.id]?.estimatedDelivery}</div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-bold text-gray-800 mb-3">⏱️ Cronología</h3>
                        <div className="space-y-3">
                          {mockLogistics[selectedOrder.id]?.timeline.map((event, index) => (
                            <div key={index} className={`flex items-start gap-3 ${event.completed ? 'text-green-600' : 'text-gray-500'}`}>
                              <div className={`w-3 h-3 rounded-full mt-1 ${event.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              <div>
                                <div className="font-medium">{event.status}</div>
                                <div className="text-sm">{event.date} - {event.location}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </PremiumThemeProvider>
  );
};

export default SalesDashboardUnified;