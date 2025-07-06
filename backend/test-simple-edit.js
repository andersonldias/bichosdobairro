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

// Teste simples de edição
async function testSimpleEdit() {
  console.log('🔧 Teste Simples de Edição de Cliente\n');
  
  try {
    // 1. Criar cliente
    log.test('1. Criando cliente...');
    const cliente = {
      name: 'Teste Simples',
      cpf: '12345678901',
      phone: '41123456789',
      cep: '80000000',
      street: 'Rua Teste',
      neighborhood: 'Bairro Teste',
      city: 'Curitiba',
      state: 'PR',
      number: '123'
    };
    
    const createResponse = await axios.post(`${API_BASE}/clients`, cliente);
    console.log('Resposta da criação:', createResponse.data);
    
    if (!createResponse.data.success) {
      log.error('Falha na criação');
      return;
    }
    
    const clientId = createResponse.data.data.id;
    log.success(`Cliente criado com ID: ${clientId}`);
    
    // 2. Buscar cliente
    log.test('2. Buscando cliente...');
    try {
      const getResponse = await axios.get(`${API_BASE}/clients/${clientId}`);
      console.log('Resposta da busca:', getResponse.data);
      
      if (getResponse.data.success) {
        log.success('Cliente encontrado!');
      } else {
        log.error('Cliente não encontrado');
      }
    } catch (error) {
      log.error('Erro na busca:');
      console.log('Status:', error.response?.status);
      console.log('Data:', error.response?.data);
      console.log('Message:', error.message);
    }
    
    // 3. Atualizar cliente
    log.test('3. Atualizando cliente...');
    try {
      const updateData = {
        name: 'Teste Atualizado',
        cpf: '12345678901',
        phone: '41123456789',
        cep: '80000000',
        street: 'Rua Atualizada',
        neighborhood: 'Bairro Teste',
        city: 'Curitiba',
        state: 'PR',
        number: '123'
      };
      
      const updateResponse = await axios.put(`${API_BASE}/clients/${clientId}`, updateData);
      console.log('Resposta da atualização:', updateResponse.data);
      
      if (updateResponse.data.success) {
        log.success('Cliente atualizado!');
      } else {
        log.error('Falha na atualização');
      }
    } catch (error) {
      log.error('Erro na atualização:');
      console.log('Status:', error.response?.status);
      console.log('Data:', error.response?.data);
      console.log('Message:', error.message);
    }
    
    // 4. Limpar
    log.test('4. Excluindo cliente...');
    try {
      await axios.delete(`${API_BASE}/clients/${clientId}`);
      log.success('Cliente excluído');
    } catch (error) {
      log.error('Erro na exclusão:', error.message);
    }
    
  } catch (error) {
    log.error('Erro geral:', error.message);
  }
}

// Executar teste
testSimpleEdit(); 