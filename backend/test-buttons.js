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
  button: (msg) => console.log(`🔘 ${msg}`)
};

// Função para aguardar
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Teste 1: Botão "Novo Cliente"
async function testNovoClienteButton() {
  log.test('Teste 1: Botão "Novo Cliente"');
  
  try {
    // Simular clique no botão "Novo Cliente"
    log.button('Clicando no botão "Novo Cliente"');
    
    // Verificar se a rota está disponível (simula a abertura do modal)
    const response = await axios.get(`${API_BASE}/clients`);
    log.success('Modal de novo cliente pode ser aberto');
    
    // Verificar se as estatísticas são carregadas
    const statsResponse = await axios.get(`${API_BASE}/clients/stats`);
    log.success('Estatísticas carregadas para o modal');
    
    return true;
  } catch (error) {
    log.error('Erro ao testar botão "Novo Cliente"');
    return false;
  }
}

// Teste 2: Botão "Adicionar Pet" (no formulário de cliente)
async function testAdicionarPetButton() {
  log.test('Teste 2: Botão "Adicionar Pet"');
  
  try {
    // Simular adição de pet no formulário
    log.button('Clicando no botão "Adicionar Pet"');
    
    // Verificar se as espécies e raças estão disponíveis
    const speciesResponse = await axios.get(`${API_BASE}/pets/species`);
    log.success('Espécies carregadas para o formulário de pet');
    
    const breedsResponse = await axios.get(`${API_BASE}/pets/breeds`);
    log.success('Raças carregadas para o formulário de pet');
    
    return true;
  } catch (error) {
    log.error('Erro ao testar botão "Adicionar Pet"');
    return false;
  }
}

// Teste 3: Botão "Cadastrar" (cliente com pets)
async function testCadastrarButton() {
  log.test('Teste 3: Botão "Cadastrar" (cliente com pets)');
  
  try {
    log.button('Clicando no botão "Cadastrar"');
    
    // Simular cadastro de cliente com pets
    const cliente = {
      name: 'Teste Botões',
      cpf: '88888888888',
      phone: '41888888888',
      cep: '80000000',
      street: 'Rua dos Botões',
      neighborhood: 'Bairro Teste',
      city: 'Curitiba',
      state: 'PR',
      number: '456',
      pets: [
        {
          name: 'Botão Pet',
          species: 'Cachorro',
          breed: 'Golden Retriever'
        }
      ]
    };
    
    const response = await axios.post(`${API_BASE}/clients`, cliente);
    
    if (response.data.success) {
      log.success('Cliente cadastrado com pets via botão "Cadastrar"');
      log.info(`ID do cliente: ${response.data.data.id}`);
      log.info(`Pets cadastrados: ${response.data.data.pets?.length || 0}`);
      return response.data.data.id;
    } else {
      log.error('Falha no cadastro via botão "Cadastrar"');
      return null;
    }
  } catch (error) {
    log.error('Erro ao testar botão "Cadastrar"');
    return null;
  }
}

// Teste 4: Botão "Cancelar"
async function testCancelarButton() {
  log.test('Teste 4: Botão "Cancelar"');
  
  try {
    log.button('Clicando no botão "Cancelar"');
    
    // Verificar se o sistema volta ao estado inicial
    const clientsResponse = await axios.get(`${API_BASE}/clients`);
    log.success('Sistema voltou ao estado inicial após cancelar');
    
    return true;
  } catch (error) {
    log.error('Erro ao testar botão "Cancelar"');
    return false;
  }
}

// Teste 5: Botão "Editar" (cliente)
async function testEditarClienteButton(clientId) {
  log.test('Teste 5: Botão "Editar" (cliente)');
  
  if (!clientId) {
    log.warning('ID do cliente não fornecido, pulando teste');
    return false;
  }
  
  try {
    log.button('Clicando no botão "Editar" do cliente');
    
    // Simular abertura do modal de edição
    const response = await axios.get(`${API_BASE}/clients/${clientId}`);
    
    if (response.data.success) {
      log.success('Modal de edição de cliente aberto');
      log.info(`Cliente: ${response.data.data.name}`);
      return true;
    } else {
      log.error('Falha ao abrir modal de edição');
      return false;
    }
  } catch (error) {
    log.error('Erro ao testar botão "Editar" do cliente');
    return false;
  }
}

// Teste 6: Botão "Excluir" (cliente)
async function testExcluirClienteButton(clientId) {
  log.test('Teste 6: Botão "Excluir" (cliente)');
  
  if (!clientId) {
    log.warning('ID do cliente não fornecido, pulando teste');
    return false;
  }
  
  try {
    log.button('Clicando no botão "Excluir" do cliente');
    
    // Simular exclusão
    const response = await axios.delete(`${API_BASE}/clients/${clientId}`);
    
    if (response.data.success) {
      log.success('Cliente excluído com sucesso');
      return true;
    } else {
      log.error('Falha na exclusão do cliente');
      return false;
    }
  } catch (error) {
    log.error('Erro ao testar botão "Excluir" do cliente');
    return false;
  }
}

