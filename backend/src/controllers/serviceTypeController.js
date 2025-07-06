const ServiceType = require('../models/ServiceType');

const serviceTypeController = {
  // Buscar todos os tipos de serviço
  async getAll(req, res) {
    try {
      const serviceTypes = await ServiceType.findAll();
      res.json(serviceTypes);
    } catch (error) {
      console.error('Erro ao buscar tipos de serviço:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Buscar tipo de serviço por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const serviceType = await ServiceType.findById(id);
      
      if (!serviceType) {
        return res.status(404).json({ error: 'Tipo de serviço não encontrado' });
      }
      
      res.json(serviceType);
    } catch (error) {
      console.error('Erro ao buscar tipo de serviço:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Buscar tipo de serviço por nome
  async getByName(req, res) {
    try {
      const { name } = req.params;
      const serviceType = await ServiceType.findByName(name);
      
      if (!serviceType) {
        return res.status(404).json({ error: 'Tipo de serviço não encontrado' });
      }
      
      res.json(serviceType);
    } catch (error) {
      console.error('Erro ao buscar tipo de serviço por nome:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Criar novo tipo de serviço
  async create(req, res) {
    try {
      const { name, description, default_price } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Nome do serviço é obrigatório' });
      }

      // Verificar se já existe um serviço com esse nome
      const existingService = await ServiceType.findByName(name);
      if (existingService) {
        return res.status(400).json({ error: 'Já existe um serviço com esse nome' });
      }

      const serviceType = await ServiceType.create({
        name,
        description: description || '',
        default_price: default_price || 0.00
      });

      res.status(201).json(serviceType);
    } catch (error) {
      console.error('Erro ao criar tipo de serviço:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Atualizar tipo de serviço
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description, default_price } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Nome do serviço é obrigatório' });
      }

      // Verificar se o serviço existe
      const existingService = await ServiceType.findById(id);
      if (!existingService) {
        return res.status(404).json({ error: 'Tipo de serviço não encontrado' });
      }

      // Verificar se já existe outro serviço com esse nome
      const serviceWithSameName = await ServiceType.findByName(name);
      if (serviceWithSameName && serviceWithSameName.id != id) {
        return res.status(400).json({ error: 'Já existe um serviço com esse nome' });
      }

      const success = await ServiceType.update(id, {
        name,
        description: description || '',
        default_price: default_price || 0.00
      });

      if (!success) {
        return res.status(500).json({ error: 'Erro ao atualizar tipo de serviço' });
      }

      const updatedService = await ServiceType.findById(id);
      res.json(updatedService);
    } catch (error) {
      console.error('Erro ao atualizar tipo de serviço:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Deletar tipo de serviço
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Verificar se o serviço existe
      const existingService = await ServiceType.findById(id);
      if (!existingService) {
        return res.status(404).json({ error: 'Tipo de serviço não encontrado' });
      }

      const success = await ServiceType.delete(id);
      
      if (!success) {
        return res.status(500).json({ error: 'Erro ao deletar tipo de serviço' });
      }

      res.json({ message: 'Tipo de serviço deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar tipo de serviço:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Buscar tipos de serviço
  async search(req, res) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({ error: 'Query de busca é obrigatória' });
      }

      const serviceTypes = await ServiceType.search(q);
      res.json(serviceTypes);
    } catch (error) {
      console.error('Erro ao buscar tipos de serviço:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};

module.exports = serviceTypeController; 