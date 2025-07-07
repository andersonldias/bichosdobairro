const Appointment = require('../models/Appointment');
const ServiceType = require('../models/ServiceType');

const appointmentController = {
  // Buscar todos os agendamentos
  async getAll(req, res) {
    try {
      const appointments = await Appointment.findAll();
      res.json(appointments);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Buscar agendamento por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const appointment = await Appointment.findById(id);
      
      if (!appointment) {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }
      
      res.json(appointment);
    } catch (error) {
      console.error('Erro ao buscar agendamento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Buscar agendamentos por data
  async getByDate(req, res) {
    try {
      const { date } = req.params;
      const appointments = await Appointment.findByDate(date);
      res.json(appointments);
    } catch (error) {
      console.error('Erro ao buscar agendamentos por data:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Buscar agendamentos por cliente
  async getByClient(req, res) {
    try {
      const { clientId } = req.params;
      const appointments = await Appointment.findByClient(clientId);
      res.json(appointments);
    } catch (error) {
      console.error('Erro ao buscar agendamentos por cliente:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Buscar agendamentos por pet
  async getByPet(req, res) {
    try {
      const { petId } = req.params;
      const appointments = await Appointment.findByPet(petId);
      res.json(appointments);
    } catch (error) {
      console.error('Erro ao buscar agendamentos por pet:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Criar novo agendamento
  async create(req, res) {
    try {
      const {
        client_id,
        pet_id,
        service_type_id,
        service_name,
        price,
        appointment_date,
        appointment_time,
        transport_required,
        transport_price,
        notes
      } = req.body;
      
      // Validações básicas
      if (!client_id || !pet_id || !service_name || !price || !appointment_date) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios: client_id, pet_id, service_name, price, appointment_date' 
        });
      }

      // Verificar se o tipo de serviço existe
      if (service_type_id) {
        const serviceType = await ServiceType.findById(service_type_id);
        if (!serviceType) {
          return res.status(400).json({ error: 'Tipo de serviço não encontrado' });
        }
      }

      // Verificar se já existe agendamento para o mesmo dia e horário
      const existing = await Appointment.findByDateAndTime(appointment_date, appointment_time);
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Já existe um agendamento para este horário.' });
      }

      const appointment = await Appointment.create({
        client_id: parseInt(client_id),
        pet_id: parseInt(pet_id),
        service_type_id: service_type_id ? parseInt(service_type_id) : null,
        service_name,
        price: parseFloat(price),
        appointment_date,
        appointment_time: appointment_time || null,
        transport_required: transport_required === 'true' || transport_required === true,
        transport_price: transport_price ? parseFloat(transport_price) : 0.00,
        notes: notes || ''
      });

      res.status(201).json(appointment);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Atualizar agendamento
  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        service_type_id,
        service_name,
        price,
        appointment_date,
        appointment_time,
        transport_required,
        transport_price,
        status,
        notes
      } = req.body;
      
      // Verificar se o agendamento existe
      const existingAppointment = await Appointment.findById(id);
      if (!existingAppointment) {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }

      // Verificar se o tipo de serviço existe
      if (service_type_id) {
        const serviceType = await ServiceType.findById(service_type_id);
        if (!serviceType) {
          return res.status(400).json({ error: 'Tipo de serviço não encontrado' });
        }
      }

      const success = await Appointment.update(id, {
        service_type_id: service_type_id ? parseInt(service_type_id) : existingAppointment.service_type_id,
        service_name: service_name || existingAppointment.service_name,
        price: price ? parseFloat(price) : existingAppointment.price,
        appointment_date: appointment_date || existingAppointment.appointment_date,
        appointment_time: appointment_time || existingAppointment.appointment_time,
        transport_required: transport_required !== undefined ? 
          (transport_required === 'true' || transport_required === true) : 
          existingAppointment.transport_required,
        transport_price: transport_price !== undefined ? parseFloat(transport_price) : existingAppointment.transport_price,
        status: status || existingAppointment.status,
        notes: notes !== undefined ? notes : existingAppointment.notes
      });

      if (!success) {
        return res.status(500).json({ error: 'Erro ao atualizar agendamento' });
      }

      const updatedAppointment = await Appointment.findById(id);
      res.json(updatedAppointment);
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Atualizar status do agendamento
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: 'Status é obrigatório' });
      }

      const validStatuses = ['agendado', 'em_andamento', 'concluido', 'cancelado'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
      }

      // Verificar se o agendamento existe
      const existingAppointment = await Appointment.findById(id);
      if (!existingAppointment) {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }

      const success = await Appointment.updateStatus(id, status);
      
      if (!success) {
        return res.status(500).json({ error: 'Erro ao atualizar status do agendamento' });
      }

      const updatedAppointment = await Appointment.findById(id);
      res.json(updatedAppointment);
    } catch (error) {
      console.error('Erro ao atualizar status do agendamento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Deletar agendamento
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Verificar se o agendamento existe
      const existingAppointment = await Appointment.findById(id);
      if (!existingAppointment) {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }

      const success = await Appointment.delete(id);
      
      if (!success) {
        return res.status(500).json({ error: 'Erro ao deletar agendamento' });
      }

      res.json({ message: 'Agendamento deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Buscar estatísticas dos agendamentos
  async getStats(req, res) {
    try {
      const stats = await Appointment.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Erro ao buscar estatísticas dos agendamentos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Buscar agendamentos
  async search(req, res) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({ error: 'Query de busca é obrigatória' });
      }

      const appointments = await Appointment.search(q);
      res.json(appointments);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};

module.exports = appointmentController; 