'use strict';
const express = require('express');
const { body } = require('express-validator');
const cashRegController = require('../controllers/cashRegister.controller');
const validate = require('../middleware/validate');
const authorize = require('../middleware/authorize');
const { PERMISSIONS } = require('../constants/permissions');

const router = express.Router({ mergeParams: true });

const openValidator = [
  body('montoApertura')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El monto de apertura debe ser mayor o igual a 0'),
];

const movementValidator = [
  body('tipo')
    .isIn(['ingreso_manual', 'egreso_manual'])
    .withMessage('El tipo de movimiento manual debe ser "ingreso_manual" o "egreso_manual"'),
  body('monto')
    .isFloat({ min: 0.01 })
    .withMessage('El monto debe ser mayor a 0'),
  body('descripcion')
    .optional()
    .trim(),
];

router.get('/actual', cashRegController.getOpenCashRegister);
router.post('/abrir', authorize(PERMISSIONS.MANAGE_CASH_MOVEMENTS), openValidator, validate, cashRegController.openCashRegister);
router.post('/:id/cerrar', authorize(PERMISSIONS.CLOSE_CASH_REGISTER), cashRegController.closeCashRegister);
router.get('/:id/movimientos', authorize(PERMISSIONS.MANAGE_CASH_MOVEMENTS), cashRegController.getMovements);
router.post('/:id/movimientos', authorize(PERMISSIONS.MANAGE_CASH_MOVEMENTS), movementValidator, validate, cashRegController.addMovement);

module.exports = router;
