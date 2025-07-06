const axios = require('axios');

// Configuração da API
const API_BASE = 'http://localhost:3001/api';

// Função para log colorido
const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  warning: (msg) => console.log(`⚠️  ${msg}`),
  test: (msg) => console.log(`🧪 ${msg}`)
};

// Função para aguardar
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Teste 1: Verificar se a API está rodando
async function testAPIConnection() {
  log.test('Teste 1: Verificar conexão com a API');
  try {
    const response = await axios.get(`${API_BASE.replace('/api', '')}/`);
    log.success('API está rodando');
    log.info(`Status: ${response.data.status}`);
    log.info(`Versão: ${response.data.version}`);
    return true;
  } catch (error) {
    log.error('API não está rodando');
    return false;
  }
}

// Teste 2: Verificar rotas de clientes
async function testClientRoutes() {
  log.test('Teste 2: Verificar rotas de clientes');
  
  try {
    // GET /clients
    log.info('Testando GET /clients');
    const clientsResponse = await axios.get(`${API_BASE}/clients`);
    log.success(`Clientes encontrados: ${clientsResponse.data.data?.length || 0}`);
    
    // GET /clients/stats
    log.info('Testando GET /clients/stats');
    const statsResponse = await axios.get(`${API_BASE}/clients/stats`);
    log.success('Estatísticas carregadas');
    
    return true;
  } catch (error) {
    log.error('Erro nas rotas de clientes');
    return false;
  }
}

// Teste 3: Verificar rotas de pets
async function testPetRoutes() {
  log.test('Teste 3: Verificar rotas de pets');
  
  try {
    // GET /pets
    log.info('Testando GET /pets');
    const petsResponse = await axios.get(`${API_BASE}/pets`);
    log.success(`Pets encontrados: ${petsResponse.data.data?.length || 0}`);
    
    // GET /pets/stats
    log.info('Testando GET /pets/stats');
    const statsResponse = await axios.get(`${API_BASE}/pets/stats`);
    log.success('Estatísticas de pets carregadas');
    
    // GET /pets/species
    log.info('Testando GET /pets/species');
    const speciesResponse = await axios.get(`${API_BASE}/pets/species`);
    log.success(`Espécies encontradas: ${speciesResponse.data.data?.length || 0}`);
    
    // GET /pets/breeds
    log.info('Testando GET /pets/breeds');
    const breedsResponse = await axios.get(`${API_BASE}/pets/breeds`);
    log.success(`Raças encontradas: ${breedsResponse.data.data?.length || 0}`);
    
    return true;
  } catch (error) {
    log.error('Erro nas rotas de pets');
    return false;
  }
}

// Teste 4: Testar cadastro de cliente com pets
async function testClientWithPetsCreation() {
  log.test('Teste 4: Cadastro de cliente com pets');
  
  try {
    const cliente = {
      name: 'Teste Completo',
      cpf: '99999999999',
      phone: '41999999999',
      cep: '80000000',
      street: 'Rua dos Testes',
      neighborhood: 'Bairro Teste',
      city: 'Curitiba',
      state: 'PR',
      number: '123',
      pets: [
        {
          name: 'Rex',
          species: 'Cachorro',
          breed: 'Labrador',
          color: 'Preto',
          gender: 'M'
        },
        {
          name: 'Mimi',
          species: 'Gato',
          breed: 'Siamês',
          color: 'Branco',
          gender: 'F'
        }
      ]
    };
    
    log.info('Cadastrando cliente com 2 pets...');
    const response = await axios.post(`${API_BASE}/clients`, cliente);
    
    if (response.data.success) {
      log.success('Cliente cadastrado com sucesso');
      log.info(`ID do cliente: ${response.data.data.id}`);
      log.info(`Pets cadastrados: ${response.data.data.pets?.length || 0}`);
      
      // Verificar se os pets foram criados
      if (response.data.data.pets && response.data.data.pets.length > 0) {
        response.data.data.pets.forEach((pet, index) => {
          log.success(`  Pet ${index + 1}: ${pet.name} (${pet.species})`);
        });
      }
      
      return response.data.data.id;
    } else {
      log.error('Falha no cadastro do cliente');
      return null;
    }
  } catch (error) {
    log.error('Erro no cadastro de cliente com pets');
    log.error(error.response?.data || error.message);
    return null;
  }
}

