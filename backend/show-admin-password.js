const pool = require('./src/config/database');

async function showAdminPassword() {
  try {
    console.log('🔍 Buscando informações do administrador...\n');
    
    const connection = await pool.getConnection();
    
    // Buscar usuário admin
    const [users] = await connection.query(
      'SELECT * FROM users WHERE role = "admin" ORDER BY created_at DESC LIMIT 1'
    );
    
    if (users.length === 0) {
      console.log('❌ Nenhum usuário administrador encontrado!');
      return;
    }
    
    const admin = users[0];
    
    console.log('📋 INFORMAÇÕES DO ADMINISTRADOR:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Nome: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Ativo: ${admin.active ? '✅ Sim' : '❌ Não'}`);
    console.log(`   Criado em: ${admin.created_at}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('🔑 CREDENCIAIS DE ACESSO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Senha: Bichos2024!`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('💡 Use essas credenciais para fazer login no sistema!');
    
    connection.release();
    
  } catch (error) {
    console.error('❌ Erro ao buscar admin:', error.message);
  }
}

showAdminPassword().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Erro:', error);
  process.exit(1);
}); 