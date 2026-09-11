const mongoose = require('mongoose');

const inscriptionSchema = new mongoose.Schema(
  {
    socio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    nombre: {
      type: String,
      trim: true,
    },
    inscriptoEl: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const classSchema = new mongoose.Schema(
  {
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: [true, 'El gimnasio es obligatorio'],
      index: true,
    },
    nombre: {
      type: String,
      required: [true, 'El nombre de la clase es obligatorio'],
      trim: true,
      maxlength: 100,
    },
    salon: {
      type: String,
      required: [true, 'El salón o sala es obligatorio'],
      trim: true,
    },
    profesor: {
      type: String,
      trim: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
    },
    dias: [
      {
        type: String,
        enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      },
    ],
    dia: {
      type: String,
      trim: true,
    },
    horario: {
      type: String,
      required: [true, 'El horario es obligatorio'],
      trim: true,
    },
    duracion: {
      type: Number,
      default: 60,
      min: [1, 'La duración mínima es 1 minuto'],
    },
    cupoMaximo: {
      type: Number,
      default: 20,
      min: [1, 'El cupo máximo debe ser al menos 1'],
    },
    tipoEvento: {
      type: String,
      enum: ['Semanal Recurrente', 'Evento Único'],
      default: 'Semanal Recurrente',
    },
    fechaEspecifica: {
      type: Date,
    },
    inscritos: [inscriptionSchema],
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.inscriptos = ret.inscritos ? ret.inscritos.length : 0;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Virtual para total de inscritos
classSchema.virtual('totalInscriptos').get(function () {
  return this.inscritos ? this.inscritos.length : 0;
});

// Índices compuestos multi-tenant
classSchema.index({ gym: 1, activo: 1 });
classSchema.index({ gym: 1, nombre: 1 });
classSchema.index({ gym: 1, salon: 1 });
classSchema.index({ gym: 1, horario: 1 });
classSchema.index({ gym: 1, dias: 1 });

module.exports = mongoose.model('Class', classSchema);
