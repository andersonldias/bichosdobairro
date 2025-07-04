const fs = require('fs').promises;
const path = require('path');
const pool = require('./database');

async function setupDatabase() {
  try {
    console.log('🚀 Iniciando configuração do banco de dados...');
    
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, '../../database.sql');
    const sqlContent = await fs.readFile(sqlPath, 'utf8');
    
    // Dividir o SQL em comandos individuais
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--') && !cmd.startsWith('CREATE DATABASE') && !cmd.startsWith('USE'));
    
    const connection = await pool.getConnection();
    
    console.log(`📝 Executando ${commands.length} comandos SQL...`);
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.trim()) {
        try {
          await connection.query(command);
          console.log(`✅ Comando ${i + 1}/${commands.length} executado com sucesso`);
        } catch (error) {
          // Ignorar erros de tabela já existente
          if (!error.message.includes('already exists')) {
            console.log(`⚠️  Erro no comando ${i + 1}: ${error.message}`);
          }
        }
      }
    }
    
    // Verificar se as tabelas foram criadas
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`📊 Tabelas criadas: ${tables.length}`);
    
    // Verificar dados iniciais
    const [serviceTypes] = await connection.query('SELECT COUNT(*) as count FROM service_types');
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
    
    console.log(`🔧 Tipos de serviço: ${serviceTypes[0].count}`);
    console.log(`👥 Usuários: ${users[0].count}`);
    
    connection.release();
    
    console.log('✅ Configuração do banco de dados concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro na configuração do banco:', error.message);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase; 