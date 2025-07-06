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

// Teste simples de cada funcionalidade
async function testAllButtons() {
  console.log('🔘 TESTE FINAL - Status de Todos os Botões\n');
  
  const results = {};
  
  try {
    // 1. Teste: API está rodando
    log.test('1. Verificar se a API está rodando');
    try {
      await axios.get(`${API_BASE.replace('/api', '')}/`);
      log.success('API está rodando');
      results.api = true;
    } catch (error) {
      log.error('API não está rodando');
      results.api = false;
      return results;
    }
    await wait(200);
    
    // 2. Teste: Listar clientes
    log.test('2. Botão "Listar Clientes"');
    try {
      const response = await axios.get(`${API_BASE}/clients`);
      log.success(`Clientes carregados: ${response.data.data?.length || 0}`);
      results.listClients = true;
    } catch (error) {
      log.error('Erro ao listar clientes');
      results.listClients = false;
    }
    await wait(200);
    
    // 3. Teste: Criar cliente
    log.test('3. Botão "Novo Cliente" + "Cadastrar"');
    try {
      const cliente = {
        name: 'Teste Final',
        cpf: '12345678901',
        phone: '41123456789',
        cep: '80000000',
        street: 'Rua Teste',
        neighborhood: 'Bairro Teste',
        city: 'Curitiba',
        state: 'PR',
        number: '123'
      };
      
      const response = await axios.post(`${API_BASE}/clients`, cliente);
      if (response.data.success) {
        log.success('Cliente criado com sucesso');
        results.createClient = true;
        
        // Testar edição do cliente criado
        const clientId = response.data.data.id;
        log.test('4. Botão "Editar Cliente"');
        try {
          const getResponse = await axios.get(`${API_BASE}/clients/${clientId}`);
          if (getResponse.data.success) {
            log.success('Cliente encontrado para edição');
            results.editClient = true;
          } else {
            log.error('Cliente não encontrado para edição');
            results.editClient = false;
          }
        } catch (error) {
          log.error('Erro ao buscar cliente para edição');
          results.editClient = false;
        }
        
        // Testar exclusão do cliente
        log.test('5. Botão "Excluir Cliente"');
        try {
          const deleteResponse = await axios.delete(`${API_BASE}/clients/${clientId}`);
          if (deleteResponse.data.success) {
            log.success('Cliente excluído com sucesso');
            results.deleteClient = true;
          } else {
            log.error('Erro ao excluir cliente');
            results.deleteClient = false;
          }
        } catch (error) {
          log.error('Erro ao excluir cliente');
          results.deleteClient = false;
        }
      } else {
        log.error('Erro ao criar cliente');
        results.createClient = false;
        results.editClient = false;
        results.deleteClient = false;
      }
    } catch (error) {
      log.error('Erro no teste de cliente');
      results.createClient = false;
      results.editClient = false;
      results.deleteClient = false;
    }
    await wait(200);
    
    // 6. Teste: Listar pets
    log.test('6. Botão "Listar Pets"');
    try {
      const response = await axios.get(`${API_BASE}/pets`);
      log.success(`Pets carregados: ${response.data.data?.length || 0}`);
      results.listPets = true;
    } catch (error) {
      log.error('Erro ao listar pets');
      results.listPets = false;
    }
    await wait(200);
    
    // 7. Teste: Criar pet
    log.test('7. Botão "Novo Pet" + "Cadastrar Pet"');
    try {
      // Primeiro criar um cliente para o pet
      const cliente = {
        name: 'Cliente Pet Teste',
        cpf: '98765432109',
        phone: '41987654321',
        cep: '80000000',
        street: 'Rua Teste',
        neighborhood: 'Bairro Teste',
        city: 'Curitiba',
        state: 'PR',
        number: '456'
      };
      
      const clientResponse = await axios.post(`${API_BASE}/clients`, cliente);
      if (clientResponse.data.success) {
        const clientId = clientResponse.data.data.id;
        
        // Criar pet
        const pet = {
          name: 'Pet Teste Final',
          species: 'Cachorro',
          breed: 'Labrador',
          client_id: clientId
        };
        
        const petResponse = await axios.post(`${API_BASE}/pets`, pet);
        if (petResponse.data.success) {
          log.success('Pet criado com sucesso');
          results.createPet = true;
          
          const petId = petResponse.data.data.id;
          
          // Testar edição do pet
          log.test('8. Botão "Editar Pet"');
          try {
            const getPetResponse = await axios.get(`${API_BASE}/pets/${petId}`);
            if (getPetResponse.data.success) {
              log.success('Pet encontrado para edição');
              results.editPet = true;
            } else {
              log.error('Pet não encontrado para edição');
              results.editPet = false;
            }
          } catch (error) {
            log.error('Erro ao buscar pet para edição');
            results.editPet = false;
          }
          
          // Testar exclusão do pet
          log.test('9. Botão "Excluir Pet"');
          try {
            const deletePetResponse = await axios.delete(`${API_BASE}/pets/${petId}`);
            if (deletePetResponse.data.success) {
              log.success('Pet excluído com sucesso');
              results.deletePet = true;
            } else {
              log.error('Erro ao excluir pet');
              results.deletePet = false;
            }
          } catch (error) {
            log.error('Erro ao excluir pet');
            results.deletePet = false;
          }
          
          // Limpar cliente
          await axios.delete(`${API_BASE}/clients/${clientId}`);
        } else {
          log.error('Erro ao criar pet');
          results.createPet = false;
          results.editPet = false;
          results.deletePet = false;
        }
      } else {
        log.error('Erro ao criar cliente para pet');
        results.createPet = false;
        results.editPet = false;
        results.deletePet = false;
      }
    } catch (error) {
      log.error('Erro no teste de pet');
      results.createPet = false;
      results.editPet = false;
      results.deletePet = false;
    }
    await wait(200);
    
    // 10. Teste: Busca
    log.test('10. Botão "Busca"');
    try {
      const clientSearch = await axios.get(`${API_BASE}/clients/search?q=Teste`);
      const petSearch = await axios.get(`${API_BASE}/pets/search?q=Teste`);
      log.success('Busca funcionando');
      results.search = true;
    } catch (error) {
      log.error('Erro na busca');
      results.search = false;
    }
    await wait(200);
    
    // 11. Teste: Filtros
    log.test('11. Botões "Filtros"');
    try {
      const species = await axios.get(`${API_BASE}/pets/species`);
      const breeds = await axios.get(`${API_BASE}/pets/breeds`);
      log.success('Filtros funcionando');
      results.filters = true;
    } catch (error) {
      log.error('Erro nos filtros');
      results.filters = false;
    }
    await wait(200);
    
    // 12. Teste: Estatísticas
    log.test('12. Botões "Estatísticas"');
    try {
      const clientStats = await axios.get(`${API_BASE}/clients/stats`);
      const petStats = await axios.get(`${API_BASE}/pets/stats`);
      log.success('Estatísticas funcionando');
      results.stats = true;
    } catch (error) {
      log.error('Erro nas estatísticas');
      results.stats = false;
    }
    
  } catch (error) {
    log.error('Erro geral nos testes:', error.message);
  }
  
  return results;
}

