const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError.js');
const catchAsync = require('../utils/catchAsync.js');
const User = require('../models/user.model.js');

const authenticate = catchAsync(async (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        throw ApiError.unauthorized('Falta el token de autenticación');
    }

    const token = header.split(' ')[1];

    let payload;
    try {
        payload = jwt.verify(token, env.jwt.secret);
    } catch (err) {
        throw ApiError.unauthorized('Token inválido o expirado');
    }

    const user = await User.findById(payload.sub);

    if (!user || !user.active) {
        throw ApiError.unauthorized('Usuario no encontrado o inactivo');
    }

    req.user = user;
    next();
});

module.exports = authenticate;