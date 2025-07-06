const Client = require('../models/Client');
const Pet = require('../models/Pet');
const db = require('../config/database');

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
      const pets = clientData.pets || [];
      
      console.log('Dados do cliente recebidos:', clientData);
      console.log('Pets recebidos:', pets);
      
      // Validações básicas
      if (!clientData.name || !clientData.cpf || !clientData.phone) {
        return res.status(400).json({
          success: false,
          message: 'Nome, CPF e telefone são obrigatórios'
        });
      }
      
      // Verificar duplicidade
      const duplicate = await Client.findDuplicate(clientData);
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: 'Já existe um cliente com o mesmo Nome, CPF ou Telefone',
          duplicate
        });
      }
      
      // Criar cliente
      const newClient = await Client.create(clientData);
      console.log('Cliente criado:', newClient);
      
      // Criar pets se houver
      const createdPets = [];
      if (pets.length > 0) {
        for (const petData of pets) {
          console.log('Criando pet:', petData);
          const petWithClientId = { ...petData, client_id: newClient.id };
          console.log('Pet com client_id:', petWithClientId);
          const newPet = await Pet.create(petWithClientId);
          createdPets.push(newPet);
          console.log('Pet criado:', newPet);
        }
      }
      
      // Retornar cliente com pets
      const clientWithPets = {
        ...newClient,
        pets: createdPets
      };
      
      res.status(201).json({
        success: true,
        data: clientWithPets,
        message: 'Cliente criado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
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
      
      // Verificar duplicidade (exceto o próprio)
      const duplicate = await Client.findDuplicate(clientData, id);
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: 'Já existe um cliente com o mesmo Nome, CPF ou Telefone',
          duplicate
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

  // Checar duplicidade de campo individual
  static async checkDuplicateField(req, res) {
    try {
      const { field, value } = req.body;
      if (!field || !value) {
        return res.status(400).json({ success: false, message: 'Campo e valor são obrigatórios' });
      }
      let query = '';
      let param = value;
      if (field === 'name') {
        query = 'SELECT * FROM clients WHERE LOWER(name) = LOWER(?)';
      } else if (field === 'cpf') {
        param = value.replace(/[^0-9]/g, '');
        query = 'SELECT * FROM clients WHERE REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(cpf, ".", ""), "-", ""), "/", ""), " ", ""), "_", ""), ",", "") = ?';
      } else if (field === 'phone') {
        param = value.replace(/[^0-9]/g, '');
        query = 'SELECT * FROM clients WHERE REPLACE(REPLACE(REPLACE(REPLACE(phone, "(", ""), ")", ""), "-", ""), " ", "") = ?';
      } else {
        return res.status(400).json({ success: false, message: 'Campo inválido' });
      }
      const [rows] = await db.query(query, [param]);
      if (rows.length > 0) {
        return res.json({ duplicate: true, client: rows[0] });
      }
      return res.json({ duplicate: false });
    } catch (error) {
      console.error('Erro em checkDuplicateField:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = ClientController; 