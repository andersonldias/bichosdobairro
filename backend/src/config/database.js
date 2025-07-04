const mysql = require('mysql2/promise');
const config = require('./config');

// Configurações do banco de dados
const dbConfig = {
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  port: config.database.port,
  waitForConnections: true,
  connectionLimit: config.database.connectionLimit,
  queueLimit: config.database.queueLimit,
  // Configurações adicionais para conexões externas
  ssl: config.database.ssl ? {
    rejectUnauthorized: false
  } : false,
  // Configurações para timezone
  timezone: config.database.timezone,
  // Configurações para charset
  charset: config.database.charset
};

console.log('🔧 Configurações do banco de dados:');
console.log(`   Host: ${dbConfig.host}`);
console.log(`   Port: ${dbConfig.port}`);
console.log(`   Database: ${dbConfig.database}`);
console.log(`   User: ${dbConfig.user}`);
console.log(`   SSL: ${dbConfig.ssl ? 'Habilitado' : 'Desabilitado'}`);

const pool = mysql.createPool(dbConfig);

// Testar conexão
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexão com banco de dados estabelecida com sucesso!');
    
    // Verificar se o banco existe
    const [databases] = await connection.query('SHOW DATABASES LIKE ?', [dbConfig.database]);
    
    if (databases.length === 0) {
      console.log('⚠️  Banco de dados não encontrado. Criando...');
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
      console.log(`✅ Banco de dados '${dbConfig.database}' criado com sucesso!`);
    } else {
      console.log(`✅ Banco de dados '${dbConfig.database}' encontrado!`);
    }
    
    // Usar o banco de dados
    await connection.query(`USE ${dbConfig.database}`);
    
    // Verificar se as tabelas existem
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`📊 Tabelas encontradas: ${tables.length}`);
    
    if (tables.length === 0) {
      console.log('⚠️  Nenhuma tabela encontrada. Execute o script database.sql para criar as tabelas.');
    }
    
    connection.release();
  } catch (err) {
    console.error('❌ Erro ao conectar com banco de dados:', err.message);
    console.log('\n🔧 Soluções possíveis:');
    console.log('1. Verifique se o MySQL está rodando');
    console.log('2. Verifique as credenciais no arquivo .env');
    console.log('3. Para banco externo, configure DB_HOST, DB_USER, DB_PASSWORD');
    console.log('4. Para SSL, configure DB_SSL=true no .env');
    
    // Em desenvolvimento, podemos continuar sem o banco
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  Continuando em modo desenvolvimento sem banco de dados...');
    }
  }
}

// Executar teste de conexão
testConnection();

module.exports = pool; 