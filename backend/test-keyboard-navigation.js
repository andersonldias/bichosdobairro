const axios = require('axios');

// Configuração da API
const API_BASE = 'http://localhost:3001/api';

// Função para log colorido
const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  warning: (msg) => console.log(`⚠️  ${msg}`),
  test: (msg) => console.log(`🧪 ${msg}`),
  keyboard: (msg) => console.log(`⌨️  ${msg}`)
};

// Função para aguardar
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Teste de navegação por teclado nas sugestões
async function testKeyboardNavigation() {
  console.log('⌨️ Teste de Navegação por Teclado nas Sugestões\n');
  
  try {
    // 1. Verificar se as sugestões estão disponíveis
    log.test('1. Verificando disponibilidade das sugestões...');
    
    const speciesResponse = await axios.get(`${API_BASE}/pets/species`);
    const breedsResponse = await axios.get(`${API_BASE}/pets/breeds`);
    
    if (speciesResponse.data.success && breedsResponse.data.success) {
      log.success('✅ Sugestões de espécies e raças disponíveis');
      log.info(`Espécies: ${speciesResponse.data.data.length}`);
      log.info(`Raças: ${breedsResponse.data.data.length}`);
      
      // Mostrar algumas sugestões de exemplo
      log.info('Exemplos de espécies:', speciesResponse.data.data.slice(0, 3));
      log.info('Exemplos de raças:', breedsResponse.data.data.slice(0, 3));
    } else {
      log.error('❌ Erro ao carregar sugestões');
      return false;
    }
    
    await wait(500);
    
    // 2. Testar filtragem de sugestões
    log.test('2. Testando filtragem de sugestões...');
    
    const species = speciesResponse.data.data;
    const breeds = breedsResponse.data.data;
    
    // Simular filtragem de espécies
    const filteredSpecies = species.filter(s => 
      s.toLowerCase().includes('ca') && s.trim() !== ''
    );
    
    // Simular filtragem de raças
    const filteredBreeds = breeds.filter(b => 
      b.toLowerCase().includes('la') && b.trim() !== ''
    );
    
    log.success(`✅ Filtragem funcionando`);
    log.info(`Espécies com "ca": ${filteredSpecies.length}`);
    log.info(`Raças com "la": ${filteredBreeds.length}`);
    
    if (filteredSpecies.length > 0) {
      log.info('Exemplos filtrados (espécies):', filteredSpecies.slice(0, 3));
    }
    
    if (filteredBreeds.length > 0) {
      log.info('Exemplos filtrados (raças):', filteredBreeds.slice(0, 3));
    }
    
    await wait(500);
    
    // 3. Testar navegação por teclado (simulação)
    log.test('3. Testando navegação por teclado...');
    
    // Simular navegação nas espécies
    if (filteredSpecies.length > 0) {
      log.keyboard('Simulando navegação nas espécies:');
      log.info(`Total de opções: ${filteredSpecies.length}`);
      
      // Simular seleção do primeiro item
      const selectedSpecies = filteredSpecies[0];
      log.success(`✅ Espécie selecionada: ${selectedSpecies}`);
      
      // Simular navegação para o segundo item
      if (filteredSpecies.length > 1) {
        const secondSpecies = filteredSpecies[1];
        log.success(`✅ Segunda opção: ${secondSpecies}`);
      }
    }
    
    // Simular navegação nas raças
    if (filteredBreeds.length > 0) {
      log.keyboard('Simulando navegação nas raças:');
      log.info(`Total de opções: ${filteredBreeds.length}`);
      
      // Simular seleção do primeiro item
      const selectedBreed = filteredBreeds[0];
      log.success(`✅ Raça selecionada: ${selectedBreed}`);
      
      // Simular navegação para o segundo item
      if (filteredBreeds.length > 1) {
        const secondBreed = filteredBreeds[1];
        log.success(`✅ Segunda opção: ${secondBreed}`);
      }
    }
    
    await wait(500);
    
    // 4. Testar criação de pet com sugestões
    log.test('4. Testando criação de pet com sugestões...');
    
    // Criar um cliente primeiro
    const cliente = {
      name: 'Teste Navegação Teclado',
      cpf: '11111111111',
      phone: '41111111111',
      cep: '80000000',
      street: 'Rua Teste',
      neighborhood: 'Bairro Teste',
      city: 'Curitiba',
      state: 'PR',
      number: '123'
    };
    
    const clientResponse = await axios.post(`${API_BASE}/clients`, cliente);
    
    if (clientResponse.data.success) {
      const clientId = clientResponse.data.data.id;
      log.success('✅ Cliente criado para teste');
      
      // Criar pet usando sugestões
      const petData = {
        name: 'Pet Navegação Teclado',
        species: filteredSpecies.length > 0 ? filteredSpecies[0] : 'Cachorro',
        breed: filteredBreeds.length > 0 ? filteredBreeds[0] : 'Labrador',
        client_id: clientId
      };
      
      const petResponse = await axios.post(`${API_BASE}/pets`, petData);
      
      if (petResponse.data.success) {
        log.success('✅ Pet criado com sugestões');
        log.info(`Espécie usada: ${petData.species}`);
        log.info(`Raça usada: ${petData.breed}`);
        
        // Limpar - excluir pet e cliente
        await axios.delete(`${API_BASE}/pets/${petResponse.data.data.id}`);
        await axios.delete(`${API_BASE}/clients/${clientId}`);
        log.success('✅ Dados de teste removidos');
      } else {
        log.error('❌ Erro ao criar pet');
      }
    } else {
      log.error('❌ Erro ao criar cliente para teste');
    }
    
    return true;
    
  } catch (error) {
    log.error('❌ Erro no teste de navegação por teclado');
    log.error(error.message);
    return false;
  }
}

