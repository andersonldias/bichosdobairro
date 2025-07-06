const db = require('../config/database');

class Appointment {
  static async findAll() {
    try {
      const [rows] = await db.execute(`
        SELECT 
          a.*,
          c.name as client_name,
          c.phone as client_phone,
          p.name as pet_name,
          p.species as pet_species,
          st.name as service_type_name
        FROM appointments a
        JOIN clients c ON a.client_id = c.id
        JOIN pets p ON a.pet_id = p.id
        JOIN service_types st ON a.service_type_id = st.id
        ORDER BY a.appointment_date DESC, a.appointment_time ASC
      `);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          a.*,
          c.name as client_name,
          c.phone as client_phone,
          p.name as pet_name,
          p.species as pet_species,
          st.name as service_type_name
        FROM appointments a
        JOIN clients c ON a.client_id = c.id
        JOIN pets p ON a.pet_id = p.id
        JOIN service_types st ON a.service_type_id = st.id
        WHERE a.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar agendamento por ID:', error);
      throw error;
    }
  }

  static async findByDate(date) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          a.*,
          c.name as client_name,
          c.phone as client_phone,
          p.name as pet_name,
          p.species as pet_species,
          st.name as service_type_name
        FROM appointments a
        JOIN clients c ON a.client_id = c.id
        JOIN pets p ON a.pet_id = p.id
        JOIN service_types st ON a.service_type_id = st.id
        WHERE a.appointment_date = ?
        ORDER BY a.appointment_time ASC
      `, [date]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar agendamentos por data:', error);
      throw error;
    }
  }

  static async findByClient(clientId) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          a.*,
          c.name as client_name,
          c.phone as client_phone,
          p.name as pet_name,
          p.species as pet_species,
          st.name as service_type_name
        FROM appointments a
        JOIN clients c ON a.client_id = c.id
        JOIN pets p ON a.pet_id = p.id
        JOIN service_types st ON a.service_type_id = st.id
        WHERE a.client_id = ?
        ORDER BY a.appointment_date DESC, a.appointment_time ASC
      `, [clientId]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar agendamentos por cliente:', error);
      throw error;
    }
  }

  static async findByPet(petId) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          a.*,
          c.name as client_name,
          c.phone as client_phone,
          p.name as pet_name,
          p.species as pet_species,
          st.name as service_type_name
        FROM appointments a
        JOIN clients c ON a.client_id = c.id
        JOIN pets p ON a.pet_id = p.id
        JOIN service_types st ON a.service_type_id = st.id
        WHERE a.pet_id = ?
        ORDER BY a.appointment_date DESC, a.appointment_time ASC
      `, [petId]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar agendamentos por pet:', error);
      throw error;
    }
  }

  static async create(appointmentData) {
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
      } = appointmentData;

      const [result] = await db.execute(`
        INSERT INTO appointments (
          client_id, pet_id, service_type_id, service_name, price,
          appointment_date, appointment_time, transport_required,
          transport_price, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        client_id, pet_id, service_type_id, service_name, price,
        appointment_date, appointment_time, transport_required,
        transport_price, notes
      ]);

      return { id: result.insertId, ...appointmentData };
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw error;
    }
  }

  static async update(id, appointmentData) {
    try {
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
      } = appointmentData;

      const [result] = await db.execute(`
        UPDATE appointments SET
          service_type_id = ?, service_name = ?, price = ?,
          appointment_date = ?, appointment_time = ?, transport_required = ?,
          transport_price = ?, status = ?, notes = ?
        WHERE id = ?
      `, [
        service_type_id, service_name, price, appointment_date,
        appointment_time, transport_required, transport_price, status, notes, id
      ]);

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      throw error;
    }
  }

  static async updateStatus(id, status) {
    try {
      const [result] = await db.execute(
        'UPDATE appointments SET status = ? WHERE id = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao atualizar status do agendamento:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute(
        'DELETE FROM appointments WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
      throw error;
    }
  }

  static async getStats() {
    try {
      const [rows] = await db.execute(`
        SELECT 
          COUNT(*) as total_appointments,
          COUNT(CASE WHEN status = 'agendado' THEN 1 END) as pending,
          COUNT(CASE WHEN status = 'em_andamento' THEN 1 END) as in_progress,
          COUNT(CASE WHEN status = 'concluido' THEN 1 END) as completed,
          COUNT(CASE WHEN status = 'cancelado' THEN 1 END) as cancelled,
          COUNT(CASE WHEN appointment_date = CURDATE() THEN 1 END) as today,
          COALESCE(SUM(total_price), 0) as total_revenue
        FROM appointments
        WHERE status != 'cancelado'
      `);
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar estatísticas dos agendamentos:', error);
      throw error;
    }
  }

  static async search(query) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          a.*,
          c.name as client_name,
          c.phone as client_phone,
          p.name as pet_name,
          p.species as pet_species,
          st.name as service_type_name
        FROM appointments a
        JOIN clients c ON a.client_id = c.id
        JOIN pets p ON a.pet_id = p.id
        JOIN service_types st ON a.service_type_id = st.id
        WHERE 
          c.name LIKE ? OR 
          p.name LIKE ? OR 
          st.name LIKE ? OR 
          a.service_name LIKE ?
        ORDER BY a.appointment_date DESC, a.appointment_time ASC
      `, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      throw error;
    }
  }
}

module.exports = Appointment; 