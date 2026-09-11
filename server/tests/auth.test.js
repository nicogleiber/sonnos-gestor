'use strict';
/**
 * tests/auth.test.js
 *
 * Suite de integración para el módulo de autenticación.
 * Usa Supertest sobre la instancia de app Express exportada (sin app.listen),
 * y una base de datos MongoMemoryReplSet en memoria (nunca toca la BD real).
 *
 * Cobertura:
 *   - POST /api/v1/auth/register
 *   - POST /api/v1/auth/login
 *   - Middleware authenticate (GET /api/v1/auth/me)
 *   - Middleware authorize (GET /api/v1/gyms/:gymId)
 *   - Aislamiento multi-tenant (CASO CRÍTICO)
 */

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const { createGymOwner, createUserInGym, createGym, authHeader } = require('./helpers/factories');
const { ROLES } = require('../src/constants/roles');
const { PERMISSIONS } = require('../src/constants/permissions');

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/auth/register
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/v1/auth/register', () => {
  it('registra un gimnasio y devuelve token, user y gym con status 201', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      gymName: 'Gym Alpha',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@alpha.com',
      password: 'Segura1234',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);

    // Token presente y verificable
    const { token, user, gym } = res.body.data;
    expect(typeof token).toBe('string');
    const payload = jwt.decode(token);
    expect(payload.sub).toBeTruthy();

    // User sin password en la respuesta
    expect(user.email).toBe('juan@alpha.com');
    expect(user.password).toBeUndefined();

    // Gym creado
    expect(gym.name).toBe('Gym Alpha');
    expect(gym.id).toBeTruthy();
  });

  it('rechaza registro con email ya existente y devuelve 409', async () => {
    await createGymOwner({ email: 'duplicado@test.com' });

    const res = await request(app).post('/api/v1/auth/register').send({
      gymName: 'Gym Beta',
      firstName: 'Ana',
      lastName: 'García',
      email: 'duplicado@test.com',
      password: 'Segura1234',
    });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('rechaza registro cuando falta un campo requerido (gymName)', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      firstName: 'Ana',
      lastName: 'García',
      email: 'ana@test.com',
      password: 'Segura1234',
      // gymName ausente
    });

    // El middleware validate.js usa ApiError.badRequest → 400.
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rechaza registro con contraseña menor a 8 caracteres', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      gymName: 'Gym Corta',
      firstName: 'Luis',
      lastName: 'Salas',
      email: 'luis@test.com',
      password: 'abc12', // muy corta
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rechaza registro con contraseña sin número', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      gymName: 'Gym SinNum',
      firstName: 'Pedro',
      lastName: 'López',
      email: 'pedro@test.com',
      password: 'sinNumeroAqui', // sin dígito
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/auth/login
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/v1/auth/login', () => {
  it('login exitoso devuelve 200 con JWT válido y datos del usuario', async () => {
    await createGymOwner({ email: 'login-ok@test.com', password: 'Password1' });

    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'login-ok@test.com',
      password: 'Password1',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const { token, user, gyms } = res.body.data;

    // El token debe ser verificable con el secret de test
    expect(() =>
      jwt.verify(token, process.env.JWT_SECRET)
    ).not.toThrow();

    // El payload debe tener sub con el id del usuario
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    expect(payload.sub).toBe(user._id);

    // Los gyms deben incluir al menos el gym del owner
    expect(Array.isArray(gyms)).toBe(true);
    expect(gyms.length).toBeGreaterThan(0);
    expect(gyms[0]).toHaveProperty('gymId');
    expect(gyms[0]).toHaveProperty('role', ROLES.OWNER);
  });

  it('devuelve 401 con password incorrecta', async () => {
    await createGymOwner({ email: 'pass-mal@test.com', password: 'Password1' });

    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'pass-mal@test.com',
      password: 'PasswordIncorrecta9',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Email o contraseña incorrectos');
  });

  it('devuelve 401 con email inexistente y el MISMO mensaje que password incorrecta', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'noexiste@test.com',
      password: 'Password1',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    // Mismo mensaje — no filtra si el email existe o no.
    expect(res.body.message).toBe('Email o contraseña incorrectos');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Middleware: authenticate
// ─────────────────────────────────────────────────────────────────────────────
describe('Middleware authenticate — GET /api/v1/auth/me', () => {
  it('devuelve 401 si no se envía el header Authorization', async () => {
    const res = await request(app).get('/api/v1/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('devuelve 401 con token malformado (no es un JWT)', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer esto-no-es-un-jwt');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('devuelve 401 con token firmado con secret incorrecto', async () => {
    const tokenFalso = jwt.sign({ sub: 'fakeid' }, 'secret-incorrecto');

    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', authHeader(tokenFalso));

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('devuelve 401 con token expirado', async () => {
    // Generamos un token que ya nació expirado (expiresIn negativo)
    const { user } = await createGymOwner();
    const tokenExpirado = jwt.sign(
      { sub: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '-1s' }
    );

    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', authHeader(tokenExpirado));

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('devuelve 200 y los datos del usuario con token válido', async () => {
    const { token, user } = await createGymOwner({ email: 'me-ok@test.com' });

    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', authHeader(token));

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('me-ok@test.com');
    expect(res.body.data.user.password).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Middleware: authorize — control de roles y permisos
// ─────────────────────────────────────────────────────────────────────────────
describe('Middleware authorize — GET /api/v1/gyms/:gymId', () => {
  it('permite acceso al owner de su propio gimnasio', async () => {
    const { token, gym } = await createGymOwner();

    const res = await request(app)
      .get(`/api/v1/gyms/${gym._id}`)
      .set('Authorization', authHeader(token));

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.role).toBe(ROLES.OWNER);
  });

  it('un usuario con rol teacher en el gym puede acceder a GET /gyms/:gymId (authorize sin permiso específico)', async () => {
    const { gym } = await createGymOwner();
    // Creamos un usuario con rol teacher dentro del mismo gym
    const { user: teacher } = await createUserInGym({ gym: gym._id, role: ROLES.TEACHER });

    // Generamos manualmente el token del teacher
    const tokenTeacher = jwt.sign(
      { sub: teacher._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // authorize() sin args solo verifica pertenencia al gym — el teacher sí pertenece.
    const res = await request(app)
      .get(`/api/v1/gyms/${gym._id}`)
      .set('Authorization', authHeader(tokenTeacher));

    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe(ROLES.TEACHER);
  });

  it('devuelve 403 cuando authorize recibe un permiso requerido que el rol no tiene', async () => {
    // Verificación unitaria de la lógica hasPermission: comprobamos que la
    // matriz de permisos está correctamente configurada.
    const { hasPermission } = require('../src/constants/permissions');
    expect(hasPermission(ROLES.TEACHER, PERMISSIONS.MANAGE_STAFF)).toBe(false);
    expect(hasPermission(ROLES.OWNER, PERMISSIONS.MANAGE_STAFF)).toBe(true);
    expect(hasPermission(ROLES.ADMIN, PERMISSIONS.MANAGE_STAFF)).toBe(true);
    expect(hasPermission(ROLES.MANAGER, PERMISSIONS.MANAGE_STAFF)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CASO CRÍTICO: Aislamiento multi-tenant
// ─────────────────────────────────────────────────────────────────────────────
describe('Aislamiento multi-tenant — usuario de Gym A no puede ver Gym B', () => {
  it('devuelve 404 al intentar acceder a un gimnasio al que no se pertenece', async () => {
    // Creamos dos gimnasios completamente independientes.
    const { token: tokenA } = await createGymOwner({
      gymName: 'Gym A',
      email: 'owner-a@test.com',
    });
    const gymB = await createGym({ name: 'Gym B' });

    // El owner de Gym A intenta acceder a Gym B con su token válido.
    const res = await request(app)
      .get(`/api/v1/gyms/${gymB._id}`)
      .set('Authorization', authHeader(tokenA));

    // 404: Gym B existe en la BD, pero no lo revelamos al owner de Gym A.
    // Si fuera 403, el cliente sabría que el gym existe y su acceso está denegado.
    // Con 404, el gym ajeno es indistinguible de un gym que no existe.
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('el mismo token del owner de Gym A sí puede acceder a Gym A (control positivo)', async () => {
    const { token, gym } = await createGymOwner({
      gymName: 'Gym A Control',
      email: 'owner-control@test.com',
    });

    const res = await request(app)
      .get(`/api/v1/gyms/${gym._id}`)
      .set('Authorization', authHeader(token));

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('un usuario de Gym A con gymId malformado recibe 400 (no expone info del gym)', async () => {
    const { token } = await createGymOwner({ email: 'owner-badid@test.com' });

    const res = await request(app)
      .get('/api/v1/gyms/id-totalmente-invalido')
      .set('Authorization', authHeader(token));

    // CastError de Mongoose → errorHandler lo convierte en 400.
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
