const InventoryMovement = require('../models/inventoryMovement.model');
const inventoryService = require('../services/inventory.service');
const catchAsync = require('../utils/catchAsync');

const adjustStock = catchAsync(async (req, res) => {
  const { cantidad, tipo, motivo } = req.body;
  const productId = req.params.id;

  const result = await inventoryService.adjustStock({
    gymId: req.gymId,
    productId,
    cantidad,
    tipo,
    motivo,
    userId: req.user._id,
  });

  res.json({
    success: true,
    message: 'Stock ajustado correctamente',
    data: result,
  });
});

const getMovements = catchAsync(async (req, res) => {
  const { productoId, tipo, desde, hasta } = req.query;

  const filter = { gym: req.gymId };

  if (productoId) {
    filter.producto = productoId;
  }

  if (tipo) {
    filter.tipo = tipo;
  }

  if (desde || hasta) {
    filter.createdAt = {};
    if (desde) filter.createdAt.$gte = new Date(desde);
    if (hasta) filter.createdAt.$lte = new Date(hasta);
  }

  const movements = await InventoryMovement.find(filter)
    .populate('producto', 'nombre codigo categoria stock')
    .populate('usuario', 'firstName lastName email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: movements,
  });
});

module.exports = {
  adjustStock,
  getMovements,
};
