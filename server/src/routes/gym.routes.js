const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const gymController = require('../controllers/gym.controller');

const router = express.Router({ mergeParams: true });

// ── CRUD de Sedes (/sedes y /configuracion/sedes) ───────
router.get('/sedes', authenticate, authorize(), gymController.getSedes);
router.get('/sedes/:sedeId', authenticate, authorize(), gymController.getSedeById);
router.post('/sedes', authenticate, authorize(['admin']), gymController.addSede);
router.put('/sedes/:sedeId', authenticate, authorize(['admin']), gymController.updateSede);
router.delete('/sedes/:sedeId', authenticate, authorize(['admin']), gymController.deleteSede);

// ── Rutas anidadas por gymId (/api/v1/gyms/:gymId/sedes) ─
router.get('/:gymId/sedes', authenticate, authorize(), gymController.getSedes);
router.get('/:gymId/sedes/:sedeId', authenticate, authorize(), gymController.getSedeById);
router.post('/:gymId/sedes', authenticate, authorize(['admin']), gymController.addSede);
router.put('/:gymId/sedes/:sedeId', authenticate, authorize(['admin']), gymController.updateSede);
router.delete('/:gymId/sedes/:sedeId', authenticate, authorize(['admin']), gymController.deleteSede);

// ── Perfil del Gimnasio (/gym, /configuracion, /api/v1/gyms/:gymId)
router.get('/:gymId', authenticate, authorize(), gymController.getGym);
router.get('/', authenticate, authorize(), gymController.getGym);
router.put('/:gymId', authenticate, authorize(), gymController.updateGym);
router.put('/', authenticate, authorize(), gymController.updateGym);

module.exports = router;