const { body } = require('express-validator');

const registerValidator = [
  body('gymName').trim().notEmpty().withMessage('El nombre del gimnasio es obligatorio'),
  body('firstName').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('lastName').trim().notEmpty().withMessage('El apellido es obligatorio'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/\d/)
    .withMessage('La contraseña debe tener al menos un número'),
];

const loginValidator = [
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
];

module.exports = { registerValidator, loginValidator };