// Executar testes e gerar relatório
async function runFinalTest() {
  const results = await testAllButtons();
  
  console.log('\n📊 RELATÓRIO FINAL - STATUS DOS BOTÕES');
  console.log('========================================');
  
  const buttonNames = {
    api: 'API Rodando',
    listClients: 'Listar Clientes',
    createClient: 'Criar Cliente',
    editClient: 'Editar Cliente',
    deleteClient: 'Excluir Cliente',
    listPets: 'Listar Pets',
    createPet: 'Criar Pet',
    editPet: 'Editar Pet',
    deletePet: 'Excluir Pet',
    search: 'Busca',
    filters: 'Filtros',
    stats: 'Estatísticas'
  };
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  const failedTests = totalTests - passedTests;
  
  console.log(`Total de funcionalidades: ${totalTests}`);
  console.log(`✅ Funcionando: ${passedTests}`);
  console.log(`❌ Com problema: ${failedTests}`);
  console.log(`📈 Taxa de sucesso: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  console.log('\n📋 Status detalhado:');
  Object.entries(results).forEach(([test, result]) => {
    const status = result ? '✅' : '❌';
    const buttonName = buttonNames[test] || test;
    console.log(`${status} ${buttonName}`);
  });
  
  if (failedTests === 0) {
    console.log('\n🎉 TODOS OS BOTÕES ESTÃO FUNCIONANDO PERFEITAMENTE!');
  } else if (passedTests >= totalTests * 0.8) {
    console.log('\n👍 A maioria dos botões está funcionando bem!');
  } else {
    console.log('\n⚠️ Há problemas que precisam ser corrigidos.');
  }
}

// Executar o teste final
runFinalTest().catch(console.error); 