'use strict';
const cashRegisterService = require('../services/cashRegister.service');
const CashRegister = require('../models/cashRegister.model');
const CashMovement = require('../models/cashMovement.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const openCashRegister = catchAsync(async (req, res) => {
  const { montoApertura, notas } = req.body;
  const caja = await cashRegisterService.openCashRegister({
    gymId: req.gymId,
    userId: req.user._id,
    montoApertura,
  });
  if (notas) {
    caja.notas = notas;
    await caja.save();
  }
  res.status(201).json({ success: true, data: caja });
});

const closeCashRegister = catchAsync(async (req, res) => {
  const { montoCierre, notas } = req.body;
  const caja = await cashRegisterService.closeCashRegister({
    gymId: req.gymId,
    cajaId: req.params.id,
    userId: req.user._id,
    montoCierre,
  });
  if (notas) {
    caja.notas = notas;
    await caja.save();
  }
  res.json({ success: true, data: caja });
});

const getOpenCashRegister = catchAsync(async (req, res) => {
  const caja = await cashRegisterService.getOpenRegister(req.gymId);
  res.json({ success: true, data: caja || null });
});

const addMovement = catchAsync(async (req, res) => {
  const { tipo, monto, descripcion } = req.body;
  const movement = await cashRegisterService.addMovement({
    gymId: req.gymId,
    cajaId: req.params.id,
    tipo,
    monto,
    descripcion,
    userId: req.user._id,
  });
  res.status(201).json({ success: true, data: movement });
});

const getMovements = catchAsync(async (req, res) => {
  const caja = await CashRegister.findOne({ _id: req.params.id, gym: req.gymId });
  if (!caja) throw ApiError.notFound('Caja no encontrada');
  const movements = await CashMovement.find({ caja: req.params.id, gym: req.gymId })
    .populate('registradoPor', 'firstName lastName')
    .populate('referenciaVenta', 'total totalConDescuento estado')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: movements });
});

module.exports = { openCashRegister, closeCashRegister, getOpenCashRegister, addMovement, getMovements };
