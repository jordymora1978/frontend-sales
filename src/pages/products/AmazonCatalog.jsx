import React from 'react';
import { Package, Search, Filter } from 'lucide-react';

const CatalogoAmazon = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-blue-600" size={28} />
            Catálogo Amazon
          </h1>
          <p className="text-gray-600">Gestión de productos del catálogo de Amazon</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Search size={16} />
            Buscar Productos
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Filter size={16} />
            Filtros
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <Package className="mx-auto text-gray-400 mb-4" size={64} />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Catálogo Amazon
        </h2>
        <p className="text-gray-600 mb-4">
          Esta página estará disponible próximamente para gestionar el catálogo de productos de Amazon.
        </p>
        <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-blue-700">
            🚀 Funcionalidades planificadas: sincronización con Amazon, búsqueda avanzada, gestión de inventario.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CatalogoAmazon;