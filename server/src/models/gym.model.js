const mongoose = require('mongoose');

const DEFAULT_PAYMENT_METHODS = ['efectivo', 'transferencia_bancaria', 'qr_mercadopago'];

const sedeSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  direccion: { type: String, default: '' },
  telefono: { type: String, default: '' },
  principal: { type: Boolean, default: false },
}, { _id: true });

const gymSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del gimnasio es obligatorio'],
      trim: true,
      maxlength: 120,
    },
    timezone: {
      type: String,
      required: true,
      default: 'America/Argentina/Buenos_Aires',
    },
    paymentMethods: {
      type: [String],
      default: () => [...DEFAULT_PAYMENT_METHODS],
    },
    active: {
      type: Boolean,
      default: true,
    },
    // ── Perfil del Gimnasio ──────────────────────
    telefono: { type: String, default: '' },
    direccion: { type: String, default: '' },
    email: { type: String, default: '' },
    sitioWeb: { type: String, default: '' },
    cuit: { type: String, default: '' },
    aliasMercadoPago: { type: String, default: '' },
    cvuTransferencia: { type: String, default: '' },
    horarioApertura: { type: String, default: '06:00' },
    horarioCierre: { type: String, default: '22:00' },
    diasApertura: {
      type: [String],
      default: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    },
    capacidadMaxima: { type: Number, default: 150 },
    // ── Sedes ────────────────────────────────────
    sedes: {
      type: [sedeSchema],
      default: [],
    },
  },
  { timestamps: true }
);

gymSchema.index({ active: 1 });

module.exports = mongoose.model('Gym', gymSchema);