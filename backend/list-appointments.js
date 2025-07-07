const axios = require('axios');

async function main() {
  try {
    const res = await axios.get('http://localhost:3001/api/appointments');
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('Erro ao buscar agendamentos:', err.message);
    if (err.response) {
      console.error(JSON.stringify(err.response.data, null, 2));
    }
  }
}

main(); 