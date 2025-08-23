import React from 'react';
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Target,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

const SalesDashboardPage = () => {
  // Mock data para el dashboard
  const dashboardStats = {
    totalSales: 12450000,
    totalOrders: 156,
    totalCustomers: 89,
    averageOrderValue: 79807,
    monthlyGrowth: 15.3,
    salesGrowth: 8.7,
    customersGrowth: 12.1,
    ordersGrowth: -2.1
  };

  const recentOrders = [
    { id: 'ORD-001', customer: 'Carlos Mendoza', amount: 450000, status: 'completed', date: '2025-01-23' },
    { id: 'ORD-002', customer: 'Ana Rodriguez', amount: 1200000, status: 'processing', date: '2025-01-23' },
    { id: 'ORD-003', customer: 'Luis Perez', amount: 75000, status: 'pending', date: '2025-01-22' },
    { id: 'ORD-004', customer: 'Maria Lopez', amount: 320000, status: 'completed', date: '2025-01-22' },
    { id: 'ORD-005', customer: 'Juan Garcia', amount: 890000, status: 'processing', date: '2025-01-21' }
  ];

  const topProducts = [
    { name: 'Auriculares Bluetooth Premium', sales: 45, revenue: 6750000 },
    { name: 'Cámara Digital Canon EOS', sales: 12, revenue: 14400000 },
    { name: 'Smart Watch Deportivo', sales: 28, revenue: 5600000 },
    { name: 'Tablet 10" Android', sales: 18, revenue: 5400000 },
    { name: 'Cargador Wireless', sales: 67, revenue: 5360000 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'text-green-600 bg-green-100',
      processing: 'text-blue-600 bg-blue-100',
      pending: 'text-yellow-600 bg-yellow-100',
      cancelled: 'text-red-600 bg-red-100'
    };
    return colors[status] || colors.pending;
  };

  const getGrowthIcon = (growth) => {
    return growth >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />;
  };

  const getGrowthColor = (growth) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="sales-dashboard-page p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard de Ventas</h1>
          <p className="text-gray-600">Resumen de tu performance de ventas</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} />
          Período: Enero 2025
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ventas Totales</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(dashboardStats.totalSales)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
          <div className={`flex items-center mt-3 text-sm ${getGrowthColor(dashboardStats.salesGrowth)}`}>
            {getGrowthIcon(dashboardStats.salesGrowth)}
            <span className="ml-1">{Math.abs(dashboardStats.salesGrowth)}% vs mes anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Órdenes</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardStats.totalOrders}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <ShoppingCart className="text-green-600" size={24} />
            </div>
          </div>
          <div className={`flex items-center mt-3 text-sm ${getGrowthColor(dashboardStats.ordersGrowth)}`}>
            {getGrowthIcon(dashboardStats.ordersGrowth)}
            <span className="ml-1">{Math.abs(dashboardStats.ordersGrowth)}% vs mes anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Clientes</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardStats.totalCustomers}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
          <div className={`flex items-center mt-3 text-sm ${getGrowthColor(dashboardStats.customersGrowth)}`}>
            {getGrowthIcon(dashboardStats.customersGrowth)}
            <span className="ml-1">{Math.abs(dashboardStats.customersGrowth)}% vs mes anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Valor Promedio</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(dashboardStats.averageOrderValue)}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Target className="text-orange-600" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-3 text-sm text-gray-600">
            <TrendingUp size={16} />
            <span className="ml-1">Por orden</span>
          </div>
        </div>
      </div>

      {/* Sección de órdenes recientes y productos top */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Órdenes recientes */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Órdenes Recientes</h2>
              <button className="text-blue-600 text-sm hover:text-blue-800">Ver todas</button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-gray-800">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-800">
                      {formatCurrency(order.amount)}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status === 'completed' ? 'Completada' : 
                         order.status === 'processing' ? 'Procesando' : 
                         order.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                      </span>
                      <span className="text-xs text-gray-500">{order.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Productos top */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Productos Más Vendidos</h2>
              <button className="text-blue-600 text-sm hover:text-blue-800">Ver reporte</button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sales} unidades vendidas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-800">
                      {formatCurrency(product.revenue)}
                    </div>
                    <div className="text-sm text-gray-500">Ingresos</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de tendencias - placeholder */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Tendencia de Ventas</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded">7 días</button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">30 días</button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">90 días</button>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <BarChart3 size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Gráfico de tendencias se mostrará aquí</p>
            <p className="text-sm text-gray-500 mt-1">Implementación pendiente con Chart.js</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboardPage;