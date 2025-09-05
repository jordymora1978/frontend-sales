import React from 'react';
import { ShoppingBag, Plus, Edit } from 'lucide-react';

const PublicacionesML = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingBag className="text-yellow-600" size={28} />
            Publicaciones ML
          </h1>
          <p className="text-gray-600">Gestión de publicaciones en MercadoLibre</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Nueva Publicación
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Edit size={16} />
            Editar Masivo
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <ShoppingBag className="mx-auto text-gray-400 mb-4" size={64} />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Publicaciones MercadoLibre
        </h2>
        <p className="text-gray-600 mb-4">
          Esta página estará disponible próximamente para gestionar las publicaciones en MercadoLibre.
        </p>
        <div className="bg-yellow-50 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-yellow-700">
            🚀 Funcionalidades planificadas: crear/editar publicaciones, sincronización automática, optimización de precios.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicacionesML;