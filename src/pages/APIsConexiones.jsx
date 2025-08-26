import React, { useState } from 'react';
import { 
  Settings, 
  Bot, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  Mail, 
  ShoppingBag, 
  DollarSign,
  Eye,
  EyeOff,
  TestTube,
  Save
} from 'lucide-react';

const APIsConexiones = () => {
  // Estado para mostrar/ocultar API keys
  const [showKeys, setShowKeys] = useState({});
  
  // Estado para las APIs de IA - solo una puede estar activa
  const [activeAIProvider, setActiveAIProvider] = useState('openai');
  const [aiProviders, setAIProviders] = useState({
    openai: {
      name: 'OpenAI',
      apiKey: '',
      model: 'gpt-3.5-turbo',
      endpoint: 'https://api.openai.com/v1',
      status: 'disconnected',
      description: 'GPT models para análisis de mensajes'
    },
    claude: {
      name: 'Anthropic Claude',
      apiKey: '',
      model: 'claude-3-haiku',
      endpoint: 'https://api.anthropic.com/v1',
      status: 'disconnected',
      description: 'Claude models para análisis avanzado'
    },
    gemini: {
      name: 'Google Gemini',
      apiKey: '',
      model: 'gemini-pro',
      endpoint: 'https://generativelanguage.googleapis.com/v1',
      status: 'disconnected',
      description: 'Gemini models de Google'
    }
  });

  // Estado para APIs de servicios
  const [serviceAPIs, setServiceAPIs] = useState({
    gmail: {
      category: 'Google Services',
      name: 'Gmail API',
      icon: Mail,
      clientId: '',
      clientSecret: '',
      status: 'connected',
      description: 'Integración con Gmail para Gmail Drive',
      color: 'blue'
    },
    sheets: {
      category: 'Google Services', 
      name: 'Google Sheets API',
      icon: Globe,
      apiKey: '',
      status: 'disconnected',
      description: 'Conexión con Google Sheets para reportes',
      color: 'green'
    },
    trm: {
      category: 'Financial Data',
      name: 'TRM Colombia API',
      icon: DollarSign,
      apiKey: '',
      endpoint: 'https://api.trm.co/v1',
      status: 'connected',
      description: 'Monitor de tasa de cambio USD/COP',
      color: 'yellow'
    },
    amazon: {
      category: 'E-commerce',
      name: 'Amazon Product API',
      icon: ShoppingBag,
      accessKey: '',
      secretKey: '',
      region: 'us-east-1',
      status: 'disconnected',
      description: 'Catálogo de productos de Amazon',
      color: 'orange'
    }
  });

  const toggleShowKey = (apiId, field = 'apiKey') => {
    const key = `${apiId}-${field}`;
    setShowKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleAIProviderChange = (provider, field, value) => {
    setAIProviders(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [field]: value
      }
    }));
  };

  const handleServiceAPIChange = (apiId, field, value) => {
    setServiceAPIs(prev => ({
      ...prev,
      [apiId]: {
        ...prev[apiId],
        [field]: value
      }
    }));
  };

  const testConnection = async (apiId, apiType = 'service') => {
    // TODO: Implementar test de conexión real
    console.log(`Testing connection for ${apiId}`);
    
    if (apiType === 'ai') {
      setAIProviders(prev => ({
        ...prev,
        [apiId]: {
          ...prev[apiId],
          status: prev[apiId].status === 'connected' ? 'disconnected' : 'connected'
        }
      }));
    } else {
      setServiceAPIs(prev => ({
        ...prev,
        [apiId]: {
          ...prev[apiId],
          status: prev[apiId].status === 'connected' ? 'disconnected' : 'connected'
        }
      }));
    }
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      connected: 'bg-green-100 text-green-800 border-green-200',
      disconnected: 'bg-red-100 text-red-800 border-red-200',
      testing: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };

    const icons = {
      connected: CheckCircle2,
      disconnected: AlertCircle,
      testing: TestTube
    };

    const Icon = icons[status];

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        <Icon size={12} />
        {status === 'connected' ? 'Conectado' : status === 'testing' ? 'Probando' : 'Desconectado'}
      </div>
    );
  };

  const AIProviderCard = ({ providerId, provider }) => (
    <div className={`border rounded-lg p-6 ${activeAIProvider === providerId ? 'ring-2 ring-purple-500 bg-purple-50' : 'bg-white'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <input
            type="radio"
            name="aiProvider"
            checked={activeAIProvider === providerId}
            onChange={() => setActiveAIProvider(providerId)}
            className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
          />
          <div>
            <h4 className="font-semibold text-gray-900">{provider.name}</h4>
            <p className="text-sm text-gray-600">{provider.description}</p>
          </div>
        </div>
        <StatusBadge status={provider.status} />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Key
          </label>
          <div className="flex gap-2">
            <input
              type={showKeys[`${providerId}-apiKey`] ? 'text' : 'password'}
              value={provider.apiKey}
              onChange={(e) => handleAIProviderChange(providerId, 'apiKey', e.target.value)}
              placeholder="sk-..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <button
              type="button"
              onClick={() => toggleShowKey(providerId, 'apiKey')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {showKeys[`${providerId}-apiKey`] ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modelo
            </label>
            <select
              value={provider.model}
              onChange={(e) => handleAIProviderChange(providerId, 'model', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              {providerId === 'openai' && (
                <>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                </>
              )}
              {providerId === 'claude' && (
                <>
                  <option value="claude-3-haiku">Claude 3 Haiku</option>
                  <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  <option value="claude-3-opus">Claude 3 Opus</option>
                </>
              )}
              {providerId === 'gemini' && (
                <>
                  <option value="gemini-pro">Gemini Pro</option>
                  <option value="gemini-pro-vision">Gemini Pro Vision</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endpoint
            </label>
            <input
              type="text"
              value={provider.endpoint}
              onChange={(e) => handleAIProviderChange(providerId, 'endpoint', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => testConnection(providerId, 'ai')}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <TestTube size={16} />
            Probar Conexión
          </button>
        </div>
      </div>
    </div>
  );

  const ServiceAPICard = ({ apiId, api }) => {
    const IconComponent = api.icon;
    const colorClasses = {
      blue: 'border-blue-200 bg-blue-50',
      green: 'border-green-200 bg-green-50', 
      yellow: 'border-yellow-200 bg-yellow-50',
      orange: 'border-orange-200 bg-orange-50'
    };

    return (
      <div className="border rounded-lg p-6 bg-white hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colorClasses[api.color]}`}>
              <IconComponent size={20} className={`text-${api.color}-600`} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{api.name}</h4>
              <p className="text-sm text-gray-600">{api.description}</p>
            </div>
          </div>
          <StatusBadge status={api.status} />
        </div>

        <div className="space-y-4">
          {/* Campos específicos por API */}
          {apiId === 'gmail' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client ID
                </label>
                <input
                  type="text"
                  value={api.clientId}
                  onChange={(e) => handleServiceAPIChange(apiId, 'clientId', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Secret
                </label>
                <div className="flex gap-2">
                  <input
                    type={showKeys[`${apiId}-clientSecret`] ? 'text' : 'password'}
                    value={api.clientSecret}
                    onChange={(e) => handleServiceAPIChange(apiId, 'clientSecret', e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowKey(apiId, 'clientSecret')}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {showKeys[`${apiId}-clientSecret`] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {apiId === 'amazon' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Access Key
                </label>
                <input
                  type="text"
                  value={api.accessKey}
                  onChange={(e) => handleServiceAPIChange(apiId, 'accessKey', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secret Key
                </label>
                <div className="flex gap-2">
                  <input
                    type={showKeys[`${apiId}-secretKey`] ? 'text' : 'password'}
                    value={api.secretKey}
                    onChange={(e) => handleServiceAPIChange(apiId, 'secretKey', e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowKey(apiId, 'secretKey')}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {showKeys[`${apiId}-secretKey`] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region
                </label>
                <select
                  value={api.region}
                  onChange={(e) => handleServiceAPIChange(apiId, 'region', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="us-east-1">US East (N. Virginia)</option>
                  <option value="us-west-2">US West (Oregon)</option>
                  <option value="eu-west-1">Europe (Ireland)</option>
                </select>
              </div>
            </div>
          )}

          {(apiId === 'sheets' || apiId === 'trm') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <div className="flex gap-2">
                <input
                  type={showKeys[`${apiId}-apiKey`] ? 'text' : 'password'}
                  value={api.apiKey}
                  onChange={(e) => handleServiceAPIChange(apiId, 'apiKey', e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => toggleShowKey(apiId, 'apiKey')}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {showKeys[`${apiId}-apiKey`] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => testConnection(apiId)}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <TestTube size={16} />
              Probar Conexión
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Agrupar APIs por categoría
  const groupedAPIs = Object.entries(serviceAPIs).reduce((acc, [apiId, api]) => {
    const category = api.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push([apiId, api]);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Key className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">APIs y Conexiones</h1>
            <p className="text-gray-600">Configuración centralizada de todas las integraciones del sistema</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="text-purple-600" size={16} />
              <span className="text-sm font-medium text-purple-800">IA Providers</span>
            </div>
            <p className="text-xl font-bold text-purple-900">
              {Object.values(aiProviders).filter(p => p.status === 'connected').length}/{Object.keys(aiProviders).length}
            </p>
            <p className="text-xs text-purple-700">Activo: {aiProviders[activeAIProvider]?.name}</p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="text-green-600" size={16} />
              <span className="text-sm font-medium text-green-800">Conectadas</span>
            </div>
            <p className="text-xl font-bold text-green-900">
              {Object.values(serviceAPIs).filter(api => api.status === 'connected').length}
            </p>
            <p className="text-xs text-green-700">APIs funcionando</p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="text-red-600" size={16} />
              <span className="text-sm font-medium text-red-800">Pendientes</span>
            </div>
            <p className="text-xl font-bold text-red-900">
              {Object.values(serviceAPIs).filter(api => api.status === 'disconnected').length}
            </p>
            <p className="text-xs text-red-700">Por configurar</p>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="text-gray-600" size={16} />
              <span className="text-sm font-medium text-gray-800">Total APIs</span>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {Object.keys(aiProviders).length + Object.keys(serviceAPIs).length}
            </p>
            <p className="text-xs text-gray-700">Configuradas</p>
          </div>
        </div>
      </div>

      {/* IA Providers Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="text-purple-600" size={20} />
          <h2 className="text-xl font-semibold text-gray-900">Proveedores de IA para Análisis</h2>
        </div>
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
          <p className="text-sm text-purple-700">
            <strong>Selecciona un proveedor activo</strong> para el análisis de mensajes. 
            Puedes configurar múltiples APIs pero solo una estará activa a la vez.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Object.entries(aiProviders).map(([providerId, provider]) => (
            <AIProviderCard key={providerId} providerId={providerId} provider={provider} />
          ))}
        </div>
      </div>

      {/* Service APIs Sections */}
      {Object.entries(groupedAPIs).map(([category, apis]) => (
        <div key={category} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="text-gray-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-900">{category}</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {apis.map(([apiId, api]) => (
              <ServiceAPICard key={apiId} apiId={apiId} api={api} />
            ))}
          </div>
        </div>
      ))}

      {/* Save All Button */}
      <div className="flex justify-center pt-8 border-t">
        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
          <Save size={18} />
          Guardar Todas las Configuraciones
        </button>
      </div>
    </div>
  );
};

export default APIsConexiones;