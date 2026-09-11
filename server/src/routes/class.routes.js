const express = require('express');
const classController = require('../controllers/class.controller');
const {
  createClassValidator,
  updateClassValidator,
  inscribirSocioValidator,
} = require('../validator/class.validator');
const validate = require('../middleware/validate');
const authorize = require('../middleware/authorize');
const { PERMISSIONS } = require('../constants/permissions');

const router = express.Router({ mergeParams: true });

router.get('/', classController.getClasses);
router.get('/:id', classController.getClassById);

router.post(
  '/',
  authorize(PERMISSIONS.MANAGE_CLASSES),
  createClassValidator,
  validate,
  classController.createClass
);

router.put(
  '/:id',
  authorize(PERMISSIONS.MANAGE_CLASSES),
  updateClassValidator,
  validate,
  classController.updateClass
);

router.delete(
  '/:id',
  authorize(PERMISSIONS.MANAGE_CLASSES),
  classController.deleteClass
);

router.post(
  '/:id/inscribir',
  authorize(PERMISSIONS.MANAGE_CLASSES),
  inscribirSocioValidator,
  validate,
  classController.inscribirSocio
);

router.post(
  '/:id/desinscribir',
  authorize(PERMISSIONS.MANAGE_CLASSES),
  inscribirSocioValidator,
  validate,
  classController.desinscribirSocio
);

module.exports = router;
