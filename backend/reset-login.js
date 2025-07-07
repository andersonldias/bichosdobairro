const bcrypt = require('bcryptjs');
const pool = require('./src/config/database');

async function resetLoginSystem() {
  try {
    console.log('🔧 Resetando sistema de login...\n');
    
    const connection = await pool.getConnection();
    
    // 1. Limpar tabela de rate limiting (se existir)
    try {
      await connection.query('DELETE FROM rate_limit_logs WHERE ip_address LIKE "%"');
      console.log('✅ Cache de rate limiting limpo');
    } catch (error) {
      console.log('ℹ️  Tabela de rate limiting não encontrada (normal)');
    }
    
    // 2. Deletar usuário admin antigo
    await connection.query('DELETE FROM users WHERE email = ?', ['admin@petshop.com']);
    console.log('✅ Usuário admin antigo removido');
    
    // 3. Criar novo usuário admin com credenciais diferentes
    const newAdminData = {
      name: 'Administrador Sistema',
      email: 'admin@bichosdobairro.com.br',
      password: 'Bichos2024!',
      role: 'admin'
    };
    
    // Criptografar senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newAdminData.password, saltRounds);
    
    // Criar novo admin
    const [result] = await connection.query(
      'INSERT INTO users (name, email, password, role, active) VALUES (?, ?, ?, ?, TRUE)',
      [newAdminData.name, newAdminData.email, hashedPassword, newAdminData.role]
    );
    
    console.log('✅ Novo usuário administrador criado!');
    
    // 4. Verificar se foi criado corretamente
    const [verification] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [newAdminData.email]
    );
    
    if (verification.length > 0) {
      const user = verification[0];
      const isPasswordValid = await bcrypt.compare(newAdminData.password, user.password);
      
      console.log('\n📋 Verificação do novo usuário:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Nome: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Ativo: ${user.active ? '✅ Sim' : '❌ Não'}`);
      console.log(`   Senha válida: ${isPasswordValid ? '✅ Sim' : '❌ Não'}`);
      
      if (isPasswordValid && user.active) {
        console.log('\n🎉 Sistema de login resetado com sucesso!');
        console.log('\n📋 NOVAS CREDENCIAIS DE ACESSO:');
        console.log('   Email: admin@bichosdobairro.com.br');
        console.log('   Senha: Bichos2024!');
        console.log('\n⚠️  IMPORTANTE: Use essas novas credenciais para fazer login!');
      } else {
        console.log('\n❌ Problema na criação do usuário.');
      }
    }
    
    connection.release();
    
  } catch (error) {
    console.error('❌ Erro ao resetar sistema de login:', error.message);
    
    if (error.message.includes('Table \'users\' doesn\'t exist')) {
      console.log('\n🔧 Solução: Execute primeiro o script de criação das tabelas:');
      console.log('   npm run db:setup');
    }
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  resetLoginSystem().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('Erro:', error);
    process.exit(1);
  });
}

module.exports = resetLoginSystem; 