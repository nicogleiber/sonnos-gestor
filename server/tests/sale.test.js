'use strict';

const request = require('supertest');
const app = require('../src/app');
const Product = require('../src/models/product.model');
const Sale = require('../src/models/sale.model');
const CashRegister = require('../src/models/cashRegister.model');
const CashMovement = require('../src/models/cashMovement.model');
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

async function setupGym() {
  const { user, gym, token } = await createGymOwner({ gymName: 'Gimnasio Ventas Test' });
  return { owner: user, gym, token };
}

async function createProduct(gymId, overrides = {}) {
  return Product.create({
    gym: gymId,
    nombre: 'Proteina Test',
    costo: 10000,
    precioVenta: 15000,
    stock: 50,
    stockMinimo: 5,
    ...overrides,
  });
}

async function openCaja(gymId, token) {
  return request(app)
    .post(`/api/v1/gyms/${gymId}/cash-register/abrir`)
    .set('Authorization', authHeader(token))
    .send({ montoApertura: 5000 });
}

describe('Fase 5: Módulo Caja, Ventas & Pagos', () => {
  // ─────────────────────────────────────────────────────────────
  describe('CRUD Ventas — POST /sales', () => {
    it('1. Crea una venta, descuenta stock y registra CashMovement si hay caja abierta', async () => {
      const { gym, token } = await setupGym();
      const prod1 = await createProduct(gym._id, { nombre: 'Proteina Whey', precioVenta: 28000, stock: 20 });
      const prod2 = await createProduct(gym._id, { nombre: 'Creatina', precioVenta: 12000, stock: 10 });

      // Abrir caja
      await openCaja(gym._id, token);

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/sales`)
        .set('Authorization', authHeader(token))
        .send({
          items: [
            { productoId: prod1._id, cantidad: 2 },
            { productoId: prod2._id, cantidad: 1 },
          ],
          metodoPago: 'efectivo',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.sale.items).toHaveLength(2);
      // total = 28000*2 + 12000*1 = 68000
      expect(res.body.data.sale.total).toBe(68000);
      expect(res.body.data.sale.estado).toBe('completada');

      // Stock descontado
      const p1Actualizado = await Product.findById(prod1._id);
      const p2Actualizado = await Product.findById(prod2._id);
      expect(p1Actualizado.stock).toBe(18); // 20 - 2
      expect(p2Actualizado.stock).toBe(9);  // 10 - 1

      // CashMovement creado
      expect(res.body.data.cashMovement).not.toBeNull();
      expect(res.body.data.cashMovement.tipo).toBe('ingreso_venta');
      expect(res.body.data.cashMovement.monto).toBe(68000);
    });

    it('2. Crea una venta sin caja abierta — se registra sin CashMovement', async () => {
      const { gym, token } = await setupGym();
      const prod = await createProduct(gym._id);

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/sales`)
        .set('Authorization', authHeader(token))
        .send({
          items: [{ productoId: prod._id, cantidad: 1 }],
          metodoPago: 'transferencia_bancaria',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.sale.estado).toBe('completada');
      expect(res.body.data.cashMovement).toBeNull();
    });

    it('3. Aplica descuento porcentual correctamente', async () => {
      const { gym, token } = await setupGym();
      const prod = await createProduct(gym._id, { precioVenta: 10000, stock: 5 });

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/sales`)
        .set('Authorization', authHeader(token))
        .send({
          items: [{ productoId: prod._id, cantidad: 2 }],
          descuento: 10, // 10% de 20000 = 18000
        });

      expect(res.status).toBe(201);
      expect(res.body.data.sale.total).toBe(20000);
      expect(res.body.data.sale.descuento).toBe(10);
      expect(res.body.data.sale.totalConDescuento).toBe(18000);
    });

    it('4. Rechaza venta si stock insuficiente — rollback completo (400)', async () => {
      const { gym, token } = await setupGym();
      const prodA = await createProduct(gym._id, { nombre: 'Prod A', stock: 10 });
      const prodB = await createProduct(gym._id, { nombre: 'Prod B con poco stock', stock: 1 });

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/sales`)
        .set('Authorization', authHeader(token))
        .send({
          items: [
            { productoId: prodA._id, cantidad: 2 },
            { productoId: prodB._id, cantidad: 5 }, // 5 > 1 → debe fallar
          ],
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Stock insuficiente');

      // Verificar rollback: el stock de prodA no se modificó
      const prodACheck = await Product.findById(prodA._id);
      expect(prodACheck.stock).toBe(10);
    });

    it('5. Anula una venta y restaura el stock (POST /sales/:id/anular)', async () => {
      const { gym, token } = await setupGym();
      const prod = await createProduct(gym._id, { stock: 15 });

      const createRes = await request(app)
        .post(`/api/v1/gyms/${gym._id}/sales`)
        .set('Authorization', authHeader(token))
        .send({ items: [{ productoId: prod._id, cantidad: 3 }] });

      expect(createRes.status).toBe(201);
      const saleId = createRes.body.data.sale._id;

      // Verificar stock descontado
      let prodCheck = await Product.findById(prod._id);
      expect(prodCheck.stock).toBe(12); // 15 - 3

      const cancelRes = await request(app)
        .post(`/api/v1/gyms/${gym._id}/sales/${saleId}/anular`)
        .set('Authorization', authHeader(token));

      expect(cancelRes.status).toBe(200);
      expect(cancelRes.body.data.estado).toBe('anulada');

      // Stock restaurado
      prodCheck = await Product.findById(prod._id);
      expect(prodCheck.stock).toBe(15);
    });

    it('6. Lista ventas con filtros (GET /sales)', async () => {
      const { gym, token } = await setupGym();
      const prod = await createProduct(gym._id, { stock: 50 });

      // Crear 2 ventas
      await request(app)
        .post(`/api/v1/gyms/${gym._id}/sales`)
        .set('Authorization', authHeader(token))
        .send({ items: [{ productoId: prod._id, cantidad: 1 }] });

      await request(app)
        .post(`/api/v1/gyms/${gym._id}/sales`)
        .set('Authorization', authHeader(token))
        .send({ items: [{ productoId: prod._id, cantidad: 1 }] });

      const res = await request(app)
        .get(`/api/v1/gyms/${gym._id}/sales`)
        .set('Authorization', authHeader(token));

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
    });
  });

  // ─────────────────────────────────────────────────────────────
  describe('Caja Registradora — /cash-register', () => {
    it('7. Abre una caja correctamente (POST /cash-register/abrir)', async () => {
      const { gym, token } = await setupGym();

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/cash-register/abrir`)
        .set('Authorization', authHeader(token))
        .send({ montoApertura: 10000 });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.estado).toBe('abierta');
      expect(res.body.data.montoApertura).toBe(10000);
    });

    it('8. Impide abrir una segunda caja si ya hay una abierta (409 Conflict)', async () => {
      const { gym, token } = await setupGym();

      await openCaja(gym._id, token);

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/cash-register/abrir`)
        .set('Authorization', authHeader(token))
        .send({ montoApertura: 5000 });

      expect(res.status).toBe(409);
      expect(res.body.message).toContain('caja abierta');
    });

    it('9. Cierra la caja calculando totales automáticamente (POST /cash-register/:id/cerrar)', async () => {
      const { gym, token } = await setupGym();
      const prod = await createProduct(gym._id, { precioVenta: 20000, stock: 10 });

      const aperturaRes = await openCaja(gym._id, token);
      const cajaId = aperturaRes.body.data._id;

      // Hacer una venta para generar un movimiento en caja
      await request(app)
        .post(`/api/v1/gyms/${gym._id}/sales`)
        .set('Authorization', authHeader(token))
        .send({ items: [{ productoId: prod._id, cantidad: 1 }] });

      // Hacer un egreso manual
      await request(app)
        .post(`/api/v1/gyms/${gym._id}/cash-register/${cajaId}/movimientos`)
        .set('Authorization', authHeader(token))
        .send({ tipo: 'egreso_manual', monto: 2000, descripcion: 'Pago servicio' });

      const cierreRes = await request(app)
        .post(`/api/v1/gyms/${gym._id}/cash-register/${cajaId}/cerrar`)
        .set('Authorization', authHeader(token))
        .send({ montoCierre: 23000 });

      expect(cierreRes.status).toBe(200);
      expect(cierreRes.body.data.estado).toBe('cerrada');
      expect(cierreRes.body.data.totalVentas).toBe(20000);
      expect(cierreRes.body.data.totalEgresosManuales).toBe(2000);
      expect(cierreRes.body.data.montoCierre).toBe(23000);
    });

    it('10. Registra movimiento manual en caja y consulta historial', async () => {
      const { gym, token } = await setupGym();

      const aperturaRes = await openCaja(gym._id, token);
      const cajaId = aperturaRes.body.data._id;

      await request(app)
        .post(`/api/v1/gyms/${gym._id}/cash-register/${cajaId}/movimientos`)
        .set('Authorization', authHeader(token))
        .send({ tipo: 'ingreso_manual', monto: 3000, descripcion: 'Adelanto de socio' });

      const res = await request(app)
        .get(`/api/v1/gyms/${gym._id}/cash-register/${cajaId}/movimientos`)
        .set('Authorization', authHeader(token));

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].tipo).toBe('ingreso_manual');
      expect(res.body.data[0].monto).toBe(3000);
    });

    it('11. GET /cash-register/actual devuelve la caja abierta o null', async () => {
      const { gym, token } = await setupGym();

      // Sin caja abierta
      const res1 = await request(app)
        .get(`/api/v1/gyms/${gym._id}/cash-register/actual`)
        .set('Authorization', authHeader(token));
      expect(res1.status).toBe(200);
      expect(res1.body.data).toBeNull();

      // Con caja abierta
      await openCaja(gym._id, token);
      const res2 = await request(app)
        .get(`/api/v1/gyms/${gym._id}/cash-register/actual`)
        .set('Authorization', authHeader(token));
      expect(res2.status).toBe(200);
      expect(res2.body.data.estado).toBe('abierta');
    });
  });

  // ─────────────────────────────────────────────────────────────
  describe('Seguridad, Permisos y Multi-Tenancy', () => {
    it('12. Rol TEACHER no puede realizar ventas (falta REGISTER_SALES → 403)', async () => {
      const { gym } = await setupGym();
      const { user: teacherUser } = await createUserInGym({ gym: gym._id, role: ROLES.TEACHER });
      const teacherToken = signToken(teacherUser._id);

      const prod = await createProduct(gym._id);

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/sales`)
        .set('Authorization', authHeader(teacherToken))
        .send({ items: [{ productoId: prod._id, cantidad: 1 }] });

      expect(res.status).toBe(403);
    });

    it('13. Rol STAFF puede realizar ventas (tiene REGISTER_SALES)', async () => {
      const { gym } = await setupGym();
      const { user: staffUser } = await createUserInGym({ gym: gym._id, role: ROLES.STAFF });
      const staffToken = signToken(staffUser._id);

      const prod = await createProduct(gym._id);

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/sales`)
        .set('Authorization', authHeader(staffToken))
        .send({ items: [{ productoId: prod._id, cantidad: 1 }] });

      expect(res.status).toBe(201);
    });

    it('14. Usuario de Gym B no puede ver ventas de Gym A (404)', async () => {
      const gymA = await setupGym();
      const gymB = await setupGym();

      const prodA = await createProduct(gymA.gym._id);
      const createRes = await request(app)
        .post(`/api/v1/gyms/${gymA.gym._id}/sales`)
        .set('Authorization', authHeader(gymA.token))
        .send({ items: [{ productoId: prodA._id, cantidad: 1 }] });

      const saleId = createRes.body.data.sale._id;

      // Usuario de Gym B intenta ver la venta de Gym A
      const res = await request(app)
        .get(`/api/v1/gyms/${gymA.gym._id}/sales/${saleId}`)
        .set('Authorization', authHeader(gymB.token));

      expect(res.status).toBe(404);
    });
  });

  // ─────────────────────────────────────────────────────────────
  describe('Dashboard — GET /dashboard', () => {
    it('15. El dashboard devuelve métricas consolidadas del gimnasio', async () => {
      const { gym, token } = await setupGym();
      const prod = await createProduct(gym._id, { stock: 20, stockMinimo: 50 }); // bajo stock

      // Hacer una venta para tener datos
      await request(app)
        .post(`/api/v1/gyms/${gym._id}/sales`)
        .set('Authorization', authHeader(token))
        .send({ items: [{ productoId: prod._id, cantidad: 2 }] });

      const res = await request(app)
        .get(`/api/v1/gyms/${gym._id}/dashboard`)
        .set('Authorization', authHeader(token));

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('socios');
      expect(res.body.data).toHaveProperty('ventas');
      expect(res.body.data).toHaveProperty('caja');
      expect(res.body.data).toHaveProperty('inventario');
      expect(res.body.data).toHaveProperty('clases');

      // Verificar que las ventas del mes se registraron
      expect(res.body.data.ventas.cantidadMes).toBe(1);
      expect(res.body.data.ventas.totalMes).toBe(30000); // 15000 * 2

      // Producto bajo stock detectado
      expect(res.body.data.inventario.totalBajoStock).toBeGreaterThan(0);
    });
  });
});
