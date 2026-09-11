'use strict';
const mongoose = require('mongoose');
const Sale = require('../models/sale.model');
const Product = require('../models/product.model');
const inventoryService = require('./inventory.service');
const cashRegisterService = require('./cashRegister.service');
const ApiError = require('../utils/ApiError');

/**
 * Crea una venta de forma transaccional:
 * 1. Descuenta stock de cada producto
 * 2. Crea el documento Sale
 * 3. Si hay caja abierta, registra el CashMovement de tipo 'ingreso_venta'
 */
async function createSale({ gymId, vendedorId, items, descuento = 0, metodoPago = 'efectivo', notas }) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validar y procesar items
    const itemsProcessed = [];
    let total = 0;

    for (const item of items) {
      const product = await Product.findOne({ _id: item.productoId, gym: gymId }).session(session);
      if (!product) {
        throw ApiError.notFound(`Producto con id "${item.productoId}" no encontrado en este gimnasio`);
      }
      if (!product.activo) {
        throw ApiError.badRequest(`El producto "${product.nombre}" no esta activo`);
      }

      const cantidad = Number(item.cantidad);
      if (!Number.isInteger(cantidad) || cantidad < 1) {
        throw ApiError.badRequest(`La cantidad para "${product.nombre}" debe ser un entero mayor a 0`);
      }

      // Descontar stock (lanza 400 si insuficiente)
      await inventoryService.adjustStock({
        gymId,
        productId: product._id,
        cantidad,
        tipo: 'venta',
        motivo: 'Venta registrada en sistema',
        userId: vendedorId,
        session,
      });

      const precioUnitario = product.precioVenta;
      const subtotal = precioUnitario * cantidad;
      total += subtotal;

      itemsProcessed.push({
        producto: product._id,
        nombre: product.nombre,
        cantidad,
        precioUnitario,
        subtotal,
      });
    }

    const desc = Math.min(Math.max(Number(descuento) || 0, 0), 100);
    const totalConDescuento = Math.round(total * (1 - desc / 100));

    // Verificar si hay caja abierta
    const cajaAbierta = await cashRegisterService.getOpenRegister(gymId, session);

    const [sale] = await Sale.create(
      [
        {
          gym: gymId,
          vendedor: vendedorId,
          items: itemsProcessed,
          total,
          descuento: desc,
          totalConDescuento,
          metodoPago,
          estado: 'completada',
          caja: cajaAbierta ? cajaAbierta._id : undefined,
          notas,
        },
      ],
      { session }
    );

    let cashMovement = null;
    if (cajaAbierta) {
      cashMovement = await cashRegisterService.addMovement({
        gymId,
        cajaId: cajaAbierta._id,
        tipo: 'ingreso_venta',
        monto: totalConDescuento,
        descripcion: `Venta #${sale._id}`,
        userId: vendedorId,
        referenciaVenta: sale._id,
        session,
      });
    }

    await session.commitTransaction();
    return { sale, cashMovement };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

/**
 * Anula una venta y devuelve el stock de cada item.
 */
async function cancelSale({ gymId, saleId, userId }) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sale = await Sale.findOne({ _id: saleId, gym: gymId }).session(session);
    if (!sale) {
      throw ApiError.notFound('Venta no encontrada');
    }
    if (sale.estado === 'anulada') {
      throw ApiError.conflict('La venta ya se encuentra anulada');
    }

    // Restaurar stock de cada item
    for (const item of sale.items) {
      await inventoryService.adjustStock({
        gymId,
        productId: item.producto,
        cantidad: item.cantidad,
        tipo: 'devolucion',
        motivo: `Devolucion por anulacion de venta #${sale._id}`,
        userId,
        session,
      });
    }

    sale.estado = 'anulada';
    await sale.save({ session });

    await session.commitTransaction();
    return sale;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

module.exports = { createSale, cancelSale };
