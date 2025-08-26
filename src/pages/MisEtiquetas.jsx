import React, { useState } from 'react';
import { Bot, Zap, Tag, Save, Plus, Trash2, Settings, AlertCircle } from 'lucide-react';

const MisEtiquetas = () => {
  const [activeTab, setActiveTab] = useState('ia');
  
  // AI Labels State
  const [aiPrompt, setAiPrompt] = useState('Analiza este mensaje de MercadoLibre y determina si el cliente está:\n- Pidiendo factura\n- Preguntando sobre envío\n- Solicitando cancelación\n- Pidiendo garantía\nResponde solo con la categoría más probable.');
  const [aiTemperature, setAiTemperature] = useState(0.3);
  const [aiMaxTokens, setAiMaxTokens] = useState(150);

  // System Rules State  
  const [systemRules, setSystemRules] = useState([
    { id: 1, name: 'Envío Crítico', condition: '>4 días sin despacho', active: true },
    { id: 2, name: 'Alto Valor', condition: 'Productos >$500', active: true },
    { id: 3, name: 'Cliente VIP', condition: '>10 órdenes anteriores', active: false },
    { id: 4, name: 'Margen Bajo', condition: 'Margen <15%', active: true },
  ]);

  // Personal Labels State
  const [personalTags, setPersonalTags] = useState([
    { id: 1, name: 'Urgente', color: 'blue' },
    { id: 2, name: 'Seguimiento especial', color: 'red' },
    { id: 3, name: 'Revisar mañana', color: 'yellow' }
  ]);
  const [newTagName, setNewTagName] = useState('');

  const handleDeleteSystemRule = (id) => {
    setSystemRules(systemRules.filter(rule => rule.id !== id));
  };

  const handleToggleRule = (id) => {
    setSystemRules(systemRules.map(rule => 
      rule.id === id ? {...rule, active: !rule.active} : rule
    ));
  };

  const handleDeletePersonalTag = (id) => {
    setPersonalTags(personalTags.filter(tag => tag.id !== id));
  };

  const handleAddPersonalTag = () => {
    if (newTagName.trim()) {
      const colors = ['blue', 'green', 'purple', 'pink', 'indigo'];
      const newTag = {
        id: Date.now(),
        name: newTagName.trim(),
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      setPersonalTags([...personalTags, newTag]);
      setNewTagName('');
    }
  };

  const handleSaveAiConfig = () => {
    // TODO: Save to backend
    alert('Configuración IA guardada exitosamente');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Settings className="text-blue-600" size={28} />
            Mis Etiquetas
          </h1>
          <p className="text-gray-600">Configuración de los 3 sistemas de etiquetas para inteligencia de órdenes</p>
        </div>
        
        {/* Statistics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="text-purple-600" size={16} />
              <span className="text-sm font-medium text-purple-800">AI Labels</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">8</p>
            <p className="text-xs text-purple-700">Patrones detectados</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="text-yellow-600" size={16} />
              <span className="text-sm font-medium text-yellow-800">System Rules</span>
            </div>
            <p className="text-2xl font-bold text-yellow-900">{systemRules.filter(r => r.active).length}</p>
            <p className="text-xs text-yellow-700">Reglas activas</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="text-green-600" size={16} />
              <span className="text-sm font-medium text-green-800">Personal Tags</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{personalTags.length}</p>
            <p className="text-xs text-green-700">Etiquetas creadas</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('ia')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'ia'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Bot size={16} />
              🤖 Etiquetas IA
            </button>
            <button
              onClick={() => setActiveTab('sistema')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'sistema'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Zap size={16} />
              ⚡ Etiquetas del Sistema
            </button>
            <button
              onClick={() => setActiveTab('personales')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'personales'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Tag size={16} />
              🏷️ Etiquetas Personales
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'ia' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bot className="text-purple-600" size={20} />
                Configuración de Etiquetas IA
              </h3>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
                <h4 className="font-medium text-purple-800 mb-2">💡 ¿Cómo funcionan las Etiquetas IA?</h4>
                <p className="text-sm text-purple-700">
                  El sistema analiza automáticamente los mensajes de MercadoLibre usando inteligencia artificial. 
                  Detecta patrones como: "pide factura", "duda con envío", "intención de cancelar", etc. 
                  <strong> Costo: ~$0.02 por análisis</strong>.
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prompt para Análisis de Mensajes
                  </label>
                  <textarea
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Ingresa el prompt que usará la IA para analizar los mensajes de los clientes..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temperatura IA (0.0 - 1.0)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={aiTemperature}
                      onChange={(e) => setAiTemperature(parseFloat(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Máximo tokens
                    </label>
                    <input
                      type="number"
                      value={aiMaxTokens}
                      onChange={(e) => setAiMaxTokens(parseInt(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleSaveAiConfig}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Save size={16} />
                    Guardar Configuración IA
                  </button>
                  <div className="flex items-center gap-2 text-sm text-purple-600">
                    <AlertCircle size={16} />
                    Costo estimado: $0.02 por análisis
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sistema' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="text-yellow-600" size={20} />
                Reglas Automáticas del Sistema
              </h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                <h4 className="font-medium text-yellow-800 mb-2">⚡ ¿Cómo funcionan las Reglas del Sistema?</h4>
                <p className="text-sm text-yellow-700">
                  Análisis automático GRATUITO basado en datos estructurados de las órdenes. 
                  Detecta: "Envío crítico >4 días", "Alto valor >$500", "Cliente VIP", "Margen bajo", etc. 
                  <strong>Sin costo</strong> - Procesamiento instantáneo.
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Reglas Automáticas Configuradas</h4>
                  <div className="space-y-2">
                    {systemRules.map(rule => (
                      <div key={rule.id} className="flex items-center justify-between p-3 bg-white rounded border">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={rule.active}
                            onChange={() => handleToggleRule(rule.id)}
                            className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                          />
                          <div>
                            <span className={`font-medium ${rule.active ? 'text-gray-900' : 'text-gray-500'}`}>
                              {rule.name}
                            </span>
                            <p className="text-sm text-gray-600">{rule.condition}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteSystemRule(rule.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center gap-2">
                  <Plus size={16} />
                  Crear Nueva Regla
                </button>
              </div>
            </div>
          )}

          {activeTab === 'personales' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Tag className="text-green-600" size={20} />
                Etiquetas Personales
              </h3>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                <h4 className="font-medium text-green-800 mb-2">🏷️ ¿Cómo funcionan las Etiquetas Personales?</h4>
                <p className="text-sm text-green-700">
                  Etiquetas manuales que creas y asignas según tus criterios. 
                  Perfectas para casos especiales: "Urgente", "Seguimiento especial", "Revisar mañana". 
                  <strong>Control total</strong> - Las asignas cuando necesites.
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Mis Etiquetas Personalizadas</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {personalTags.map(tag => (
                      <span key={tag.id} className={`px-3 py-1 bg-${tag.color}-100 text-${tag.color}-800 rounded-full text-sm flex items-center gap-2`}>
                        {tag.name}
                        <button 
                          onClick={() => handleDeletePersonalTag(tag.id)}
                          className={`text-${tag.color}-600 hover:text-${tag.color}-800`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nueva etiqueta..."
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddPersonalTag()}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                    <button 
                      onClick={handleAddPersonalTag}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MisEtiquetas;