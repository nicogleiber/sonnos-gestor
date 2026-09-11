const { body } = require('express-validator');

const createMemberValidator = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre del socio es obligatorio')
    .isLength({ max: 60 })
    .withMessage('El nombre no puede superar los 60 caracteres'),
  body('apellido')
    .trim()
    .notEmpty()
    .withMessage('El apellido del socio es obligatorio')
    .isLength({ max: 60 })
    .withMessage('El apellido no puede superar los 60 caracteres'),
  body('dni')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 20 })
    .withMessage('El DNI no puede superar los 20 caracteres'),
  body('email')
    .optional({ values: 'falsy' })
    .trim()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('telefono')
    .optional()
    .trim(),
  body('codigoFichaje')
    .optional()
    .trim(),
  body('planId')
    .optional({ values: 'falsy' })
    .isMongoId()
    .withMessage('ID de plan inválido'),
  body('tipoSuscripcion')
    .optional()
    .trim(),
  body('fechaVencimiento')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('La fecha de vencimiento debe tener formato ISO8601 válido'),
  body('observaciones')
    .optional()
    .trim(),
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe ser booleano'),
];

const updateMemberValidator = [
  body('nombre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío')
    .isLength({ max: 60 })
    .withMessage('El nombre no puede superar los 60 caracteres'),
  body('apellido')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El apellido no puede estar vacío')
    .isLength({ max: 60 })
    .withMessage('El apellido no puede superar los 60 caracteres'),
  body('dni')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 20 })
    .withMessage('El DNI no puede superar los 20 caracteres'),
  body('email')
    .optional({ values: 'falsy' })
    .trim()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('telefono')
    .optional()
    .trim(),
  body('codigoFichaje')
    .optional()
    .trim(),
  body('planId')
    .optional({ values: 'falsy' })
    .isMongoId()
    .withMessage('ID de plan inválido'),
  body('tipoSuscripcion')
    .optional()
    .trim(),
  body('fechaVencimiento')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('La fecha de vencimiento debe tener formato ISO8601 válido'),
  body('estado')
    .optional()
    .isIn(['Al Día', 'En Fecha de Cobro', 'Vencido', 'Inactivo'])
    .withMessage('Estado inválido'),
  body('observaciones')
    .optional()
    .trim(),
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe ser booleano'),
];

const checkinValidator = [
  body('codigo')
    .trim()
    .notEmpty()
    .withMessage('El código o DNI de fichaje es obligatorio'),
];

const whatsappTemplateValidator = [
  body('socioIds')
    .optional()
    .isArray()
    .withMessage('socioIds debe ser un array de identificadores'),
  body('plantilla')
    .optional()
    .trim(),
];

module.exports = {
  createMemberValidator,
  updateMemberValidator,
  checkinValidator,
  whatsappTemplateValidator,
};
