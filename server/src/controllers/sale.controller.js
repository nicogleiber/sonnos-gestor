'use strict';
const saleService = require('../services/sale.service');
const Sale = require('../models/sale.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createSale = catchAsync(async (req, res) => {
  const { items, descuento, metodoPago, notas } = req.body;
  const { sale, cashMovement } = await saleService.createSale({
    gymId: req.gymId,
    vendedorId: req.user._id,
    items,
    descuento,
    metodoPago,
    notas,
  });

  res.status(201).json({
    success: true,
    data: { sale, cashMovement },
  });
});

const getSales = catchAsync(async (req, res) => {
  const { estado, vendedor, desde, hasta } = req.query;

  const filter = { gym: req.gymId };

  if (estado) filter.estado = estado;
  if (vendedor) filter.vendedor = vendedor;
  if (desde || hasta) {
    filter.createdAt = {};
    if (desde) filter.createdAt.$gte = new Date(desde);
    if (hasta) filter.createdAt.$lte = new Date(hasta);
  }

  const sales = await Sale.find(filter)
    .populate('vendedor', 'firstName lastName email')
    .populate('items.producto', 'nombre codigo')
    .populate('caja', 'fechaApertura estado')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: sales });
});

const getSaleById = catchAsync(async (req, res) => {
  const sale = await Sale.findOne({ _id: req.params.id, gym: req.gymId })
    .populate('vendedor', 'firstName lastName email')
    .populate('items.producto', 'nombre codigo categoria')
    .populate('caja', 'fechaApertura estado');

  if (!sale) throw ApiError.notFound('Venta no encontrada');

  res.json({ success: true, data: sale });
});

const cancelSale = catchAsync(async (req, res) => {
  const sale = await saleService.cancelSale({
    gymId: req.gymId,
    saleId: req.params.id,
    userId: req.user._id,
  });

  res.json({
    success: true,
    message: 'Venta anulada correctamente. Stock restaurado.',
    data: sale,
  });
});

module.exports = { createSale, getSales, getSaleById, cancelSale };
