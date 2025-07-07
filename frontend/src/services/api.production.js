import axios from 'axios';

// Configuração da API para produção
const getBaseURL = () => {
  // URL da API no seu servidor
  return 'https://www.bichosdobairro.com.br/api';
  // Alternativa com subdomínio: 'https://api.bichosdobairro.com.br/api'
};

// Configuração base do axios para produção
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
  retry: 3,
  retryDelay: 1000,
});

// Interceptor para requisições
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respostas
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} - ${response.config.url}`);
    return response;
  },
  async (error) => {
    const { config } = error;
    
    if (!config || !config.retry || config.retryCount >= config.retry) {
      console.error('❌ Erro na resposta:', error.response?.data || error.message);
      return Promise.reject(error);
    }
    
    config.retryCount = config.retryCount || 0;
    config.retryCount += 1;
    
    console.log(`🔄 Tentativa ${config.retryCount} de ${config.retry} para ${config.url}`);
    
    await new Promise(resolve => setTimeout(resolve, config.retryDelay || 1000));
    
    return api(config);
  }
);

export default api; 