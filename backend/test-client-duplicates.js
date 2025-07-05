const db = require('./src/config/database');

async function testClientDuplicates() {
  try {
    console.log('🧪 Testando verificação de duplicatas de clientes...\n');
    
    // Primeiro, vamos ver os clientes existentes
    const [clients] = await db.query('SELECT * FROM clients ORDER BY name');
    
    console.log('📊 Clientes existentes:');
    clients.forEach(client => {
      console.log(`  - ID: ${client.id}, Nome: "${client.name}", CPF: ${client.cpf}, Telefone: ${client.phone}`);
    });
    
    if (clients.length === 0) {
      console.log('❌ Nenhum cliente encontrado para teste');
      return;
    }
    
    const testClient = clients[0];
    
    console.log('\n🔍 Testando comparação case-insensitive para NOME:');
    const testNames = [
      testClient.name,
      testClient.name.toUpperCase(),
      testClient.name.toLowerCase(),
      testClient.name.charAt(0).toUpperCase() + testClient.name.slice(1).toLowerCase(),
      'anderson luiz dias',
      'ANDERSON LUIZ DIAS',
      'Anderson Luiz Dias'
    ];
    
    for (const testName of testNames) {
      try {
        const [result] = await db.query('SELECT * FROM clients WHERE LOWER(name) = LOWER(?)', [testName]);
        const found = result.length > 0;
        console.log(`  "${testName}" -> ${found ? '✅ Encontrado' : '❌ Não encontrado'}`);
        
        if (found) {
          console.log(`    Cliente encontrado: ID ${result[0].id}, Nome: "${result[0].name}"`);
        }
      } catch (error) {
        console.error(`  ❌ Erro ao testar "${testName}":`, error.message);
      }
    }
    
    console.log('\n🔍 Testando comparação numérica para CPF:');
    const testCpfs = [
      testClient.cpf,
      testClient.cpf.replace(/[^0-9]/g, ''),
      testClient.cpf.replace(/\./g, '').replace(/-/g, ''),
      '12345678901', // CPF que não existe
      '000.000.000-00'
    ];
    
    for (const testCpf of testCpfs) {
      try {
        const cleanCpf = testCpf.replace(/[^0-9]/g, '');
        if (cleanCpf.length === 11) {
          const [result] = await db.query('SELECT * FROM clients WHERE REPLACE(REPLACE(REPLACE(cpf, ".", ""), "-", ""), " ", "") = ?', [cleanCpf]);
          const found = result.length > 0;
          console.log(`  "${testCpf}" -> ${found ? '✅ Encontrado' : '❌ Não encontrado'}`);
          
          if (found) {
            console.log(`    Cliente encontrado: ID ${result[0].id}, Nome: "${result[0].name}", CPF: ${result[0].cpf}`);
          }
        } else {
          console.log(`  "${testCpf}" -> ❌ CPF inválido (${cleanCpf.length} dígitos)`);
        }
      } catch (error) {
        console.error(`  ❌ Erro ao testar "${testCpf}":`, error.message);
      }
    }
    
    console.log('\n🔍 Testando comparação numérica para TELEFONE:');
    const testPhones = [
      testClient.phone,
      testClient.phone.replace(/[^0-9]/g, ''),
      testClient.phone.replace(/[\(\)\-\s]/g, ''),
      '(11) 99999-9999', // Telefone que não existe
      '11999999999'
    ];
    
    for (const testPhone of testPhones) {
      try {
        const cleanPhone = testPhone.replace(/[^0-9]/g, '');
        if (cleanPhone.length >= 10) {
          const [result] = await db.query('SELECT * FROM clients WHERE REPLACE(REPLACE(REPLACE(REPLACE(phone, "(", ""), ")", ""), "-", ""), " ", "") = ?', [cleanPhone]);
          const found = result.length > 0;
          console.log(`  "${testPhone}" -> ${found ? '✅ Encontrado' : '❌ Não encontrado'}`);
          
          if (found) {
            console.log(`    Cliente encontrado: ID ${result[0].id}, Nome: "${result[0].name}", Telefone: ${result[0].phone}`);
          }
        } else {
          console.log(`  "${testPhone}" -> ❌ Telefone inválido (${cleanPhone.length} dígitos)`);
        }
      } catch (error) {
        console.error(`  ❌ Erro ao testar "${testPhone}":`, error.message);
      }
    }
    
    console.log('\n✅ Teste concluído!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    process.exit(0);
  }
}

testClientDuplicates(); 