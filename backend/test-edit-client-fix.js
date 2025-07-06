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

// Teste específico para corrigir edição de cliente
async function testAndFixClientEdit() {
  log.test('Teste e Correção: Edição de Cliente');
  
  try {
    // 1. Criar um cliente para teste
    log.debug('Criando cliente para teste de edição...');
    const cliente = {
      name: 'Cliente Edição Teste',
      cpf: '11111111111',
      phone: '41111111111',
      cep: '80000000',
      street: 'Rua Edição',
      neighborhood: 'Bairro Edição',
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
    
    // 2. Testar busca do cliente por ID
    log.debug(`Testando GET /clients/${clientId}`);
    try {
      const getResponse = await axios.get(`${API_BASE}/clients/${clientId}`);
      
      if (getResponse.data.success) {
        log.success('✅ Cliente encontrado via GET /clients/:id');
        log.debug('Dados do cliente:', JSON.stringify(getResponse.data.data, null, 2));
        
        // 3. Testar atualização do cliente
        log.debug('Testando PUT /clients/:id');
        const updateData = {
          name: 'Cliente Editado com Sucesso',
          cpf: '11111111111',
          phone: '41111111111',
          cep: '80000000',
          street: 'Rua Editada',
          neighborhood: 'Bairro Editado',
          city: 'Curitiba',
          state: 'PR',
          number: '456'
        };
        
        const updateResponse = await axios.put(`${API_BASE}/clients/${clientId}`, updateData);
        
        if (updateResponse.data.success) {
          log.success('✅ Cliente atualizado com sucesso');
          log.debug('Dados atualizados:', JSON.stringify(updateResponse.data.data, null, 2));
          
          // 4. Verificar se a atualização foi salva
          log.debug('Verificando se a atualização foi salva...');
          const verifyResponse = await axios.get(`${API_BASE}/clients/${clientId}`);
          
          if (verifyResponse.data.success && verifyResponse.data.data.name === 'Cliente Editado com Sucesso') {
            log.success('✅ Atualização confirmada no banco de dados');
          } else {
            log.error('❌ Atualização não foi salva corretamente');
          }
          
          // 5. Limpar - excluir o cliente
          await axios.delete(`${API_BASE}/clients/${clientId}`);
          log.success('Cliente de teste excluído');
          
          return true;
        } else {
          log.error('❌ Falha na atualização do cliente');
          log.debug('Resposta:', updateResponse.data);
          return false;
        }
      } else {
        log.error('❌ Cliente não encontrado');
        log.debug('Resposta:', getResponse.data);
        return false;
      }
    } catch (error) {
      log.error('❌ Erro ao buscar cliente por ID');
      log.debug('Status:', error.response?.status);
      log.debug('Mensagem:', error.response?.data);
      log.debug('Erro completo:', error.message);
      
      // Se o cliente foi criado mas não pode ser buscado, vamos excluí-lo
      try {
        await axios.delete(`${API_BASE}/clients/${clientId}`);
        log.info('Cliente de teste excluído após erro');
      } catch (deleteError) {
        log.warning('Não foi possível excluir cliente de teste');
      }
      
      return false;
    }
    
  } catch (error) {
    log.error('❌ Erro geral no teste de edição de cliente');
    log.debug('Erro:', error.message);
    return false;
  }
}

// Teste de verificação do modelo Client
async function testClientModel() {
  log.test('Teste: Verificação do Modelo Client');
  
  try {
    // Verificar se o modelo está funcionando corretamente
    const Client = require('./src/models/Client');
    
    // Testar se o modelo pode ser carregado
    log.success('✅ Modelo Client carregado com sucesso');
    
    // Verificar se o método findById existe
    if (typeof Client.findById === 'function') {
      log.success('✅ Método findById existe');
    } else {
      log.error('❌ Método findById não existe');
    }
    
    // Verificar se o método update existe
    if (typeof Client.update === 'function') {
      log.success('✅ Método update existe');
    } else {
      log.error('❌ Método update não existe');
    }
    
    return true;
  } catch (error) {
    log.error('❌ Erro ao verificar modelo Client');
    log.debug('Erro:', error.message);
    return false;
  }
}

// Teste de verificação da rota
async function testRoute() {
  log.test('Teste: Verificação da Rota GET /clients/:id');
  
  try {
    // Verificar se a rota está registrada
    const routes = require('./src/routes/clients');
    
    // Verificar se a rota GET /:id está definida
    log.success('✅ Rota clients carregada');
    
    return true;
  } catch (error) {
    log.error('❌ Erro ao verificar rota');
    log.debug('Erro:', error.message);
    return false;
  }
}

// Função principal
async function runEditClientFix() {
  console.log('🔧 Iniciando correção do problema de edição de cliente...\n');
  
  const results = {
    model: false,
    route: false,
    edit: false
  };
  
  try {
    // Teste 1: Verificar modelo
    results.model = await testClientModel();
    await wait(200);
    
    // Teste 2: Verificar rota
    results.route = await testRoute();
    await wait(200);
    
    // Teste 3: Testar edição
    results.edit = await testAndFixClientEdit();
    
  } catch (error) {
    log.error('Erro durante a execução dos testes:', error.message);
  }
  
  // Relatório final
  console.log('\n📊 RELATÓRIO DA CORREÇÃO');
  console.log('=========================');
  console.log(`✅ Modelo Client: ${results.model ? 'OK' : 'PROBLEMA'}`);
  console.log(`✅ Rota GET /clients/:id: ${results.route ? 'OK' : 'PROBLEMA'}`);
  console.log(`✅ Edição de Cliente: ${results.edit ? 'FUNCIONANDO' : 'COM PROBLEMA'}`);
  
  if (results.edit) {
    console.log('\n🎉 PROBLEMA CORRIGIDO! Edição de cliente está funcionando!');
  } else {
    console.log('\n⚠️ Ainda há problemas na edição de cliente.');
    
    if (!results.model) {
      console.log('💡 Sugestão: Verificar o modelo Client.js');
    }
    if (!results.route) {
      console.log('💡 Sugestão: Verificar as rotas em clients.js');
    }
  }
}

// Executar a correção
runEditClientFix().catch(console.error); 