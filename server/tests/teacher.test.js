'use strict';

const request = require('supertest');
const app = require('../src/app');
const Teacher = require('../src/models/teacher.model');
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

describe('Fase 1: Módulo Profesores y Consultas', () => {
  it('1. Permite registrar un profesor nuevo (POST /teachers)', async () => {
    const { gym, token } = await createGymOwner({ gymName: 'Gym Profesores' });

    const res = await request(app)
      .post(`/api/v1/gyms/${gym._id}/teachers`)
      .set('Authorization', authHeader(token))
      .send({
        nombre: 'Carlos',
        apellido: 'Vega',
        rol: 'Entrenador Personal',
        especialidad: 'Fuerza y Musculación',
        email: 'cvega@sonnos.com',
        telefono: '011-4500-1111',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.nombre).toBe('Carlos');
    expect(res.body.data.especialidad).toBe('Fuerza y Musculación');
  });

  it('2. Permite agendar una consulta personalizada con un profesor (POST /teachers/:id/consultas)', async () => {
    const { gym, token } = await createGymOwner({ gymName: 'Gym Profesores' });

    const teacher = await Teacher.create({
      gym: gym._id,
      nombre: 'Pablo',
      apellido: 'Ríos',
      rol: 'Nutricionista',
      especialidad: 'Nutrición Deportiva',
    });

    const res = await request(app)
      .post(`/api/v1/gyms/${gym._id}/teachers/${teacher._id}/consultas`)
      .set('Authorization', authHeader(token))
      .send({
        fecha: new Date(),
        hora: '14:30',
        socioNombre: 'Valentina García',
        tipo: 'Evaluación Nutricional',
        notas: 'Plan de alimentación deportiva',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.consultasAcordadas.length).toBe(1);
    expect(res.body.data.consultasAcordadas[0].socioNombre).toBe('Valentina García');
    expect(res.body.data.consultasAcordadas[0].estado).toBe('Programada');
  });

  it('3. Permite actualizar el estado de una consulta (PUT /teachers/:id/consultas/:consultaId)', async () => {
    const { gym, token } = await createGymOwner({ gymName: 'Gym Profesores' });

    const teacher = await Teacher.create({
      gym: gym._id,
      nombre: 'Pablo',
      apellido: 'Ríos',
      consultasAcordadas: [
        {
          fecha: new Date(),
          hora: '10:00',
          socioNombre: 'Diego López',
          tipo: 'Control Físico',
          estado: 'Programada',
        },
      ],
    });

    const consultaId = teacher.consultasAcordadas[0]._id;

    const res = await request(app)
      .put(`/api/v1/gyms/${gym._id}/teachers/${teacher._id}/consultas/${consultaId}`)
      .set('Authorization', authHeader(token))
      .send({
        estado: 'Realizada',
        notas: 'Consulta completada satisfactoriamente',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const consultaActualizada = res.body.data.consultasAcordadas.find((c) => c._id.toString() === consultaId.toString());
    expect(consultaActualizada.estado).toBe('Realizada');
  });
});
