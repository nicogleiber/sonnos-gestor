const Member = require('../models/member.model');
const Membership = require('../models/membership.model');
const MembershipPlan = require('../models/membershipPlan.model');
const ApiError = require('../utils/ApiError');

/**
 * Calcula la fecha de vencimiento a partir de una fecha base y meses de duración.
 */
function calculateExpirationDate(startDate = new Date(), durationMonths = 1) {
  const d = new Date(startDate);
  d.setMonth(d.getMonth() + Number(durationMonths));
  return d;
}

/**
 * Asigna o crea una nueva membresía para un socio en un gimnasio.
 */
async function assignMembership({
  gymId,
  socioId,
  planId,
  fechaInicio = new Date(),
  precioPagado,
  metodoPago = 'efectivo',
  notas,
  session,
}) {
  const [member, plan] = await Promise.all([
    Member.findOne({ _id: socioId, gym: gymId }).session(session || null),
    MembershipPlan.findOne({ _id: planId, gym: gymId }).session(session || null),
  ]);

  if (!member) {
    throw ApiError.notFound('Socio no encontrado');
  }

  if (!plan || !plan.activo) {
    throw ApiError.badRequest('El plan seleccionado no existe o no está activo');
  }

  const finalPrice = precioPagado !== undefined ? Number(precioPagado) : plan.precio;
  const fechaFin = calculateExpirationDate(fechaInicio, plan.duracionMeses || 1);

  // Desactivar membresías activas previas
  await Membership.updateMany(
    { gym: gymId, socio: socioId, estado: 'activa' },
    { estado: 'vencida' }
  ).session(session || null);

  const [membership] = await Membership.create(
    [
      {
        gym: gymId,
        socio: socioId,
        plan: plan._id,
        fechaInicio,
        fechaFin,
        precioPagado: finalPrice,
        metodoPago,
        estado: 'activa',
        notas,
      },
    ],
    session ? { session } : {}
  );

  member.plan = plan._id;
  member.tipoSuscripcion = plan.nombre;
  member.fechaVencimiento = fechaFin;
  member.fechaUltimoPago = fechaInicio;
  member.estado = Member.calcularEstado(fechaFin, member.activo);

  await member.save(session ? { session } : {});

  return { membership, member };
}

/**
 * Renueva la membresía de un socio. Si aún no venció, extiende a partir de la fecha actual de vencimiento.
 */
async function renewMembership({
  gymId,
  socioId,
  planId,
  precioPagado,
  metodoPago = 'efectivo',
  notas,
  session,
}) {
  const member = await Member.findOne({ _id: socioId, gym: gymId }).session(session || null);
  if (!member) {
    throw ApiError.notFound('Socio no encontrado');
  }

  const targetPlanId = planId || member.plan;
  if (!targetPlanId) {
    throw ApiError.badRequest('Debe especificar un plan para la renovación');
  }

  const plan = await MembershipPlan.findOne({ _id: targetPlanId, gym: gymId }).session(session || null);
  if (!plan || !plan.activo) {
    throw ApiError.badRequest('El plan seleccionado no existe o no está activo');
  }

  // Base para la nueva fecha de inicio:
  // Si la fecha de vencimiento actual es futura, la renovación empieza cuando expire la actual
  const hoy = new Date();
  let baseInicio = hoy;
  if (member.fechaVencimiento && new Date(member.fechaVencimiento) > hoy) {
    baseInicio = new Date(member.fechaVencimiento);
  }

  return assignMembership({
    gymId,
    socioId,
    planId: plan._id,
    fechaInicio: baseInicio,
    precioPagado: precioPagado !== undefined ? precioPagado : plan.precio,
    metodoPago,
    notas,
    session,
  });
}

/**
 * Refresca y actualiza el estado de cobranza del socio según su fechaVencimiento.
 */
function refreshMemberStatus(member) {
  if (!member) return null;
  const nuevoEstado = Member.calcularEstado(member.fechaVencimiento, member.activo);
  if (member.estado !== nuevoEstado) {
    member.estado = nuevoEstado;
  }
  return member;
}

module.exports = {
  calculateExpirationDate,
  assignMembership,
  renewMembership,
  refreshMemberStatus,
};
