const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: [true, 'El gimnasio es obligatorio'],
      index: true,
    },
    nombre: {
      type: String,
      required: [true, 'El nombre del socio es obligatorio'],
      trim: true,
      maxlength: 60,
    },
    apellido: {
      type: String,
      required: [true, 'El apellido del socio es obligatorio'],
      trim: true,
      maxlength: 60,
    },
    dni: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    telefono: {
      type: String,
      trim: true,
    },
    codigoFichaje: {
      type: String,
      trim: true,
    },
    estado: {
      type: String,
      enum: {
        values: ['Al Día', 'En Fecha de Cobro', 'Vencido', 'Inactivo'],
        message: '{VALUE} no es un estado válido',
      },
      default: 'Al Día',
    },
    tipoSuscripcion: {
      type: String,
      trim: true,
      default: 'Mensual',
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MembershipPlan',
    },
    fechaVencimiento: {
      type: Date,
    },
    fechaUltimoPago: {
      type: Date,
    },
    ultimoAcceso: {
      type: Date,
    },
    historialAcceso: [
      {
        fecha: {
          type: Date,
          default: Date.now,
        },
        tipo: {
          type: String,
          default: 'checkin',
        },
      },
    ],
    observaciones: {
      type: String,
      trim: true,
    },
    activo: {
      type: Boolean,
      default: true,
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

// Helper estático para calcular el estado de cobro según fecha de vencimiento
memberSchema.statics.calcularEstado = function (fechaVencimiento, activo = true) {
  if (!activo) return 'Inactivo';
  if (!fechaVencimiento) return 'Al Día';

  const ahora = new Date();
  const vto = new Date(fechaVencimiento);

  // Normalizamos a medianoche para comparación de fechas puras
  ahora.setHours(0, 0, 0, 0);
  vto.setHours(0, 0, 0, 0);

  const diffMs = vto.getTime() - ahora.getTime();
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias < 0) {
    return 'Vencido';
  }
  if (diffDias <= 5) {
    return 'En Fecha de Cobro';
  }
  return 'Al Día';
};

// Índices compuestos multi-tenant
memberSchema.index({ gym: 1, activo: 1 });
memberSchema.index({ gym: 1, dni: 1 });
memberSchema.index({ gym: 1, codigoFichaje: 1 });
memberSchema.index({ gym: 1, estado: 1 });
memberSchema.index({ gym: 1, fechaVencimiento: 1 });
memberSchema.index({ gym: 1, apellido: 1, nombre: 1 });

module.exports = mongoose.model('Member', memberSchema);
