import React, { useState, useEffect } from 'react';
import { X, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UnifiedSidebar from './UnifiedSidebar';
import OrdersPageCustom from './OrdersPageCustom';
import ConnectMLStore from './ConnectMLStore.jsx';
import CustomersPage from '../pages/CustomersPage';
import QuotesPage from '../pages/QuotesPage';
import SalesDashboardPage from '../pages/SalesDashboardPage';
import MLOrdersSync from '../pages/MLOrdersSync';
import './UnifiedSidebar.css';
import './OrdersPageCustom.css';
import apiService from '../services/api';

const SalesDashboardUnified = () => {
  const { user, logout } = useAuth();
  
  // Navigation state
  const [activeTab, setActiveTab] = useState('orders');
  
  // Modal states
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalTab, setModalTab] = useState('messages');
  const [messageInput, setMessageInput] = useState('');
  const [isEditingPublication, setIsEditingPublication] = useState(false);
  
  // ML Stores states
  const [showConnectML, setShowConnectML] = useState(false);
  const [mlStores, setMlStores] = useState([]);

  // Load ML stores
  const loadMLStores = async () => {
    try {
      const response = await apiService.request('/api/ml/my-stores');
      setMlStores(response || []);
    } catch (error) {
      console.error('Error loading ML stores:', error);
    }
  };

  // Handle successful ML connection
  const handleMLConnectionSuccess = () => {
    setShowConnectML(false);
    loadMLStores();
  };

  // Delete ML store
  const deleteMLStore = async (storeId, storeName) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la tienda "${storeName}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await apiService.request(`/api/ml/stores/${storeId}`, {
        method: 'DELETE'
      });
      
      loadMLStores();
      alert('Tienda eliminada correctamente');
    } catch (error) {
      console.error('Error deleting store:', error);
      alert('Error al eliminar la tienda. Inténtalo de nuevo.');
    }
  };

  // Load stores when component mounts
  useEffect(() => {
    loadMLStores();
  }, []);

  // Mock data para el modal (mantenemos la funcionalidad existente)
  const mockMessages = {
    'MLC-2025002': [
      { id: 1, sender: 'customer', text: 'Hola, ¿cuando llegará mi pedido?', time: '10:30 AM', date: '2025-01-15' },
      { id: 2, sender: 'seller', text: 'Buenos días! Su pedido fue despachado hoy y llegará en 3-5 días hábiles.', time: '10:45 AM', date: '2025-01-15' }
    ],
    'MPE-2025003': [
      { id: 1, sender: 'customer', text: 'Buenas tardes, ¿tienen este producto en otro color?', time: '2:30 PM', date: '2025-01-14' },
      { id: 2, sender: 'seller', text: 'Hola! Sí, también está disponible en negro y azul.', time: '2:45 PM', date: '2025-01-14' }
    ],
    'MCO-2025004': [
      { id: 1, sender: 'customer', text: '¿Cuándo llega mi pedido a Lima?', time: '11:00 AM', date: '2025-01-13' },
      { id: 2, sender: 'seller', text: 'Estimado cliente, su pedido llegará entre 5-7 días hábiles.', time: '11:30 AM', date: '2025-01-13' }
    ]
  };

  const mockQuestions = {
    'MLC-2025002': [
      { id: 1, question: '¿El producto incluye garantía?', answer: 'Sí, incluye garantía de 12 meses.', time: '2 días atrás', answered: true }
    ],
    'MPE-2025003': [
      { id: 1, question: '¿Es original o réplica?', answer: 'Es 100% original con certificado de autenticidad.', time: '1 día atrás', answered: true }
    ],
    'MCO-2025004': [
      { id: 1, question: '¿Hacen envíos a regiones?', answer: 'Sí, enviamos a todo el país.', time: '3 horas atrás', answered: true }
    ]
  };

  const mockLogistics = {
    'MLC-2025002': {
      provider: 'CHILEXPRESS',
      tracking: 'CHX-CL-456789321',
      status: 'Enviado',
      steps: [
        { status: 'Orden recibida', date: '2025-01-14 09:00', completed: true, location: 'Santiago, Chile' },
        { status: 'En tránsito', date: '2025-01-15 08:00', completed: true, location: 'Valparaíso, Chile' }
      ]
    },
    'MPE-2025003': {
      provider: 'ANICAM',
      tracking: 'ANI-PE-789123456',
      status: 'Procesando',
      steps: [
        { status: 'Orden recibida', date: '2025-01-13 10:00', completed: true, location: 'Lima, Perú' }
      ]
    }
  };

  const mockPublications = {
    'MLC-2025002': {
      title: '2 Zapatillas Deportivas Running Nike Air Max Revolution 5',
      price: 89990,
      currency: 'CLP',
      category: 'Deportes y Fitness > Calzado',
      condition: 'Nuevo',
      warranty: '12 meses',
      description: 'Zapatillas deportivas de alta calidad...'
    },
    'MPE-2025003': {
      title: 'Cámara Fotográfica Digital Canon EOS Rebel T100 Kit',
      price: 1850,
      currency: 'PEN',
      category: 'Cámaras y Accesorios',
      condition: 'Nuevo',
      warranty: '24 meses',
      description: 'Kit completo de cámara profesional...'
    }
  };

  const mockSpecifications = {
    'MLC-2025002': [
      { label: 'Marca', value: 'Nike' },
      { label: 'Modelo', value: 'Air Max Revolution 5' },
      { label: 'Material', value: 'Sintético y malla' },
      { label: 'Suela', value: 'Goma' }
    ],
    'MPE-2025003': [
      { label: 'Marca', value: 'Canon' },
      { label: 'Modelo', value: 'EOS Rebel T100' },
      { label: 'Resolución', value: '18MP' },
      { label: 'Pantalla', value: '3" LCD' }
    ]
  };

  // Render main content based on active tab
  const renderMainContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <OrdersPageCustom 
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
        return <QuotesPage />;
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
    <div className="unified-dashboard flex h-screen bg-gray-50">
      {/* Unified Sidebar */}
      <UnifiedSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* Main Content Area */}
      <div className="main-content flex-1 flex flex-col" style={{ marginLeft: '280px' }}>
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                {activeTab === 'orders' && 'Órdenes de Venta'}
                {activeTab === 'customers' && 'Gestión de Clientes'}
                {activeTab === 'quotes' && 'Cotizaciones'}
                {activeTab === 'dashboard' && 'Dashboard de Ventas'}
                {activeTab === 'ml-stores' && 'Tiendas MercadoLibre'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User size={16} />
                <span>{user?.email || 'Usuario'}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Cerrar sesión"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
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

      {/* Message Modal (mantenemos funcionalidad existente) */}
      {showMessageModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">
                {selectedOrder.id} - {selectedOrder.productTitle}
              </h2>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b bg-gray-50">
              {[
                { id: 'messages', label: 'Mensajes', icon: '💬' },
                { id: 'questions', label: 'Preguntas', icon: '❓' },
                { id: 'logistics', label: 'Logística', icon: '🚚' },
                { id: 'publication', label: 'Publicación', icon: '📝' },
                { id: 'specifications', label: 'Especificaciones', icon: '📋' }
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    modalTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setModalTab(tab.id)}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {modalTab === 'messages' && (
                <div className="space-y-4">
                  <h3 className="font-semibold mb-4">Mensajes con el cliente</h3>
                  <div className="space-y-3">
                    {(mockMessages[selectedOrder.id] || []).map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === 'seller' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.sender === 'seller'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}>
                          <p>{msg.text}</p>
                          <p className={`text-xs mt-1 ${
                            msg.sender === 'seller' ? 'text-blue-100' : 'text-gray-600'
                          }`}>
                            {msg.time} - {msg.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Escribe tu mensaje..."
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Enviar
                    </button>
                  </div>
                </div>
              )}

              {modalTab === 'questions' && (
                <div className="space-y-4">
                  <h3 className="font-semibold mb-4">Preguntas de compradores</h3>
                  {(mockQuestions[selectedOrder.id] || []).map((q) => (
                    <div key={q.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">{q.question}</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          q.answered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {q.answered ? 'Respondida' : 'Pendiente'}
                        </span>
                      </div>
                      {q.answered && (
                        <p className="text-gray-600 text-sm mb-2">{q.answer}</p>
                      )}
                      <p className="text-xs text-gray-500">{q.time}</p>
                    </div>
                  ))}
                </div>
              )}

              {modalTab === 'logistics' && mockLogistics[selectedOrder.id] && (
                <div className="space-y-4">
                  <h3 className="font-semibold mb-4">Información de envío</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600">Transportadora</p>
                      <p className="font-medium">{mockLogistics[selectedOrder.id].provider}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Número de tracking</p>
                      <p className="font-medium">{mockLogistics[selectedOrder.id].tracking}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Estado del envío</h4>
                    <div className="space-y-3">
                      {mockLogistics[selectedOrder.id].steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className={`w-4 h-4 rounded-full mt-0.5 ${
                            step.completed ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                          <div>
                            <p className={step.completed ? 'text-gray-900' : 'text-gray-500'}>
                              {step.status}
                            </p>
                            <p className="text-sm text-gray-600">{step.location}</p>
                            <p className="text-xs text-gray-500">{step.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {modalTab === 'publication' && mockPublications[selectedOrder.id] && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Información de la publicación</h3>
                    <button
                      onClick={() => setIsEditingPublication(!isEditingPublication)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {isEditingPublication ? 'Cancelar' : 'Editar'}
                    </button>
                  </div>
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Título</label>
                      {isEditingPublication ? (
                        <input 
                          type="text" 
                          defaultValue={mockPublications[selectedOrder.id].title}
                          className="w-full mt-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      ) : (
                        <p className="font-medium">{mockPublications[selectedOrder.id].title}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600">Precio</label>
                        {isEditingPublication ? (
                          <input 
                            type="number" 
                            defaultValue={mockPublications[selectedOrder.id].price}
                            className="w-full mt-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        ) : (
                          <p className="font-medium">
                            {mockPublications[selectedOrder.id].currency} {mockPublications[selectedOrder.id].price.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Condición</label>
                        <p className="font-medium">{mockPublications[selectedOrder.id].condition}</p>
                      </div>
                    </div>
                    {isEditingPublication && (
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                          Guardar cambios
                        </button>
                        <button 
                          onClick={() => setIsEditingPublication(false)}
                          className="px-4 py-2 border rounded hover:bg-gray-50"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {modalTab === 'specifications' && mockSpecifications[selectedOrder.id] && (
                <div className="space-y-4">
                  <h3 className="font-semibold mb-4">Especificaciones del producto</h3>
                  <div className="grid gap-3">
                    {mockSpecifications[selectedOrder.id].map((spec, index) => (
                      <div key={index} className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{spec.label}</span>
                        <span className="font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesDashboardUnified;