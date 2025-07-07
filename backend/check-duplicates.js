const pool = require('./src/config/database');

async function checkDuplicates() {
  try {
    console.log('🔍 Verificando usuários duplicados...\n');
    
    const connection = await pool.getConnection();
    
    // Buscar todos os usuários
    const [users] = await connection.query('SELECT * FROM users ORDER BY email, created_at');
    
    console.log(`📊 Total de usuários no banco: ${users.length}`);
    
    // Agrupar por email
    const emailGroups = {};
    users.forEach(user => {
      if (!emailGroups[user.email]) {
        emailGroups[user.email] = [];
      }
      emailGroups[user.email].push(user);
    });
    
    // Verificar duplicatas
    let hasDuplicates = false;
    Object.keys(emailGroups).forEach(email => {
      const group = emailGroups[email];
      if (group.length > 1) {
        hasDuplicates = true;
        console.log(`\n⚠️  DUPLICATA ENCONTRADA: ${email}`);
        console.log(`   Total de usuários com este email: ${group.length}`);
        
        group.forEach((user, index) => {
          console.log(`   ${index + 1}. ID: ${user.id} | Nome: ${user.name} | Role: ${user.role} | Ativo: ${user.active} | Criado: ${user.created_at}`);
        });
      }
    });
    
    if (!hasDuplicates) {
      console.log('✅ Nenhuma duplicata encontrada!');
    } else {
      console.log('\n💡 Para limpar duplicatas, execute: node clean-duplicates.js');
    }
    
    // Mostrar todos os usuários
    console.log('\n📋 TODOS OS USUÁRIOS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    users.forEach(user => {
      console.log(`   ID: ${user.id} | Email: ${user.email} | Nome: ${user.name} | Role: ${user.role} | Ativo: ${user.active}`);
    });
    
    connection.release();
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

checkDuplicates().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Erro:', error);
  process.exit(1);
}); 