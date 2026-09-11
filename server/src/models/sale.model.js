'use strict';
const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema(
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    cantidad: {
      type: Number,
      required: true,
      min: [1, 'La cantidad debe ser al menos 1'],
    },
    precioUnitario: {
      type: Number,
      required: true,
      min: [0, 'El precio unitario no puede ser negativo'],
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'El subtotal no puede ser negativo'],
    },
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: [true, 'El gimnasio es obligatorio'],
      index: true,
    },
    vendedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El vendedor es obligatorio'],
    },
    items: {
      type: [saleItemSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'La venta debe tener al menos un item',
      },
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'El total no puede ser negativo'],
    },
    descuento: {
      type: Number,
      default: 0,
      min: [0, 'El descuento no puede ser negativo'],
      max: [100, 'El descuento no puede superar el 100%'],
    },
    totalConDescuento: {
      type: Number,
      required: true,
      min: [0, 'El total con descuento no puede ser negativo'],
    },
    metodoPago: {
      type: String,
      enum: {
        values: ['efectivo', 'transferencia_bancaria', 'qr_mercadopago'],
        message: '{VALUE} no es un metodo de pago valido',
      },
      default: 'efectivo',
    },
    estado: {
      type: String,
      enum: {
        values: ['completada', 'anulada'],
        message: '{VALUE} no es un estado de venta valido',
      },
      default: 'completada',
    },
    caja: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CashRegister',
    },
    notas: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

saleSchema.index({ gym: 1, estado: 1 });
saleSchema.index({ gym: 1, vendedor: 1 });
saleSchema.index({ gym: 1, createdAt: -1 });
saleSchema.index({ gym: 1, caja: 1 });

module.exports = mongoose.model('Sale', saleSchema);
