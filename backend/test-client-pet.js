const axios = require('axios');

async function cadastrarClienteComPets() {
  try {
    // Dados fictícios do cliente
    const cliente = {
      name: 'Teste Automatizado',
      cpf: '12345678901',
      phone: '41999999999',
      cep: '80000000',
      street: 'Rua dos Testes',
      neighborhood: 'Bairro Teste',
      city: 'Curitiba',
      state: 'PR',
      number: '123',
      pets: [
        {
          name: 'Rex',
          species: 'Cachorro',
          breed: 'Labrador'
        },
        {
          name: 'Mimi',
          species: 'Gato',
          breed: 'Siamês'
        }
      ]
    };

    // Cadastrar cliente com pets
    const res = await axios.post('http://localhost:3001/api/clients', cliente);
    console.log('Cliente cadastrado:', res.data);

    // Buscar pets cadastrados para o cliente
    const clientId = res.data.data.id;
    const petsRes = await axios.get(`http://localhost:3001/api/pets/client/${clientId}`);
    console.log('Pets cadastrados:', petsRes.data);
  } catch (error) {
    if (error.response) {
      console.error('Erro na resposta da API:', error.response.data);
    } else {
      console.error('Erro ao executar teste:', error.message);
    }
  }
}

cadastrarClienteComPets(); 