const { body } = require('express-validator');

const createTeacherValidator = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 60 })
    .withMessage('El nombre no puede superar los 60 caracteres'),
  body('apellido')
    .trim()
    .notEmpty()
    .withMessage('El apellido es obligatorio')
    .isLength({ max: 60 })
    .withMessage('El apellido no puede superar los 60 caracteres'),
  body('rol')
    .optional()
    .trim(),
  body('especialidad')
    .optional()
    .trim(),
  body('email')
    .optional({ values: 'falsy' })
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('telefono')
    .optional()
    .trim(),
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe ser booleano'),
];

const updateTeacherValidator = [
  body('nombre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío')
    .isLength({ max: 60 }),
  body('apellido')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El apellido no puede estar vacío')
    .isLength({ max: 60 }),
  body('rol')
    .optional()
    .trim(),
  body('especialidad')
    .optional()
    .trim(),
  body('email')
    .optional({ values: 'falsy' })
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('telefono')
    .optional()
    .trim(),
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe ser booleano'),
];

const createConsultaValidator = [
  body('fecha')
    .notEmpty()
    .withMessage('La fecha es obligatoria')
    .isISO8601()
    .withMessage('La fecha debe tener un formato válido (ISO8601)'),
  body('hora')
    .trim()
    .notEmpty()
    .withMessage('La hora es obligatoria'),
  body('socioNombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre del socio es obligatorio'),
  body('socioId')
    .optional({ values: 'falsy' })
    .isMongoId()
    .withMessage('ID de socio inválido'),
  body('tipo')
    .optional()
    .trim(),
  body('notas')
    .optional()
    .trim(),
];

const updateConsultaValidator = [
  body('estado')
    .optional()
    .isIn(['Programada', 'Realizada', 'Cancelada'])
    .withMessage('El estado debe ser Programada, Realizada o Cancelada'),
  body('notas')
    .optional()
    .trim(),
  body('fecha')
    .optional()
    .isISO8601()
    .withMessage('La fecha debe tener un formato válido'),
  body('hora')
    .optional()
    .trim(),
];

module.exports = {
  createTeacherValidator,
  updateTeacherValidator,
  createConsultaValidator,
  updateConsultaValidator,
};
