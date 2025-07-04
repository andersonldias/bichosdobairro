const pool = require('./src/config/database');

async function clearSampleData() {
  try {
    console.log('🧹 Limpando dados de exemplo do banco de dados...');
    
    const connection = await pool.getConnection();
    
    // Verificar dados existentes antes de limpar
    console.log('📊 Verificando dados existentes...');
    
    const [clients] = await connection.query('SELECT COUNT(*) as count FROM clients');
    const [pets] = await connection.query('SELECT COUNT(*) as count FROM pets');
    const [appointments] = await connection.query('SELECT COUNT(*) as count FROM appointments');
    const [cashRegister] = await connection.query('SELECT COUNT(*) as count FROM cash_register');
    const [serviceHistory] = await connection.query('SELECT COUNT(*) as count FROM service_history');
    
    console.log(`📋 Dados encontrados:`);
    console.log(`   - Clientes: ${clients[0].count}`);
    console.log(`   - Pets: ${pets[0].count}`);
    console.log(`   - Agendamentos: ${appointments[0].count}`);
    console.log(`   - Transações de caixa: ${cashRegister[0].count}`);
    console.log(`   - Histórico de serviços: ${serviceHistory[0].count}`);
    
    // Perguntar ao usuário se quer limpar
    console.log('\n⚠️  ATENÇÃO: Esta operação irá APAGAR TODOS os dados de exemplo!');
    console.log('   Os dados serão perdidos permanentemente.');
    console.log('   Para continuar, execute: node clear-sample-data.js --confirm');
    
    if (process.argv.includes('--confirm')) {
      console.log('\n🗑️  Iniciando limpeza dos dados...');
      
      // Limpar dados na ordem correta (respeitando foreign keys)
      const clearQueries = [
        'DELETE FROM service_history',
        'DELETE FROM cash_register',
        'DELETE FROM appointments',
        'DELETE FROM pets',
        'DELETE FROM clients'
      ];
      
      for (let i = 0; i < clearQueries.length; i++) {
        try {
          const [result] = await connection.query(clearQueries[i]);
          console.log(`✅ ${clearQueries[i].split(' ')[2]} limpo: ${result.affectedRows} registros removidos`);
        } catch (error) {
          console.log(`❌ Erro ao limpar ${clearQueries[i].split(' ')[2]}: ${error.message}`);
        }
      }
      
      // Resetar auto-increment
      const resetQueries = [
        'ALTER TABLE service_history AUTO_INCREMENT = 1',
        'ALTER TABLE cash_register AUTO_INCREMENT = 1',
        'ALTER TABLE appointments AUTO_INCREMENT = 1',
        'ALTER TABLE pets AUTO_INCREMENT = 1',
        'ALTER TABLE clients AUTO_INCREMENT = 1'
      ];
      
      for (let i = 0; i < resetQueries.length; i++) {
        try {
          await connection.query(resetQueries[i]);
          console.log(`🔄 Auto-increment resetado para ${resetQueries[i].split(' ')[2]}`);
        } catch (error) {
          console.log(`❌ Erro ao resetar auto-increment: ${error.message}`);
        }
      }
      
      console.log('\n✅ Limpeza concluída com sucesso!');
      console.log('📝 O banco de dados agora está limpo e pronto para uso.');
      
    } else {
      console.log('\n❌ Operação cancelada. Use --confirm para executar a limpeza.');
    }
    
    connection.release();
    
  } catch (error) {
    console.error('❌ Erro na limpeza:', error.message);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  clearSampleData();
}

module.exports = clearSampleData; 