const Membership = require('../models/membership.model');
const membershipService = require('../services/membership.service');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const getMemberships = catchAsync(async (req, res) => {
  const { socioId, estado } = req.query;

  const filter = { gym: req.gymId };

  if (socioId) {
    filter.socio = socioId;
  }

  if (estado) {
    filter.estado = estado;
  }

  const memberships = await Membership.find(filter)
    .populate('socio', 'nombre apellido dni email telefono estado')
    .populate('plan', 'nombre precio duracionMeses tipo')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: memberships,
  });
});

const getMembershipById = catchAsync(async (req, res) => {
  const membership = await Membership.findOne({
    _id: req.params.id,
    gym: req.gymId,
  })
    .populate('socio', 'nombre apellido dni email')
    .populate('plan', 'nombre precio duracionMeses tipo');

  if (!membership) {
    throw ApiError.notFound('Membresía no encontrada');
  }

  res.json({
    success: true,
    data: membership,
  });
});

const createMembership = catchAsync(async (req, res) => {
  const { socioId, planId, fechaInicio, precioPagado, metodoPago, notas } = req.body;

  if (!socioId || !planId) {
    throw ApiError.badRequest('socioId y planId son obligatorios');
  }

  const result = await membershipService.assignMembership({
    gymId: req.gymId,
    socioId,
    planId,
    fechaInicio,
    precioPagado,
    metodoPago,
    notas,
  });

  res.status(201).json({
    success: true,
    data: result,
  });
});

const renewMembership = catchAsync(async (req, res) => {
  const { socioId, planId, precioPagado, metodoPago, notas } = req.body;

  if (!socioId) {
    throw ApiError.badRequest('socioId es obligatorio');
  }

  const result = await membershipService.renewMembership({
    gymId: req.gymId,
    socioId,
    planId,
    precioPagado,
    metodoPago,
    notas,
  });

  res.json({
    success: true,
    message: 'Membresía renovada con éxito',
    data: result,
  });
});

const cancelMembership = catchAsync(async (req, res) => {
  const membership = await Membership.findOneAndUpdate(
    { _id: req.params.id, gym: req.gymId },
    { estado: 'cancelada' },
    { returnDocument: 'after' }
  );

  if (!membership) {
    throw ApiError.notFound('Membresía no encontrada');
  }

  res.json({
    success: true,
    message: 'Membresía cancelada correctamente',
    data: membership,
  });
});

module.exports = {
  getMemberships,
  getMembershipById,
  createMembership,
  renewMembership,
  cancelMembership,
};
