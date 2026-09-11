const { body } = require('express-validator');

const createProductValidator = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre del producto es obligatorio')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede superar los 100 caracteres'),
  body('codigo')
    .optional()
    .trim(),
  body('categoria')
    .optional()
    .trim(),
  body('costo')
    .notEmpty()
    .withMessage('El costo del producto es obligatorio')
    .isFloat({ min: 0 })
    .withMessage('El costo debe ser un número mayor o igual a 0'),
  body('margen')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El margen de ganancia debe ser un porcentaje mayor o igual a 0'),
  body('precioVenta')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio de venta debe ser un número mayor o igual a 0'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock inicial debe ser un número entero mayor o igual a 0'),
  body('stockMinimo')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock mínimo debe ser un número entero mayor o igual a 0'),
  body('descripcion')
    .optional()
    .trim(),
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe ser booleano'),
];

const updateProductValidator = [
  body('nombre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede superar los 100 caracteres'),
  body('codigo')
    .optional()
    .trim(),
  body('categoria')
    .optional()
    .trim(),
  body('costo')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El costo debe ser un número mayor o igual a 0'),
  body('margen')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El margen debe ser mayor o igual a 0'),
  body('precioVenta')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio de venta debe ser un número mayor o igual a 0'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero mayor o igual a 0'),
  body('stockMinimo')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock mínimo debe ser un número entero mayor o igual a 0'),
  body('descripcion')
    .optional()
    .trim(),
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe ser booleano'),
];

const adjustStockValidator = [
  body('cantidad')
    .notEmpty()
    .withMessage('La cantidad es obligatoria')
    .isNumeric()
    .withMessage('La cantidad debe ser numérica'),
  body('tipo')
    .notEmpty()
    .withMessage('El tipo de movimiento es obligatorio')
    .isIn(['ingreso', 'egreso', 'ajuste', 'devolucion'])
    .withMessage('El tipo debe ser "ingreso", "egreso", "ajuste" o "devolucion"'),
  body('motivo')
    .optional()
    .trim(),
];

const calcularPrecioValidator = [
  body('costo')
    .notEmpty()
    .withMessage('El costo es obligatorio')
    .isFloat({ min: 0 })
    .withMessage('El costo debe ser un número mayor o igual a 0'),
  body('margen')
    .notEmpty()
    .withMessage('El margen es obligatorio')
    .isFloat({ min: 0 })
    .withMessage('El margen debe ser un número mayor o igual a 0'),
];

module.exports = {
  createProductValidator,
  updateProductValidator,
  adjustStockValidator,
  calcularPrecioValidator,
};
