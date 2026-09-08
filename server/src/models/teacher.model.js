const mongoose = require('mongoose');

const consultaSchema = new mongoose.Schema(
  {
    fecha: {
      type: Date,
      required: [true, 'La fecha de la consulta es obligatoria'],
    },
    hora: {
      type: String,
      required: [true, 'La hora de la consulta es obligatoria'],
      trim: true,
    },
    socioNombre: {
      type: String,
      required: [true, 'El nombre del socio es obligatorio'],
      trim: true,
    },
    socioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
    },
    tipo: {
      type: String,
      trim: true,
    },
    notas: {
      type: String,
      trim: true,
    },
    estado: {
      type: String,
      enum: ['Programada', 'Realizada', 'Cancelada'],
      default: 'Programada',
    },
  },
  {
    timestamps: true,
  }
);

const teacherSchema = new mongoose.Schema(
  {
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true,
      index: true,
    },
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxlength: 60,
    },
    apellido: {
      type: String,
      required: [true, 'El apellido es obligatorio'],
      trim: true,
      maxlength: 60,
    },
    rol: {
      type: String,
      trim: true,
      default: 'Entrenador Personal',
    },
    especialidad: {
      type: String,
      trim: true,
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
    activo: {
      type: Boolean,
      default: true,
    },
    consultasAcordadas: [consultaSchema],
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

teacherSchema.index({ gym: 1, activo: 1 });
teacherSchema.index({ gym: 1, nombre: 1, apellido: 1 });

module.exports = mongoose.model('Teacher', teacherSchema);
