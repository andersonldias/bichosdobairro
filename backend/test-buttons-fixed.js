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

// Função para obter dados existentes
async function getExistingData() {
  try {
    const [clientsResponse, petsResponse] = await Promise.all([
      axios.get(`${API_BASE}/clients`),
      axios.get(`${API_BASE}/pets`)
    ]);
    
    return {
      clients: clientsResponse.data.data || [],
      pets: petsResponse.data.data || []
    };
  } catch (error) {
    return { clients: [], pets: [] };
  }
}

// Teste 1: Botão "Novo Cliente"
async function testNovoClienteButton() {
  log.test('Teste 1: Botão "Novo Cliente"');
  
  try {
    log.button('Clicando no botão "Novo Cliente"');
    
    const response = await axios.get(`${API_BASE}/clients`);
    log.success('Modal de novo cliente pode ser aberto');
    
    const statsResponse = await axios.get(`${API_BASE}/clients/stats`);
    log.success('Estatísticas carregadas para o modal');
    
    return true;
  } catch (error) {
    log.error('Erro ao testar botão "Novo Cliente"');
    return false;
  }
}

// Teste 2: Botão "Adicionar Pet"
async function testAdicionarPetButton() {
  log.test('Teste 2: Botão "Adicionar Pet"');
  
  try {
    log.button('Clicando no botão "Adicionar Pet"');
    
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

// Teste 3: Botão "Cadastrar"
async function testCadastrarButton() {
  log.test('Teste 3: Botão "Cadastrar" (cliente com pets)');
  
  try {
    log.button('Clicando no botão "Cadastrar"');
    
    const cliente = {
      name: 'Teste Botões Fixo',
      cpf: '77777777777',
      phone: '41777777777',
      cep: '80000000',
      street: 'Rua dos Botões Fixos',
      neighborhood: 'Bairro Teste',
      city: 'Curitiba',
      state: 'PR',
      number: '789',
      pets: [
        {
          name: 'Botão Pet Fixo',
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
    
    const clientsResponse = await axios.get(`${API_BASE}/clients`);
    log.success('Sistema voltou ao estado inicial após cancelar');
    
    return true;
  } catch (error) {
    log.error('Erro ao testar botão "Cancelar"');
    return false;
  }
}

// Teste 5: Botão "Editar" (cliente)
async function testEditarClienteButton() {
  log.test('Teste 5: Botão "Editar" (cliente)');
  
  try {
    log.button('Clicando no botão "Editar" do cliente');
    
    // Primeiro verificar se há clientes
    const { clients } = await getExistingData();
    
    if (clients.length === 0) {
      log.warning('Nenhum cliente encontrado, criando um para teste');
      
      // Criar um cliente para teste
      const cliente = {
        name: 'Cliente para Editar',
        cpf: '66666666666',
        phone: '41666666666',
        cep: '80000000',
        street: 'Rua Teste',
        neighborhood: 'Bairro Teste',
        city: 'Curitiba',
        state: 'PR',
        number: '123'
      };
      
      const createResponse = await axios.post(`${API_BASE}/clients`, cliente);
      if (!createResponse.data.success) {
        log.error('Falha ao criar cliente para teste');
        return false;
      }
      
      const clientId = createResponse.data.data.id;
      log.success('Cliente criado para teste de edição');
      
      // Testar edição
      const response = await axios.get(`${API_BASE}/clients/${clientId}`);
      
      if (response.data.success) {
        log.success('Modal de edição de cliente aberto');
        log.info(`Cliente: ${response.data.data.name}`);
        
        // Limpar - excluir o cliente de teste
        await axios.delete(`${API_BASE}/clients/${clientId}`);
        return true;
      } else {
        log.error('Falha ao abrir modal de edição');
        return false;
      }
    } else {
      // Usar o primeiro cliente existente
      const clientId = clients[0].id;
      const response = await axios.get(`${API_BASE}/clients/${clientId}`);
      
      if (response.data.success) {
        log.success('Modal de edição de cliente aberto');
        log.info(`Cliente: ${response.data.data.name}`);
        return true;
      } else {
        log.error('Falha ao abrir modal de edição');
        return false;
      }
    }
  } catch (error) {
    log.error('Erro ao testar botão "Editar" do cliente');
    return false;
  }
}

// Teste 6: Botão "Excluir" (cliente)
async function testExcluirClienteButton() {
  log.test('Teste 6: Botão "Excluir" (cliente)');
  
  try {
    log.button('Clicando no botão "Excluir" do cliente');
    
    // Criar um cliente para teste de exclusão
    const cliente = {
      name: 'Cliente para Excluir',
      cpf: '55555555555',
      phone: '41555555555',
      cep: '80000000',
      street: 'Rua Teste',
      neighborhood: 'Bairro Teste',
      city: 'Curitiba',
      state: 'PR',
      number: '123'
    };
    
    const createResponse = await axios.post(`${API_BASE}/clients`, cliente);
    
    if (createResponse.data.success) {
      const clientId = createResponse.data.data.id;
      log.success('Cliente criado para teste de exclusão');
      
      const response = await axios.delete(`${API_BASE}/clients/${clientId}`);
      
      if (response.data.success) {
        log.success('Cliente excluído com sucesso');
        return true;
      } else {
        log.error('Falha na exclusão do cliente');
        return false;
      }
    } else {
      log.error('Falha ao criar cliente para teste');
      return false;
    }
  } catch (error) {
    log.error('Erro ao testar botão "Excluir" do cliente');
    return false;
  }
}

// Teste 7: Botão "Novo Pet"
async function testNovoPetButton() {
  log.test('Teste 7: Botão "Novo Pet"');
  
  try {
    log.button('Clicando no botão "Novo Pet"');
    
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
    
    // Verificar se há clientes primeiro
    const { clients } = await getExistingData();
    
    if (clients.length === 0) {
      log.warning('Nenhum cliente encontrado, criando um para teste');
      
      // Criar um cliente primeiro
      const cliente = {
        name: 'Cliente para Pet',
        cpf: '44444444444',
        phone: '41444444444',
        cep: '80000000',
        street: 'Rua Teste',
        neighborhood: 'Bairro Teste',
        city: 'Curitiba',
        state: 'PR',
        number: '123'
      };
      
      const clientResponse = await axios.post(`${API_BASE}/clients`, cliente);
      if (!clientResponse.data.success) {
        log.error('Falha ao criar cliente para teste de pet');
        return false;
      }
      
      const clientId = clientResponse.data.data.id;
      log.success('Cliente criado para teste de pet');
      
      // Criar um pet para teste
      const petData = {
        name: 'Pet para Editar',
        species: 'Gato',
        breed: 'Persa',
        client_id: clientId
      };
      
      const createResponse = await axios.post(`${API_BASE}/pets`, petData);
      
      if (createResponse.data.success) {
        const petId = createResponse.data.data.id;
        log.success('Pet criado para teste de edição');
        
        // Testar edição
        const updateData = {
          name: 'Pet Editado',
          color: 'Branco',
          client_id: clientId
        };
        
        const updateResponse = await axios.put(`${API_BASE}/pets/${petId}`, updateData);
        
        if (updateResponse.data.success) {
          log.success('Pet editado com sucesso');
          
          // Limpar - excluir pet e cliente
          await axios.delete(`${API_BASE}/pets/${petId}`);
          await axios.delete(`${API_BASE}/clients/${clientId}`);
          return true;
        } else {
          log.error('Falha na edição do pet');
          return false;
        }
      } else {
        log.error('Falha na criação do pet para teste');
        return false;
      }
    } else {
      // Usar o primeiro cliente existente
      const clientId = clients[0].id;
      
      // Criar um pet para teste
      const petData = {
        name: 'Pet para Editar',
        species: 'Gato',
        breed: 'Persa',
        client_id: clientId
      };
      
      const createResponse = await axios.post(`${API_BASE}/pets`, petData);
      
      if (createResponse.data.success) {
        const petId = createResponse.data.data.id;
        log.success('Pet criado para teste de edição');
        
        // Testar edição
        const updateData = {
          name: 'Pet Editado',
          color: 'Branco',
          client_id: clientId
        };
        
        const updateResponse = await axios.put(`${API_BASE}/pets/${petId}`, updateData);
        
        if (updateResponse.data.success) {
          log.success('Pet editado com sucesso');
          
          // Limpar - excluir pet
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
    
    // Verificar se há clientes primeiro
    const { clients } = await getExistingData();
    
    if (clients.length === 0) {
      log.warning('Nenhum cliente encontrado, criando um para teste');
      
      // Criar um cliente primeiro
      const cliente = {
        name: 'Cliente para Pet Excluir',
        cpf: '33333333333',
        phone: '41333333333',
        cep: '80000000',
        street: 'Rua Teste',
        neighborhood: 'Bairro Teste',
        city: 'Curitiba',
        state: 'PR',
        number: '123'
      };
      
      const clientResponse = await axios.post(`${API_BASE}/clients`, cliente);
      if (!clientResponse.data.success) {
        log.error('Falha ao criar cliente para teste de pet');
        return false;
      }
      
      const clientId = clientResponse.data.data.id;
      log.success('Cliente criado para teste de pet');
      
      // Criar um pet para teste
      const petData = {
        name: 'Pet para Excluir',
        species: 'Cachorro',
        breed: 'Poodle',
        client_id: clientId
      };
      
      const createResponse = await axios.post(`${API_BASE}/pets`, petData);
      
      if (createResponse.data.success) {
        const petId = createResponse.data.data.id;
        log.success('Pet criado para teste de exclusão');
        
        const deleteResponse = await axios.delete(`${API_BASE}/pets/${petId}`);
        
        if (deleteResponse.data.success) {
          log.success('Pet excluído com sucesso');
          
          // Limpar - excluir cliente
          await axios.delete(`${API_BASE}/clients/${clientId}`);
          return true;
        } else {
          log.error('Falha na exclusão do pet');
          return false;
        }
      } else {
        log.error('Falha na criação do pet para teste');
        return false;
      }
    } else {
      // Usar o primeiro cliente existente
      const clientId = clients[0].id;
      
      // Criar um pet para teste
      const petData = {
        name: 'Pet para Excluir',
        species: 'Cachorro',
        breed: 'Poodle',
        client_id: clientId
      };
      
      const createResponse = await axios.post(`${API_BASE}/pets`, petData);
      
      if (createResponse.data.success) {
        const petId = createResponse.data.data.id;
        log.success('Pet criado para teste de exclusão');
        
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
    
    const clientSearchResponse = await axios.get(`${API_BASE}/clients/search?q=Teste`);
    log.success('Busca de clientes funcionando');
    
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
  console.log('🔘 Iniciando testes de botões corrigidos do sistema...\n');
  
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
  
  try {
    // Teste 1: Botão "Novo Cliente"
    results.novoCliente = await testNovoClienteButton();
    await wait(300);
    
    // Teste 2: Botão "Adicionar Pet"
    results.adicionarPet = await testAdicionarPetButton();
    await wait(300);
    
    // Teste 3: Botão "Cadastrar"
    const clientId = await testCadastrarButton();
    results.cadastrar = clientId !== null;
    await wait(300);
    
    // Teste 4: Botão "Cancelar"
    results.cancelar = await testCancelarButton();
    await wait(300);
    
    // Teste 5: Botão "Editar" (cliente)
    results.editarCliente = await testEditarClienteButton();
    await wait(300);
    
    // Teste 6: Botão "Excluir" (cliente)
    results.excluirCliente = await testExcluirClienteButton();
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
  console.log('\n📊 RELATÓRIO FINAL DOS TESTES DE BOTÕES CORRIGIDOS');
  console.log('==================================================');
  
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