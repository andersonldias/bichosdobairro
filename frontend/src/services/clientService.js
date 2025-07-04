import api from './api';

class ClientService {
  // Listar todos os clientes
  static async getAll() {
    try {
      const response = await api.get('/clients');
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar clientes: ' + error.message);
    }
  }

  // Buscar cliente por ID
  static async getById(id) {
    try {
      const response = await api.get(`/clients/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar cliente: ' + error.message);
    }
  }

  // Criar novo cliente
  static async create(clientData) {
    try {
      const response = await api.post('/clients', clientData);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao criar cliente: ' + error.message);
    }
  }

  // Atualizar cliente
  static async update(id, clientData) {
    try {
      const response = await api.put(`/clients/${id}`, clientData);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao atualizar cliente: ' + error.message);
    }
  }

  // Deletar cliente
  static async delete(id) {
    try {
      const response = await api.delete(`/clients/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao deletar cliente: ' + error.message);
    }
  }

  // Buscar clientes
  static async search(query) {
    try {
      const response = await api.get(`/clients/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar clientes: ' + error.message);
    }
  }

  // Obter estatísticas
  static async getStats() {
    try {
      const response = await api.get('/clients/stats');
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar estatísticas: ' + error.message);
    }
  }
}

export default ClientService; 