'use strict';
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: [true, 'El gimnasio es obligatorio'],
      index: true,
    },
    membresia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Membership',
      required: [true, 'La membresia es obligatoria'],
    },
    socio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: [true, 'El socio es obligatorio'],
      index: true,
    },
    monto: {
      type: Number,
      required: [true, 'El monto es obligatorio'],
      min: [0, 'El monto no puede ser negativo'],
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
        values: ['completado', 'anulado'],
        message: '{VALUE} no es un estado de pago valido',
      },
      default: 'completado',
    },
    registradoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario que registra el pago es obligatorio'],
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

paymentSchema.index({ gym: 1, socio: 1 });
paymentSchema.index({ gym: 1, membresia: 1 });
paymentSchema.index({ gym: 1, estado: 1 });
paymentSchema.index({ gym: 1, createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
