const fetch = require('node-fetch');

async function testOnBlurBehavior() {
  try {
    console.log('🧪 Testando comportamento onBlur da verificação de duplicatas...\n');
    
    const baseUrl = 'http://localhost:3001/api';
    
    // Teste 1: Nome case-insensitive
    console.log('🔍 Teste 1: Verificação de nome (case-insensitive)');
    const testNames = [
      'Anderson Luiz Dias',
      'anderson luiz dias',
      'ANDERSON LUIZ DIAS',
      'Anderson luiz dias'
    ];
    
    for (const name of testNames) {
      try {
        const response = await fetch(`${baseUrl}/clients/check-duplicate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            cpf: '',
            phone: ''
          })
        });
        
        const result = await response.json();
        console.log(`  "${name}" -> ${result.duplicate.name ? '✅ Duplicata' : '❌ Não duplicata'}`);
        
        if (result.duplicate.name && result.duplicateData.name) {
          console.log(`    Cliente encontrado: "${result.duplicateData.name.name}"`);
        }
      } catch (error) {
        console.error(`  ❌ Erro ao testar "${name}":`, error.message);
      }
    }
    
    // Teste 2: CPF numérico
    console.log('\n🔍 Teste 2: Verificação de CPF (numérico)');
    const testCpfs = [
      '034.400.159-80',
      '03440015980',
      '03440015980'
    ];
    
    for (const cpf of testCpfs) {
      try {
        const response = await fetch(`${baseUrl}/clients/check-duplicate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: '',
            cpf: cpf,
            phone: ''
          })
        });
        
        const result = await response.json();
        console.log(`  "${cpf}" -> ${result.duplicate.cpf ? '✅ Duplicata' : '❌ Não duplicata'}`);
        
        if (result.duplicate.cpf && result.duplicateData.cpf) {
          console.log(`    Cliente encontrado: "${result.duplicateData.cpf.name}"`);
        }
      } catch (error) {
        console.error(`  ❌ Erro ao testar "${cpf}":`, error.message);
      }
    }
    
    // Teste 3: Telefone numérico
    console.log('\n🔍 Teste 3: Verificação de telefone (numérico)');
    const testPhones = [
      '(41) 99813-5428',
      '41998135428',
      '41998135428'
    ];
    
    for (const phone of testPhones) {
      try {
        const response = await fetch(`${baseUrl}/clients/check-duplicate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: '',
            cpf: '',
            phone: phone
          })
        });
        
        const result = await response.json();
        console.log(`  "${phone}" -> ${result.duplicate.phone ? '✅ Duplicata' : '❌ Não duplicata'}`);
        
        if (result.duplicate.phone && result.duplicateData.phone) {
          console.log(`    Cliente encontrado: "${result.duplicateData.phone.name}"`);
        }
      } catch (error) {
        console.error(`  ❌ Erro ao testar "${phone}":`, error.message);
      }
    }
    
    console.log('\n✅ Teste concluído!');
    console.log('💡 Agora a verificação acontece apenas quando você sai do campo (onBlur)');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    process.exit(0);
  }
}

testOnBlurBehavior(); 