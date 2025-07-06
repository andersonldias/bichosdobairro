const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Rotas para agendamentos
router.get('/', appointmentController.getAll);
router.get('/search', appointmentController.search);
router.get('/stats', appointmentController.getStats);
router.get('/date/:date', appointmentController.getByDate);
router.get('/client/:clientId', appointmentController.getByClient);
router.get('/pet/:petId', appointmentController.getByPet);
router.get('/:id', appointmentController.getById);
router.post('/', appointmentController.create);
router.put('/:id', appointmentController.update);
router.patch('/:id/status', appointmentController.updateStatus);
router.delete('/:id', appointmentController.delete);

module.exports = router; 