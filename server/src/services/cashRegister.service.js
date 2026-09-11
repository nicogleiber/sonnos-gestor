'use strict';
const CashRegister = require('../models/cashRegister.model');
const CashMovement = require('../models/cashMovement.model');
const ApiError = require('../utils/ApiError');

/**
 * Retorna la caja abierta del gimnasio, o null si no hay ninguna.
 */
async function getOpenRegister(gymId, session) {
  return CashRegister.findOne({ gym: gymId, estado: 'abierta' }).session(session || null);
}

/**
 * Abre una nueva caja para el gimnasio.
 * Lanza 409 si ya hay una caja abierta.
 */
async function openCashRegister({ gymId, userId, montoApertura = 0 }) {
  const existing = await getOpenRegister(gymId);
  if (existing) {
    throw ApiError.conflict('Ya hay una caja abierta para este gimnasio. Cierre la actual antes de abrir una nueva.');
  }

  const caja = await CashRegister.create({
    gym: gymId,
    aperturaPor: userId,
    montoApertura: Number(montoApertura) || 0,
    estado: 'abierta',
    fechaApertura: new Date(),
  });

  return caja;
}

/**
 * Cierra la caja indicada calculando los totales desde los movimientos registrados.
 */
async function closeCashRegister({ gymId, cajaId, userId, montoCierre }) {
  const caja = await CashRegister.findOne({ _id: cajaId, gym: gymId, estado: 'abierta' });
  if (!caja) {
    throw ApiError.notFound('Caja no encontrada o ya se encuentra cerrada');
  }

  // Calcular totales desde los movimientos
  const [ventasTotales, ingresosManuales, egresosManuales] = await Promise.all([
    CashMovement.aggregate([
      { $match: { caja: caja._id, tipo: 'ingreso_venta' } },
      { $group: { _id: null, total: { $sum: '$monto' } } },
    ]),
    CashMovement.aggregate([
      { $match: { caja: caja._id, tipo: 'ingreso_manual' } },
      { $group: { _id: null, total: { $sum: '$monto' } } },
    ]),
    CashMovement.aggregate([
      { $match: { caja: caja._id, tipo: 'egreso_manual' } },
      { $group: { _id: null, total: { $sum: '$monto' } } },
    ]),
  ]);

  caja.totalVentas = ventasTotales[0]?.total || 0;
  caja.totalIngresosManuales = ingresosManuales[0]?.total || 0;
  caja.totalEgresosManuales = egresosManuales[0]?.total || 0;
  caja.estado = 'cerrada';
  caja.fechaCierre = new Date();
  caja.cierrePor = userId;
  if (montoCierre !== undefined) {
    caja.montoCierre = Number(montoCierre);
  }

  await caja.save();
  return caja;
}

/**
 * Registra un movimiento manual (ingreso o egreso) en la caja.
 */
async function addMovement({ gymId, cajaId, tipo, monto, descripcion, userId, referenciaVenta, session }) {
  const caja = await CashRegister.findOne({ _id: cajaId, gym: gymId, estado: 'abierta' }).session(session || null);
  if (!caja) {
    throw ApiError.notFound('Caja no encontrada o no se encuentra abierta');
  }

  const [movement] = await CashMovement.create(
    [
      {
        gym: gymId,
        caja: cajaId,
        tipo,
        monto: Number(monto),
        descripcion,
        registradoPor: userId,
        referenciaVenta: referenciaVenta || undefined,
      },
    ],
    session ? { session } : {}
  );

  return movement;
}

module.exports = {
  getOpenRegister,
  openCashRegister,
  closeCashRegister,
  addMovement,
};
