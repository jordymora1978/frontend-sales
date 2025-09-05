import React from 'react';
import { Truck, Users, BarChart3 } from 'lucide-react';

const StockProveedores = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Truck className="text-green-600" size={28} />
            Stock Proveedores
          </h1>
          <p className="text-gray-600">Gestión de inventario y proveedores</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
            <Users size={16} />
            Nuevo Proveedor
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <BarChart3 size={16} />
            Reportes Stock
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <Truck className="mx-auto text-gray-400 mb-4" size={64} />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Stock Proveedores
        </h2>
        <p className="text-gray-600 mb-4">
          Esta página estará disponible próximamente para gestionar el stock y proveedores.
        </p>
        <div className="bg-green-50 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-green-700">
            🚀 Funcionalidades planificadas: gestión de proveedores, control de stock, alertas de inventario bajo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockProveedores;