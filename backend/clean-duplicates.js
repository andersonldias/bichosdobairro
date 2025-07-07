const pool = require('./src/config/database');

async function cleanDuplicates() {
  try {
    console.log('🧹 Limpando usuários duplicados...\n');
    
    const connection = await pool.getConnection();
    
    // Deletar todos os usuários com o email admin
    await connection.query('DELETE FROM users WHERE email LIKE "%admin%"');
    console.log('✅ Usuários admin removidos');
    
    // Criar novo usuário admin
    const bcrypt = require('bcryptjs');
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('Bichos2024!', saltRounds);
    
    const [result] = await connection.query(
      'INSERT INTO users (name, email, password, role, active) VALUES (?, ?, ?, ?, TRUE)',
      ['Administrador Sistema', 'admin@bichosdobairro.com.br', hashedPassword, 'admin']
    );
    
    console.log('✅ Novo usuário admin criado');
    
    // Verificar
    const [users] = await connection.query('SELECT * FROM users WHERE email LIKE "%admin%"');
    console.log(`📊 Total de usuários admin: ${users.length}`);
    
    connection.release();
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

cleanDuplicates().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Erro:', error);
  process.exit(1);
}); 