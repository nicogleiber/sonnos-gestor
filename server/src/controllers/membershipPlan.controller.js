const MembershipPlan = require('../models/membershipPlan.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const getPlans = catchAsync(async (req, res) => {
  const { tipo, activo, q } = req.query;

  const filter = { gym: req.gymId };

  if (tipo) {
    filter.tipo = tipo;
  }

  if (activo !== undefined) {
    filter.activo = activo === 'true';
  }

  if (q) {
    filter.nombre = { $regex: q.trim(), $options: 'i' };
  }

  const plans = await MembershipPlan.find(filter).sort({ nombre: 1 });

  res.json({
    success: true,
    data: plans,
  });
});

const getPlanById = catchAsync(async (req, res) => {
  const plan = await MembershipPlan.findOne({
    _id: req.params.id,
    gym: req.gymId,
  });

  if (!plan) {
    throw ApiError.notFound('Plan no encontrado');
  }

  res.json({
    success: true,
    data: plan,
  });
});

const createPlan = catchAsync(async (req, res) => {
  const planData = {
    ...req.body,
    gym: req.gymId,
  };

  const plan = await MembershipPlan.create(planData);

  res.status(201).json({
    success: true,
    data: plan,
  });
});

const updatePlan = catchAsync(async (req, res) => {
  const plan = await MembershipPlan.findOneAndUpdate(
    { _id: req.params.id, gym: req.gymId },
    req.body,
    { returnDocument: 'after', runValidators: true }
  );

  if (!plan) {
    throw ApiError.notFound('Plan no encontrado');
  }

  res.json({
    success: true,
    data: plan,
  });
});

const deletePlan = catchAsync(async (req, res) => {
  const plan = await MembershipPlan.findOneAndUpdate(
    { _id: req.params.id, gym: req.gymId },
    { activo: false },
    { returnDocument: 'after' }
  );

  if (!plan) {
    throw ApiError.notFound('Plan no encontrado');
  }

  res.json({
    success: true,
    message: 'Plan desactivado correctamente',
    data: plan,
  });
});

module.exports = {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
};