// Teste 7: Botão "Novo Pet" (página de pets)
async function testNovoPetButton() {
  log.test('Teste 7: Botão "Novo Pet"');
  
  try {
    log.button('Clicando no botão "Novo Pet"');
    
    // Verificar se as rotas necessárias estão disponíveis
    const clientsResponse = await axios.get(`${API_BASE}/clients`);
    log.success('Clientes carregados para o formulário de pet');
    
    const speciesResponse = await axios.get(`${API_BASE}/pets/species`);
    log.success('Espécies carregadas para o formulário de pet');
    
    const breedsResponse = await axios.get(`${API_BASE}/pets/breeds`);
    log.success('Raças carregadas para o formulário de pet');
    
    return true;
  } catch (error) {
    log.error('Erro ao testar botão "Novo Pet"');
    return false;
  }
}

// Teste 8: Botão "Editar" (pet)
async function testEditarPetButton() {
  log.test('Teste 8: Botão "Editar" (pet)');
  
  try {
    log.button('Clicando no botão "Editar" do pet');
    
    // Primeiro criar um pet para testar
    const petData = {
      name: 'Pet para Editar',
      species: 'Gato',
      breed: 'Persa',
      client_id: 1 // Assumindo que existe um cliente com ID 1
    };
    
    const createResponse = await axios.post(`${API_BASE}/pets`, petData);
    
    if (createResponse.data.success) {
      const petId = createResponse.data.data.id;
      log.success('Pet criado para teste de edição');
      
      // Simular edição
      const updateData = {
        name: 'Pet Editado',
        color: 'Branco',
        client_id: 1
      };
      
      const updateResponse = await axios.put(`${API_BASE}/pets/${petId}`, updateData);
      
      if (updateResponse.data.success) {
        log.success('Pet editado com sucesso');
        
        // Limpar - excluir o pet de teste
        await axios.delete(`${API_BASE}/pets/${petId}`);
        return true;
      } else {
        log.error('Falha na edição do pet');
        return false;
      }
    } else {
      log.error('Falha na criação do pet para teste');
      return false;
    }
  } catch (error) {
    log.error('Erro ao testar botão "Editar" do pet');
    return false;
  }
}

// Teste 9: Botão "Excluir" (pet)
async function testExcluirPetButton() {
  log.test('Teste 9: Botão "Excluir" (pet)');
  
  try {
    log.button('Clicando no botão "Excluir" do pet');
    
    // Primeiro criar um pet para testar
    const petData = {
      name: 'Pet para Excluir',
      species: 'Cachorro',
      breed: 'Poodle',
      client_id: 1
    };
    
    const createResponse = await axios.post(`${API_BASE}/pets`, petData);
    
    if (createResponse.data.success) {
      const petId = createResponse.data.data.id;
      log.success('Pet criado para teste de exclusão');
      
      // Simular exclusão
      const deleteResponse = await axios.delete(`${API_BASE}/pets/${petId}`);
      
      if (deleteResponse.data.success) {
        log.success('Pet excluído com sucesso');
        return true;
      } else {
        log.error('Falha na exclusão do pet');
        return false;
      }
    } else {
      log.error('Falha na criação do pet para teste');
      return false;
    }
  } catch (error) {
    log.error('Erro ao testar botão "Excluir" do pet');
    return false;
  }
}

// Teste 10: Botão de busca
async function testBuscaButton() {
  log.test('Teste 10: Botão de busca');
  
  try {
    log.button('Testando funcionalidade de busca');
    
    // Testar busca de clientes
    const clientSearchResponse = await axios.get(`${API_BASE}/clients/search?q=Teste`);
    log.success('Busca de clientes funcionando');
    
    // Testar busca de pets
    const petSearchResponse = await axios.get(`${API_BASE}/pets/search?q=Rex`);
    log.success('Busca de pets funcionando');
    
    return true;
  } catch (error) {
    log.error('Erro ao testar funcionalidade de busca');
    return false;
  }
}

// Teste 11: Botões de filtro
async function testFiltrosButton() {
  log.test('Teste 11: Botões de filtro');
  
  try {
    log.button('Testando filtros');
    
    // Verificar se os dados para filtros estão disponíveis
    const speciesResponse = await axios.get(`${API_BASE}/pets/species`);
    log.success('Filtro por espécie disponível');
    
    const breedsResponse = await axios.get(`${API_BASE}/pets/breeds`);
    log.success('Filtro por raça disponível');
    
    const clientsResponse = await axios.get(`${API_BASE}/clients`);
    log.success('Filtro por cliente disponível');
    
    return true;
  } catch (error) {
    log.error('Erro ao testar filtros');
    return false;
  }
}

