import api from './api';

class PetService {
  static async getAll() {
    return api.get('/pets');
  }

  static async getById(id) {
    return api.get(`/pets/${id}`);
  }

  static async getByClient(clientId) {
    return api.get(`/pets/client/${clientId}`);
  }

  static async create(petData) {
    return api.post('/pets', petData);
  }

  static async update(id, petData) {
    return api.put(`/pets/${id}`, petData);
  }

  static async delete(id) {
    return api.delete(`/pets/${id}`);
  }

  static async search(query) {
    return api.get(`/pets/search?q=${encodeURIComponent(query)}`);
  }

  static async getStats() {
    return api.get('/pets/stats');
  }

  static async getSpecies() {
    return api.get('/pets/species');
  }

  static async getBreeds() {
    return api.get('/pets/breeds');
  }
}

export default PetService; 