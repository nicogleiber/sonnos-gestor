'use strict';
const mongoose = require('mongoose');
const Member = require('../models/member.model');
const Membership = require('../models/membership.model');
const Sale = require('../models/sale.model');
const Product = require('../models/product.model');
const Class = require('../models/class.model');
const cashRegisterService = require('../services/cashRegister.service');
const catchAsync = require('../utils/catchAsync');

const getDashboard = catchAsync(async (req, res) => {
  const gymId = new mongoose.Types.ObjectId(req.gymId);
  const now = new Date();
  const inicioMesActual = new Date(now.getFullYear(), now.getMonth(), 1);
  const inicioMesAnterior = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const finMesAnterior = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const [
    sociosStats,
    ventasMesActual,
    ventasMesAnterior,
    cajaActual,
    bajoStock,
    proximasClases,
  ] = await Promise.all([
    // Socios activos, nuevos este mes y con membresía vencida
    Promise.all([
      Member.countDocuments({ gym: gymId, activo: true }),
      Member.countDocuments({ gym: gymId, createdAt: { $gte: inicioMesActual } }),
      Membership.countDocuments({ gym: gymId, estado: 'vencida' }),
    ]),

    // Ventas del mes actual (solo completadas)
    Sale.aggregate([
      { $match: { gym: gymId, estado: 'completada', createdAt: { $gte: inicioMesActual } } },
      { $group: { _id: null, total: { $sum: '$totalConDescuento' }, cantidad: { $sum: 1 } } },
    ]),

    // Ventas del mes anterior
    Sale.aggregate([
      { $match: { gym: gymId, estado: 'completada', createdAt: { $gte: inicioMesAnterior, $lte: finMesAnterior } } },
      { $group: { _id: null, total: { $sum: '$totalConDescuento' }, cantidad: { $sum: 1 } } },
    ]),

    // Caja abierta actual
    cashRegisterService.getOpenRegister(gymId.toString()),

    // Productos bajo stock
    Product.find({ gym: gymId, activo: true, $expr: { $lte: ['$stock', '$stockMinimo'] } })
      .select('nombre codigo stock stockMinimo categoria')
      .sort({ stock: 1 })
      .limit(10),

    // Proximas 5 clases
    Class.find({
      gym: gymId,
      activo: true,
    })
      .select('nombre tipo salon horario cupoMaximo inscriptos')
      .sort({ 'horario.hora': 1 })
      .limit(5),
  ]);

  const [totalSocios, nuevosSocios, membresiasVencidas] = sociosStats;

  const ventasMes = ventasMesActual[0] || { total: 0, cantidad: 0 };
  const ventasAnterior = ventasMesAnterior[0] || { total: 0, cantidad: 0 };
  const ticketPromedio = ventasMes.cantidad > 0 ? Math.round(ventasMes.total / ventasMes.cantidad) : 0;
  const variacionVentas = ventasAnterior.total > 0
    ? Math.round(((ventasMes.total - ventasAnterior.total) / ventasAnterior.total) * 100)
    : null;

  res.json({
    success: true,
    data: {
      socios: {
        totalActivos: totalSocios,
        nuevosMes: nuevosSocios,
        membresiasVencidas,
      },
      ventas: {
        totalMes: ventasMes.total,
        cantidadMes: ventasMes.cantidad,
        ticketPromedio,
        variacionVsAnterior: variacionVentas,
      },
      caja: {
        abierta: !!cajaActual,
        saldoTeorico: cajaActual ? cajaActual.saldoTeorico : null,
        fechaApertura: cajaActual ? cajaActual.fechaApertura : null,
      },
      inventario: {
        productosBajoStock: bajoStock,
        totalBajoStock: bajoStock.length,
      },
      clases: {
        proximas: proximasClases,
      },
    },
  });
});

module.exports = { getDashboard };
