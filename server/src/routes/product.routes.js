const express = require('express');
const productController = require('../controllers/product.controller');
const inventoryController = require('../controllers/inventory.controller');
const {
  createProductValidator,
  updateProductValidator,
  adjustStockValidator,
  calcularPrecioValidator,
} = require('../validator/product.validator');
const validate = require('../middleware/validate');
const authorize = require('../middleware/authorize');
const { PERMISSIONS } = require('../constants/permissions');

const router = express.Router({ mergeParams: true });

router.get('/', productController.getProducts);

router.post(
  '/calcular-precio',
  calcularPrecioValidator,
  validate,
  productController.calcularPrecio
);

router.get('/:id', productController.getProductById);

router.post(
  '/',
  authorize(PERMISSIONS.REGISTER_SALES),
  createProductValidator,
  validate,
  productController.createProduct
);

router.put(
  '/:id',
  authorize(PERMISSIONS.REGISTER_SALES),
  updateProductValidator,
  validate,
  productController.updateProduct
);

router.delete(
  '/:id',
  authorize(PERMISSIONS.REGISTER_SALES),
  productController.deleteProduct
);

router.post(
  '/:id/ajuste-stock',
  authorize(PERMISSIONS.REGISTER_SALES),
  adjustStockValidator,
  validate,
  inventoryController.adjustStock
);

module.exports = router;
