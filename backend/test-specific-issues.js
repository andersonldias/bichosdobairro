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
  debug: (msg) => console.log(`🔍 ${msg}`)
};

// Função para aguardar
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Teste específico para problema de edição de cliente
async function testClientEditIssue() {
  log.test('Teste Específico: Problema na edição de cliente');
  
  try {
    // 1. Criar um cliente para teste
    log.debug('Criando cliente para teste...');
    const cliente = {
      name: 'Cliente Teste Edição',
      cpf: '11111111111',
      phone: '41111111111',
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
    log.success(`Cliente criado com ID: ${clientId}`);
    
    // 2. Tentar buscar o cliente por ID
    log.debug(`Tentando buscar cliente com ID: ${clientId}`);
    try {
      const getResponse = await axios.get(`${API_BASE}/clients/${clientId}`);
      log.success('Cliente encontrado via GET /clients/:id');
      log.debug('Dados do cliente:', getResponse.data);
    } catch (error) {
      log.error('Erro ao buscar cliente por ID');
      log.debug('Status:', error.response?.status);
      log.debug('Mensagem:', error.response?.data);
      return false;
    }
    
    // 3. Tentar atualizar o cliente
    log.debug('Tentando atualizar cliente...');
    const updateData = {
      name: 'Cliente Teste Editado',
      cpf: '11111111111',
      phone: '41111111111',
      cep: '80000000',
      street: 'Rua Teste Editada',
      neighborhood: 'Bairro Teste',
      city: 'Curitiba',
      state: 'PR',
      number: '123'
    };
    
    try {
      const updateResponse = await axios.put(`${API_BASE}/clients/${clientId}`, updateData);
      log.success('Cliente atualizado com sucesso');
      log.debug('Dados atualizados:', updateResponse.data);
    } catch (error) {
      log.error('Erro ao atualizar cliente');
      log.debug('Status:', error.response?.status);
      log.debug('Mensagem:', error.response?.data);
      return false;
    }
    
    // 4. Limpar - excluir o cliente
    await axios.delete(`${API_BASE}/clients/${clientId}`);
    log.success('Cliente de teste excluído');
    
    return true;
  } catch (error) {
    log.error('Erro geral no teste de edição de cliente');
    log.debug('Erro:', error.message);
    return false;
  }
}

// Teste específico para problema de edição de pet
async function testPetEditIssue() {
  log.test('Teste Específico: Problema na edição de pet');
  
  try {
    // 1. Criar um cliente primeiro
    log.debug('Criando cliente para teste de pet...');
    const cliente = {
      name: 'Cliente Pet Teste',
      cpf: '22222222222',
      phone: '41222222222',
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
    log.success(`Cliente criado com ID: ${clientId}`);
    
    // 2. Criar um pet
    log.debug('Criando pet para teste...');
    const petData = {
      name: 'Pet Teste Edição',
      species: 'Cachorro',
      breed: 'Labrador',
      client_id: clientId
    };
    
    const createResponse = await axios.post(`${API_BASE}/pets`, petData);
    
    if (!createResponse.data.success) {
      log.error('Falha ao criar pet para teste');
      return false;
    }
    
    const petId = createResponse.data.data.id;
    log.success(`Pet criado com ID: ${petId}`);
    
    // 3. Tentar buscar o pet por ID
    log.debug(`Tentando buscar pet com ID: ${petId}`);
    try {
      const getResponse = await axios.get(`${API_BASE}/pets/${petId}`);
      log.success('Pet encontrado via GET /pets/:id');
      log.debug('Dados do pet:', getResponse.data);
    } catch (error) {
      log.error('Erro ao buscar pet por ID');
      log.debug('Status:', error.response?.status);
      log.debug('Mensagem:', error.response?.data);
      return false;
    }
    
    // 4. Tentar atualizar o pet
    log.debug('Tentando atualizar pet...');
    const updateData = {
      name: 'Pet Teste Editado',
      species: 'Cachorro',
      breed: 'Golden Retriever',
      client_id: clientId
    };
    
    try {
      const updateResponse = await axios.put(`${API_BASE}/pets/${petId}`, updateData);
      log.success('Pet atualizado com sucesso');
      log.debug('Dados atualizados:', updateResponse.data);
    } catch (error) {
      log.error('Erro ao atualizar pet');
      log.debug('Status:', error.response?.status);
      log.debug('Mensagem:', error.response?.data);
      return false;
    }
    
    // 5. Limpar - excluir pet e cliente
    await axios.delete(`${API_BASE}/pets/${petId}`);
    await axios.delete(`${API_BASE}/clients/${clientId}`);
    log.success('Pet e cliente de teste excluídos');
    
    return true;
  } catch (error) {
    log.error('Erro geral no teste de edição de pet');
    log.debug('Erro:', error.message);
    return false;
  }
}

// Teste de verificação de rotas
async function testRoutesAvailability() {
  log.test('Teste: Verificação de disponibilidade das rotas');
  
  const routes = [
    { method: 'GET', path: '/clients', name: 'Listar clientes' },
    { method: 'POST', path: '/clients', name: 'Criar cliente' },
    { method: 'GET', path: '/clients/1', name: 'Buscar cliente por ID' },
    { method: 'PUT', path: '/clients/1', name: 'Atualizar cliente' },
    { method: 'DELETE', path: '/clients/1', name: 'Excluir cliente' },
    { method: 'GET', path: '/pets', name: 'Listar pets' },
    { method: 'POST', path: '/pets', name: 'Criar pet' },
    { method: 'GET', path: '/pets/1', name: 'Buscar pet por ID' },
    { method: 'PUT', path: '/pets/1', name: 'Atualizar pet' },
    { method: 'DELETE', path: '/pets/1', name: 'Excluir pet' }
  ];
  
  for (const route of routes) {
    try {
      log.debug(`Testando ${route.method} ${route.path} - ${route.name}`);
      
      let response;
      if (route.method === 'GET') {
        response = await axios.get(`${API_BASE}${route.path}`);
      } else if (route.method === 'POST') {
        response = await axios.post(`${API_BASE}${route.path}`, {});
      } else if (route.method === 'PUT') {
        response = await axios.put(`${API_BASE}${route.path}`, {});
      } else if (route.method === 'DELETE') {
        response = await axios.delete(`${API_BASE}${route.path}`);
      }
      
      log.success(`✅ ${route.method} ${route.path} - ${route.name} (Status: ${response.status})`);
    } catch (error) {
      const status = error.response?.status || 'Erro';
      const message = error.response?.data?.message || error.message;
      log.error(`❌ ${route.method} ${route.path} - ${route.name} (Status: ${status})`);
      log.debug(`   Mensagem: ${message}`);
    }
    
    await wait(100);
  }
}

// Função principal
async function runSpecificTests() {
  console.log('🔍 Iniciando testes específicos para identificar problemas...\n');
  
  try {
    // Teste 1: Verificar disponibilidade das rotas
    await testRoutesAvailability();
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Teste 2: Problema específico de edição de cliente
    const clientEditResult = await testClientEditIssue();
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Teste 3: Problema específico de edição de pet
    const petEditResult = await testPetEditIssue();
    
    // Relatório final
    console.log('\n📊 RELATÓRIO DOS TESTES ESPECÍFICOS');
    console.log('====================================');
    console.log(`✅ Edição de Cliente: ${clientEditResult ? 'FUNCIONANDO' : 'COM PROBLEMA'}`);
    console.log(`✅ Edição de Pet: ${petEditResult ? 'FUNCIONANDO' : 'COM PROBLEMA'}`);
    
    if (clientEditResult && petEditResult) {
      console.log('\n🎉 Todos os problemas foram resolvidos!');
    } else {
      console.log('\n⚠️ Ainda há problemas a serem investigados.');
    }
    
  } catch (error) {
    log.error('Erro durante a execução dos testes específicos:', error.message);
  }
}

// Executar os testes específicos
runSpecificTests().catch(console.error); 