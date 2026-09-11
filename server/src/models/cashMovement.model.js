'use strict';
const mongoose = require('mongoose');

const cashMovementSchema = new mongoose.Schema(
  {
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: [true, 'El gimnasio es obligatorio'],
      index: true,
    },
    caja: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CashRegister',
      required: [true, 'La caja es obligatoria'],
      index: true,
    },
    tipo: {
      type: String,
      enum: {
        values: ['ingreso_venta', 'ingreso_manual', 'egreso_manual'],
        message: '{VALUE} no es un tipo de movimiento de caja valido',
      },
      required: [true, 'El tipo de movimiento es obligatorio'],
    },
    monto: {
      type: Number,
      required: [true, 'El monto es obligatorio'],
      min: [0.01, 'El monto debe ser mayor a 0'],
    },
    descripcion: {
      type: String,
      trim: true,
    },
    referenciaVenta: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sale',
    },
    registradoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario que registra el movimiento es obligatorio'],
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

cashMovementSchema.index({ gym: 1, caja: 1 });
cashMovementSchema.index({ gym: 1, tipo: 1 });
cashMovementSchema.index({ gym: 1, createdAt: -1 });

module.exports = mongoose.model('CashMovement', cashMovementSchema);
