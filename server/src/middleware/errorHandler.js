const ApiError = require('../utils/ApiError');
const env = require('../config/env');

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  let error = err;

  if (!(error instanceof ApiError)) {
    if (error.name === 'ValidationError') {
      // Error de validación de un schema de Mongoose
      const details = Object.values(error.errors).map((e) => e.message);
      error = ApiError.badRequest('Datos inválidos', details);
    } else if (error.name === 'CastError') {
      // Típicamente un ObjectId con formato inválido en la URL
      error = ApiError.badRequest(`Id inválido: ${error.value}`);
    } else if (error.code === 11000) {
      // Índice único violado (ej: email duplicado)
      const field = Object.keys(error.keyValue || {})[0];
      error = ApiError.conflict(`Ya existe un registro con ese ${field}`);
    } else {
      if (!env.isProduction) console.error(err);
      error = ApiError.internal(env.isProduction ? undefined : error.message);
    }
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(error.details ? { details: error.details } : {}),
  });
}

module.exports = errorHandler;