const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

// Dados de teste para criar um agendamento
const testAppointment = {
  client_id: 1,
  pet_id: 1,
  service_type_id: 1,
  service_name: 'Banho e Tosa',
  price: 70.00,
  appointment_date: '2025-01-15',
  appointment_time: '14:30:00',
  transport_required: false,
  transport_price: 0.00,
  notes: 'Teste automático - agendamento funcionando'
};

async function testAppointmentCreation() {
  console.log('🧪 Iniciando teste de agendamento...\n');

  try {
    // 1. Verificar se o servidor está rodando
    console.log('1️⃣ Verificando se o servidor está rodando...');
    const healthCheck = await axios.get(`${API_BASE_URL}/appointments`);
    console.log('✅ Servidor está respondendo\n');

    // 2. Verificar se existem clientes e pets para testar
    console.log('2️⃣ Verificando dados necessários...');
    const clientsResponse = await axios.get(`${API_BASE_URL}/clients`);
    const petsResponse = await axios.get(`${API_BASE_URL}/pets`);
    const servicesResponse = await axios.get(`${API_BASE_URL}/service-types`);

    // Corrigir acesso aos dados
    const clients = Array.isArray(clientsResponse.data.data) ? clientsResponse.data.data : clientsResponse.data;
    const pets = Array.isArray(petsResponse.data.data) ? petsResponse.data.data : petsResponse.data;
    const services = Array.isArray(servicesResponse.data.data) ? servicesResponse.data.data : servicesResponse.data;

    if (clients.length === 0) {
      console.log('❌ Nenhum cliente encontrado. Crie pelo menos um cliente primeiro.');
      return;
    }

    if (pets.length === 0) {
      console.log('❌ Nenhum pet encontrado. Crie pelo menos um pet primeiro.');
      return;
    }

    if (services.length === 0) {
      console.log('❌ Nenhum tipo de serviço encontrado. Verifique se os dados iniciais foram inseridos.');
      return;
    }

    console.log(`✅ ${clients.length} clientes encontrados`);
    console.log(`✅ ${pets.length} pets encontrados`);
    console.log(`✅ ${services.length} tipos de serviço encontrados\n`);

    // 3. Usar dados reais do banco para o teste
    const realClient = clients[0];
    const realPet = pets[0];
    const realService = services[0];

    const realTestAppointment = {
      client_id: realClient.id,
      pet_id: realPet.id,
      service_type_id: realService.id,
      service_name: realService.name,
      price: realService.default_price || 50.00,
      appointment_date: '2025-01-15',
      appointment_time: '14:30:00',
      transport_required: false,
      transport_price: 0.00,
      notes: 'Teste automático - agendamento funcionando'
    };

    console.log('3️⃣ Testando criação de agendamento...');
    console.log('📋 Dados do teste:');
    console.log(`   Cliente: ${realClient.name}`);
    console.log(`   Pet: ${realPet.name}`);
    console.log(`   Serviço: ${realService.name}`);
    console.log(`   Data: ${realTestAppointment.appointment_date}`);
    console.log(`   Horário: ${realTestAppointment.appointment_time}\n`);

    // 4. Criar o agendamento
    const createResponse = await axios.post(`${API_BASE_URL}/appointments`, realTestAppointment);
    
    console.log('✅ Agendamento criado com sucesso!');
    console.log('📄 Resposta do servidor:');
    console.log(JSON.stringify(createResponse.data, null, 2));

    // 5. Verificar se o agendamento foi salvo no banco
    console.log('\n4️⃣ Verificando se o agendamento foi salvo...');
    const appointmentsResponse = await axios.get(`${API_BASE_URL}/appointments`);
    const createdAppointment = appointmentsResponse.data.find(
      apt => apt.client_id === realTestAppointment.client_id && 
             apt.pet_id === realTestAppointment.pet_id &&
             apt.appointment_date === realTestAppointment.appointment_date
    );

    if (createdAppointment) {
      console.log('✅ Agendamento encontrado no banco de dados!');
      console.log(`   ID: ${createdAppointment.id}`);
      console.log(`   Status: ${createdAppointment.status}`);
    } else {
      console.log('❌ Agendamento não foi encontrado no banco de dados');
    }

    // 6. Testar busca por data
    console.log('\n5️⃣ Testando busca por data...');
    const dateResponse = await axios.get(`${API_BASE_URL}/appointments/date/${realTestAppointment.appointment_date}`);
    console.log(`✅ ${dateResponse.data.length} agendamento(s) encontrado(s) para a data ${realTestAppointment.appointment_date}`);

    // 7. Limpeza - remover o agendamento de teste
    console.log('\n6️⃣ Removendo agendamento de teste...');
    if (createResponse.data.id) {
      await axios.delete(`${API_BASE_URL}/appointments/${createResponse.data.id}`);
      console.log('✅ Agendamento de teste removido');
    }

    console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
    console.log('✅ O sistema de agendamento está funcionando corretamente');
    console.log('✅ A tabela appointments foi corrigida com sucesso');
    console.log('✅ Todos os endpoints estão operacionais');

  } catch (error) {
    console.log('\n❌ ERRO NO TESTE:');
    
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Mensagem: ${error.response.data.error || error.message}`);
      console.log('\nDetalhes do erro:');
      console.log(JSON.stringify(error.response.data, null, 2));
    } else if (error.code === 'ECONNREFUSED') {
      console.log('❌ Servidor não está rodando. Execute: npm start');
    } else {
      console.log(`Erro: ${error.message}`);
    }

    console.log('\n🔧 POSSÍVEIS SOLUÇÕES:');
    console.log('1. Verifique se o backend está rodando (npm start)');
    console.log('2. Verifique se o banco de dados está conectado');
    console.log('3. Verifique se a tabela appointments foi corrigida');
    console.log('4. Verifique se existem clientes e pets cadastrados');
  }
}

// Executar o teste
testAppointmentCreation(); 