// Teste 5: Testar busca de clientes
async function testClientSearch() {
  log.test('Teste 5: Busca de clientes');
  
  try {
    // Buscar por nome
    log.info('Testando busca por nome...');
    const searchResponse = await axios.get(`${API_BASE}/clients/search?q=Teste`);
    log.success(`Resultados da busca: ${searchResponse.data.data?.length || 0}`);
    
    return true;
  } catch (error) {
    log.error('Erro na busca de clientes');
    return false;
  }
}

// Teste 6: Testar busca de pets
async function testPetSearch() {
  log.test('Teste 6: Busca de pets');
  
  try {
    // Buscar por nome
    log.info('Testando busca por nome de pet...');
    const searchResponse = await axios.get(`${API_BASE}/pets/search?q=Rex`);
    log.success(`Resultados da busca: ${searchResponse.data.data?.length || 0}`);
    
    return true;
  } catch (error) {
    log.error('Erro na busca de pets');
    return false;
  }
}

// Teste 7: Testar atualização de cliente
async function testClientUpdate(clientId) {
  log.test('Teste 7: Atualização de cliente');
  
  if (!clientId) {
    log.warning('ID do cliente não fornecido, pulando teste');
    return false;
  }
  
  try {
    const updateData = {
      name: 'Teste Completo Atualizado',
      phone: '41988888888'
    };
    
    log.info('Atualizando cliente...');
    const response = await axios.put(`${API_BASE}/clients/${clientId}`, updateData);
    
    if (response.data.success) {
      log.success('Cliente atualizado com sucesso');
      log.info(`Novo nome: ${response.data.data.name}`);
      return true;
    } else {
      log.error('Falha na atualização do cliente');
      return false;
    }
  } catch (error) {
    log.error('Erro na atualização de cliente');
    return false;
  }
}

// Teste 8: Testar criação de pet individual
async function testIndividualPetCreation(clientId) {
  log.test('Teste 8: Criação de pet individual');
  
  if (!clientId) {
    log.warning('ID do cliente não fornecido, pulando teste');
    return false;
  }
  
  try {
    const petData = {
      name: 'Thor',
      species: 'Cachorro',
      breed: 'Pastor Alemão',
      color: 'Preto e Marrom',
      gender: 'M',
      client_id: clientId
    };
    
    log.info('Criando pet individual...');
    const response = await axios.post(`${API_BASE}/pets`, petData);
    
    if (response.data.success) {
      log.success('Pet criado com sucesso');
      log.info(`ID do pet: ${response.data.data.id}`);
      log.info(`Nome: ${response.data.data.name}`);
      return response.data.data.id;
    } else {
      log.error('Falha na criação do pet');
      return null;
    }
  } catch (error) {
    log.error('Erro na criação de pet individual');
    return null;
  }
}

// Teste 9: Testar atualização de pet
async function testPetUpdate(petId) {
  log.test('Teste 9: Atualização de pet');
  
  if (!petId) {
    log.warning('ID do pet não fornecido, pulando teste');
    return false;
  }
  
  try {
    const updateData = {
      name: 'Thor Atualizado',
      color: 'Preto',
      client_id: 1 // Assumindo que existe um cliente com ID 1
    };
    
    log.info('Atualizando pet...');
    const response = await axios.put(`${API_BASE}/pets/${petId}`, updateData);
    
    if (response.data.success) {
      log.success('Pet atualizado com sucesso');
      log.info(`Novo nome: ${response.data.data.name}`);
      return true;
    } else {
      log.error('Falha na atualização do pet');
      return false;
    }
  } catch (error) {
    log.error('Erro na atualização de pet');
    return false;
  }
}

// Teste 10: Testar exclusão de pet
async function testPetDeletion(petId) {
  log.test('Teste 10: Exclusão de pet');
  
  if (!petId) {
    log.warning('ID do pet não fornecido, pulando teste');
    return false;
  }
  
  try {
    log.info('Excluindo pet...');
    const response = await axios.delete(`${API_BASE}/pets/${petId}`);
    
    if (response.data.success) {
      log.success('Pet excluído com sucesso');
      return true;
    } else {
      log.error('Falha na exclusão do pet');
      return false;
    }
  } catch (error) {
    log.error('Erro na exclusão de pet');
    return false;
  }
}