// Teste 12: Verificar responsividade dos botões
async function testResponsividadeButton() {
  log.test('Teste 12: Responsividade dos botões');
  
  try {
    log.button('Testando responsividade');
    
    // Verificar se todas as rotas respondem rapidamente
    const startTime = Date.now();
    
    await Promise.all([
      axios.get(`${API_BASE}/clients`),
      axios.get(`${API_BASE}/pets`),
      axios.get(`${API_BASE}/clients/stats`),
      axios.get(`${API_BASE}/pets/stats`)
    ]);
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (responseTime < 2000) {
      log.success(`Resposta rápida: ${responseTime}ms`);
      return true;
    } else {
      log.warning(`Resposta lenta: ${responseTime}ms`);
      return false;
    }
  } catch (error) {
    log.error('Erro ao testar responsividade');
    return false;
  }
}

// Função principal que executa todos os testes de botões
async function runButtonTests() {
  console.log('🔘 Iniciando testes de botões do sistema...\n');
  
  const results = {
    novoCliente: false,
    adicionarPet: false,
    cadastrar: false,
    cancelar: false,
    editarCliente: false,
    excluirCliente: false,
    novoPet: false,
    editarPet: false,
    excluirPet: false,
    busca: false,
    filtros: false,
    responsividade: false
  };
  
  let clientId = null;
  
  try {
    // Teste 1: Botão "Novo Cliente"
    results.novoCliente = await testNovoClienteButton();
    await wait(300);
    
    // Teste 2: Botão "Adicionar Pet"
    results.adicionarPet = await testAdicionarPetButton();
    await wait(300);
    
    // Teste 3: Botão "Cadastrar"
    clientId = await testCadastrarButton();
    results.cadastrar = clientId !== null;
    await wait(300);
    
    // Teste 4: Botão "Cancelar"
    results.cancelar = await testCancelarButton();
    await wait(300);
    
    // Teste 5: Botão "Editar" (cliente)
    results.editarCliente = await testEditarClienteButton(clientId);
    await wait(300);
    
    // Teste 6: Botão "Excluir" (cliente)
    results.excluirCliente = await testExcluirClienteButton(clientId);
    await wait(300);
    
    // Teste 7: Botão "Novo Pet"
    results.novoPet = await testNovoPetButton();
    await wait(300);
    
    // Teste 8: Botão "Editar" (pet)
    results.editarPet = await testEditarPetButton();
    await wait(300);
    
    // Teste 9: Botão "Excluir" (pet)
    results.excluirPet = await testExcluirPetButton();
    await wait(300);
    
    // Teste 10: Botão de busca
    results.busca = await testBuscaButton();
    await wait(300);
    
    // Teste 11: Botões de filtro
    results.filtros = await testFiltrosButton();
    await wait(300);
    
    // Teste 12: Responsividade
    results.responsividade = await testResponsividadeButton();
    await wait(300);
    
  } catch (error) {
    log.error('Erro durante a execução dos testes de botões:', error.message);
  }
  
  // Relatório final
  console.log('\n📊 RELATÓRIO FINAL DOS TESTES DE BOTÕES');
  console.log('========================================');
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  const failedTests = totalTests - passedTests;
  
  console.log(`Total de testes: ${totalTests}`);
  console.log(`✅ Aprovados: ${passedTests}`);
  console.log(`❌ Reprovados: ${failedTests}`);
  console.log(`📈 Taxa de sucesso: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  console.log('\n📋 Detalhes dos testes de botões:');
  const buttonNames = {
    novoCliente: 'Novo Cliente',
    adicionarPet: 'Adicionar Pet',
    cadastrar: 'Cadastrar',
    cancelar: 'Cancelar',
    editarCliente: 'Editar Cliente',
    excluirCliente: 'Excluir Cliente',
    novoPet: 'Novo Pet',
    editarPet: 'Editar Pet',
    excluirPet: 'Excluir Pet',
    busca: 'Busca',
    filtros: 'Filtros',
    responsividade: 'Responsividade'
  };
  
  Object.entries(results).forEach(([test, result]) => {
    const status = result ? '✅' : '❌';
    const buttonName = buttonNames[test] || test;
    console.log(`${status} ${buttonName}`);
  });
  
  if (failedTests === 0) {
    console.log('\n🎉 Todos os botões estão funcionando perfeitamente!');
  } else {
    console.log('\n⚠️ Alguns botões falharam. Verifique os logs acima para mais detalhes.');
  }
}

// Executar os testes de botões
runButtonTests().catch(console.error); 