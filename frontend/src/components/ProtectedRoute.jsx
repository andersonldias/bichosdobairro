import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading, isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, redirecionar para login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se usuário não está ativo, mostrar mensagem
  if (user && !user.active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Usuário Inativo
            </h2>
            <p className="text-red-600 mb-4">
              Sua conta foi desativada. Entre em contato com o administrador.
            </p>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Voltar ao Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Se requer role específica, verificar permissão
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">
              Acesso Negado
            </h2>
            <p className="text-yellow-600 mb-4">
              Você não tem permissão para acessar esta página.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Se passou por todas as verificações, mostrar o conteúdo
  return children;
};

export default ProtectedRoute; 