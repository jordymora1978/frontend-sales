import React, { useState } from 'react';
import {
  Store,
  Plus,
  Link2,
  Shield,
  Package,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Settings,
  RefreshCw,
  ExternalLink,
  Calendar,
  Activity,
  Key,
  Globe,
  Users,
  TrendingUp,
  Box
} from 'lucide-react';

const MLStoresPage = ({ showConnectML, setShowConnectML }) => {
  const [activeCategory, setActiveCategory] = useState('ventas');
  
  // Datos de ejemplo para las tiendas conectadas
  const [connectedStores, setConnectedStores] = useState([]);

  // Categorías de aplicaciones
  const categories = [
    { id: 'ventas', name: 'Ventas', icon: ShoppingCart, color: 'purple' },
    { id: 'productos', name: 'Productos', icon: Package, color: 'blue' },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp, color: 'green' },
    { id: 'integraciones', name: 'Integraciones', icon: Link2, color: 'yellow' }
  ];

  const getCategoryStyles = (color) => {
    const styles = {
      purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
      blue: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
      green: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
    };
    return styles[color] || styles.purple;
  };

  const getIconBgColor = (color) => {
    const colors = {
      purple: 'bg-purple-100 text-purple-600',
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      yellow: 'bg-yellow-100 text-yellow-600'
    };
    return colors[color] || colors.purple;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Principal */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Store className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Aplicaciones MercadoLibre</h1>
                <p className="text-gray-600 mt-1">Gestiona tus integraciones y aplicaciones de MercadoLibre Developers</p>
              </div>
            </div>
            <button
              onClick={() => setShowConnectML(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus size={20} />
              <span>Conectar Aplicación</span>
            </button>
          </div>

          {/* Estadísticas Rápidas */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Activity className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">Apps Activas</p>
                <p className="text-lg font-semibold text-gray-900">{connectedStores.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Estado</p>
                <p className="text-lg font-semibold text-green-700">Operativo</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Última Sync</p>
                <p className="text-lg font-semibold text-gray-900">Hace 5m</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <Globe className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-xs text-gray-600">Países</p>
                <p className="text-lg font-semibold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categorías */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  activeCategory === category.id
                    ? getCategoryStyles(category.color)
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <category.icon size={18} />
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Contenido Principal */}
        {connectedStores.length === 0 ? (
          // Estado Vacío - Diseño Mejorado
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="text-center max-w-md mx-auto">
              <div className="inline-flex p-4 bg-purple-100 rounded-full mb-4">
                <Store className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay aplicaciones conectadas
              </h3>
              <p className="text-gray-600 mb-6">
                Conecta tu primera aplicación de MercadoLibre Developers para comenzar a 
                sincronizar órdenes de venta y gestionar tus productos.
              </p>
              
              {/* Beneficios */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-2 text-left">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Sincronización automática</p>
                    <p className="text-xs text-gray-600">Órdenes en tiempo real</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-left">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Multi-tienda</p>
                    <p className="text-xs text-gray-600">Gestiona varias cuentas</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-left">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">API completa</p>
                    <p className="text-xs text-gray-600">Acceso total a ML API</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-left">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Seguro</p>
                    <p className="text-xs text-gray-600">OAuth 2.0 certificado</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowConnectML(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus size={20} />
                <span>Conectar Primera Aplicación</span>
              </button>
            </div>
          </div>
        ) : (
          // Grid de Aplicaciones Conectadas
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectedStores.map((store, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getIconBgColor(store.category)}`}>
                      <ShoppingCart className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{store.name}</h3>
                      <p className="text-xs text-gray-600">{store.nickname}</p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <Settings className="h-4 w-4 text-gray-400" />
                  </button>
                </div>

                {/* Información de la App */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Client ID:</span>
                    <span className="font-mono text-xs text-gray-900">{store.clientId}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">País:</span>
                    <span className="text-gray-900">{store.country}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Estado:</span>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-green-700">Activo</span>
                    </span>
                  </div>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-2 gap-2 py-3 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">1,234</p>
                    <p className="text-xs text-gray-600">Órdenes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">567</p>
                    <p className="text-xs text-gray-600">Productos</p>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors text-sm">
                    <RefreshCw size={14} />
                    <span>Sincronizar</span>
                  </button>
                  <button className="flex items-center justify-center p-1.5 bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition-colors">
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Panel de Ayuda */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-1">¿Necesitas ayuda con la integración?</h4>
              <p className="text-sm text-blue-800 mb-2">
                Para conectar una aplicación necesitas tener una cuenta de MercadoLibre Developers y crear una aplicación 
                con los permisos necesarios para acceder a órdenes y productos.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://developers.mercadolibre.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-700 hover:text-blue-800 underline"
                >
                  Ir a ML Developers →
                </a>
                <button className="text-sm font-medium text-blue-700 hover:text-blue-800 underline">
                  Ver documentación →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLStoresPage;