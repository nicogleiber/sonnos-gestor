'use strict';
const mongoose = require('mongoose');

const cashRegisterSchema = new mongoose.Schema(
  {
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: [true, 'El gimnasio es obligatorio'],
      index: true,
    },
    aperturaPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario que abre la caja es obligatorio'],
    },
    montoApertura: {
      type: Number,
      required: [true, 'El monto de apertura es obligatorio'],
      min: [0, 'El monto de apertura no puede ser negativo'],
      default: 0,
    },
    estado: {
      type: String,
      enum: {
        values: ['abierta', 'cerrada'],
        message: '{VALUE} no es un estado de caja valido',
      },
      default: 'abierta',
    },
    fechaApertura: {
      type: Date,
      default: Date.now,
    },
    fechaCierre: {
      type: Date,
    },
    cierrePor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    montoCierre: {
      type: Number,
      min: [0, 'El monto de cierre no puede ser negativo'],
    },
    totalVentas: {
      type: Number,
      default: 0,
    },
    totalIngresosManuales: {
      type: Number,
      default: 0,
    },
    totalEgresosManuales: {
      type: Number,
      default: 0,
    },
    notas: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

cashRegisterSchema.virtual('saldoTeorico').get(function () {
  return (
    this.montoApertura +
    this.totalVentas +
    this.totalIngresosManuales -
    this.totalEgresosManuales
  );
});

cashRegisterSchema.index({ gym: 1, estado: 1 });
cashRegisterSchema.index({ gym: 1, fechaApertura: -1 });

module.exports = mongoose.model('CashRegister', cashRegisterSchema);
