const bcrypt = require('bcryptjs');
const pool = require('./src/config/database');

async function createAdminUser() {
  try {
    console.log('🔧 Criando usuário administrador...');
    
    const connection = await pool.getConnection();
    
    // Dados do admin
    const adminData = {
      name: 'Administrador',
      email: 'admin@petshop.com',
      password: 'admin123',
      role: 'admin'
    };
    
    // Verificar se já existe um admin
    const [existingAdmin] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [adminData.email]
    );
    
    if (existingAdmin.length > 0) {
      console.log('⚠️  Usuário administrador já existe!');
      console.log('📧 Email: admin@petshop.com');
      console.log('🔑 Senha: admin123');
      connection.release();
      return;
    }
    
    // Criptografar senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);
    
    // Inserir admin
    const [result] = await connection.query(
      'INSERT INTO users (name, email, password, role, active) VALUES (?, ?, ?, ?, TRUE)',
      [adminData.name, adminData.email, hashedPassword, adminData.role]
    );
    
    console.log('✅ Usuário administrador criado com sucesso!');
    console.log('');
    console.log('📋 Credenciais de acesso:');
    console.log('📧 Email: admin@petshop.com');
    console.log('🔑 Senha: admin123');
    console.log('');
    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
    
    connection.release();
    
  } catch (error) {
    console.error('❌ Erro ao criar usuário administrador:', error.message);
    
    if (error.message.includes('Table \'users\' doesn\'t exist')) {
      console.log('\n🔧 Solução: Execute primeiro o script de criação das tabelas:');
      console.log('   npm run db:setup');
    }
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createAdminUser().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('Erro:', error);
    process.exit(1);
  });
}

module.exports = createAdminUser; 