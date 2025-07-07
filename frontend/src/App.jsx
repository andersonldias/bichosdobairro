import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Pets from './pages/Pets';
import Services from './pages/Services';
import Agenda from './pages/Agenda';
import CashRegister from './pages/CashRegister';
import Statistics from './pages/Statistics';
import Permissions from './pages/Permissions';
import Settings from './pages/Settings';
import { SettingsProvider } from './contexts/SettingsContext';

// Componente principal da aplicação
const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, user, loading } = useAuth();

  console.log('🔍 Estado da autenticação:', { isAuthenticated, user, loading });

  // Se não está autenticado, mostrar apenas a página de login
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Se está autenticado, mostrar o layout principal
  return (
    <SettingsProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          
          {/* Page Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/clients" element={
                <ProtectedRoute>
                  <Clients />
                </ProtectedRoute>
              } />
              <Route path="/pets" element={
                <ProtectedRoute>
                  <Pets />
                </ProtectedRoute>
              } />
              <Route path="/services" element={
                <ProtectedRoute requiredRole={['admin', 'veterinario']}>
                  <Services />
                </ProtectedRoute>
              } />
              <Route path="/agenda" element={
                <ProtectedRoute>
                  <Agenda />
                </ProtectedRoute>
              } />
              <Route path="/cash-register" element={
                <ProtectedRoute requiredRole={['admin', 'atendente']}>
                  <CashRegister />
                </ProtectedRoute>
              } />
              <Route path="/statistics" element={
                <ProtectedRoute requiredRole={['admin', 'veterinario']}>
                  <Statistics />
                </ProtectedRoute>
              } />
              <Route path="/permissions" element={
                <ProtectedRoute requiredRole="admin">
                  <Permissions />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </SettingsProvider>
  );
};

// Componente raiz com providers
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App; 