const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Buscar usuário por ID
  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT id, name, email, role, active, created_at FROM users WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw new Error('Erro ao buscar usuário: ' + error.message);
    }
  }

  // Buscar usuário por email
  static async findByEmail(email) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM users WHERE email = ? AND active = TRUE',
        [email]
      );
      return rows[0];
    } catch (error) {
      throw new Error('Erro ao buscar usuário: ' + error.message);
    }
  }

  // Criar novo usuário
  static async create(userData) {
    try {
      const { name, email, password, role = 'atendente' } = userData;
      
      // Verificar se email já existe
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new Error('Email já cadastrado');
      }

      // Criptografar senha
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const [result] = await db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role]
      );

      return { id: result.insertId, name, email, role };
    } catch (error) {
      throw new Error('Erro ao criar usuário: ' + error.message);
    }
  }

  // Atualizar usuário
  static async update(id, userData) {
    try {
      const { name, email, role, active } = userData;
      const updates = [];
      const values = [];

      if (name) {
        updates.push('name = ?');
        values.push(name);
      }
      if (email) {
        updates.push('email = ?');
        values.push(email);
      }
      if (role) {
        updates.push('role = ?');
        values.push(role);
      }
      if (active !== undefined) {
        updates.push('active = ?');
        values.push(active);
      }

      if (updates.length === 0) {
        throw new Error('Nenhum campo para atualizar');
      }

      values.push(id);
      const [result] = await db.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      if (result.affectedRows === 0) {
        throw new Error('Usuário não encontrado');
      }

      return await this.findById(id);
    } catch (error) {
      throw new Error('Erro ao atualizar usuário: ' + error.message);
    }
  }

  // Alterar senha
  static async changePassword(id, currentPassword, newPassword) {
    try {
      console.log(`🔐 Alterando senha para usuário ID: ${id}`);
      
      // Buscar usuário com senha
      const [rows] = await db.query(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        throw new Error('Usuário não encontrado');
      }

      const user = rows[0];
      console.log(`   Usuário encontrado: ${user.name} (${user.email})`);

      // Verificar senha atual
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Senha atual incorreta');
      }

      console.log('   Senha atual válida');

      // Criptografar nova senha
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Atualizar senha (APENAS a senha, não criar novo usuário)
      const [updateResult] = await db.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedNewPassword, id]
      );

      if (updateResult.affectedRows === 0) {
        throw new Error('Falha ao atualizar senha');
      }

      console.log(`   Senha atualizada com sucesso para usuário ID: ${id}`);

      // Verificar se não houve duplicação
      const [verifyRows] = await db.query(
        'SELECT COUNT(*) as count FROM users WHERE email = ?',
        [user.email]
      );

      if (verifyRows[0].count > 1) {
        console.error(`   ⚠️  ATENÇÃO: Encontrados ${verifyRows[0].count} usuários com email ${user.email}`);
        throw new Error('Detectada possível duplicação de usuário');
      }

      console.log(`   ✅ Verificação de duplicação: OK (${verifyRows[0].count} usuário)`);

      return { message: 'Senha alterada com sucesso' };
    } catch (error) {
      console.error(`   ❌ Erro ao alterar senha: ${error.message}`);
      throw new Error('Erro ao alterar senha: ' + error.message);
    }
  }

  // Verificar senha
  static async verifyPassword(user, password) {
    try {
      return await bcrypt.compare(password, user.password);
    } catch (error) {
      throw new Error('Erro ao verificar senha: ' + error.message);
    }
  }

  // Listar todos os usuários
  static async findAll() {
    try {
      const [rows] = await db.query(
        'SELECT id, name, email, role, active, created_at FROM users ORDER BY name'
      );
      return rows;
    } catch (error) {
      throw new Error('Erro ao listar usuários: ' + error.message);
    }
  }

  // Desativar usuário
  static async deactivate(id) {
    try {
      const [result] = await db.query(
        'UPDATE users SET active = FALSE WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Usuário não encontrado');
      }

      return { message: 'Usuário desativado com sucesso' };
    } catch (error) {
      throw new Error('Erro ao desativar usuário: ' + error.message);
    }
  }

  // Ativar usuário
  static async activate(id) {
    try {
      const [result] = await db.query(
        'UPDATE users SET active = TRUE WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Usuário não encontrado');
      }

      return { message: 'Usuário ativado com sucesso' };
    } catch (error) {
      throw new Error('Erro ao ativar usuário: ' + error.message);
    }
  }

  // Buscar estatísticas de usuários
  static async getStats() {
    try {
      const [total] = await db.query('SELECT COUNT(*) as total FROM users');
      const [active] = await db.query('SELECT COUNT(*) as active FROM users WHERE active = TRUE');
      const [admins] = await db.query('SELECT COUNT(*) as admins FROM users WHERE role = "admin"');
      const [vets] = await db.query('SELECT COUNT(*) as vets FROM users WHERE role = "veterinario"');
      const [attendants] = await db.query('SELECT COUNT(*) as attendants FROM users WHERE role = "atendente"');

      return {
        total: total[0].total,
        active: active[0].active,
        inactive: total[0].total - active[0].active,
        admins: admins[0].admins,
        veterinarios: vets[0].vets,
        atendentes: attendants[0].attendants
      };
    } catch (error) {
      throw new Error('Erro ao buscar estatísticas: ' + error.message);
    }
  }
}

module.exports = User; 