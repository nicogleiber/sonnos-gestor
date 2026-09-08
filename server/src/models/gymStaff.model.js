const mongoose = require('mongoose');
const { GYM_STAFF_ROLES } = require('../constants/roles');
const bcrypt = require('bcrypt');

const gymStaffSchema = new mongoose.Schema(
    {
        gym: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, enum: GYM_STAFF_ROLES, required: true },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    },
    { timestamps: true }
);

// Un usuario no puede tener dos registros de staff para el mismo gimnasio.
// Además, es el índice que responde "¿a qué gimnasios pertenece este usuario?".
gymStaffSchema.index({ user: 1, gym: 1 }, { unique: true });

// Consulta frecuente: "todo el staff de este gimnasio" (opcionalmente filtrado por rol).
gymStaffSchema.index({ gym: 1, role: 1 });

module.exports = mongoose.model('GymStaff', gymStaffSchema);