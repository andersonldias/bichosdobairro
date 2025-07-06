const express = require('express');
const router = express.Router();
const serviceTypeController = require('../controllers/serviceTypeController');

// Rotas para tipos de serviço
router.get('/', serviceTypeController.getAll);
router.get('/search', serviceTypeController.search);
router.get('/:id', serviceTypeController.getById);
router.get('/name/:name', serviceTypeController.getByName);
router.post('/', serviceTypeController.create);
router.put('/:id', serviceTypeController.update);
router.delete('/:id', serviceTypeController.delete);

module.exports = router; 