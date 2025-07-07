const bcrypt = require('bcryptjs');
const pool = require('./src/config/database');

async function fixAdminUser() {
  try {
    console.log('🔧 Verificando e corrigindo usuário administrador...\n');
    
    const connection = await pool.getConnection();
    
    // Dados do admin
    const adminData = {
      name: 'Administrador',
      email: 'admin@petshop.com',
      password: 'admin123',
      role: 'admin'
    };
    
    // Verificar se o admin existe
    const [existingAdmin] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [adminData.email]
    );
    
    if (existingAdmin.length > 0) {
      console.log('📋 Usuário admin encontrado:');
      console.log(`   ID: ${existingAdmin[0].id}`);
      console.log(`   Nome: ${existingAdmin[0].name}`);
      console.log(`   Email: ${existingAdmin[0].email}`);
      console.log(`   Role: ${existingAdmin[0].role}`);
      console.log(`   Ativo: ${existingAdmin[0].active ? 'Sim' : 'Não'}`);
      console.log(`   Criado em: ${existingAdmin[0].created_at}`);
      
      // Verificar se a senha está correta
      const isPasswordValid = await bcrypt.compare(adminData.password, existingAdmin[0].password);
      
      if (isPasswordValid) {
        console.log('✅ Senha está correta!');
      } else {
        console.log('❌ Senha incorreta. Atualizando...');
        
        // Criptografar nova senha
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);
        
        // Atualizar senha
        await connection.query(
          'UPDATE users SET password = ? WHERE email = ?',
          [hashedPassword, adminData.email]
        );
        
        console.log('✅ Senha atualizada com sucesso!');
      }
      
      // Garantir que o usuário está ativo
      if (!existingAdmin[0].active) {
        console.log('⚠️  Usuário estava inativo. Ativando...');
        await connection.query(
          'UPDATE users SET active = TRUE WHERE email = ?',
          [adminData.email]
        );
        console.log('✅ Usuário ativado!');
      }
      
    } else {
      console.log('❌ Usuário admin não encontrado. Criando...');
      
      // Criptografar senha
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);
      
      // Criar admin
      const [result] = await connection.query(
        'INSERT INTO users (name, email, password, role, active) VALUES (?, ?, ?, ?, TRUE)',
        [adminData.name, adminData.email, hashedPassword, adminData.role]
      );
      
      console.log('✅ Usuário administrador criado com sucesso!');
    }
    
    // Verificar novamente
    const [finalCheck] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [adminData.email]
    );
    
    if (finalCheck.length > 0) {
      const user = finalCheck[0];
      const isPasswordValid = await bcrypt.compare(adminData.password, user.password);
      
      console.log('\n📋 Verificação final:');
      console.log(`   Email: ${user.email}`);
      console.log(`   Senha válida: ${isPasswordValid ? '✅ Sim' : '❌ Não'}`);
      console.log(`   Ativo: ${user.active ? '✅ Sim' : '❌ Não'}`);
      console.log(`   Role: ${user.role}`);
      
      if (isPasswordValid && user.active) {
        console.log('\n🎉 Usuário admin está funcionando corretamente!');
        console.log('\n📋 Credenciais de acesso:');
        console.log('   Email: admin@petshop.com');
        console.log('   Senha: admin123');
      } else {
        console.log('\n❌ Ainda há problemas com o usuário admin.');
      }
    }
    
    connection.release();
    
  } catch (error) {
    console.error('❌ Erro ao corrigir usuário admin:', error.message);
    
    if (error.message.includes('Table \'users\' doesn\'t exist')) {
      console.log('\n🔧 Solução: Execute primeiro o script de criação das tabelas:');
      console.log('   npm run db:setup');
    }
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  fixAdminUser().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('Erro:', error);
    process.exit(1);
  });
}

module.exports = fixAdminUser; 