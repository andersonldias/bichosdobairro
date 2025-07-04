require('dotenv').config();

const config = {
  // Configurações do servidor
  server: {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
  },

  // Configurações do banco de dados
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'petshop_db',
    port: parseInt(process.env.DB_PORT) || 3306,
    ssl: process.env.DB_SSL === 'true',
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    timezone: 'local',
    charset: 'utf8mb4'
  },

  // Configurações de segurança
  security: {
    jwtSecret: process.env.JWT_SECRET || 'sua_chave_secreta_aqui',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  // Configurações de serviços externos
  services: {
    // API de CEP (ViaCEP)
    viaCep: {
      baseUrl: 'https://viacep.com.br/ws'
    }
  }
};

// Função para validar configurações
function validateConfig() {
  const required = ['database.host', 'database.user', 'database.database'];
  const missing = [];

  required.forEach(path => {
    const keys = path.split('.');
    let value = config;
    keys.forEach(key => {
      value = value[key];
    });
    if (!value) {
      missing.push(path);
    }
  });

  if (missing.length > 0) {
    console.warn('⚠️  Configurações ausentes:', missing.join(', '));
    console.warn('💡 Configure as variáveis de ambiente ou use os valores padrão');
  }

  return missing.length === 0;
}

// Validar configurações na inicialização
validateConfig();

module.exports = config; 