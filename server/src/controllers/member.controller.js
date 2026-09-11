const Member = require('../models/member.model');
const MembershipPlan = require('../models/membershipPlan.model');
const { calculateExpirationDate } = require('../services/membership.service');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');

const getMembers = catchAsync(async (req, res) => {
  const { q, estado, desde, hasta, abandonos, activo } = req.query;

  const filter = { gym: req.gymId };

  if (activo !== undefined) {
    filter.activo = activo === 'true';
  }

  if (estado) {
    filter.estado = estado;
  }

  if (desde || hasta) {
    filter.fechaVencimiento = {};
    if (desde) filter.fechaVencimiento.$gte = new Date(desde);
    if (hasta) filter.fechaVencimiento.$lte = new Date(hasta);
  }

  if (abandonos === 'true') {
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    filter.fechaVencimiento = { $lt: hace30Dias };
  }

  if (q) {
    const term = q.trim();
    const regex = { $regex: term, $options: 'i' };
    filter.$or = [{ nombre: regex }, { apellido: regex }, { dni: regex }, { email: regex }];
  }

  const members = await Member.find(filter)
    .populate('plan', 'nombre precio duracionMeses tipo')
    .sort({ apellido: 1, nombre: 1 });

  // Sincronizar estados dinámicos
  const promises = [];
  const updatedMembers = members.map((m) => {
    const estadoActual = Member.calcularEstado(m.fechaVencimiento, m.activo);
    if (m.estado !== estadoActual && m.activo) {
      m.estado = estadoActual;
      promises.push(m.save());
    }
    return m;
  });

  if (promises.length > 0) {
    await Promise.all(promises);
  }

  res.json({
    success: true,
    data: updatedMembers,
  });
});

const getMemberById = catchAsync(async (req, res) => {
  const member = await Member.findOne({
    _id: req.params.id,
    gym: req.gymId,
  }).populate('plan');

  if (!member) {
    throw ApiError.notFound('Socio no encontrado');
  }

  // Recalcular estado dinámico si es necesario
  const estadoCalculado = Member.calcularEstado(member.fechaVencimiento, member.activo);
  if (member.estado !== estadoCalculado && member.activo) {
    member.estado = estadoCalculado;
    await member.save();
  }

  res.json({
    success: true,
    data: member,
  });
});

const createMember = catchAsync(async (req, res) => {
  const { dni, codigoFichaje, planId, fechaVencimiento } = req.body;

  // Validar unicidad de DNI en el mismo gimnasio
  if (dni) {
    const existingDni = await Member.findOne({ gym: req.gymId, dni: dni.trim() });
    if (existingDni) {
      throw ApiError.conflict('Ya existe un socio con ese DNI en este gimnasio');
    }
  }

  // Validar unicidad de código de fichaje en el mismo gimnasio
  if (codigoFichaje) {
    const existingCodigo = await Member.findOne({
      gym: req.gymId,
      codigoFichaje: codigoFichaje.trim(),
    });
    if (existingCodigo) {
      throw ApiError.conflict('Ya existe un socio con ese código de fichaje');
    }
  }

  const memberData = {
    ...req.body,
    gym: req.gymId,
  };

  // Si se envió planId y no fechaVencimiento explícita, calculamos el vencimiento automático
  if (planId && !fechaVencimiento) {
    const plan = await MembershipPlan.findOne({ _id: planId, gym: req.gymId });
    if (plan) {
      memberData.plan = plan._id;
      memberData.tipoSuscripcion = plan.nombre;
      memberData.fechaVencimiento = calculateExpirationDate(new Date(), plan.duracionMeses || 1);
      memberData.fechaUltimoPago = new Date();
    }
  }

  // Calcular estado inicial
  memberData.estado = Member.calcularEstado(
    memberData.fechaVencimiento,
    memberData.activo !== false
  );

  const member = await Member.create(memberData);

  res.status(201).json({
    success: true,
    data: member,
  });
});

const updateMember = catchAsync(async (req, res) => {
  const { dni, codigoFichaje, fechaVencimiento, activo } = req.body;

  // Validar que el DNI no pertenezca a otro socio del mismo gimnasio
  if (dni) {
    const existingDni = await Member.findOne({
      gym: req.gymId,
      dni: dni.trim(),
      _id: { $ne: req.params.id },
    });
    if (existingDni) {
      throw ApiError.conflict('Ya existe otro socio con ese DNI en este gimnasio');
    }
  }

  // Validar que el código de fichaje no pertenezca a otro socio
  if (codigoFichaje) {
    const existingCodigo = await Member.findOne({
      gym: req.gymId,
      codigoFichaje: codigoFichaje.trim(),
      _id: { $ne: req.params.id },
    });
    if (existingCodigo) {
      throw ApiError.conflict('Ya existe otro socio con ese código de fichaje');
    }
  }

  const updateData = { ...req.body };

  if (fechaVencimiento !== undefined || activo !== undefined) {
    const currentMember = await Member.findOne({ _id: req.params.id, gym: req.gymId });
    if (!currentMember) {
      throw ApiError.notFound('Socio no encontrado');
    }
    const finalVto = fechaVencimiento !== undefined ? fechaVencimiento : currentMember.fechaVencimiento;
    const finalActivo = activo !== undefined ? activo : currentMember.activo;
    updateData.estado = Member.calcularEstado(finalVto, finalActivo);
  }

  const member = await Member.findOneAndUpdate(
    { _id: req.params.id, gym: req.gymId },
    updateData,
    { returnDocument: 'after', runValidators: true }
  ).populate('plan');

  if (!member) {
    throw ApiError.notFound('Socio no encontrado');
  }

  res.json({
    success: true,
    data: member,
  });
});

