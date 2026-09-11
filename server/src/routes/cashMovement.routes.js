'use strict';
const express = require('express');
const CashMovement = require('../models/cashMovement.model');
const catchAsync = require('../utils/catchAsync');
const authorize = require('../middleware/authorize');
const { PERMISSIONS } = require('../constants/permissions');

const router = express.Router({ mergeParams: true });

// Historial global de movimientos de caja (todas las cajas del gym)
router.get(
  '/',
  authorize(PERMISSIONS.VIEW_FINANCIAL_REPORTS),
  catchAsync(async (req, res) => {
    const { tipo, cajaId, desde, hasta } = req.query;
    const filter = { gym: req.gymId };
    if (tipo) filter.tipo = tipo;
    if (cajaId) filter.caja = cajaId;
    if (desde || hasta) {
      filter.createdAt = {};
      if (desde) filter.createdAt.$gte = new Date(desde);
      if (hasta) filter.createdAt.$lte = new Date(hasta);
    }
    const movements = await CashMovement.find(filter)
      .populate('caja', 'fechaApertura estado')
      .populate('registradoPor', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: movements });
  })
);

module.exports = router;
