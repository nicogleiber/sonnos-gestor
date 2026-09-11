const Product = require('../models/product.model');
const InventoryMovement = require('../models/inventoryMovement.model');
const { calculateSalePrice } = require('../services/inventory.service');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const getProducts = catchAsync(async (req, res) => {
  const { categoria, q, bajoStock, activo } = req.query;

  const filter = { gym: req.gymId };

  if (activo !== undefined) {
    filter.activo = activo === 'true';
  }

  if (categoria) {
    filter.categoria = categoria;
  }

  if (bajoStock === 'true') {
    filter.$expr = { $lte: ['$stock', '$stockMinimo'] };
  }

  if (q) {
    const regex = { $regex: q.trim(), $options: 'i' };
    filter.$or = [{ nombre: regex }, { codigo: regex }, { categoria: regex }];
  }

  const products = await Product.find(filter).sort({ nombre: 1 });

  res.json({
    success: true,
    data: products,
  });
});

const getProductById = catchAsync(async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    gym: req.gymId,
  });

  if (!product) {
    throw ApiError.notFound('Producto no encontrado');
  }

  res.json({
    success: true,
    data: product,
  });
});

const createProduct = catchAsync(async (req, res) => {
  const { codigo, costo, margen, precioVenta, stock } = req.body;

  if (codigo) {
    const existingCode = await Product.findOne({
      gym: req.gymId,
      codigo: codigo.trim().toUpperCase(),
    });
    if (existingCode) {
      throw ApiError.conflict('Ya existe un producto con ese código en este gimnasio');
    }
  }

  const productData = {
    ...req.body,
    gym: req.gymId,
    costo: Number(costo) || 0,
    margen: margen !== undefined ? Number(margen) : 30,
    precioVenta:
      precioVenta !== undefined
        ? Number(precioVenta)
        : calculateSalePrice(costo, margen !== undefined ? margen : 30),
  };

  const product = await Product.create(productData);

  // Si se inicializó con stock > 0, registrar movimiento inicial
  if (product.stock > 0) {
    await InventoryMovement.create({
      gym: req.gymId,
      producto: product._id,
      productoNombre: product.nombre,
      tipo: 'ingreso',
      cantidad: product.stock,
      stockAnterior: 0,
      stockNuevo: product.stock,
      motivo: 'Stock inicial de alta',
      usuario: req.user._id,
    });
  }

  res.status(201).json({
    success: true,
    data: product,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const { codigo, costo, margen, precioVenta } = req.body;

  if (codigo) {
    const existingCode = await Product.findOne({
      gym: req.gymId,
      codigo: codigo.trim().toUpperCase(),
      _id: { $ne: req.params.id },
    });
    if (existingCode) {
      throw ApiError.conflict('Ya existe otro producto con ese código en este gimnasio');
    }
  }

  const updateData = { ...req.body };

  // Si se modifican costo o margen y no se especifica precio de venta, recalcularlo
  if ((costo !== undefined || margen !== undefined) && precioVenta === undefined) {
    const current = await Product.findOne({ _id: req.params.id, gym: req.gymId });
    if (!current) throw ApiError.notFound('Producto no encontrado');
    const finalCosto = costo !== undefined ? Number(costo) : current.costo;
    const finalMargen = margen !== undefined ? Number(margen) : current.margen;
    updateData.precioVenta = calculateSalePrice(finalCosto, finalMargen);
  }

  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, gym: req.gymId },
    updateData,
    { returnDocument: 'after', runValidators: true }
  );

  if (!product) {
    throw ApiError.notFound('Producto no encontrado');
  }

  res.json({
    success: true,
    data: product,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, gym: req.gymId },
    { activo: false },
    { returnDocument: 'after' }
  );

  if (!product) {
    throw ApiError.notFound('Producto no encontrado');
  }

  res.json({
    success: true,
    message: 'Producto desactivado correctamente',
    data: product,
  });
});

const calcularPrecio = catchAsync(async (req, res) => {
  const { costo, margen } = req.body;
  const precioVenta = calculateSalePrice(costo, margen);

  res.json({
    success: true,
    data: {
      costo: Number(costo),
      margen: Number(margen),
      precioVenta,
    },
  });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  calcularPrecio,
};
