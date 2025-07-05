const db = require('./src/config/database');

async function checkDuplicates() {
  try {
    console.log('🔍 Verificando pets duplicados...\n');
    
    // Buscar todos os pets com informações do cliente
    const [pets] = await db.query(`
      SELECT p.*, c.name as client_name
      FROM pets p
      LEFT JOIN clients c ON p.client_id = c.id
      ORDER BY p.client_id, p.name, p.created_at
    `);
    
    console.log(`📊 Total de pets no banco: ${pets.length}`);
    
    // Agrupar por cliente
    const petsByClient = {};
    pets.forEach(pet => {
      if (!petsByClient[pet.client_id]) {
        petsByClient[pet.client_id] = [];
      }
      petsByClient[pet.client_id].push(pet);
    });
    
    console.log(`👥 Total de clientes com pets: ${Object.keys(petsByClient).length}\n`);
    
    // Verificar duplicatas
    let hasDuplicates = false;
    
    Object.keys(petsByClient).forEach(clientId => {
      const clientPets = petsByClient[clientId];
      const clientName = clientPets[0]?.client_name || 'Cliente não encontrado';
      
      console.log(`👤 Cliente ${clientId} (${clientName}): ${clientPets.length} pets`);
      
      // Verificar se há pets com mesmo nome
      const petsByName = {};
      clientPets.forEach(pet => {
        const key = `${pet.name}-${pet.species}-${pet.breed || 'sem-raça'}`;
        if (!petsByName[key]) {
          petsByName[key] = [];
        }
        petsByName[key].push(pet);
      });
      
      // Mostrar duplicatas
      Object.keys(petsByName).forEach(key => {
        const petsWithSameName = petsByName[key];
        if (petsWithSameName.length > 1) {
          hasDuplicates = true;
          console.log(`  ⚠️  DUPLICATA: ${petsWithSameName.length}x "${key}"`);
          petsWithSameName.forEach((pet, index) => {
            console.log(`     ${index + 1}. ID: ${pet.id}, Criado: ${pet.created_at}`);
          });
        }
      });
      
      // Mostrar todos os pets do cliente
      clientPets.forEach(pet => {
        console.log(`  - ${pet.name} (${pet.species}) - ID: ${pet.id}`);
      });
      console.log('');
    });
    
    if (!hasDuplicates) {
      console.log('✅ Nenhuma duplicata encontrada!');
    } else {
      console.log('❌ Duplicatas encontradas!');
    }
    
    // Mostrar estatísticas gerais
    console.log('\n📈 Estatísticas:');
    const speciesCount = {};
    pets.forEach(pet => {
      speciesCount[pet.species] = (speciesCount[pet.species] || 0) + 1;
    });
    
    Object.keys(speciesCount).forEach(species => {
      console.log(`  ${species}: ${speciesCount[species]}`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao verificar duplicatas:', error);
  } finally {
    process.exit(0);
  }
}

checkDuplicates(); 