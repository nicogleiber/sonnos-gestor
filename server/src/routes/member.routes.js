const express = require('express');
const memberController = require('../controllers/member.controller');
const {
  createMemberValidator,
  updateMemberValidator,
  checkinValidator,
  whatsappTemplateValidator,
} = require('../validator/member.validator');
const validate = require('../middleware/validate');
const authorize = require('../middleware/authorize');
const { PERMISSIONS } = require('../constants/permissions');

const router = express.Router({ mergeParams: true });

// Consulta y listado de socios
router.get('/', memberController.getMembers);

// Fichaje / Check-in (ubicado antes de /:id para evitar colisión de rutas)
router.post(
  '/checkin',
  checkinValidator,
  validate,
  memberController.checkin
);

// Plantillas de WhatsApp para cobranza / avisos
router.post(
  '/whatsapp-template',
  authorize(PERMISSIONS.MANAGE_MEMBERS),
  whatsappTemplateValidator,
  validate,
  memberController.generateWhatsAppTemplates
);

// Detalle de un socio
router.get('/:id', memberController.getMemberById);

// Operaciones de gestión de socios (exigen permiso MANAGE_MEMBERS)
router.post(
  '/',
  authorize(PERMISSIONS.MANAGE_MEMBERS),
  createMemberValidator,
  validate,
  memberController.createMember
);

router.put(
  '/:id',
  authorize(PERMISSIONS.MANAGE_MEMBERS),
  updateMemberValidator,
  validate,
  memberController.updateMember
);

router.post(
  '/:id/pagar',
  memberController.registrarPago
);

router.delete(
  '/:id',
  authorize(PERMISSIONS.MANAGE_MEMBERS),
  memberController.deleteMember
);

module.exports = router;

