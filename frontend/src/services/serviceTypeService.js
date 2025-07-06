import api from './api';

const ServiceTypeService = {
  // Buscar todos os tipos de serviço
  async getAll() {
    return await api.get('/service-types');
  },

  // Buscar tipo de serviço por ID
  async getById(id) {
    return await api.get(`/service-types/${id}`);
  },

  // Buscar tipo de serviço por nome
  async getByName(name) {
    return await api.get(`/service-types/name/${name}`);
  },

  // Criar novo tipo de serviço
  async create(serviceTypeData) {
    return await api.post('/service-types', serviceTypeData);
  },

  // Atualizar tipo de serviço
  async update(id, serviceTypeData) {
    return await api.put(`/service-types/${id}`, serviceTypeData);
  },

  // Deletar tipo de serviço
  async delete(id) {
    return await api.delete(`/service-types/${id}`);
  },

  // Buscar tipos de serviço
  async search(query) {
    return await api.get(`/service-types/search?q=${encodeURIComponent(query)}`);
  }
};

export default ServiceTypeService; 