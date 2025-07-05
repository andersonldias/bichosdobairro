const Pet = require('./src/models/Pet');
const Client = require('./src/models/Client');

async function testPetsModule() {
  console.log('🧪 Testando módulo de Pets...\n');
  
  try {
    // Teste 1: Verificar se há clientes para testar
    console.log('1️⃣ Verificando clientes disponíveis...');
    const clients = await Client.findAll();
    console.log(`   ✅ Encontrados ${clients.length} clientes`);
    
    if (clients.length === 0) {
      console.log('   ⚠️  Nenhum cliente encontrado. Crie alguns clientes primeiro.');
      return;
    }
    
    const testClient = clients[0];
    console.log(`   📋 Usando cliente: ${testClient.name} (ID: ${testClient.id})`);
    
    // Teste 2: Criar um pet de teste
    console.log('\n2️⃣ Criando pet de teste...');
    const testPetData = {
      name: 'Pet Teste',
      species: 'Cachorro',
      breed: 'Labrador',
      age: 3,
      weight: 25.5,
      observations: 'Pet criado para teste do sistema',
      client_id: testClient.id
    };
    
    const newPet = await Pet.create(testPetData);
    console.log(`   ✅ Pet criado: ${newPet.name} (ID: ${newPet.id})`);
    
    // Teste 3: Buscar pet por ID
    console.log('\n3️⃣ Buscando pet por ID...');
    const foundPet = await Pet.findById(newPet.id);
    if (foundPet) {
      console.log(`   ✅ Pet encontrado: ${foundPet.name} - Cliente: ${foundPet.client_name}`);
    } else {
      console.log('   ❌ Pet não encontrado');
    }
    
    // Teste 4: Buscar pets do cliente
    console.log('\n4️⃣ Buscando pets do cliente...');
    const clientPets = await Pet.findByClientId(testClient.id);
    console.log(`   ✅ Encontrados ${clientPets.length} pets do cliente`);
    
    // Teste 5: Atualizar pet
    console.log('\n5️⃣ Atualizando pet...');
    const updateData = {
      name: 'Pet Teste Atualizado',
      species: 'Cachorro',
      breed: 'Golden Retriever',
      age: 4,
      weight: 28.0,
      observations: 'Pet atualizado para teste',
      client_id: testClient.id
    };
    
    const updatedPet = await Pet.update(newPet.id, updateData);
    console.log(`   ✅ Pet atualizado: ${updatedPet.name}`);
    
    // Teste 6: Buscar pets por espécie
    console.log('\n6️⃣ Buscando pets por espécie...');
    const dogs = await Pet.findBySpecies('Cachorro');
    console.log(`   ✅ Encontrados ${dogs.length} cachorros`);
    
    // Teste 7: Buscar estatísticas
    console.log('\n7️⃣ Buscando estatísticas...');
    const stats = await Pet.getStats();
    console.log(`   ✅ Estatísticas: ${stats.total_pets} pets totais, ${stats.dogs_count} cachorros, ${stats.cats_count} gatos`);
    
    // Teste 8: Buscar espécies disponíveis
    console.log('\n8️⃣ Buscando espécies disponíveis...');
    const species = await Pet.getSpecies();
    console.log(`   ✅ Espécies encontradas: ${species.length}`);
    species.forEach(s => console.log(`      - ${s.species}: ${s.count} pets`));
    
    // Teste 9: Buscar pets
    console.log('\n9️⃣ Testando busca de pets...');
    const searchResults = await Pet.search('teste');
    console.log(`   ✅ Busca por "teste": ${searchResults.length} resultados`);
    
    // Teste 10: Listar todos os pets
    console.log('\n🔟 Listando todos os pets...');
    const allPets = await Pet.findAll();
    console.log(`   ✅ Total de pets: ${allPets.length}`);
    
    // Teste 11: Deletar pet de teste
    console.log('\n1️⃣1️⃣ Deletando pet de teste...');
    await Pet.delete(newPet.id);
    console.log(`   ✅ Pet deletado com sucesso`);
    
    // Verificação final
    console.log('\n✅ Todos os testes do módulo de Pets foram executados com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  testPetsModule();
}

module.exports = testPetsModule; 