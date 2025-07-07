const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

class AuthController {
  // Login de usuário
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validações básicas
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email e senha são obrigatórios'
        });
      }

      // Buscar usuário por email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email ou senha incorretos'
        });
      }

      // Verificar se usuário está ativo
      if (!user.active) {
        return res.status(401).json({
          success: false,
          message: 'Usuário inativo. Entre em contato com o administrador.'
        });
      }

      // Verificar senha
      const isPasswordValid = await User.verifyPassword(user, password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Email ou senha incorretos'
        });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { 
          userId: user.id,
          email: user.email,
          role: user.role
        },
        config.security.jwtSecret,
        { expiresIn: config.security.jwtExpiresIn }
      );

      // Retornar dados do usuário (sem senha) e token
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
        created_at: user.created_at
      };

      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          user: userData,
          token: token,
          expiresIn: config.security.jwtExpiresIn
        }
      });

    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Registrar novo usuário (apenas admin)
  static async register(req, res) {
    try {
      const { name, email, password, role = 'atendente' } = req.body;

      // Validações
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Nome, email e senha são obrigatórios'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Senha deve ter pelo menos 6 caracteres'
        });
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Email inválido'
        });
      }

      // Validar role
      const validRoles = ['admin', 'veterinario', 'atendente'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Tipo de usuário inválido'
        });
      }

      // Criar usuário
      const newUser = await User.create({
        name,
        email,
        password,
        role
      });

      res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        data: newUser
      });

    } catch (error) {
      console.error('Erro no registro:', error);
      
      if (error.message.includes('Email já cadastrado')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Verificar token atual
  static async verifyToken(req, res) {
    try {
      // O middleware de autenticação já verificou o token
      // e adicionou o usuário à requisição
      const user = req.user;

      res.json({
        success: true,
        message: 'Token válido',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            active: user.active,
            created_at: user.created_at
          }
        }
      });

    } catch (error) {
      console.error('Erro na verificação do token:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Alterar senha
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Validações
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Senha atual e nova senha são obrigatórias'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Nova senha deve ter pelo menos 6 caracteres'
        });
      }

      // Alterar senha
      const result = await User.changePassword(userId, currentPassword, newPassword);

      res.json({
        success: true,
        message: result.message
      });

    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      
      if (error.message.includes('Senha atual incorreta')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Listar usuários (apenas admin)
  static async listUsers(req, res) {
    try {
      const users = await User.findAll();

      res.json({
        success: true,
        message: 'Usuários listados com sucesso',
        data: users
      });

    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Buscar usuário por ID (apenas admin)
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Usuário encontrado',
        data: user
      });

    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar usuário (apenas admin)
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Remover campos que não devem ser atualizados via API
      delete updateData.password;
      delete updateData.created_at;

      const updatedUser = await User.update(id, updateData);

      res.json({
        success: true,
        message: 'Usuário atualizado com sucesso',
        data: updatedUser
      });

    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      
      if (error.message.includes('Usuário não encontrado')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Ativar/Desativar usuário (apenas admin)
  static async toggleUserStatus(req, res) {
    try {
      const { id } = req.params;
      const { active } = req.body;

      let result;
      if (active) {
        result = await User.activate(id);
      } else {
        result = await User.deactivate(id);
      }

      res.json({
        success: true,
        message: result.message
      });

    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error);
      
      if (error.message.includes('Usuário não encontrado')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Estatísticas de usuários (apenas admin)
  static async getUserStats(req, res) {
    try {
      const stats = await User.getStats();

      res.json({
        success: true,
        message: 'Estatísticas obtidas com sucesso',
        data: stats
      });

    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Logout (client-side apenas, pois JWT é stateless)
  static async logout(req, res) {
    try {
      // Em uma implementação mais avançada, você poderia
      // adicionar o token a uma blacklist
      res.json({
        success: true,
        message: 'Logout realizado com sucesso'
      });

    } catch (error) {
      console.error('Erro no logout:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = AuthController; 