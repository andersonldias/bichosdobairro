const Pet = require('./src/models/Pet');

async function demoCaseInsensitive() {
  try {
    console.log('🎯 Demonstração da comparação case-insensitive\n');
    
    // Buscar pets existentes
    const pets = await Pet.findAll();
    console.log('📊 Pets existentes:');
    pets.forEach(pet => {
      console.log(`  - ID: ${pet.id}, Nome: "${pet.name}", Cliente: ${pet.client_name}`);
    });
    
    if (pets.length === 0) {
      console.log('❌ Nenhum pet encontrado para demonstração');
      return;
    }
    
    const testPet = pets[0];
    const testNames = [
      'dora',
      'DORA', 
      'Dora',
      'dOrA',
      'DoRa',
      'DORA'
    ];
    
    console.log(`\n🔍 Testando verificação de duplicata para cliente ID ${testPet.client_id}:`);
    
    for (const testName of testNames) {
      try {
        console.log(`\n📝 Testando nome: "${testName}"`);
        
        const duplicate = await Pet.checkDuplicateName(testPet.client_id, testName);
        
        if (duplicate) {
          console.log(`  ✅ Duplicata encontrada: ID ${duplicate.id}, Nome: "${duplicate.name}"`);
        } else {
          console.log(`  ❌ Nenhuma duplicata encontrada`);
        }
        
      } catch (error) {
        console.error(`  ❌ Erro ao testar "${testName}":`, error.message);
      }
    }
    
    console.log('\n🎉 Demonstração concluída!');
    console.log('💡 A comparação agora ignora maiúsculas e minúsculas!');
    
  } catch (error) {
    console.error('❌ Erro na demonstração:', error);
  } finally {
    process.exit(0);
  }
}

demoCaseInsensitive(); 