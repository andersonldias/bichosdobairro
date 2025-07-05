const db = require('./src/config/database');

async function testCaseInsensitive() {
  try {
    console.log('🧪 Testando comparação case-insensitive...\n');
    
    // Primeiro, vamos ver o pet existente
    const [existingPets] = await db.query(`
      SELECT p.*, c.name as client_name
      FROM pets p
      LEFT JOIN clients c ON p.client_id = c.id
      ORDER BY p.client_id, p.name
    `);
    
    console.log('📊 Pets existentes:');
    existingPets.forEach(pet => {
      console.log(`  - ID: ${pet.id}, Nome: "${pet.name}", Cliente: ${pet.client_name}`);
    });
    
    if (existingPets.length === 0) {
      console.log('❌ Nenhum pet encontrado para teste');
      return;
    }
    
    const testPet = existingPets[0];
    const testNames = [
      testPet.name,                    // Nome original
      testPet.name.toUpperCase(),      // Tudo maiúsculo
      testPet.name.toLowerCase(),      // Tudo minúsculo
      testPet.name.charAt(0).toUpperCase() + testPet.name.slice(1).toLowerCase(), // Primeira maiúscula
      'dora',                          // Minúsculo
      'DORA',                          // Maiúsculo
      'Dora',                          // Primeira maiúscula
      'dOrA'                           // Misturado
    ];
    
    console.log('\n🔍 Testando diferentes variações do nome:');
    
    for (const testName of testNames) {
      try {
        const [result] = await db.query(`
          SELECT p.*, c.name as client_name
          FROM pets p
          LEFT JOIN clients c ON p.client_id = c.id
          WHERE p.client_id = ? AND LOWER(p.name) = LOWER(?)
          ORDER BY p.created_at ASC LIMIT 1
        `, [testPet.client_id, testName]);
        
        const found = result.length > 0;
        console.log(`  "${testName}" -> ${found ? '✅ Encontrado' : '❌ Não encontrado'}`);
        
        if (found) {
          console.log(`    Pet encontrado: ID ${result[0].id}, Nome: "${result[0].name}"`);
        }
      } catch (error) {
        console.error(`  ❌ Erro ao testar "${testName}":`, error.message);
      }
    }
    
    console.log('\n✅ Teste concluído!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    process.exit(0);
  }
}

testCaseInsensitive(); 