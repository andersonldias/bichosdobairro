const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function testDuplicateAPI() {
  console.log('🧪 Testando API de duplicidade...\n');

  try {
    // Teste 1: Verificar se a API está respondendo
    console.log('1️⃣ Testando se a API está respondendo...');
    const response = await axios.get(`${API_BASE}/clients/check-duplicate`, {
      params: {
        name: 'João Silva',
        cpf: '12345678901',
        phone: '11999999999'
      }
    });
    
    console.log('✅ API respondendo:', response.status);
    console.log('📄 Resposta:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Erro ao testar API:', error.message);
    
    if (error.response) {
      console.error('📄 Status:', error.response.status);
      console.error('📄 Dados:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Executar teste
testDuplicateAPI(); 