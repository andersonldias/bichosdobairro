const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { 
  authenticateToken, 
  requireAdmin, 
  requireAttendantOrHigher,
  loginLimiter,
  logActivity 
} = require('../middlewares/auth');

// Rotas públicas (não precisam de autenticação)
router.post('/login', loginLimiter, logActivity('LOGIN'), AuthController.login);
router.post('/register', authenticateToken, requireAdmin, logActivity('REGISTER'), AuthController.register);

// Rotas protegidas (precisam de autenticação)
router.get('/verify', authenticateToken, AuthController.verifyToken);
router.post('/change-password', authenticateToken, logActivity('CHANGE_PASSWORD'), AuthController.changePassword);
router.post('/logout', authenticateToken, logActivity('LOGOUT'), AuthController.logout);

// Rotas de gerenciamento de usuários (apenas admin)
router.get('/users', authenticateToken, requireAdmin, logActivity('LIST_USERS'), AuthController.listUsers);
router.get('/users/stats', authenticateToken, requireAdmin, logActivity('USER_STATS'), AuthController.getUserStats);
router.post('/users/:id/change-password', authenticateToken, requireAdmin, logActivity('CHANGE_USER_PASSWORD'), AuthController.changeUserPassword);
router.patch('/users/:id/status', authenticateToken, requireAdmin, logActivity('TOGGLE_USER_STATUS'), AuthController.toggleUserStatus);
router.put('/users/:id', authenticateToken, requireAdmin, logActivity('UPDATE_USER'), AuthController.updateUser);
router.get('/users/:id', authenticateToken, requireAdmin, logActivity('GET_USER'), AuthController.getUserById);

module.exports = router; 