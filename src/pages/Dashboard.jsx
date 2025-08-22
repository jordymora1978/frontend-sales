import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  TrendingUp,
  Store,
  LogOut,
  Menu,
  X,
  Bell,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    activeStores: 0
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'https://api.dropux.co';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch stores
      const storesResponse = await axios.get(`${API_URL}/api/ml/my-stores`, { headers });
      
      setStats({
        totalOrders: 156,
        pendingOrders: 23,
        totalRevenue: 45678.90,
        activeStores: storesResponse.data?.stores?.length || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const menuItems = [
    { icon: ShoppingCart, label: 'Órdenes', path: '/orders' },
    { icon: Store, label: 'Tiendas ML', path: '/connect-store' },
    { icon: Package, label: 'Productos', path: '/products' },
    { icon: TrendingUp, label: 'Reportes', path: '/reports' },
  ];

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${!sidebarOpen && 'hidden'}`}>
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Dropux Sales</h2>
        </div>
        <nav className="p-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="w-full text-left p-3 mb-2 rounded-lg hover:bg-gray-100 flex items-center"
            >
              <item.icon className="h-5 w-5 mr-3 text-gray-600" />
              <span className="text-gray-700">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={onLogout}
            className="w-full text-left p-3 rounded-lg hover:bg-red-50 flex items-center text-red-600"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content flex-1">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gray-200 rounded-full">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <span className="text-sm font-medium">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Bienvenido de vuelta!</h1>
          <p className="text-gray-600 mt-2">Aquí está el resumen de tu negocio hoy</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard 
            icon={ShoppingCart} 
            label="Total Órdenes" 
            value={stats.totalOrders}
            color="bg-blue-500"
          />
          <StatCard 
            icon={Package} 
            label="Pendientes" 
            value={stats.pendingOrders}
            color="bg-yellow-500"
          />
          <StatCard 
            icon={DollarSign} 
            label="Ingresos" 
            value={`$${stats.totalRevenue.toLocaleString()}`}
            color="bg-green-500"
          />
          <StatCard 
            icon={Store} 
            label="Tiendas Activas" 
            value={stats.activeStores}
            color="bg-purple-500"
          />
        </div>

        {/* Recent Orders */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Órdenes Recientes</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>ID Orden</th>
                  <th>Cliente</th>
                  <th>Producto</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#ML-001</td>
                  <td>Juan Pérez</td>
                  <td>Laptop HP</td>
                  <td>$1,200</td>
                  <td><span className="status-badge status-active">Completado</span></td>
                </tr>
                <tr>
                  <td>#ML-002</td>
                  <td>María García</td>
                  <td>Mouse Logitech</td>
                  <td>$45</td>
                  <td><span className="status-badge status-pending">Pendiente</span></td>
                </tr>
                <tr>
                  <td>#ML-003</td>
                  <td>Carlos López</td>
                  <td>Teclado Mecánico</td>
                  <td>$89</td>
                  <td><span className="status-badge status-processing">Procesando</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;