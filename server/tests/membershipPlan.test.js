'use strict';

const request = require('supertest');
const app = require('../src/app');
const MembershipPlan = require('../src/models/membershipPlan.model');
const { ROLES } = require('../src/constants/roles');
const {
  createGymOwner,
  createUserInGym,
  authHeader,
} = require('./helpers/factories');
const jwt = require('jsonwebtoken');
const env = require('../src/config/env');

function signToken(userId) {
  return jwt.sign({ sub: userId.toString() }, env.jwt.secret, { expiresIn: '1h' });
}

describe('Fase 1: Módulo Tarifas y Planes de Membresía', () => {
  it('1. Permite crear un plan de musculación correctamente (POST /membership-plans)', async () => {
    const { gym, token } = await createGymOwner({ gymName: 'Gym Tarifas' });

    const res = await request(app)
      .post(`/api/v1/gyms/${gym._id}/membership-plans`)
      .set('Authorization', authHeader(token))
      .send({
        nombre: 'Plan Trimestral Fit',
        tipo: 'Plan Musculación',
        duracionMeses: 3,
        precio: 48000,
        descripcion: 'Ahorro del 15% pagando el trimestre.',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.nombre).toBe('Plan Trimestral Fit');
    expect(res.body.data.precio).toBe(48000);
    expect(res.body.data.duracionMeses).toBe(3);
  });

  it('2. Rechaza creación si el tipo de plan es inválido (400 Bad Request)', async () => {
    const { gym, token } = await createGymOwner({ gymName: 'Gym Tarifas' });

    const res = await request(app)
      .post(`/api/v1/gyms/${gym._id}/membership-plans`)
      .set('Authorization', authHeader(token))
      .send({
        nombre: 'Plan Inválido',
        tipo: 'TipoQueNoExiste',
        precio: 1000,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('3. Lista planes filtrando por tipo y por estado activo', async () => {
    const { gym, token } = await createGymOwner({ gymName: 'Gym Tarifas' });

    await MembershipPlan.create([
      { gym: gym._id, nombre: 'Pase Libre', tipo: 'Plan Musculación', precio: 15000, activo: true },
      { gym: gym._id, nombre: 'Spinning', tipo: 'Clase/Disciplina', precio: 12000, activo: true },
      { gym: gym._id, nombre: 'Plan Viejo', tipo: 'Plan Musculación', precio: 8000, activo: false },
    ]);

    const res = await request(app)
      .get(`/api/v1/gyms/${gym._id}/membership-plans?tipo=Plan Musculación&activo=true`)
      .set('Authorization', authHeader(token));

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].nombre).toBe('Pase Libre');
  });

  it('4. Rol STAFF no puede crear planes de membresía (falta MANAGE_MEMBERSHIP_PLANS -> 403)', async () => {
    const { gym } = await createGymOwner({ gymName: 'Gym Tarifas' });
    const { user: staffUser } = await createUserInGym({
      gym: gym._id,
      role: ROLES.STAFF,
    });
    const staffToken = signToken(staffUser._id);

    const res = await request(app)
      .post(`/api/v1/gyms/${gym._id}/membership-plans`)
      .set('Authorization', authHeader(staffToken))
      .send({
        nombre: 'Plan Prohibido',
        tipo: 'Plan Musculación',
        precio: 9999,
      });

    expect(res.status).toBe(403);
  });
});
