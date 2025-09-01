import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppWithRoutes from './components/AppWithRoutes';
import Login from './components/Login.jsx';
import EnterpriseRegister from './components/EnterpriseRegister.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import InviteRegister from './pages/InviteRegister.jsx';
import AdminRegister from './pages/AdminRegister.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Component to redirect preserving query parameters
const RedirectWithParams = ({ to }) => {
  const location = useLocation();
  return <Navigate to={`${to}${location.search}`} replace />;
};

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      <p className="mt-4 text-white">Cargando...</p>
    </div>
  </div>
);

const AuthenticatedAuth = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Show register form
  if (location.pathname === '/auth/register' || location.pathname === '/register') {
    return (
      <EnterpriseRegister 
        onBackToLogin={() => navigate('/auth/login')}
      />
    );
  }
  
  // Show forgot password form
  if (location.pathname === '/auth/forgot-password' || location.pathname === '/forgot-password') {
    return (
      <ForgotPassword 
        onBackToLogin={() => navigate('/auth/login')}
      />
    );
  }
  
  // Show reset password form
  if (location.pathname === '/auth/reset-password' || location.pathname === '/reset-password') {
    return <ResetPassword />;
  }
  
  // Show login form (default)
  return (
    <Login 
      onShowRegister={() => navigate('/auth/register')}
      onShowForgotPassword={() => navigate('/auth/forgot-password')}
    />
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Authentication routes - both old and new for compatibility */}
          <Route path="/auth/login" element={<AuthenticatedAuth />} />
          <Route path="/auth/register" element={<AuthenticatedAuth />} />
          <Route path="/auth/forgot-password" element={<AuthenticatedAuth />} />
          <Route path="/auth/reset-password" element={<AuthenticatedAuth />} />
          {/* Invitation registration route */}
          <Route path="/invite/:token" element={<InviteRegister />} />
          {/* Admin registration route */}
          <Route path="/admin-register" element={<AdminRegister />} />
          {/* Legacy routes - redirect to new structure */}
          <Route path="/login" element={<Navigate to="/auth/login" replace />} />
          <Route path="/register" element={<Navigate to="/auth/register" replace />} />
          <Route path="/forgot-password" element={<Navigate to="/auth/forgot-password" replace />} />
          <Route path="/reset-password" element={<RedirectWithParams to="/auth/reset-password" />} />
          {/* Protected application routes */}
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <AppWithRoutes />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;