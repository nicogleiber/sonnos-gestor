const express = require('express');
const teacherController = require('../controllers/teacher.controller');
const {
  createTeacherValidator,
  updateTeacherValidator,
  createConsultaValidator,
  updateConsultaValidator,
} = require('../validator/teacher.validator');
const validate = require('../middleware/validate');
const authorize = require('../middleware/authorize');
const { PERMISSIONS } = require('../constants/permissions');

const router = express.Router({ mergeParams: true });

router.get('/', teacherController.getTeachers);
router.get('/:id', teacherController.getTeacherById);

router.post(
  '/',
  authorize(PERMISSIONS.MANAGE_STAFF),
  createTeacherValidator,
  validate,
  teacherController.createTeacher
);

router.put(
  '/:id',
  authorize(PERMISSIONS.MANAGE_STAFF),
  updateTeacherValidator,
  validate,
  teacherController.updateTeacher
);

router.delete(
  '/:id',
  authorize(PERMISSIONS.MANAGE_STAFF),
  teacherController.deleteTeacher
);

// Consultas personalizadas
router.post(
  '/:id/consultas',
  authorize(PERMISSIONS.MANAGE_MEMBERS),
  createConsultaValidator,
  validate,
  teacherController.scheduleConsulta
);

router.put(
  '/:id/consultas/:consultaId',
  authorize(PERMISSIONS.MANAGE_MEMBERS),
  updateConsultaValidator,
  validate,
  teacherController.updateConsulta
);

module.exports = router;
