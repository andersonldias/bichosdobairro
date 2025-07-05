const db = require('./src/config/database');

async function checkTables() {
  try {
    console.log('🔍 Verificando estrutura das tabelas...\n');
    
    // Verificar tabela pets
    console.log('📋 Estrutura da tabela PETS:');
    const [petsStructure] = await db.query('DESCRIBE pets');
    console.table(petsStructure);
    
    console.log('\n📋 Estrutura da tabela CLIENTS:');
    const [clientsStructure] = await db.query('DESCRIBE clients');
    console.table(clientsStructure);
    
    // Verificar relacionamento
    console.log('\n🔗 Verificando relacionamento entre tabelas:');
    const [foreignKeys] = await db.query(`
      SELECT 
        TABLE_NAME,
        COLUMN_NAME,
        CONSTRAINT_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM information_schema.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = 'bichosdobairro2' 
      AND REFERENCED_TABLE_NAME IS NOT NULL
      AND TABLE_NAME = 'pets'
    `);
    
    console.log('Chaves estrangeiras da tabela pets:');
    console.table(foreignKeys);
    
    // Verificar dados de exemplo
    console.log('\n📊 Dados de exemplo:');
    const [petsCount] = await db.query('SELECT COUNT(*) as total FROM pets');
    const [clientsCount] = await db.query('SELECT COUNT(*) as total FROM clients');
    
    console.log(`Total de pets: ${petsCount[0].total}`);
    console.log(`Total de clientes: ${clientsCount[0].total}`);
    
    if (petsCount[0].total > 0) {
      const [samplePets] = await db.query(`
        SELECT p.*, c.name as client_name 
        FROM pets p 
        LEFT JOIN clients c ON p.client_id = c.id 
        LIMIT 3
      `);
      console.log('\nExemplo de pets com seus clientes:');
      console.table(samplePets);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

checkTables(); 