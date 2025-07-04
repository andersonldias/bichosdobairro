const express = require('express');
const PetController = require('../controllers/petController');

const router = express.Router();

// Rotas de pets
router.get('/', PetController.index);
router.get('/search', PetController.search);
router.get('/stats', PetController.stats);
router.get('/species', PetController.species);
router.get('/breeds', PetController.breeds);
router.get('/client/:clientId', PetController.byClient);
router.get('/:id', PetController.show);
router.post('/', PetController.store);
router.put('/:id', PetController.update);
router.delete('/:id', PetController.destroy);

module.exports = router; 