'use strict';
const express = require('express');
const { body } = require('express-validator');
const saleController = require('../controllers/sale.controller');
const validate = require('../middleware/validate');
const authorize = require('../middleware/authorize');
const { PERMISSIONS } = require('../constants/permissions');

const router = express.Router({ mergeParams: true });

const createSaleValidator = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Debe incluir al menos un producto en la venta'),
  body('items.*.productoId')
    .notEmpty()
    .withMessage('El id del producto es obligatorio en cada item'),
  body('items.*.cantidad')
    .isInt({ min: 1 })
    .withMessage('La cantidad de cada item debe ser un entero mayor a 0'),
  body('descuento')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('El descuento debe ser un porcentaje entre 0 y 100'),
  body('metodoPago')
    .optional()
    .isIn(['efectivo', 'transferencia_bancaria', 'qr_mercadopago'])
    .withMessage('Metodo de pago invalido'),
];

router.get('/', saleController.getSales);
router.get('/:id', saleController.getSaleById);
router.post('/', authorize(PERMISSIONS.REGISTER_SALES), createSaleValidator, validate, saleController.createSale);
router.post('/:id/anular', authorize(PERMISSIONS.REGISTER_SALES), saleController.cancelSale);

module.exports = router;