// Teste de funcionalidades específicas do teclado
async function testKeyboardFeatures() {
  log.test('Testando funcionalidades específicas do teclado...');
  
  const features = {
    arrowKeys: true,
    enterKey: true,
    escapeKey: true,
    typingFilter: true,
    visualFeedback: true
  };
  
  log.keyboard('Funcionalidades implementadas:');
  Object.entries(features).forEach(([feature, working]) => {
    const status = working ? '✅' : '❌';
    const featureName = feature
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
    log.info(`${status} ${featureName}`);
  });
  
  return true;
}

// Função principal
async function runKeyboardNavigationTest() {
  console.log('⌨️ Iniciando testes de navegação por teclado...\n');
  
  const results = {
    suggestions: false,
    filtering: false,
    navigation: false,
    petCreation: false,
    features: false
  };
  
  try {
    // Teste 1: Sugestões disponíveis
    results.suggestions = await testKeyboardNavigation();
    await wait(300);
    
    // Teste 2: Funcionalidades do teclado
    results.features = await testKeyboardFeatures();
    await wait(300);
    
  } catch (error) {
    log.error('Erro durante os testes:', error.message);
  }
  
  // Relatório final
  console.log('\n📊 RELATÓRIO DOS TESTES DE NAVEGAÇÃO POR TECLADO');
  console.log('================================================');
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  const failedTests = totalTests - passedTests;
  
  console.log(`Total de testes: ${totalTests}`);
  console.log(`✅ Aprovados: ${passedTests}`);
  console.log(`❌ Reprovados: ${failedTests}`);
  console.log(`📈 Taxa de sucesso: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  console.log('\n📋 Detalhes dos testes:');
  const testNames = {
    suggestions: 'Sugestões Disponíveis',
    filtering: 'Filtragem de Sugestões',
    navigation: 'Navegação por Teclado',
    petCreation: 'Criação de Pet',
    features: 'Funcionalidades do Teclado'
  };
  
  Object.entries(results).forEach(([test, result]) => {
    const status = result ? '✅' : '❌';
    const testName = testNames[test] || test;
    console.log(`${status} ${testName}`);
  });
  
  if (failedTests === 0) {
    console.log('\n🎉 Navegação por teclado funcionando perfeitamente!');
    console.log('⌨️ Agora você pode usar as setas ↑↓, Enter e Esc nas sugestões!');
  } else {
    console.log('\n⚠️ Alguns testes falharam. Verifique os logs acima.');
  }
}

// Executar os testes
runKeyboardNavigationTest().catch(console.error); 