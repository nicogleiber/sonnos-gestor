'use strict';

const request = require('supertest');
const app = require('../src/app');
const Class = require('../src/models/class.model');
const Member = require('../src/models/member.model');
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

async function setupGymA() {
  const { user, gym, token } = await createGymOwner({ gymName: 'Gimnasio Alpha Clases' });
  return { owner: user, gym, token };
}

describe('Fase 3: Módulo Clases & Calendario (Classes & Schedule)', () => {
  describe('CRUD de Clases y Eventos (POST / GET / PUT / DELETE /classes)', () => {
    it('1. Permite crear una clase semanal recurrente correctamente', async () => {
      const { gym, token } = await setupGymA();

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/classes`)
        .set('Authorization', authHeader(token))
        .send({
          nombre: 'Spinning Intenso',
          salon: 'Sala de Spinning',
          profesor: 'Florencia Aguirre',
          dias: ['Lunes', 'Miércoles', 'Viernes'],
          horario: '07:00',
          duracion: 60,
          cupoMaximo: 20,
          tipoEvento: 'Semanal Recurrente',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.nombre).toBe('Spinning Intenso');
      expect(res.body.data.salon).toBe('Sala de Spinning');
      expect(res.body.data.cupoMaximo).toBe(20);
      expect(res.body.data.dias).toEqual(['Lunes', 'Miércoles', 'Viernes']);
    });

    it('2. Permite crear un evento único con fecha específica', async () => {
      const { gym, token } = await setupGymA();

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/classes`)
        .set('Authorization', authHeader(token))
        .send({
          nombre: 'Masterclass de Levantamiento Olímpico',
          salon: 'Salón Principal',
          profesor: 'Carlos Vega',
          horario: '10:00',
          duracion: 90,
          cupoMaximo: 15,
          tipoEvento: 'Evento Único',
          fechaEspecifica: '2026-09-15',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.tipoEvento).toBe('Evento Único');
      expect(res.body.data.duracion).toBe(90);
    });

    it('3. Rechaza creación si faltan campos requeridos (nombre, salón, horario)', async () => {
      const { gym, token } = await setupGymA();

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/classes`)
        .set('Authorization', authHeader(token))
        .send({
          profesor: 'Sin Nombre',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('4. Lista clases con filtros por salón, día y búsqueda de texto', async () => {
      const { gym, token } = await setupGymA();

      await Class.create([
        { gym: gym._id, nombre: 'Yoga Matutino', salon: 'Sala de Yoga', dias: ['Lunes', 'Jueves'], horario: '09:00', cupoMaximo: 15 },
        { gym: gym._id, nombre: 'Pilates Avanzado', salon: 'Sala de Yoga', dias: ['Miércoles', 'Sábado'], horario: '10:00', cupoMaximo: 15 },
        { gym: gym._id, nombre: 'Cross Training', salon: 'Zona Funcional', dias: ['Martes', 'Jueves'], horario: '19:00', cupoMaximo: 20 },
      ]);

      const resSalon = await request(app)
        .get(`/api/v1/gyms/${gym._id}/classes?salon=Sala de Yoga`)
        .set('Authorization', authHeader(token));

      expect(resSalon.status).toBe(200);
      expect(resSalon.body.data.length).toBe(2);

      const resDia = await request(app)
        .get(`/api/v1/gyms/${gym._id}/classes?dia=Lunes`)
        .set('Authorization', authHeader(token));

      expect(resDia.status).toBe(200);
      expect(resDia.body.data.length).toBe(1);
      expect(resDia.body.data[0].nombre).toBe('Yoga Matutino');
    });

    it('5. Actualiza datos de una clase existente (PUT /classes/:id)', async () => {
      const { gym, token } = await setupGymA();

      const clase = await Class.create({
        gym: gym._id,
        nombre: 'Zumba',
        salon: 'Sala Multiusos',
        horario: '18:00',
        cupoMaximo: 20,
      });

      const res = await request(app)
        .put(`/api/v1/gyms/${gym._id}/classes/${clase._id}`)
        .set('Authorization', authHeader(token))
        .send({
          cupoMaximo: 30,
          horario: '18:30',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.cupoMaximo).toBe(30);
      expect(res.body.data.horario).toBe('18:30');
    });

    it('6. Desactiva una clase (baja lógica DELETE /classes/:id)', async () => {
      const { gym, token } = await setupGymA();

      const clase = await Class.create({
        gym: gym._id,
        nombre: 'Clase a borrar',
        salon: 'Salón',
        horario: '12:00',
      });

      const res = await request(app)
        .delete(`/api/v1/gyms/${gym._id}/classes/${clase._id}`)
        .set('Authorization', authHeader(token));

      expect(res.status).toBe(200);
      expect(res.body.data.activo).toBe(false);
    });
  });

  describe('Control Estricto de Cupos e Inscripciones (/inscribir & /desinscribir)', () => {
    it('7. Inscribe a un socio en una clase correctamente', async () => {
      const { gym, token } = await setupGymA();

      const clase = await Class.create({
        gym: gym._id,
        nombre: 'Funcional Express',
        salon: 'Zona Funcional',
        horario: '08:00',
        cupoMaximo: 10,
      });

      const socio = await Member.create({
        gym: gym._id,
        nombre: 'Agustín',
        apellido: 'Navarro',
      });

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/classes/${clase._id}/inscribir`)
        .set('Authorization', authHeader(token))
        .send({ socioId: socio._id });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.inscritos.length).toBe(1);
      expect(res.body.data.inscritos[0].nombre).toBe('Agustín Navarro');
    });

    it('8. Impide inscripción duplicada del mismo socio en la misma clase (409 Conflict)', async () => {
      const { gym, token } = await setupGymA();

      const clase = await Class.create({
        gym: gym._id,
        nombre: 'Funcional Express',
        salon: 'Zona Funcional',
        horario: '08:00',
        cupoMaximo: 10,
      });

      const socio = await Member.create({
        gym: gym._id,
        nombre: 'Luciana',
        apellido: 'Martínez',
      });

      await request(app)
        .post(`/api/v1/gyms/${gym._id}/classes/${clase._id}/inscribir`)
        .set('Authorization', authHeader(token))
        .send({ socioId: socio._id });

      const resDuplicado = await request(app)
        .post(`/api/v1/gyms/${gym._id}/classes/${clase._id}/inscribir`)
        .set('Authorization', authHeader(token))
        .send({ socioId: socio._id });

      expect(resDuplicado.status).toBe(409);
      expect(resDuplicado.body.message).toContain('ya se encuentra inscrito');
    });

    it('9. Bloquea inscripción cuando el cupo máximo está agotado (400 Bad Request)', async () => {
      const { gym, token } = await setupGymA();

      // Clase con cupo máximo de 2
      const clase = await Class.create({
        gym: gym._id,
        nombre: 'Yoga Exclusivo',
        salon: 'Sala de Yoga',
        horario: '11:00',
        cupoMaximo: 2,
      });

      const s1 = await Member.create({ gym: gym._id, nombre: 'S1', apellido: 'Uno' });
      const s2 = await Member.create({ gym: gym._id, nombre: 'S2', apellido: 'Dos' });
      const s3 = await Member.create({ gym: gym._id, nombre: 'S3', apellido: 'Tres' });

      // Inscribir a los 2 primeros
      await request(app)
        .post(`/api/v1/gyms/${gym._id}/classes/${clase._id}/inscribir`)
        .set('Authorization', authHeader(token))
        .send({ socioId: s1._id });

      await request(app)
        .post(`/api/v1/gyms/${gym._id}/classes/${clase._id}/inscribir`)
        .set('Authorization', authHeader(token))
        .send({ socioId: s2._id });

      // El 3er socio intenta inscribirse
      const resAgotado = await request(app)
        .post(`/api/v1/gyms/${gym._id}/classes/${clase._id}/inscribir`)
        .set('Authorization', authHeader(token))
        .send({ socioId: s3._id });

      expect(resAgotado.status).toBe(400);
      expect(resAgotado.body.message).toContain('Cupo agotado');
    });

    it('10. Permite desinscribir a un socio de una clase (POST /classes/:id/desinscribir)', async () => {
      const { gym, token } = await setupGymA();

      const socio = await Member.create({
        gym: gym._id,
        nombre: 'Martina',
        apellido: 'Díaz',
      });

      const clase = await Class.create({
        gym: gym._id,
        nombre: 'Spinning',
        salon: 'Sala Spinning',
        horario: '20:00',
        cupoMaximo: 10,
        inscritos: [
          {
            socio: socio._id,
            nombre: 'Martina Díaz',
          },
        ],
      });

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/classes/${clase._id}/desinscribir`)
        .set('Authorization', authHeader(token))
        .send({ socioId: socio._id });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.inscritos.length).toBe(0);
    });
  });

  describe('Seguridad, Permisos de Roles y Multi-Tenancy', () => {
    it('11. Rol MANAGER puede crear clases (tiene MANAGE_CLASSES)', async () => {
      const { gym } = await setupGymA();
      const { user: managerUser } = await createUserInGym({
        gym: gym._id,
        role: ROLES.MANAGER,
      });
      const managerToken = signToken(managerUser._id);

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/classes`)
        .set('Authorization', authHeader(managerToken))
        .send({
          nombre: 'Clase Creada Por Manager',
          salon: 'Salón Principal',
          horario: '15:00',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('12. Rol STAFF no puede crear clases (falta MANAGE_CLASSES -> 403 Forbidden)', async () => {
      const { gym } = await setupGymA();
      const { user: staffUser } = await createUserInGym({
        gym: gym._id,
        role: ROLES.STAFF,
      });
      const staffToken = signToken(staffUser._id);

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/classes`)
        .set('Authorization', authHeader(staffToken))
        .send({
          nombre: 'Clase Prohibida',
          salon: 'Salón Principal',
          horario: '15:00',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('13. Usuario de Gym B no puede ver ni modificar clases de Gym A (404 Not Found)', async () => {
      const gymA = await setupGymA();
      const gymB = await setupGymA();

      const claseA = await Class.create({
        gym: gymA.gym._id,
        nombre: 'Clase Privada Gym A',
        salon: 'Salón A',
        horario: '10:00',
      });

      const resGet = await request(app)
        .get(`/api/v1/gyms/${gymA.gym._id}/classes/${claseA._id}`)
        .set('Authorization', authHeader(gymB.token));

      expect(resGet.status).toBe(404);

      const resPut = await request(app)
        .put(`/api/v1/gyms/${gymA.gym._id}/classes/${claseA._id}`)
        .set('Authorization', authHeader(gymB.token))
        .send({ nombre: 'Hack' });

      expect(resPut.status).toBe(404);
    });
  });
});
