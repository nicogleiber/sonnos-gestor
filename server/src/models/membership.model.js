const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
  {
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: [true, 'El gimnasio es obligatorio'],
      index: true,
    },
    socio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: [true, 'El socio es obligatorio'],
      index: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MembershipPlan',
      required: [true, 'El plan es obligatorio'],
    },
    fechaInicio: {
      type: Date,
      required: [true, 'La fecha de inicio es obligatoria'],
      default: Date.now,
    },
    fechaFin: {
      type: Date,
      required: [true, 'La fecha de fin es obligatoria'],
    },
    precioPagado: {
      type: Number,
      required: [true, 'El precio pagado es obligatorio'],
      min: [0, 'El precio pagado no puede ser negativo'],
    },
    metodoPago: {
      type: String,
      enum: ['efectivo', 'transferencia_bancaria', 'qr_mercadopago'],
      default: 'efectivo',
    },
    estado: {
      type: String,
      enum: ['activa', 'vencida', 'cancelada'],
      default: 'activa',
    },
    renovacionAutomatica: {
      type: Boolean,
      default: false,
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

membershipSchema.index({ gym: 1, socio: 1 });
membershipSchema.index({ gym: 1, estado: 1 });
membershipSchema.index({ gym: 1, fechaFin: 1 });

module.exports = mongoose.model('Membership', membershipSchema);
