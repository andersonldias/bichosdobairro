const Client = require('../models/Client');

class ClientController {
  // Listar todos os clientes
  static async index(req, res) {
    try {
      const clients = await Client.findAll();
      res.json({
        success: true,
        data: clients,
        message: 'Clientes listados com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Buscar cliente por ID
  static async show(req, res) {
    try {
      const { id } = req.params;
      const client = await Client.findById(id);
      
      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }
      
      res.json({
        success: true,
        data: client,
        message: 'Cliente encontrado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Criar novo cliente
  static async store(req, res) {
    try {
      const clientData = req.body;
      
      // Validações básicas
      if (!clientData.name || !clientData.cpf || !clientData.phone) {
        return res.status(400).json({
          success: false,
          message: 'Nome, CPF e telefone são obrigatórios'
        });
      }
      
      // Verificar se CPF já existe
      const existingClient = await Client.findByCpf(clientData.cpf);
      if (existingClient) {
        return res.status(400).json({
          success: false,
          message: 'CPF já cadastrado'
        });
      }
      
      const newClient = await Client.create(clientData);
      
      res.status(201).json({
        success: true,
        data: newClient,
        message: 'Cliente criado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Atualizar cliente
  static async update(req, res) {
    try {
      const { id } = req.params;
      const clientData = req.body;
      
      // Validações básicas
      if (!clientData.name || !clientData.cpf || !clientData.phone) {
        return res.status(400).json({
          success: false,
          message: 'Nome, CPF e telefone são obrigatórios'
        });
      }
      
      // Verificar se CPF já existe em outro cliente
      const existingClient = await Client.findByCpf(clientData.cpf);
      if (existingClient && existingClient.id != id) {
        return res.status(400).json({
          success: false,
          message: 'CPF já cadastrado para outro cliente'
        });
      }
      
      const updatedClient = await Client.update(id, clientData);
      
      res.json({
        success: true,
        data: updatedClient,
        message: 'Cliente atualizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Deletar cliente
  static async destroy(req, res) {
    try {
      const { id } = req.params;
      await Client.delete(id);
      
      res.json({
        success: true,
        message: 'Cliente deletado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Buscar clientes
  static async search(req, res) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Termo de busca é obrigatório'
        });
      }
      
      const clients = await Client.search(q);
      
      res.json({
        success: true,
        data: clients,
        message: 'Busca realizada com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Estatísticas dos clientes
  static async stats(req, res) {
    try {
      const stats = await Client.getStats();
      
      res.json({
        success: true,
        data: stats,
        message: 'Estatísticas obtidas com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = ClientController; 