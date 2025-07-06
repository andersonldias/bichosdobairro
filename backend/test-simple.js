const axios = require('axios');

async function testSimple() {
  try {
    // Teste simples com dados mínimos
    const cliente = {
      name: 'Teste Simples',
      cpf: '11111111111',
      phone: '41111111111',
      pets: [
        {
          name: 'Teste Pet',
          species: 'Cachorro'
        }
      ]
    };

    console.log('📤 Enviando dados:', JSON.stringify(cliente, null, 2));
    
    const res = await axios.post('http://localhost:3001/api/clients', cliente);
    
    console.log('✅ Resposta da API:');
    console.log(JSON.stringify(res.data, null, 2));
    
    // Verificar se os pets foram criados
    if (res.data.data && res.data.data.pets) {
      console.log('🐾 Pets criados:', res.data.data.pets.length);
      res.data.data.pets.forEach((pet, index) => {
        console.log(`  ${index + 1}. ${pet.name} (${pet.species})`);
      });
    } else {
      console.log('⚠️ Nenhum pet encontrado na resposta');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
  }
}

testSimple(); 