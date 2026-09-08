const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema(
  {
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true,
      index: true,
    },
    nombre: {
      type: String,
      required: [true, 'El nombre del plan es obligatorio'],
      trim: true,
      maxlength: 100,
    },
    tipo: {
      type: String,
      required: [true, 'El tipo de plan es obligatorio'],
      enum: {
        values: ['Plan Musculación', 'Clase/Disciplina'],
        message: '{VALUE} no es un tipo de plan válido',
      },
    },
    duracionMeses: {
      type: Number,
      default: 1,
      min: [1, 'La duración mínima es 1 mes'],
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    frecuencia: {
      type: String,
      trim: true,
    },
    cupos: {
      type: Number,
      default: 20,
      min: 0,
    },
    promocionReferidos: {
      type: String,
      trim: true,
    },
    descripcion: {
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

membershipPlanSchema.index({ gym: 1, activo: 1 });
membershipPlanSchema.index({ gym: 1, nombre: 1 });
membershipPlanSchema.index({ gym: 1, tipo: 1 });

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
