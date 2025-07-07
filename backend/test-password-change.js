const pool = require('./src/config/database');
const bcrypt = require('bcryptjs');

async function testPasswordChange() {
  try {
    console.log('🧪 Testando alteração de senha...\n');
    
    const connection = await pool.getConnection();
    
    // Buscar usuário admin
    const [users] = await connection.query(
      'SELECT * FROM users WHERE role = "admin" ORDER BY created_at DESC LIMIT 1'
    );
    
    if (users.length === 0) {
      console.log('❌ Nenhum usuário admin encontrado!');
      return;
    }
    
    const admin = users[0];
    console.log(`📋 Usuário para teste: ${admin.name} (${admin.email})`);
    
    // Verificar usuários antes do teste
    const [beforeCount] = await connection.query(
      'SELECT COUNT(*) as count FROM users WHERE email = ?',
      [admin.email]
    );
    
    console.log(`📊 Usuários com este email antes do teste: ${beforeCount[0].count}`);
    
    // Simular alteração de senha
    const currentPassword = 'Bichos2024!';
    const newPassword = 'Teste123!';
    
    // Verificar senha atual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isCurrentPasswordValid) {
      console.log('❌ Senha atual incorreta!');
      return;
    }
    
    console.log('✅ Senha atual válida');
    
    // Criptografar nova senha
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Atualizar senha
    const [updateResult] = await connection.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedNewPassword, admin.id]
    );
    
    if (updateResult.affectedRows === 0) {
      console.log('❌ Falha ao atualizar senha');
      return;
    }
    
    console.log('✅ Senha atualizada com sucesso');
    
    // Verificar usuários após o teste
    const [afterCount] = await connection.query(
      'SELECT COUNT(*) as count FROM users WHERE email = ?',
      [admin.email]
    );
    
    console.log(`📊 Usuários com este email após o teste: ${afterCount[0].count}`);
    
    if (afterCount[0].count > beforeCount[0].count) {
      console.log('❌ DUPLICAÇÃO DETECTADA!');
    } else {
      console.log('✅ Nenhuma duplicação detectada');
    }
    
    // Voltar a senha original
    const originalPassword = await bcrypt.hash(currentPassword, saltRounds);
    await connection.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [originalPassword, admin.id]
    );
    
    console.log('✅ Senha restaurada para o valor original');
    
    connection.release();
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testPasswordChange().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Erro:', error);
  process.exit(1);
}); 