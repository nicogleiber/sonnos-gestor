const express = require('express');
const gymController = require('../controllers/gym.controller');

const router = express.Router({ mergeParams: true });

// CRUD de Sedes: GET /, GET /:sedeId, POST /, PUT /:sedeId, DELETE /:sedeId
router.get('/', gymController.getSedes);
router.get('/:sedeId', gymController.getSedeById);
router.post('/', gymController.addSede);
router.put('/:sedeId', gymController.updateSede);
router.delete('/:sedeId', gymController.deleteSede);

module.exports = router;
