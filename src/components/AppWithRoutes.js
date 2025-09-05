import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PremiumSidebar, { ThemeProvider as PremiumThemeProvider } from './PremiumSidebar';
import PremiumHeader from './PremiumHeader';
import OrdersPage2_0 from '../pages/OrdersPage2_0';
import CustomersPage from '../pages/CustomersPage';
import AmazonCatalog from '../pages/products/AmazonCatalog';
import MLPublications from '../pages/products/MLPublications';
import SuppliersStock from '../pages/products/SuppliersStock';
import QuotesPageComponent from './QuotesPage';
import SalesDashboardPage from '../pages/SalesDashboardPage';
import MLOrdersSync from '../pages/MLOrdersSync';
import ConsolidadorPage from '../pages/control/ConsolidadorPage';
import ValidadorPage from '../pages/control/ValidadorPage';
import TRMPage from '../pages/control/TRMPage';
import ReportesPage from '../pages/control/ReportesPage';
import GmailDrivePage from '../pages/control/GmailDrivePage';
import GoogleAPI from '../pages/GoogleAPI';
import ConnectMLStore from './ConnectMLStore';
import MyLabels from '../pages/MyLabels';
import APIConnections from '../pages/APIConnections';
import MLStoresPage from '../pages/MLStoresPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminSystem from '../pages/admin/AdminSystem';
import CustomMenu from '../pages/admin/CustomMenu';
import Roles from '../pages/admin/Roles';
import PrivatePages from '../pages/admin/PrivatePages';

const AppWithRoutes = () => {
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const [showConnectML, setShowConnectML] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleMLConnectionSuccess = () => {
    setShowConnectML(false);
  };

  return (
    <PremiumThemeProvider>
      <div className="flex h-screen bg-gray-50" style={{margin: 0, padding: 0, gap: 0}}>
        {/* PremiumSidebar */}
        <PremiumSidebar 
          isMobile={isMobile}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col content-area" style={{margin: 0, padding: 0}}>
          {/* PremiumHeader */}
          <PremiumHeader 
            onToggleMobileSidebar={() => setShowMobileMenu(!showMobileMenu)}
          />

          {/* Page Content - SCROLLABLE */}
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<SalesDashboardPage />} />
              <Route path="/dashboard" element={<SalesDashboardPage />} />
              <Route path="/orders2_0" element={<OrdersPage2_0 />} />
              <Route path="/quotes" element={<QuotesPageComponent />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/catalogo-amazon" element={<AmazonCatalog />} />
              <Route path="/publicaciones-ml" element={<MLPublications />} />
              <Route path="/stock-proveedores" element={<SuppliersStock />} />
              <Route path="/ml-stores" element={
                <MLStoresPage 
                  showConnectML={showConnectML}
                  setShowConnectML={setShowConnectML}
                />
              } />
              <Route path="/ml-sync" element={<MLOrdersSync />} />
              <Route path="/google-api" element={<GoogleAPI />} />
              <Route path="/control-consolidador" element={<ConsolidadorPage />} />
              <Route path="/control-validador" element={<ValidadorPage />} />
              <Route path="/control-trm" element={<TRMPage />} />
              <Route path="/control-reportes" element={<ReportesPage />} />
              <Route path="/control-gmail-drive" element={<GmailDrivePage />} />
              <Route path="/mis-etiquetas" element={<MyLabels />} />
              <Route path="/apis-conexiones" element={<APIConnections />} />
              {/* Redirecciones de padres a primer hijo */}
              <Route path="/settings" element={<Navigate to="/mis-etiquetas" />} />
              <Route path="/business-reports" element={<Navigate to="/control-consolidador" />} />
              <Route path="/product-management" element={<Navigate to="/catalogo-amazon" />} />
              
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<Roles />} />
              <Route path="/admin/system" element={<AdminSystem />} />
              {/* Nuevas páginas separadas */}
              <Route path="/admin/custom-menu" element={<CustomMenu />} />
              <Route path="/admin/private-pages" element={<PrivatePages />} />
              {/* 404 - Mantener usuario en página actual, no redirigir */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                    <p className="text-gray-600 mb-4">Página no encontrada</p>
                    <a href="/" className="text-blue-600 hover:underline">Volver al dashboard</a>
                  </div>
                </div>
              } />
            </Routes>
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
      </div>
    </PremiumThemeProvider>
  );
};

export default AppWithRoutes;