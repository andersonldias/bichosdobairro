const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://192.168.15.15:5173',
    'capacitor://localhost',
    'http://localhost'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API do Sistema de Gerenciamento de Petshop',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Importar rotas
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const petRoutes = require('./routes/pets');
const serviceTypeRoutes = require('./routes/serviceTypes');
const appointmentRoutes = require('./routes/appointments');

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/service-types', serviceTypeRoutes);
app.use('/api/appointments', appointmentRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL Local: http://localhost:${PORT}`);
  console.log(`🌐 URL Rede: http://192.168.15.15:${PORT}`);
  console.log(`🔒 Sistema de segurança ativo`);
});

module.exports = app; 