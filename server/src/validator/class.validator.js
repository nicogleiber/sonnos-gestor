const { body } = require('express-validator');

const createClassValidator = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la clase es obligatorio')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede superar los 100 caracteres'),
  body('salon')
    .trim()
    .notEmpty()
    .withMessage('El salón o sala es obligatorio'),
  body('profesor')
    .optional()
    .trim(),
  body('teacherId')
    .optional({ values: 'falsy' })
    .isMongoId()
    .withMessage('ID de profesor inválido'),
  body('dias')
    .optional()
    .isArray()
    .withMessage('dias debe ser un array de días de la semana'),
  body('dia')
    .optional()
    .trim(),
  body('horario')
    .trim()
    .notEmpty()
    .withMessage('El horario es obligatorio'),
  body('duracion')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La duración debe ser de al menos 1 minuto'),
  body('cupoMaximo')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El cupo máximo debe ser de al menos 1 persona'),
  body('tipoEvento')
    .optional()
    .isIn(['Semanal Recurrente', 'Evento Único'])
    .withMessage('El tipo de evento debe ser "Semanal Recurrente" o "Evento Único"'),
  body('fechaEspecifica')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('La fecha específica debe tener formato ISO8601 válido'),
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe ser booleano'),
];

const updateClassValidator = [
  body('nombre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre de la clase no puede estar vacío')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede superar los 100 caracteres'),
  body('salon')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El salón no puede estar vacío'),
  body('profesor')
    .optional()
    .trim(),
  body('teacherId')
    .optional({ values: 'falsy' })
    .isMongoId()
    .withMessage('ID de profesor inválido'),
  body('dias')
    .optional()
    .isArray()
    .withMessage('dias debe ser un array de días de la semana'),
  body('dia')
    .optional()
    .trim(),
  body('horario')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El horario no puede estar vacío'),
  body('duracion')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La duración debe ser de al menos 1 minuto'),
  body('cupoMaximo')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El cupo máximo debe ser de al menos 1 persona'),
  body('tipoEvento')
    .optional()
    .isIn(['Semanal Recurrente', 'Evento Único'])
    .withMessage('El tipo de evento debe ser "Semanal Recurrente" o "Evento Único"'),
  body('fechaEspecifica')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('La fecha específica debe tener formato ISO8601 válido'),
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe ser booleano'),
];

const inscribirSocioValidator = [
  body('socioId')
    .notEmpty()
    .withMessage('El ID del socio es obligatorio')
    .isMongoId()
    .withMessage('ID de socio inválido'),
];

module.exports = {
  createClassValidator,
  updateClassValidator,
  inscribirSocioValidator,
};
