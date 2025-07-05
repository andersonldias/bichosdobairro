const db = require('../config/database');

class Client {
  static async findAll() {
    try {
      const [rows] = await db.query(`
        SELECT c.*, 
               COUNT(p.id) as pets_count,
               GROUP_CONCAT(p.name) as pets_names
        FROM clients c
        LEFT JOIN pets p ON c.id = p.client_id
        GROUP BY c.id
        ORDER BY c.name
      `);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar clientes: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query(`
        SELECT c.*, 
               JSON_ARRAYAGG(
                 JSON_OBJECT(
                   'id', p.id,
                   'name', p.name,
                   'species', p.species,
                   'breed', p.breed,
                   'age', p.age,
                   'weight', p.weight,
                   'observations', p.observations
                 )
               ) as pets
        FROM clients c
        LEFT JOIN pets p ON c.id = p.client_id
        WHERE c.id = ?
        GROUP BY c.id
      `, [id]);
      
      if (rows.length === 0) {
        return null;
      }
      
      const client = rows[0];
      client.pets = JSON.parse(client.pets[0] || '[]');
      return client;
    } catch (error) {
      throw new Error(`Erro ao buscar cliente: ${error.message}`);
    }
  }

  static async findByCpf(cpf) {
    try {
      const [rows] = await db.query('SELECT * FROM clients WHERE cpf = ?', [cpf]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar cliente por CPF: ${error.message}`);
    }
  }

  static async create(clientData) {
    try {
      const { name, cpf, phone, cep, street, neighborhood, city, state, number } = clientData;
      
      const [result] = await db.query(`
        INSERT INTO clients (name, cpf, phone, cep, street, neighborhood, city, state, number)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [name, cpf, phone, cep, street, neighborhood, city, state, number]);
      
      return { id: result.insertId, ...clientData };
    } catch (error) {
      throw new Error(`Erro ao criar cliente: ${error.message}`);
    }
  }

  static async update(id, clientData) {
    try {
      const { name, cpf, phone, cep, street, neighborhood, city, state, number } = clientData;
      
      const [result] = await db.query(`
        UPDATE clients 
        SET name = ?, cpf = ?, phone = ?, cep = ?, street = ?, neighborhood = ?, city = ?, state = ?, number = ?
        WHERE id = ?
      `, [name, cpf, phone, cep, street, neighborhood, city, state, number, id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Cliente não encontrado');
      }
      
      return { id, ...clientData };
    } catch (error) {
      throw new Error(`Erro ao atualizar cliente: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM clients WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Cliente não encontrado');
      }
      
      return true;
    } catch (error) {
      throw new Error(`Erro ao deletar cliente: ${error.message}`);
    }
  }

  static async search(query) {
    try {
      const searchTerm = `%${query}%`;
      const [rows] = await db.query(`
        SELECT c.*, 
               COUNT(p.id) as pets_count
        FROM clients c
        LEFT JOIN pets p ON c.id = p.client_id
        WHERE c.name LIKE ? OR c.cpf LIKE ? OR c.phone LIKE ?
        GROUP BY c.id
        ORDER BY c.name
      `, [searchTerm, searchTerm, searchTerm]);
      
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar clientes: ${error.message}`);
    }
  }

  static async getStats() {
    try {
      const [rows] = await db.query(`
        SELECT 
          COUNT(*) as total_clients,
          COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) as new_today,
          COUNT(DISTINCT DATE(created_at)) as days_with_new_clients
        FROM clients
      `);
      
      return rows[0] || { total_clients: 0, new_today: 0, days_with_new_clients: 0 };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return { total_clients: 0, new_today: 0, days_with_new_clients: 0 };
    }
  }

  static async findDuplicate({ name, cpf, phone }, excludeId = null) {
    // Normalizar os campos
    const cleanCpf = cpf ? cpf.replace(/[^0-9]/g, '') : '';
    const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '';
    let query = `SELECT * FROM clients WHERE (
      LOWER(name) = LOWER(?)
      OR REPLACE(REPLACE(REPLACE(REPLACE(cpf, '.', ''), '-', ''), ' ', '') = ?
      OR REPLACE(REPLACE(REPLACE(REPLACE(phone, '(', ''), ')', ''), '-', ''), ' ', '') = ?
    )`;
    const params = [name, cleanCpf, cleanPhone];
    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }
    const [rows] = await db.query(query, params);
    return rows[0] || null;
  }
}

module.exports = Client; 