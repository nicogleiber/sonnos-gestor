const Product = require('../models/product.model');
const InventoryMovement = require('../models/inventoryMovement.model');
const ApiError = require('../utils/ApiError');

/**
 * Calcula el precio de venta sugerido a partir del costo y el margen de ganancia porcentual.
 */
function calculateSalePrice(costo, margen = 30) {
  const c = Number(costo) || 0;
  const m = Number(margen) || 0;
  return Math.round(c * (1 + m / 100));
}

/**
 * Realiza un ajuste de stock atómico y registra el movimiento en el historial de auditoría.
 */
async function adjustStock({
  gymId,
  productId,
  cantidad,
  tipo = 'ingreso',
  motivo,
  userId,
  session,
}) {
  const product = await Product.findOne({ _id: productId, gym: gymId }).session(session || null);

  if (!product) {
    throw ApiError.notFound('Producto no encontrado');
  }

  const stockAnterior = product.stock;
  let stockNuevo = stockAnterior;
  const cant = Number(cantidad);

  if (tipo === 'ingreso' || tipo === 'devolucion') {
    stockNuevo = stockAnterior + Math.abs(cant);
  } else if (tipo === 'egreso' || tipo === 'venta') {
    const qty = Math.abs(cant);
    if (stockAnterior < qty) {
      throw ApiError.badRequest(
        `Stock insuficiente para el producto "${product.nombre}". Stock disponible: ${stockAnterior}, requerido: ${qty}`
      );
    }
    stockNuevo = stockAnterior - qty;
  } else if (tipo === 'ajuste') {
    if (cant < 0) {
      throw ApiError.badRequest('El stock ajustado no puede ser negativo');
    }
    stockNuevo = cant;
  }

  product.stock = stockNuevo;
  await product.save(session ? { session } : {});

  const [movement] = await InventoryMovement.create(
    [
      {
        gym: gymId,
        producto: product._id,
        productoNombre: product.nombre,
        tipo,
        cantidad: Math.abs(cant),
        stockAnterior,
        stockNuevo,
        motivo: motivo || `Movimiento de tipo ${tipo}`,
        usuario: userId,
      },
    ],
    session ? { session } : {}
  );

  return { product, movement };
}

module.exports = {
  calculateSalePrice,
  adjustStock,
};
