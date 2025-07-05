const http = require('http');

function testSimpleDuplicate() {
  console.log('🧪 Teste simples da API de duplicatas...\n');
  
  const testData = {
    name: 'Anderson Luiz Dias',
    cpf: '',
    phone: ''
  };
  
  console.log('📤 Enviando dados:', testData);
  
  const postData = JSON.stringify(testData);
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/clients/check-duplicate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  const req = http.request(options, (res) => {
    console.log('📊 Status da resposta:', res.statusCode);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log('✅ Resposta da API:', JSON.stringify(result, null, 2));
        
        if (result.duplicate && result.duplicate.name) {
          console.log('🎯 Duplicata encontrada!');
          if (result.duplicateData && result.duplicateData.name) {
            console.log('👤 Cliente duplicado:', result.duplicateData.name.name);
          }
        } else {
          console.log('❌ Nenhuma duplicata encontrada');
        }
      } catch (error) {
        console.log('❌ Erro ao parsear resposta:', error.message);
        console.log('📄 Resposta bruta:', data);
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('❌ Erro na requisição:', error.message);
  });
  
  req.write(postData);
  req.end();
}

testSimpleDuplicate(); 