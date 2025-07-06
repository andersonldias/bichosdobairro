const db = require('./src/config/database');

async function testStats() {
  try {
    console.log('🧪 Testando query de estatísticas...\n');
    
    // Teste 1: Verificar se a tabela appointments existe
    console.log('📋 Teste 1: Verificar tabela appointments...');
    const [tables] = await db.execute('SHOW TABLES LIKE "appointments"');
    if (tables.length > 0) {
      console.log('✅ Tabela appointments existe');
    } else {
      console.log('❌ Tabela appointments não existe');
      return;
    }
    
    // Teste 2: Verificar estrutura da tabela
    console.log('\n📋 Teste 2: Verificar estrutura da tabela...');
    const [columns] = await db.execute('DESCRIBE appointments');
    console.log('📝 Colunas da tabela appointments:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type}`);
    });
    
    // Teste 3: Verificar se há dados
    console.log('\n📋 Teste 3: Verificar dados...');
    const [countResult] = await db.execute('SELECT COUNT(*) as count FROM appointments');
    console.log(`📊 Total de agendamentos: ${countResult[0].count}`);
    
    // Teste 4: Testar query de estatísticas
    console.log('\n📋 Teste 4: Testar query de estatísticas...');
    const statsQuery = `
      SELECT 
        COUNT(*) as total_appointments,
        COUNT(CASE WHEN status = 'agendado' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'em_andamento' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'concluido' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'cancelado' THEN 1 END) as cancelled,
        COUNT(CASE WHEN appointment_date = CURDATE() THEN 1 END) as today,
        COALESCE(SUM(total_price), 0) as total_revenue
      FROM appointments
      WHERE status != 'cancelado'
    `;
    
    const [statsResult] = await db.execute(statsQuery);
    console.log('📊 Estatísticas:', JSON.stringify(statsResult[0], null, 2));
    
    // Teste 5: Testar query sem WHERE
    console.log('\n📋 Teste 5: Testar query sem filtro...');
    const statsQueryNoFilter = `
      SELECT 
        COUNT(*) as total_appointments,
        COUNT(CASE WHEN status = 'agendado' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'em_andamento' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'concluido' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'cancelado' THEN 1 END) as cancelled,
        COUNT(CASE WHEN appointment_date = CURDATE() THEN 1 END) as today,
        COALESCE(SUM(total_price), 0) as total_revenue
      FROM appointments
    `;
    
    const [statsResultNoFilter] = await db.execute(statsQueryNoFilter);
    console.log('📊 Estatísticas (sem filtro):', JSON.stringify(statsResultNoFilter[0], null, 2));
    
    console.log('\n✅ Teste concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    process.exit();
  }
}

testStats(); 