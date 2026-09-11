'use strict';

const request = require('supertest');
const app = require('../src/app');
const Member = require('../src/models/member.model');
const MembershipPlan = require('../src/models/membershipPlan.model');
const { ROLES } = require('../src/constants/roles');
const {
  createGymOwner,
  createUserInGym,
  createGym,
  authHeader,
} = require('./helpers/factories');
const jwt = require('jsonwebtoken');
const env = require('../src/config/env');

function signToken(userId) {
  return jwt.sign({ sub: userId.toString() }, env.jwt.secret, { expiresIn: '1h' });
}

async function setupGymA() {
  const ownerA = await createGymOwner({ gymName: 'Gimnasio Alpha' });
  const planA = await MembershipPlan.create({
    gym: ownerA.gym._id,
    nombre: 'Plan Pase Libre',
    tipo: 'Plan Musculación',
    duracionMeses: 1,
    precio: 20000,
  });
  return { owner: ownerA.user, gym: ownerA.gym, token: ownerA.token, plan: planA };
}

describe('Fase 2: Módulo Socios y Membresías (Members & Subscriptions)', () => {
  describe('CRUD de Socios (POST / GET / PUT / DELETE /members)', () => {
    it('1. Permite crear un socio nuevo correctamente con campos completos', async () => {
      const { gym, token } = await setupGymA();

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/members`)
        .set('Authorization', authHeader(token))
        .send({
          nombre: 'Valentina',
          apellido: 'García',
          dni: '40123456',
          email: 'valen@test.com',
          telefono: '011-4532-8901',
          codigoFichaje: 'SOC-001',
          observaciones: 'Apto médico entregado',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.nombre).toBe('Valentina');
      expect(res.body.data.apellido).toBe('García');
      expect(res.body.data.dni).toBe('40123456');
      expect(res.body.data.estado).toBe('Al Día');
      expect(res.body.data.gym.toString()).toBe(gym._id.toString());
    });

    it('2. Rechaza creación si faltan campos obligatorios (nombre/apellido)', async () => {
      const { gym, token } = await setupGymA();

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/members`)
        .set('Authorization', authHeader(token))
        .send({
          dni: '40123456',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('3. Impide DNI duplicado dentro del mismo gimnasio (409 Conflict)', async () => {
      const { gym, token } = await setupGymA();

      await request(app)
        .post(`/api/v1/gyms/${gym._id}/members`)
        .set('Authorization', authHeader(token))
        .send({
          nombre: 'Socio',
          apellido: 'Uno',
          dni: '30111222',
        });

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/members`)
        .set('Authorization', authHeader(token))
        .send({
          nombre: 'Socio',
          apellido: 'Dos',
          dni: '30111222',
        });

      expect(res.status).toBe(409);
      expect(res.body.message).toContain('DNI');
    });

    it('4. Permite el mismo DNI en dos gimnasios distintos (Aislamiento Multi-Tenant)', async () => {
      const gymA = await setupGymA();
      const gymB = await setupGymA();

      const resA = await request(app)
        .post(`/api/v1/gyms/${gymA.gym._id}/members`)
        .set('Authorization', authHeader(gymA.token))
        .send({
          nombre: 'Socio',
          apellido: 'Alpha',
          dni: '99887766',
        });
      expect(resA.status).toBe(201);

      const resB = await request(app)
        .post(`/api/v1/gyms/${gymB.gym._id}/members`)
        .set('Authorization', authHeader(gymB.token))
        .send({
          nombre: 'Socio',
          apellido: 'Beta',
          dni: '99887766',
        });
      expect(resB.status).toBe(201);
    });

    it('5. Actualiza datos de un socio existente (PUT /members/:id)', async () => {
      const { gym, token } = await setupGymA();

      const socio = await Member.create({
        gym: gym._id,
        nombre: 'Carlos',
        apellido: 'Pérez',
        telefono: '1111',
      });

      const res = await request(app)
        .put(`/api/v1/gyms/${gym._id}/members/${socio._id}`)
        .set('Authorization', authHeader(token))
        .send({
          telefono: '2222-3333',
          observaciones: 'Modificado por recepción',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.telefono).toBe('2222-3333');
      expect(res.body.data.observaciones).toBe('Modificado por recepción');
    });

    it('6. Desactiva un socio (baja lógica DELETE /members/:id)', async () => {
      const { gym, token } = await setupGymA();

      const socio = await Member.create({
        gym: gym._id,
        nombre: 'Baja',
        apellido: 'Test',
      });

      const res = await request(app)
        .delete(`/api/v1/gyms/${gym._id}/members/${socio._id}`)
        .set('Authorization', authHeader(token));

      expect(res.status).toBe(200);
      expect(res.body.data.activo).toBe(false);
      expect(res.body.data.estado).toBe('Inactivo');
    });
  });

  describe('Cálculo Dinámico de Estados y Filtros', () => {
    it('7. Calcula correctamente estados: Al Día, En Fecha de Cobro y Vencido', async () => {
      const { gym, token } = await setupGymA();
      const hoy = new Date();

      // Socio 1: Vence en 20 días -> 'Al Día'
      const vtoAlDia = new Date(hoy);
      vtoAlDia.setDate(vtoAlDia.getDate() + 20);

      // Socio 2: Vence en 3 días -> 'En Fecha de Cobro'
      const vtoCobro = new Date(hoy);
      vtoCobro.setDate(vtoCobro.getDate() + 3);

      // Socio 3: Venció hace 5 días -> 'Vencido'
      const vtoVencido = new Date(hoy);
      vtoVencido.setDate(vtoVencido.getDate() - 5);

      await Member.create([
        { gym: gym._id, nombre: 'S1', apellido: 'AlDia', fechaVencimiento: vtoAlDia },
        { gym: gym._id, nombre: 'S2', apellido: 'Cobro', fechaVencimiento: vtoCobro },
        { gym: gym._id, nombre: 'S3', apellido: 'Vencido', fechaVencimiento: vtoVencido },
      ]);

      const res = await request(app)
        .get(`/api/v1/gyms/${gym._id}/members`)
        .set('Authorization', authHeader(token));

      expect(res.status).toBe(200);
      const socios = res.body.data;
      const s1 = socios.find((s) => s.nombre === 'S1');
      const s2 = socios.find((s) => s.nombre === 'S2');
      const s3 = socios.find((s) => s.nombre === 'S3');

      expect(s1.estado).toBe('Al Día');
      expect(s2.estado).toBe('En Fecha de Cobro');
      expect(s3.estado).toBe('Vencido');
    });

    it('8. Filtra socios por texto de búsqueda (q) y por estado', async () => {
      const { gym, token } = await setupGymA();

      await Member.create([
        { gym: gym._id, nombre: 'Marcos', apellido: 'Rojas', dni: '111111' },
        { gym: gym._id, nombre: 'Martín', apellido: 'Gómez', dni: '222222' },
        { gym: gym._id, nombre: 'Lucía', apellido: 'Fernández', dni: '333333' },
      ]);

      const resQ = await request(app)
        .get(`/api/v1/gyms/${gym._id}/members?q=Mar`)
        .set('Authorization', authHeader(token));

      expect(resQ.status).toBe(200);
      expect(resQ.body.data.length).toBe(2); // Marcos y Martín
    });
  });

  describe('Fichaje y Control de Acceso (POST /members/checkin)', () => {
    it('9. Permite el fichaje de un socio al día y registra el acceso en historial', async () => {
      const { gym, token } = await setupGymA();
      const vto = new Date();
      vto.setDate(vto.getDate() + 15);

      const socio = await Member.create({
        gym: gym._id,
        nombre: 'Mateo',
        apellido: 'Rossi',
        dni: '45000111',
        codigoFichaje: 'NFC-1234',
        fechaVencimiento: vto,
      });

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/members/checkin`)
        .set('Authorization', authHeader(token))
        .send({ codigo: 'NFC-1234' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.encontrado).toBe(true);
      expect(res.body.accesoPermitido).toBe(true);
      expect(res.body.data.ultimoAcceso).toBeDefined();
      expect(res.body.data.historialAcceso.length).toBe(1);
    });

    it('10. Detecta socio vencido en el fichaje y deniega acceso visual (accesoPermitido: false)', async () => {
      const { gym, token } = await setupGymA();
      const vto = new Date();
      vto.setDate(vto.getDate() - 10);

      await Member.create({
        gym: gym._id,
        nombre: 'Lucas',
        apellido: 'Vencido',
        dni: '38111222',
        fechaVencimiento: vto,
      });

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/members/checkin`)
        .set('Authorization', authHeader(token))
        .send({ codigo: '38111222' });

      expect(res.status).toBe(200);
      expect(res.body.encontrado).toBe(true);
      expect(res.body.accesoPermitido).toBe(false);
      expect(res.body.data.estado).toBe('Vencido');
    });

    it('11. Retorna 404 si el código de fichaje no existe', async () => {
      const { gym, token } = await setupGymA();

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/members/checkin`)
        .set('Authorization', authHeader(token))
        .send({ codigo: 'CODIGO_INEXISTENTE' });

      expect(res.status).toBe(404);
      expect(res.body.encontrado).toBe(false);
    });
  });

  describe('Gestión y Asignación de Membresías (POST /memberships & /renew)', () => {
    it('12. Asigna una membresía a un socio y actualiza su fecha de vencimiento y plan', async () => {
      const { gym, token, plan } = await setupGymA();

      const socio = await Member.create({
        gym: gym._id,
        nombre: 'Sofía',
        apellido: 'López',
      });

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/memberships`)
        .set('Authorization', authHeader(token))
        .send({
          socioId: socio._id,
          planId: plan._id,
          metodoPago: 'transferencia_bancaria',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.membership).toBeDefined();
      expect(res.body.data.membership.estado).toBe('activa');
      expect(res.body.data.member.plan.toString()).toBe(plan._id.toString());
      expect(res.body.data.member.fechaVencimiento).toBeDefined();
      expect(res.body.data.member.estado).toBe('Al Día');
    });

    it('13. Renueva la membresía extendiendo la fecha a partir del vencimiento previo', async () => {
      const { gym, token, plan } = await setupGymA();
      const hoy = new Date();
      const vtoActual = new Date(hoy);
      vtoActual.setDate(vtoActual.getDate() + 10);

      const socio = await Member.create({
        gym: gym._id,
        nombre: 'Camila',
        apellido: 'Duarte',
        plan: plan._id,
        fechaVencimiento: vtoActual,
      });

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/memberships/renew`)
        .set('Authorization', authHeader(token))
        .send({
          socioId: socio._id,
          metodoPago: 'efectivo',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const nuevaFechaFin = new Date(res.body.data.member.fechaVencimiento);
      // La nueva fecha debe ser aproximadamente 1 mes posterior a vtoActual
      const esperado = new Date(vtoActual);
      esperado.setMonth(esperado.getMonth() + 1);

      expect(nuevaFechaFin.getMonth()).toBe(esperado.getMonth());
    });
  });

  describe('Generador de Mensajes y Plantillas de WhatsApp', () => {
    it('14. Genera mensajes y links de WhatsApp personalizados para socios', async () => {
      const { gym, token } = await setupGymA();
      const vto = new Date();
      vto.setDate(vto.getDate() - 3);

      const socio = await Member.create({
        gym: gym._id,
        nombre: 'Gonzalo',
        apellido: 'Paz',
        telefono: '5491155554444',
        tipoSuscripcion: 'Plan Musculación',
        fechaVencimiento: vto,
      });

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/members/whatsapp-template`)
        .set('Authorization', authHeader(token))
        .send({ socioIds: [socio._id] });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      const plantilla = res.body.data[0];
      expect(plantilla.mensaje).toContain('Gonzalo');
      expect(plantilla.waLink).toContain('https://wa.me/5491155554444');
    });
  });

  describe('Seguridad, Permisos de Roles y Multi-Tenancy', () => {
    it('15. Usuario de Gym B recibe 404 al intentar ver o modificar socios de Gym A', async () => {
      const gymA = await setupGymA();
      const gymB = await setupGymA();

      const socioA = await Member.create({
        gym: gymA.gym._id,
        nombre: 'Privado',
        apellido: 'GymA',
      });

      const resGet = await request(app)
        .get(`/api/v1/gyms/${gymA.gym._id}/members/${socioA._id}`)
        .set('Authorization', authHeader(gymB.token));

      expect(resGet.status).toBe(404);

      const resPut = await request(app)
        .put(`/api/v1/gyms/${gymA.gym._id}/members/${socioA._id}`)
        .set('Authorization', authHeader(gymB.token))
        .send({ nombre: 'Hack' });

      expect(resPut.status).toBe(404);
    });

    it('16. Rol STAFF puede crear socios (tiene MANAGE_MEMBERS)', async () => {
      const { gym } = await setupGymA();
      const { user: staffUser } = await createUserInGym({
        gym: gym._id,
        role: ROLES.STAFF,
      });
      const staffToken = signToken(staffUser._id);

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/members`)
        .set('Authorization', authHeader(staffToken))
        .send({
          nombre: 'CreadoPor',
          apellido: 'Staff',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('17. Rol TEACHER no puede crear socios (falta MANAGE_MEMBERS -> 403)', async () => {
      const { gym } = await setupGymA();
      const { user: teacherUser } = await createUserInGym({
        gym: gym._id,
        role: ROLES.TEACHER,
      });
      const teacherToken = signToken(teacherUser._id);

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/members`)
        .set('Authorization', authHeader(teacherToken))
        .send({
          nombre: 'Rechazado',
          apellido: 'Teacher',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });
});
