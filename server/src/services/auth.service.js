const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const User = require('../models/user.model');
const Gym = require('../models/gym.model');
const GymStaff = require('../models/gymStaff.model');
const { ROLES } = require('../constants/roles');

function signToken(userId) {
  return jwt.sign({ sub: userId.toString() }, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
}

// Alta de un gimnasio nuevo en el SaaS: crea Gym + User(owner) + GymStaff juntos.
// Si algo falla a mitad de camino, no debe quedar ni el Gym ni el User creados sueltos.
async function registerGymOwner({ gymName, firstName, lastName, email, password }) {
  const session = await mongoose.startSession();
  let user;
  let gym;

  try {
    await session.withTransaction(async () => {
      const existing = await User.findOne({ email }).session(session);
      if (existing) {
        throw ApiError.conflict('Ya existe una cuenta con ese email');
      }

      [gym] = await Gym.create([{ name: gymName }], { session });
      [user] = await User.create([{ firstName, lastName, email, password }], { session });
      await GymStaff.create([{ gym: gym._id, user: user._id, role: ROLES.OWNER }], { session });
    });
  } finally {
    session.endSession();
  }

  return { token: signToken(user._id), user, gym };
}

async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+password');

  // Mismo mensaje si el email no existe o si la contraseña está mal:
  // no le damos a un atacante forma de saber qué emails están registrados.
  if (!user || !user.active || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Email o contraseña incorrectos');
  }

  user.lastLoginAt = new Date();
  await user.save();

  const staffRecords = user.isPlatformAdmin
    ? []
    : await GymStaff.find({ user: user._id, status: 'active' }).populate('gym', 'name');

  return {
    token: signToken(user._id),
    user,
    isPlatformAdmin: user.isPlatformAdmin,
    gyms: staffRecords.map((s) => ({ gymId: s.gym._id, gymName: s.gym.name, role: s.role })),
  };
}

module.exports = { registerGymOwner, login };