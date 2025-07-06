import api from './api';

const AppointmentService = {
  // Buscar todos os agendamentos
  async getAll() {
    return await api.get('/appointments');
  },

  // Buscar agendamento por ID
  async getById(id) {
    return await api.get(`/appointments/${id}`);
  },

  // Buscar agendamentos por data
  async getByDate(date) {
    return await api.get(`/appointments/date/${date}`);
  },

  // Buscar agendamentos por cliente
  async getByClient(clientId) {
    return await api.get(`/appointments/client/${clientId}`);
  },

  // Buscar agendamentos por pet
  async getByPet(petId) {
    return await api.get(`/appointments/pet/${petId}`);
  },

  // Criar novo agendamento
  async create(appointmentData) {
    return await api.post('/appointments', appointmentData);
  },

  // Atualizar agendamento
  async update(id, appointmentData) {
    return await api.put(`/appointments/${id}`, appointmentData);
  },

  // Atualizar status do agendamento
  async updateStatus(id, status) {
    return await api.patch(`/appointments/${id}/status`, { status });
  },

  // Deletar agendamento
  async delete(id) {
    return await api.delete(`/appointments/${id}`);
  },

  // Buscar estatísticas dos agendamentos
  async getStats() {
    return await api.get('/appointments/stats');
  },

  // Buscar agendamentos
  async search(query) {
    return await api.get(`/appointments/search?q=${encodeURIComponent(query)}`);
  }
};

export default AppointmentService; 