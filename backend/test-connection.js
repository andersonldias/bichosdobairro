const pool = require('./src/config/database');

async function testDatabaseConnection() {
  console.log('🔍 Testando conexão com o banco de dados...');
  
  try {
    // Testar conexão básica
    const connection = await pool.getConnection();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Testar query simples
    const [result] = await connection.query('SELECT 1 as test');
    console.log('✅ Query de teste executada:', result[0]);
    
    // Verificar versão do MySQL
    const [version] = await connection.query('SELECT VERSION() as version');
    console.log('✅ Versão do MySQL:', version[0].version);
    
    // Verificar bancos disponíveis
    const [databases] = await connection.query('SHOW DATABASES');
    console.log('📊 Bancos disponíveis:', databases.map(db => db.Database).join(', '));
    
    // Verificar se o banco petshop_db existe
    const [petshopDb] = await connection.query('SHOW DATABASES LIKE "petshop_db"');
    if (petshopDb.length > 0) {
      console.log('✅ Banco petshop_db encontrado!');
      
      // Usar o banco
      await connection.query('USE petshop_db');
      
      // Verificar tabelas
      const [tables] = await connection.query('SHOW TABLES');
      console.log('📋 Tabelas encontradas:', tables.length);
      
      if (tables.length > 0) {
        tables.forEach(table => {
          const tableName = Object.values(table)[0];
          console.log(`   - ${tableName}`);
        });
      }
    } else {
      console.log('⚠️  Banco petshop_db não encontrado');
    }
    
    connection.release();
    console.log('✅ Teste concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    console.log('\n🔧 Possíveis soluções:');
    console.log('1. Verifique se o MySQL está rodando');
    console.log('2. Verifique as credenciais no arquivo .env');
    console.log('3. Para banco externo, configure DB_HOST, DB_USER, DB_PASSWORD');
    console.log('4. Para SSL, configure DB_SSL=true no .env');
  }
}

// Executar teste
testDatabaseConnection(); 