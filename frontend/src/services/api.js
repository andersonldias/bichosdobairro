import axios from 'axios';

// Configuração base do axios
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 30000, // Aumentar timeout para 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Desabilitar credentials para evitar problemas de CORS
  retry: 3, // Número de tentativas
  retryDelay: 1000, // Delay entre tentativas em ms
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
    
    // Se não há config ou já tentou o máximo de vezes, rejeita
    if (!config || !config.retry || config.retryCount >= config.retry) {
      console.error('❌ Erro na resposta:', error.response?.data || error.message);
      return Promise.reject(error);
    }
    
    // Incrementa contador de tentativas
    config.retryCount = config.retryCount || 0;
    config.retryCount += 1;
    
    console.log(`🔄 Tentativa ${config.retryCount} de ${config.retry} para ${config.url}`);
    
    // Aguarda antes de tentar novamente
    await new Promise(resolve => setTimeout(resolve, config.retryDelay || 1000));
    
    // Tenta novamente
    return api(config);
  }
);

export default api; 