// Teste 11: Testar exclusão de cliente
async function testClientDeletion(clientId) {
  log.test('Teste 11: Exclusão de cliente');
  
  if (!clientId) {
    log.warning('ID do cliente não fornecido, pulando teste');
    return false;
  }
  
  try {
    log.info('Excluindo cliente...');
    const response = await axios.delete(`${API_BASE}/clients/${clientId}`);
    
    if (response.data.success) {
      log.success('Cliente excluído com sucesso');
      return true;
    } else {
      log.error('Falha na exclusão do cliente');
      return false;
    }
  } catch (error) {
    log.error('Erro na exclusão de cliente');
    return false;
  }
}

// Teste 12: Verificar verificação de duplicidade
async function testDuplicateCheck() {
  log.test('Teste 12: Verificação de duplicidade');
  
  try {
    const duplicateData = {
      field: 'cpf',
      value: '99999999999'
    };
    
    log.info('Testando verificação de duplicidade...');
    const response = await axios.post(`${API_BASE}/clients/check-duplicate-field`, duplicateData);
    
    if (response.data.hasOwnProperty('duplicate')) {
      log.success('Verificação de duplicidade funcionando');
      log.info(`Duplicado: ${response.data.duplicate}`);
      return true;
    } else {
      log.error('Falha na verificação de duplicidade');
      return false;
    }
  } catch (error) {
    log.error('Erro na verificação de duplicidade');
    return false;
  }
}

// Função principal que executa todos os testes
async function runAllTests() {
  console.log('🚀 Iniciando testes automatizados do sistema...\n');
  
  const results = {
    apiConnection: false,
    clientRoutes: false,
    petRoutes: false,
    clientCreation: false,
    clientSearch: false,
    petSearch: false,
    clientUpdate: false,
    petCreation: false,
    petUpdate: false,
    petDeletion: false,
    clientDeletion: false,
    duplicateCheck: false
  };
  
  let clientId = null;
  let petId = null;
  
  try {
    // Teste 1: Conexão com API
    results.apiConnection = await testAPIConnection();
    await wait(500);
    
    if (!results.apiConnection) {
      log.error('API não está rodando. Abortando testes.');
      return;
    }
    
    // Teste 2: Rotas de clientes
    results.clientRoutes = await testClientRoutes();
    await wait(500);
    
    // Teste 3: Rotas de pets
    results.petRoutes = await testPetRoutes();
    await wait(500);
    
    // Teste 4: Criação de cliente com pets
    clientId = await testClientWithPetsCreation();
    results.clientCreation = clientId !== null;
    await wait(500);
    
    // Teste 5: Busca de clientes
    results.clientSearch = await testClientSearch();
    await wait(500);
    
    // Teste 6: Busca de pets
    results.petSearch = await testPetSearch();
    await wait(500);
    
    // Teste 7: Atualização de cliente
    results.clientUpdate = await testClientUpdate(clientId);
    await wait(500);
    
    // Teste 8: Criação de pet individual
    petId = await testIndividualPetCreation(clientId);
    results.petCreation = petId !== null;
    await wait(500);
    
    // Teste 9: Atualização de pet
    results.petUpdate = await testPetUpdate(petId);
    await wait(500);
    
    // Teste 10: Exclusão de pet
    results.petDeletion = await testPetDeletion(petId);
    await wait(500);
    
    // Teste 11: Exclusão de cliente
    results.clientDeletion = await testClientDeletion(clientId);
    await wait(500);
    
    // Teste 12: Verificação de duplicidade
    results.duplicateCheck = await testDuplicateCheck();
    await wait(500);
    
  } catch (error) {
    log.error('Erro durante a execução dos testes:', error.message);
  }
  
  // Relatório final
  console.log('\n📊 RELATÓRIO FINAL DOS TESTES');
  console.log('================================');
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  const failedTests = totalTests - passedTests;
  
  console.log(`Total de testes: ${totalTests}`);
  console.log(`✅ Aprovados: ${passedTests}`);
  console.log(`❌ Reprovados: ${failedTests}`);
  console.log(`📈 Taxa de sucesso: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  console.log('\n📋 Detalhes dos testes:');
  Object.entries(results).forEach(([test, result]) => {
    const status = result ? '✅' : '❌';
    const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    console.log(`${status} ${testName}`);
  });
  
  if (failedTests === 0) {
    console.log('\n🎉 Todos os testes passaram! O sistema está funcionando perfeitamente.');
  } else {
    console.log('\n⚠️ Alguns testes falharam. Verifique os logs acima para mais detalhes.');
  }
}

// Executar os testes
runAllTests().catch(console.error); 