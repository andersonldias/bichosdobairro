const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

// Middleware para verificar token JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso não fornecido'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, config.security.jwtSecret);
    
    // Buscar usuário no banco
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    if (!user.active) {
      return res.status(401).json({
        success: false,
        message: 'Usuário inativo'
      });
    }

    // Adicionar informações do usuário à requisição
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    console.error('Erro na autenticação:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware para verificar permissões específicas
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    // Se roles for um array, verificar se o usuário tem uma das roles
    if (Array.isArray(roles)) {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado. Permissão insuficiente.'
        });
      }
    } else {
      // Se roles for uma string, verificar se o usuário tem essa role específica
      if (req.user.role !== roles) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado. Permissão insuficiente.'
        });
      }
    }

    next();
  };
};

// Middleware para verificar se é admin
const requireAdmin = requireRole('admin');

// Middleware para verificar se é veterinário ou admin
const requireVetOrAdmin = requireRole(['admin', 'veterinario']);

// Middleware para verificar se é atendente ou superior
const requireAttendantOrHigher = requireRole(['admin', 'veterinario', 'atendente']);

// Middleware para rate limiting (opcional)
const rateLimit = require('express-rate-limit');

// Rate limiter mais amigável para desenvolvimento
const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutos (reduzido para desenvolvimento)
  max: 10, // máximo 10 tentativas (aumentado para desenvolvimento)
  message: {
    success: false,
    message: 'Muitas tentativas de login. Tente novamente em 2 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Função para resetar o contador em caso de sucesso
  skipSuccessfulRequests: true,
});

// Middleware para logging de atividades
const logActivity = (action) => {
  return (req, res, next) => {
    const user = req.user;
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    const method = req.method;
    const url = req.originalUrl;

    console.log(`[${timestamp}] ${action} - User: ${user?.name || 'Anonymous'} (${user?.email || 'N/A'}) - IP: ${ip} - ${method} ${url} - UA: ${userAgent}`);

    next();
  };
};

// Middleware para verificar se o usuário pode acessar recursos específicos
const canAccessResource = (resourceType) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const resourceId = req.params.id;

      // Admins podem acessar tudo
      if (user.role === 'admin') {
        return next();
      }

      // Veterinários podem acessar recursos relacionados a pets e agendamentos
      if (user.role === 'veterinario' && ['pets', 'appointments', 'services'].includes(resourceType)) {
        return next();
      }

      // Atendentes podem acessar clientes e pets
      if (user.role === 'atendente' && ['clients', 'pets'].includes(resourceType)) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'Acesso negado a este recurso'
      });
    } catch (error) {
      console.error('Erro na verificação de acesso:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  };
};

// Middleware para verificar se o usuário está ativo
const requireActiveUser = (req, res, next) => {
  if (!req.user.active) {
    return res.status(401).json({
      success: false,
      message: 'Usuário inativo. Entre em contato com o administrador.'
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireVetOrAdmin,
  requireAttendantOrHigher,
  loginLimiter,
  logActivity,
  canAccessResource,
  requireActiveUser
}; 