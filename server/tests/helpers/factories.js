'use strict';
/**
 * tests/helpers/factories.js
 *
 * Helpers reutilizables para crear datos de prueba.
 * Usan la capa de servicio/modelos reales (no mocks), lo que valida también
 * las restricciones del schema de Mongoose.
 */

const authService = require('../../src/services/auth.service');
const User = require('../../src/models/user.model');
const Gym = require('../../src/models/gym.model');
const GymStaff = require('../../src/models/gymStaff.model');

/** Contador para garantizar emails únicos entre helpers llamados en el mismo test */
let _counter = 0;
function uniqueEmail(prefix = 'user') {
  return `${prefix}-${Date.now()}-${++_counter}@test.com`;
}

/**
 * Crea un gimnasio con su owner completo (User + Gym + GymStaff) usando
 * authService.registerGymOwner, que es la misma ruta que usa POST /register.
 *
 * @param {object} overrides — campos opcionales para sobreescribir los defaults
 * @returns {{ user, gym, token }}
 */
async function createGymOwner(overrides = {}) {
  const defaults = {
    gymName: 'Gimnasio Test',
    firstName: 'Owner',
    lastName: 'Test',
    email: uniqueEmail('owner'),
    password: 'Password1',
  };
  return authService.registerGymOwner({ ...defaults, ...overrides });
}

/**
 * Crea un User y un GymStaff directamente en la BD (sin pasar por la API),
 * útil para poblar escenarios de roles específicos sin exponer el endpoint.
 *
 * @param {{ gym: ObjectId|string, role: string, userOverrides?: object }} options
 * @returns {{ user, staffRecord }}
 */
async function createUserInGym({ gym, role, userOverrides = {} }) {
  const userData = {
    firstName: 'Staff',
    lastName: 'Test',
    email: uniqueEmail('staff'),
    password: 'Password1',
    ...userOverrides,
  };
  const user = await User.create(userData);
  const staffRecord = await GymStaff.create({ gym, user: user._id, role });
  return { user, staffRecord };
}

/**
 * Crea un Gym vacío (sin staff). Útil para el test de aislamiento multi-tenant
 * donde necesitamos un gym al que el usuario de prueba NO pertenece.
 *
 * @param {object} overrides
 * @returns {Gym document}
 */
async function createGym(overrides = {}) {
  return Gym.create({ name: 'Gimnasio Ajeno', ...overrides });
}

/**
 * Genera el header Authorization para usar con supertest.
 *
 * @param {string} token
 * @returns {string}
 */
function authHeader(token) {
  return `Bearer ${token}`;
}

module.exports = {
  createGymOwner,
  createUserInGym,
  createGym,
  authHeader,
};
