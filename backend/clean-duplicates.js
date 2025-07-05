const db = require('./src/config/database');

async function cleanDuplicates() {
  try {
    console.log('🧹 Iniciando limpeza de pets duplicados...\n');
    
    // Buscar todos os pets com informações do cliente
    const [pets] = await db.query(`
      SELECT p.*, c.name as client_name
      FROM pets p
      LEFT JOIN clients c ON p.client_id = c.id
      ORDER BY p.client_id, p.name, p.created_at
    `);
    
    console.log(`📊 Total de pets no banco: ${pets.length}`);
    
    // Agrupar por cliente e nome para identificar duplicatas
    const duplicates = {};
    pets.forEach(pet => {
      const key = `${pet.client_id}-${pet.name}-${pet.species}-${pet.breed || 'sem-raça'}`;
      if (!duplicates[key]) {
        duplicates[key] = [];
      }
      duplicates[key].push(pet);
    });
    
    // Identificar duplicatas (mais de 1 pet com mesmo nome/cliente)
    const toDelete = [];
    Object.keys(duplicates).forEach(key => {
      const petsWithSameName = duplicates[key];
      if (petsWithSameName.length > 1) {
        console.log(`⚠️  Duplicata encontrada: ${petsWithSameName.length}x "${key}"`);
        
        // Manter o primeiro (mais antigo) e marcar os outros para exclusão
        const [keep, ...remove] = petsWithSameName;
        console.log(`   ✅ Manter: ID ${keep.id} (criado em ${keep.created_at})`);
        
        remove.forEach(pet => {
          console.log(`   🗑️  Deletar: ID ${pet.id} (criado em ${pet.created_at})`);
          toDelete.push(pet.id);
        });
      }
    });
    
    if (toDelete.length === 0) {
      console.log('✅ Nenhuma duplicata encontrada para limpeza!');
      return;
    }
    
    console.log(`\n🗑️  Total de pets a serem deletados: ${toDelete.length}`);
    
    // Confirmar antes de deletar
    console.log('\n⚠️  ATENÇÃO: Esta operação irá deletar pets duplicados!');
    console.log('   Para continuar, execute: node clean-duplicates.js --confirm');
    
    if (process.argv.includes('--confirm')) {
      console.log('\n🧹 Iniciando exclusão...');
      
      for (const petId of toDelete) {
        try {
          await db.query('DELETE FROM pets WHERE id = ?', [petId]);
          console.log(`   ✅ Pet ID ${petId} deletado com sucesso`);
        } catch (error) {
          console.error(`   ❌ Erro ao deletar pet ID ${petId}:`, error.message);
        }
      }
      
      console.log('\n✅ Limpeza concluída!');
      
      // Verificar resultado final
      const [finalPets] = await db.query('SELECT COUNT(*) as total FROM pets');
      console.log(`📊 Total de pets após limpeza: ${finalPets[0].total}`);
      
    } else {
      console.log('\n💡 Para executar a limpeza, adicione --confirm ao comando');
    }
    
  } catch (error) {
    console.error('❌ Erro durante limpeza:', error);
  } finally {
    process.exit(0);
  }
}

cleanDuplicates(); 