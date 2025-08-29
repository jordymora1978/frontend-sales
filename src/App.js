import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppWithRoutes from './components/AppWithRoutes';
import Login from './components/Login.jsx';
import EnterpriseRegister from './components/EnterpriseRegister.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import DebugClearAuth from './components/DebugClearAuth';
import './App.css';

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
  
  // Show login form (default)
  return <Login onShowRegister={() => navigate('/auth/register')} />;
};

const AppRoutes = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Authentication routes - both old and new for compatibility */}
          <Route path="/auth/login" element={<AuthenticatedAuth />} />
          <Route path="/auth/register" element={<AuthenticatedAuth />} />
          {/* Legacy routes - redirect to new structure */}
          <Route path="/login" element={<Navigate to="/auth/login" replace />} />
          <Route path="/register" element={<Navigate to="/auth/register" replace />} />
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
      {window.location.hostname.includes('dropux.co') && <DebugClearAuth />}
    </AuthProvider>
  );
}

export default App;