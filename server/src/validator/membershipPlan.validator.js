const { body } = require('express-validator');

const createPlanValidator = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre del plan es obligatorio')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede superar los 100 caracteres'),
  body('tipo')
    .notEmpty()
    .withMessage('El tipo de plan es obligatorio')
    .isIn(['Plan Musculación', 'Clase/Disciplina'])
    .withMessage('El tipo debe ser "Plan Musculación" o "Clase/Disciplina"'),
  body('precio')
    .notEmpty()
    .withMessage('El precio es obligatorio')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número mayor o igual a 0'),
  body('duracionMeses')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La duración debe ser de al menos 1 mes'),
  body('frecuencia')
    .optional()
    .trim(),
  body('cupos')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Los cupos deben ser un número entero no negativo'),
  body('promocionReferidos')
    .optional()
    .trim(),
  body('descripcion')
    .optional()
    .trim(),
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe ser booleano'),
];

const updatePlanValidator = [
  body('nombre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre del plan no puede estar vacío')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede superar los 100 caracteres'),
  body('tipo')
    .optional()
    .isIn(['Plan Musculación', 'Clase/Disciplina'])
    .withMessage('El tipo debe ser "Plan Musculación" o "Clase/Disciplina"'),
  body('precio')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número mayor o igual a 0'),
  body('duracionMeses')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La duración debe ser de al menos 1 mes'),
  body('frecuencia')
    .optional()
    .trim(),
  body('cupos')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Los cupos deben ser un número entero no negativo'),
  body('promocionReferidos')
    .optional()
    .trim(),
  body('descripcion')
    .optional()
    .trim(),
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe ser booleano'),
];

module.exports = {
  createPlanValidator,
  updatePlanValidator,
};
