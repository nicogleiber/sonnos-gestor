'use strict';

const request = require('supertest');
const app = require('../src/app');
const Product = require('../src/models/product.model');
const InventoryMovement = require('../src/models/inventoryMovement.model');
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
  const { user, gym, token } = await createGymOwner({ gymName: 'Gimnasio Alpha Productos' });
  return { owner: user, gym, token };
}

describe('Fase 4: Módulo Productos e Inventario (Products & Stock)', () => {
  describe('CRUD de Productos (POST / GET / PUT / DELETE /products)', () => {
    it('1. Permite crear un producto y calcula automáticamente el precio de venta según el margen', async () => {
      const { gym, token } = await setupGymA();

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/products`)
        .set('Authorization', authHeader(token))
        .send({
          codigo: 'PROT-001',
          nombre: 'Proteína Whey 1kg',
          categoria: 'Suplementos',
          costo: 20000,
          margen: 40,
          stock: 10,
          stockMinimo: 3,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.nombre).toBe('Proteína Whey 1kg');
      expect(res.body.data.codigo).toBe('PROT-001');
      // 20000 * 1.4 = 28000
      expect(res.body.data.precioVenta).toBe(28000);
      expect(res.body.data.stock).toBe(10);

      // Debe haberse registrado el movimiento de inventario inicial
      const movimientos = await InventoryMovement.find({ producto: res.body.data.id || res.body.data._id });
      expect(movimientos.length).toBe(1);
      expect(movimientos[0].tipo).toBe('ingreso');
      expect(movimientos[0].stockNuevo).toBe(10);
    });

    it('2. Calcula precio sugerido con el endpoint POST /products/calcular-precio', async () => {
      const { gym, token } = await setupGymA();

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/products/calcular-precio`)
        .set('Authorization', authHeader(token))
        .send({
          costo: 15000,
          margen: 50,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      // 15000 * 1.5 = 22500
      expect(res.body.data.precioVenta).toBe(22500);
    });

    it('3. Impide código de producto duplicado en el mismo gimnasio (409 Conflict)', async () => {
      const { gym, token } = await setupGymA();

      await Product.create({
        gym: gym._id,
        codigo: 'BEB-001',
        nombre: 'Bebida Isotónica 500ml',
        costo: 1000,
        precioVenta: 1800,
      });

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/products`)
        .set('Authorization', authHeader(token))
        .send({
          codigo: 'BEB-001',
          nombre: 'Bebida Otra Marca',
          costo: 1200,
        });

      expect(res.status).toBe(409);
      expect(res.body.message).toContain('código');
    });

    it('4. Lista productos con filtros por categoría, búsqueda y alerta de bajo stock', async () => {
      const { gym, token } = await setupGymA();

      await Product.create([
        { gym: gym._id, nombre: 'Creatina 300g', categoria: 'Suplementos', costo: 15000, precioVenta: 22000, stock: 2, stockMinimo: 5 }, // bajo stock
        { gym: gym._id, nombre: 'Remera Deportiva', categoria: 'Indumentaria', costo: 8000, precioVenta: 14000, stock: 15, stockMinimo: 3 },
        { gym: gym._id, nombre: 'Barra de Proteína', categoria: 'Suplementos', costo: 1500, precioVenta: 2500, stock: 30, stockMinimo: 10 },
      ]);

      const resCat = await request(app)
        .get(`/api/v1/gyms/${gym._id}/products?categoria=Suplementos`)
        .set('Authorization', authHeader(token));

      expect(resCat.status).toBe(200);
      expect(resCat.body.data.length).toBe(2);

      const resBajoStock = await request(app)
        .get(`/api/v1/gyms/${gym._id}/products?bajoStock=true`)
        .set('Authorization', authHeader(token));

      expect(resBajoStock.status).toBe(200);
      expect(resBajoStock.body.data.length).toBe(1);
      expect(resBajoStock.body.data[0].nombre).toBe('Creatina 300g');
    });

    it('5. Actualiza datos de un producto (PUT /products/:id)', async () => {
      const { gym, token } = await setupGymA();

      const prod = await Product.create({
        gym: gym._id,
        nombre: 'Toalla Gym',
        costo: 3000,
        margen: 30,
        precioVenta: 3900,
      });

      const res = await request(app)
        .put(`/api/v1/gyms/${gym._id}/products/${prod._id}`)
        .set('Authorization', authHeader(token))
        .send({
          margen: 50, // Debe recalcular precioVenta a 3000 * 1.5 = 4500
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.precioVenta).toBe(4500);
    });

    it('6. Desactiva un producto (baja lógica DELETE /products/:id)', async () => {
      const { gym, token } = await setupGymA();

      const prod = await Product.create({
        gym: gym._id,
        nombre: 'Producto Inactivo Test',
        costo: 1000,
        precioVenta: 1500,
      });

      const res = await request(app)
        .delete(`/api/v1/gyms/${gym._id}/products/${prod._id}`)
        .set('Authorization', authHeader(token));

      expect(res.status).toBe(200);
      expect(res.body.data.activo).toBe(false);
    });
  });

  describe('Ajustes y Auditoría de Stock (/ajuste-stock & /inventory-movements)', () => {
    it('7. Realiza ingreso de stock y genera movimiento de auditoría', async () => {
      const { gym, token } = await setupGymA();

      const prod = await Product.create({
        gym: gym._id,
        nombre: 'Grip Straps',
        costo: 4000,
        precioVenta: 6000,
        stock: 5,
      });

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/products/${prod._id}/ajuste-stock`)
        .set('Authorization', authHeader(token))
        .send({
          cantidad: 10,
          tipo: 'ingreso',
          motivo: 'Compra a proveedor',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.product.stock).toBe(15);
      expect(res.body.data.movement.tipo).toBe('ingreso');
      expect(res.body.data.movement.stockAnterior).toBe(5);
      expect(res.body.data.movement.stockNuevo).toBe(15);
    });

    it('8. Realiza egreso de stock correctamente', async () => {
      const { gym, token } = await setupGymA();

      const prod = await Product.create({
        gym: gym._id,
        nombre: 'Cinta Kinesiológica',
        costo: 2000,
        precioVenta: 3500,
        stock: 8,
      });

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/products/${prod._id}/ajuste-stock`)
        .set('Authorization', authHeader(token))
        .send({
          cantidad: 3,
          tipo: 'egreso',
          motivo: 'Uso interno en consultorio',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.product.stock).toBe(5);
      expect(res.body.data.movement.stockAnterior).toBe(8);
      expect(res.body.data.movement.stockNuevo).toBe(5);
    });

    it('9. Rechaza egreso si la cantidad supera el stock disponible (400 Bad Request)', async () => {
      const { gym, token } = await setupGymA();

      const prod = await Product.create({
        gym: gym._id,
        nombre: 'Shaker 700ml',
        costo: 3000,
        precioVenta: 5000,
        stock: 2,
      });

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/products/${prod._id}/ajuste-stock`)
        .set('Authorization', authHeader(token))
        .send({
          cantidad: 5,
          tipo: 'egreso',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Stock insuficiente');
    });

    it('10. Permite consultar el historial de movimientos de inventario (GET /inventory-movements)', async () => {
      const { gym, token } = await setupGymA();

      const prod = await Product.create({
        gym: gym._id,
        nombre: 'Multivitamínico',
        costo: 8000,
        precioVenta: 12000,
        stock: 20,
      });

      await request(app)
        .post(`/api/v1/gyms/${gym._id}/products/${prod._id}/ajuste-stock`)
        .set('Authorization', authHeader(token))
        .send({
          cantidad: 5,
          tipo: 'egreso',
          motivo: 'Devolución vencido',
        });

      const res = await request(app)
        .get(`/api/v1/gyms/${gym._id}/inventory-movements`)
        .set('Authorization', authHeader(token));

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].productoNombre).toBe('Multivitamínico');
      expect(res.body.data[0].usuario).toBeDefined();
    });
  });

  describe('Seguridad, Permisos de Roles y Multi-Tenancy', () => {
    it('11. Rol STAFF puede gestionar productos y stock (tiene REGISTER_SALES)', async () => {
      const { gym } = await setupGymA();
      const { user: staffUser } = await createUserInGym({
        gym: gym._id,
        role: ROLES.STAFF,
      });
      const staffToken = signToken(staffUser._id);

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/products`)
        .set('Authorization', authHeader(staffToken))
        .send({
          nombre: 'Producto Creado Por Staff',
          costo: 500,
          precioVenta: 800,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('12. Rol TEACHER no puede crear productos (falta REGISTER_SALES -> 403)', async () => {
      const { gym } = await setupGymA();
      const { user: teacherUser } = await createUserInGym({
        gym: gym._id,
        role: ROLES.TEACHER,
      });
      const teacherToken = signToken(teacherUser._id);

      const res = await request(app)
        .post(`/api/v1/gyms/${gym._id}/products`)
        .set('Authorization', authHeader(teacherToken))
        .send({
          nombre: 'Producto Rechazado',
          costo: 500,
          precioVenta: 800,
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('13. Usuario de Gym B no puede acceder a productos ni movimientos de Gym A (404 Not Found)', async () => {
      const gymA = await setupGymA();
      const gymB = await setupGymA();

      const prodA = await Product.create({
        gym: gymA.gym._id,
        nombre: 'Producto Privado Gym A',
        costo: 1000,
        precioVenta: 2000,
      });

      const resGet = await request(app)
        .get(`/api/v1/gyms/${gymA.gym._id}/products/${prodA._id}`)
        .set('Authorization', authHeader(gymB.token));

      expect(resGet.status).toBe(404);

      const resStock = await request(app)
        .post(`/api/v1/gyms/${gymA.gym._id}/products/${prodA._id}/ajuste-stock`)
        .set('Authorization', authHeader(gymB.token))
        .send({ cantidad: 10, tipo: 'ingreso' });

      expect(resStock.status).toBe(404);
    });
  });
});
