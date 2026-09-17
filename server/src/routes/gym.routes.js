const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const gymController = require('../controllers/gym.controller');

const router = express.Router();

// Perfil del Gimnasio
router.get('/', authenticate, authorize(), gymController.getGym);
router.put('/', authenticate, authorize(['admin']), gymController.updateGym);

// CRUD de Sedes
router.get('/sedes', authenticate, authorize(), gymController.getSedes);
router.post('/sedes', authenticate, authorize(['admin']), gymController.addSede);
router.put('/sedes/:sedeId', authenticate, authorize(['admin']), gymController.updateSede);
router.delete('/sedes/:sedeId', authenticate, authorize(['admin']), gymController.deleteSede);

module.exports = router;