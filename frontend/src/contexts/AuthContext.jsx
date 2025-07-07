import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar se há token salvo e validar
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          // Configurar token para requisições
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Verificar se o token ainda é válido
          const response = await api.get('/auth/verify');
          
          if (response.data.success) {
            setUser(response.data.data.user);
            setIsAuthenticated(true);
          } else {
            // Token inválido, limpar dados
            logout();
          }
        } catch (error) {
          console.error('Erro ao verificar token:', error);
          // Token expirado ou inválido, limpar dados
          logout();
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Função de login
  const login = async (email, password) => {
    try {
      console.log('🔐 Tentando fazer login...', { email });
      const response = await api.post('/auth/login', { email, password });
      
      console.log('✅ Resposta do login:', response.data);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        
        console.log('👤 Dados do usuário:', user);
        
        // Salvar dados
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Configurar token para requisições
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Atualizar estado
        setUser(user);
        setIsAuthenticated(true);
        
        console.log('🎉 Login realizado com sucesso!');
        return { success: true };
      } else {
        console.log('❌ Login falhou:', response.data);
        return { 
          success: false, 
          error: response.data.message || 'Erro ao fazer login' 
        };
      }
    } catch (error) {
      console.error('❌ Erro no login:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao fazer login' 
      };
    }
  };

  // Função de logout
  const logout = () => {
    // Limpar dados do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Limpar token das requisições
    delete api.defaults.headers.common['Authorization'];
    
    // Atualizar estado
    setUser(null);
    setIsAuthenticated(false);
  };

  // Função para alterar senha
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      
      if (response.data.success) {
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao alterar senha' 
      };
    }
  };

  // Verificar se usuário tem permissão específica
  const hasRole = (roles) => {
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  };

  // Verificar se é admin
  const isAdmin = () => hasRole('admin');

  // Verificar se é veterinário ou admin
  const isVetOrAdmin = () => hasRole(['admin', 'veterinario']);

  // Verificar se é atendente ou superior
  const isAttendantOrHigher = () => hasRole(['admin', 'veterinario', 'atendente']);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    changePassword,
    hasRole,
    isAdmin,
    isVetOrAdmin,
    isAttendantOrHigher
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 