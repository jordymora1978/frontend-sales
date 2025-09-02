import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PremiumSidebar, { ThemeProvider as PremiumThemeProvider } from './PremiumSidebar';
import PremiumHeader from './PremiumHeader';
import OrdersPage2_0 from '../pages/OrdersPage2_0';
import CustomersPage from '../pages/CustomersPage';
import CatalogoAmazon from '../pages/CatalogoAmazon';
import PublicacionesML from '../pages/PublicacionesML';
import StockProveedores from '../pages/StockProveedores';
import QuotesPageComponent from './QuotesPage';
import SalesDashboardPage from '../pages/SalesDashboardPage';
import SincOrdersMeli from '../pages/SincOrdersMeli';
import ConsolidadorPage from '../pages/control/ConsolidadorPage';
import ValidadorPage from '../pages/control/ValidadorPage';
import TRMPage from '../pages/control/TRMPage';
import ReportesPage from '../pages/control/ReportesPage';
import GmailDrivePage from '../pages/control/GmailDrivePage';
import GoogleAPI from '../pages/GoogleAPI';
import ConnectMLStore from './ConnectMLStore';
import MisEtiquetas from '../pages/MisEtiquetas';
import APIsConexiones from '../pages/APIsConexiones';
import MLStoresPage from '../pages/MLStoresPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminSystem from '../pages/admin/AdminSystem';

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
              <Route path="/catalogo-amazon" element={<CatalogoAmazon />} />
              <Route path="/publicaciones-ml" element={<PublicacionesML />} />
              <Route path="/stock-proveedores" element={<StockProveedores />} />
              <Route path="/ml-stores" element={
                <MLStoresPage 
                  showConnectML={showConnectML}
                  setShowConnectML={setShowConnectML}
                />
              } />
              <Route path="/ml-sync" element={<SincOrdersMeli />} />
              <Route path="/google-api" element={<GoogleAPI />} />
              <Route path="/control-consolidador" element={<ConsolidadorPage />} />
              <Route path="/control-validador" element={<ValidadorPage />} />
              <Route path="/control-trm" element={<TRMPage />} />
              <Route path="/control-reportes" element={<ReportesPage />} />
              <Route path="/control-gmail-drive" element={<GmailDrivePage />} />
              <Route path="/mis-etiquetas" element={<MisEtiquetas />} />
              <Route path="/apis-conexiones" element={<APIsConexiones />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/system" element={<AdminSystem />} />
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