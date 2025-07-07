const axios = require('axios');

async function testAuth() {
  try {
    console.log('🧪 Testando sistema de autenticação...\n');

    // Teste 1: Verificar se o servidor está rodando
    console.log('1️⃣ Testando conexão com servidor...');
    const healthResponse = await axios.get('http://localhost:3001/');
    console.log('✅ Servidor está rodando');
    console.log('📊 Status:', healthResponse.data.status);
    console.log('');

    // Teste 2: Verificar se a rota de login existe
    console.log('2️⃣ Testando rota de login...');
    try {
      const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
        email: 'admin@petshop.com',
        password: 'admin123'
      });
      
      if (loginResponse.data.success) {
        console.log('✅ Login funcionando!');
        console.log('👤 Usuário:', loginResponse.data.data.user.name);
        console.log('🔑 Token gerado:', loginResponse.data.data.token ? 'Sim' : 'Não');
      } else {
        console.log('❌ Login falhou:', loginResponse.data.message);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('❌ Rota /api/auth/login não encontrada (404)');
        console.log('🔧 Verificando se as rotas estão sendo carregadas...');
        
        // Testar outras rotas para ver se o problema é específico da auth
        try {
          const clientsResponse = await axios.get('http://localhost:3001/api/clients');
          console.log('✅ Rota /api/clients está funcionando');
        } catch (clientsError) {
          console.log('❌ Rota /api/clients também não funciona');
        }
      } else if (error.response?.status === 401) {
        console.log('❌ Credenciais inválidas (401)');
        console.log('💡 Verifique se o usuário admin foi criado corretamente');
      } else {
        console.log('❌ Erro no login:', error.message);
      }
    }

    console.log('\n🔍 Verificando rotas disponíveis...');
    
    // Teste 3: Verificar rotas disponíveis
    const routes = [
      '/api/auth/login',
      '/api/auth/verify',
      '/api/clients',
      '/api/pets',
      '/api/service-types',
      '/api/appointments'
    ];

    for (const route of routes) {
      try {
        await axios.get(`http://localhost:3001${route}`);
        console.log(`✅ ${route} - OK`);
      } catch (error) {
        if (error.response?.status === 404) {
          console.log(`❌ ${route} - 404 (Não encontrada)`);
        } else if (error.response?.status === 401) {
          console.log(`✅ ${route} - 401 (Protegida - OK)`);
        } else {
          console.log(`⚠️  ${route} - ${error.response?.status || 'Erro'}`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Solução: O servidor não está rodando');
      console.log('   Execute: npm run dev');
    }
  }
}

// Executar teste
testAuth(); 