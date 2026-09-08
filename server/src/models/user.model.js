const mongoose = require('mongoose');

// Definimos el esquema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [50, 'El nombre no puede superar los 50 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email no válido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
        select: false // No devuelve la contraseña en las consultas por defecto
    },
    age: {
        type: Number,
        min: [18, 'Debes ser mayor de edad'],
        max: [120, 'Edad no válida']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
    versionKey: false // Elimina el campo __v
});

// Métodos personalizados (opcional)
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password; // Elimina la contraseña al enviar JSON
    return user;
};

// Middleware pre-save (para hashear contraseña, por ejemplo)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    // Aquí podrías hashear la contraseña con bcrypt
    // const salt = await bcrypt.genSalt(10);
    // this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Método estático (opcional)
userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email });
};

// Crear el modelo a partir del esquema
const User = mongoose.model('User', userSchema);

module.exports = User;