const db = require('../config/database');

class ServiceType {
  static async findAll() {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM service_types ORDER BY name'
      );
      return rows;
    } catch (error) {
      console.error('Erro ao buscar tipos de serviço:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM service_types WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar tipo de serviço por ID:', error);
      throw error;
    }
  }

  static async findByName(name) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM service_types WHERE name = ?',
        [name]
      );
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar tipo de serviço por nome:', error);
      throw error;
    }
  }

  static async create(serviceTypeData) {
    try {
      const { name, description, default_price } = serviceTypeData;
      const [result] = await db.execute(
        'INSERT INTO service_types (name, description, default_price) VALUES (?, ?, ?)',
        [name, description, default_price]
      );
      return { id: result.insertId, ...serviceTypeData };
    } catch (error) {
      console.error('Erro ao criar tipo de serviço:', error);
      throw error;
    }
  }

  static async update(id, serviceTypeData) {
    try {
      const { name, description, default_price } = serviceTypeData;
      const [result] = await db.execute(
        'UPDATE service_types SET name = ?, description = ?, default_price = ? WHERE id = ?',
        [name, description, default_price, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao atualizar tipo de serviço:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute(
        'DELETE FROM service_types WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao deletar tipo de serviço:', error);
      throw error;
    }
  }

  static async search(query) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM service_types WHERE name LIKE ? OR description LIKE ? ORDER BY name',
        [`%${query}%`, `%${query}%`]
      );
      return rows;
    } catch (error) {
      console.error('Erro ao buscar tipos de serviço:', error);
      throw error;
    }
  }
}

module.exports = ServiceType; 