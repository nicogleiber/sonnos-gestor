const mongoose = require('mongoose');

const DEFAULT_PAYMENT_METHODS = ['efectivo', 'transferencia_bancaria', 'qr_mercadopago'];

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
      // false = tenant desactivado por platformAdmin (ej. falta de pago del SaaS),
      // ninguna operación normal debería filtrar sobre esto todavía.
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Sirve para el futuro dashboard de platformAdmin ("gimnasios activos/inactivos de la plataforma").
gymSchema.index({ active: 1 });

module.exports = mongoose.model('Gym', gymSchema);