const deleteMember = catchAsync(async (req, res) => {
  const member = await Member.findOneAndUpdate(
    { _id: req.params.id, gym: req.gymId },
    { activo: false, estado: 'Inactivo' },
    { returnDocument: 'after' }
  );

  if (!member) {
    throw ApiError.notFound('Socio no encontrado');
  }

  res.json({
    success: true,
    message: 'Socio desactivado correctamente',
    data: member,
  });
});

const checkin = catchAsync(async (req, res) => {
  const { codigo } = req.body;
  const clean = codigo.trim();

  const queryOr = [
    { codigoFichaje: clean },
    { dni: clean },
    { email: clean.toLowerCase() },
  ];

  if (mongoose.Types.ObjectId.isValid(clean)) {
    queryOr.push({ _id: clean });
  }

  const member = await Member.findOne({
    gym: req.gymId,
    $or: queryOr,
  }).populate('plan');

  if (!member) {
    return res.status(404).json({
      success: false,
      encontrado: false,
      message: `No se encontró ningún socio con el código "${clean}"`,
    });
  }

  // Actualizar estado dinámico
  member.estado = Member.calcularEstado(member.fechaVencimiento, member.activo);
  member.ultimoAcceso = new Date();
  member.historialAcceso.push({ fecha: new Date(), tipo: 'checkin' });

  await member.save();

  const accesoPermitido = member.activo && member.estado !== 'Vencido' && member.estado !== 'Inactivo';

  res.json({
    success: true,
    encontrado: true,
    accesoPermitido,
    data: member,
    socio: member,
  });
});

const generateWhatsAppTemplates = catchAsync(async (req, res) => {
  const { socioIds, plantilla } = req.body;

  const filter = { gym: req.gymId };
  if (socioIds && Array.isArray(socioIds) && socioIds.length > 0) {
    filter._id = { $in: socioIds };
  }

  const members = await Member.find(filter).populate('plan');

  const templates = members.map((member) => {
    const estado = Member.calcularEstado(member.fechaVencimiento, member.activo);
    const fechaVtoStr = member.fechaVencimiento
      ? new Date(member.fechaVencimiento).toLocaleDateString('es-AR')
      : 'Sin fecha';

    let mensaje = '';
    if (plantilla) {
      mensaje = plantilla
        .replace(/{nombre}/g, member.nombre)
        .replace(/{apellido}/g, member.apellido)
        .replace(/{vencimiento}/g, fechaVtoStr)
        .replace(/{plan}/g, member.tipoSuscripcion || 'Membresía')
        .replace(/{estado}/g, estado);
    } else {
      if (estado === 'Vencido') {
        mensaje = `Hola ${member.nombre}! Te recordamos que tu cuota de ${member.tipoSuscripcion || 'gimnasio'} venció el ${fechaVtoStr}. Te esperamos para renovarla y seguir entrenando! 💪`;
      } else if (estado === 'En Fecha de Cobro') {
        mensaje = `Hola ${member.nombre}! Tu cuota de ${member.tipoSuscripcion || 'gimnasio'} está próxima a vencer el ${fechaVtoStr}. Podes abonarla por recepción o transferencia bancaria. Saludos! 🏋️`;
      } else {
        mensaje = `Hola ${member.nombre}! Gracias por formar parte de nuestra comunidad. Tu plan ${member.tipoSuscripcion || ''} está al día hasta el ${fechaVtoStr}. A seguir entrenando! 🔥`;
      }
    }

    const telefonoLimpio = (member.telefono || '').replace(/\D/g, '');
    const waLink = telefonoLimpio
      ? `https://wa.me/${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`
      : null;

    return {
      socioId: member._id,
      nombreCompleto: `${member.nombre} ${member.apellido}`,
      telefono: member.telefono,
      estado,
      fechaVencimiento: member.fechaVencimiento,
      mensaje,
      waLink,
    };
  });

  res.json({
    success: true,
    count: templates.length,
    data: templates,
  });
});

const registrarPago = catchAsync(async (req, res) => {
  const { monto, metodoPago, nuevaFechaVto, planNombre } = req.body;
  const member = await Member.findOne({ _id: req.params.id, gym: req.gymId });
  if (!member) {
    throw ApiError.notFound('Socio no encontrado');
  }

  // Si no se envía fecha explícita, extender desde la fecha actual de vencimiento
  let fechaVtoFinal;
  if (nuevaFechaVto) {
    fechaVtoFinal = new Date(nuevaFechaVto);
  } else {
    const baseDate = member.fechaVencimiento ? new Date(member.fechaVencimiento) : new Date();
    fechaVtoFinal = new Date(baseDate);
    fechaVtoFinal.setMonth(fechaVtoFinal.getMonth() + 1);
  }

  member.fechaVencimiento = fechaVtoFinal;
  member.fechaUltimoPago = new Date();
  member.estado = 'Al Día';
  if (planNombre) {
    member.tipoSuscripcion = planNombre;
  }

  await member.save();

  res.json({
    success: true,
    message: 'Pago registrado exitosamente',
    socio: member,
    data: member,
  });
});

module.exports = {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  checkin,
  generateWhatsAppTemplates,
  registrarPago,
};

