const db = require('../config/database');

class Pet {
  static async findAll() {
    try {
      const [rows] = await db.query(`
        SELECT p.*, c.name as client_name, c.phone as client_phone
        FROM pets p
        JOIN clients c ON p.client_id = c.id
        ORDER BY p.name
      `);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar pets: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query(`
        SELECT p.*, c.name as client_name, c.phone as client_phone
        FROM pets p
        JOIN clients c ON p.client_id = c.id
        WHERE p.id = ?
      `, [id]);
      
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar pet: ${error.message}`);
    }
  }

  static async findByClientId(clientId) {
    try {
      const [rows] = await db.query(`
        SELECT p.*, c.name as client_name
        FROM pets p
        JOIN clients c ON p.client_id = c.id
        WHERE p.client_id = ?
        ORDER BY p.name
      `, [clientId]);
      
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar pets do cliente: ${error.message}`);
    }
  }

  static async create(petData) {
    try {
      const { client_id, name, species, breed, age, weight, observations } = petData;
      
      const [result] = await db.query(`
        INSERT INTO pets (client_id, name, species, breed, age, weight, observations)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [client_id, name, species, breed, age, weight, observations]);
      
      return { id: result.insertId, ...petData };
    } catch (error) {
      throw new Error(`Erro ao criar pet: ${error.message}`);
    }
  }

  static async update(id, petData) {
    try {
      const { client_id, name, species, breed, age, weight, observations } = petData;
      
      const [result] = await db.query(`
        UPDATE pets 
        SET client_id = ?, name = ?, species = ?, breed = ?, age = ?, weight = ?, observations = ?
        WHERE id = ?
      `, [client_id, name, species, breed, age, weight, observations, id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Pet não encontrado');
      }
      
      return { id, ...petData };
    } catch (error) {
      throw new Error(`Erro ao atualizar pet: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM pets WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Pet não encontrado');
      }
      
      return true;
    } catch (error) {
      throw new Error(`Erro ao deletar pet: ${error.message}`);
    }
  }

  static async search(query) {
    try {
      const searchTerm = `%${query}%`;
      const [rows] = await db.query(`
        SELECT p.*, c.name as client_name, c.phone as client_phone
        FROM pets p
        JOIN clients c ON p.client_id = c.id
        WHERE p.name LIKE ? OR p.species LIKE ? OR p.breed LIKE ? OR c.name LIKE ?
        ORDER BY p.name
      `, [searchTerm, searchTerm, searchTerm, searchTerm]);
      
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar pets: ${error.message}`);
    }
  }

  static async getStats() {
    try {
      const [rows] = await db.query(`
        SELECT 
          COUNT(*) as total_pets,
          COUNT(DISTINCT species) as species_count,
          COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) as new_today,
          species,
          COUNT(*) as count_by_species
        FROM pets
        GROUP BY species
        ORDER BY count_by_species DESC
      `);
      
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar estatísticas: ${error.message}`);
    }
  }

  static async getSpecies() {
    try {
      const [rows] = await db.query(`
        SELECT DISTINCT species
        FROM pets
        ORDER BY species
      `);
      
      return rows.map(row => row.species);
    } catch (error) {
      throw new Error(`Erro ao buscar espécies: ${error.message}`);
    }
  }

  static async getBreeds() {
    try {
      const [rows] = await db.query(`
        SELECT DISTINCT breed
        FROM pets
        WHERE breed IS NOT NULL AND breed != ''
        ORDER BY breed
      `);
      
      return rows.map(row => row.breed);
    } catch (error) {
      throw new Error(`Erro ao buscar raças: ${error.message}`);
    }
  }
}

module.exports = Pet; 