const express = require('express');
const ClientController = require('../controllers/clientController');

const router = express.Router();

// Rotas de clientes
router.get('/', ClientController.index);
router.get('/search', ClientController.search);
router.get('/stats', ClientController.stats);
router.post('/', ClientController.store);
router.get('/:id', ClientController.show);
router.put('/:id', ClientController.update);
router.delete('/:id', ClientController.destroy);
router.post('/check-duplicate-field', ClientController.checkDuplicateField);

module.exports = router; 