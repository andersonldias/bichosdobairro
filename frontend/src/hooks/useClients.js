import React, { useState, useEffect, useCallback } from 'react';
import ClientService from '../services/clientService';

export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  // Carregar todos os clientes
  const loadClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ClientService.getAll();
      setClients(response.data || []);
    } catch (err) {
      const errorMessage = err.message.includes('timeout') 
        ? 'Servidor não está respondendo. Verifique se o backend está rodando.'
        : err.message;
      setError(errorMessage);
      console.error('Erro ao carregar clientes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar estatísticas
  const loadStats = useCallback(async () => {
    try {
      const response = await ClientService.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
      // Não definir erro global para estatísticas, apenas log
    }
  }, []);

  // Criar cliente
  const createClient = useCallback(async (clientData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🎯 useClients.createClient - Dados recebidos:', clientData);
      const response = await ClientService.create(clientData);
      console.log('🎯 useClients.createClient - Resposta:', response);
      setClients(prev => [...prev, response.data]);
      await loadStats(); // Recarregar estatísticas
      return response.data;
    } catch (err) {
      console.error('❌ useClients.createClient - Erro:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadStats]);

  // Atualizar cliente
  const updateClient = useCallback(async (id, clientData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ClientService.update(id, clientData);
      setClients(prev => prev.map(client => 
        client.id === id ? response.data : client
      ));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Deletar cliente
  const deleteClient = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await ClientService.delete(id);
      setClients(prev => prev.filter(client => client.id !== id));
      await loadStats(); // Recarregar estatísticas
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadStats]);

  // Buscar clientes
  const searchClients = useCallback(async (query) => {
    if (!query.trim()) {
      await loadClients();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await ClientService.search(query);
      setClients(response.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar clientes:', err);
    } finally {
      setLoading(false);
    }
  }, [loadClients]);

  // Carregar dados iniciais
  useEffect(() => {
    loadClients();
    loadStats();
  }, [loadClients, loadStats]);

  return {
    clients,
    loading,
    error,
    stats,
    loadClients,
    createClient,
    updateClient,
    deleteClient,
    searchClients,
    loadStats
  };
}; 