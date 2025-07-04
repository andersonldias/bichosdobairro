const Pet = require('../models/Pet');

class PetController {
  // Listar todos os pets
  static async index(req, res) {
    try {
      const pets = await Pet.findAll();
      res.json({ success: true, data: pets });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Buscar pet por ID
  static async show(req, res) {
    try {
      const { id } = req.params;
      const pet = await Pet.findById(id);
      if (!pet) {
        return res.status(404).json({ success: false, message: 'Pet não encontrado' });
      }
      res.json({ success: true, data: pet });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Buscar pets por cliente
  static async byClient(req, res) {
    try {
      const { clientId } = req.params;
      const pets = await Pet.findByClientId(clientId);
      res.json({ success: true, data: pets });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Criar pet
  static async store(req, res) {
    try {
      const pet = await Pet.create(req.body);
      res.status(201).json({ success: true, data: pet });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Atualizar pet
  static async update(req, res) {
    try {
      const { id } = req.params;
      const pet = await Pet.update(id, req.body);
      res.json({ success: true, data: pet });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Deletar pet
  static async destroy(req, res) {
    try {
      const { id } = req.params;
      await Pet.delete(id);
      res.json({ success: true, message: 'Pet deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Buscar pets (search)
  static async search(req, res) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ success: false, message: 'Termo de busca é obrigatório' });
      }
      const pets = await Pet.search(q);
      res.json({ success: true, data: pets });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Estatísticas de pets
  static async stats(req, res) {
    try {
      const stats = await Pet.getStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Listar espécies
  static async species(req, res) {
    try {
      const species = await Pet.getSpecies();
      res.json({ success: true, data: species });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Listar raças
  static async breeds(req, res) {
    try {
      const breeds = await Pet.getBreeds();
      res.json({ success: true, data: breeds });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = PetController; 