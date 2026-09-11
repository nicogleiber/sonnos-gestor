'use strict';
const Payment = require('../models/payment.model');
const catchAsync = require('../utils/catchAsync');

const getPayments = catchAsync(async (req, res) => {
  const { socioId, desde, hasta } = req.query;
  const filter = { gym: req.gymId };
  if (socioId) filter.socio = socioId;
  if (desde || hasta) {
    filter.createdAt = {};
    if (desde) filter.createdAt.$gte = new Date(desde);
    if (hasta) filter.createdAt.$lte = new Date(hasta);
  }
  const payments = await Payment.find(filter)
    .populate('socio', 'nombre apellido')
    .populate('registradoPor', 'firstName lastName')
    .populate('membresia', 'fechaInicio fechaFin precioPagado')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: payments });
});

module.exports = { getPayments };
