const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../config.env') });
const { connectDatabase, disconnectDatabase } = require('../config/database');

const Gym = require('../models/gym.model');
const User = require('../models/user.model');
const MembershipPlan = require('../models/membershipPlan.model');
const Member = require('../models/member.model');
const Teacher = require('../models/teacher.model');
const Product = require('../models/product.model');

function getOffsetDate(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d;
}

async function seed() {
  console.log('🌱 Iniciando seed de MongoDB Atlas...');
  await connectDatabase();

  // 1. Gimnasio
  let gym = await Gym.findOne();
  if (!gym) {
    gym = await Gym.create({
      name: 'Sonnos Gym - Sede Central',
      timezone: 'America/Argentina/Buenos_Aires',
      paymentMethods: ['efectivo', 'transferencia_bancaria', 'qr_mercadopago'],
      active: true,
    });
    console.log('✅ Gimnasio creado:', gym.name);
  }

  const gymId = gym._id;

  // 2. Planes de Membresía
  const planesCount = await MembershipPlan.countDocuments({ gym: gymId });
  let createdPlans = [];
  if (planesCount === 0) {
    createdPlans = await MembershipPlan.create([
      { gym: gymId, nombre: 'Pase Libre Mensual', tipo: 'Plan Musculación', duracionMeses: 1, precio: 18000, activo: true, descripcion: 'Acceso ilimitado a sala de musculación y cardio.' },
      { gym: gymId, nombre: 'Plan Trimestral Fit', tipo: 'Plan Musculación', duracionMeses: 3, precio: 48000, activo: true, descripcion: 'Ahorro del 15% pagando el trimestre por adelantado.' },
      { gym: gymId, nombre: 'Plan Semestral Pro', tipo: 'Plan Musculación', duracionMeses: 6, precio: 88000, activo: true, descripcion: 'Acceso semestral con evaluación física mensual incluida.' },
      { gym: gymId, nombre: 'Plan Anual Elite', tipo: 'Plan Musculación', duracionMeses: 12, precio: 155000, activo: true, descripcion: 'La mejor tarifa anual con acceso total a todas las áreas.' },
      { gym: gymId, nombre: 'Spinning & Cardio', tipo: 'Clase/Disciplina', duracionMeses: 1, precio: 16000, frecuencia: '3 veces por semana', cupos: 20, activo: true },
      { gym: gymId, nombre: 'Cross Training & Funcional', tipo: 'Clase/Disciplina', duracionMeses: 1, precio: 17500, frecuencia: 'Pase Libre', cupos: 20, activo: true },
      { gym: gymId, nombre: 'Yoga & Pilates', tipo: 'Clase/Disciplina', duracionMeses: 1, precio: 15000, frecuencia: '2 veces por semana', cupos: 15, activo: true },
      { gym: gymId, nombre: 'Boxeo Training', tipo: 'Clase/Disciplina', duracionMeses: 1, precio: 16500, frecuencia: '3 veces por semana', cupos: 18, activo: true },
    ]);
    console.log(`✅ ${createdPlans.length} planes creados en DB.`);
  } else {
    createdPlans = await MembershipPlan.find({ gym: gymId });
  }

  // 3. Profesores / Personal
  const teacherCount = await Teacher.countDocuments({ gym: gymId });
  if (teacherCount === 0) {
    await Teacher.create([
      { gym: gymId, nombre: 'Carlos', apellido: 'Vega', rol: 'Entrenador Personal', especialidad: 'Fuerza y Musculación', email: 'cvega@sonnos.com', telefono: '011-4500-1111', activo: true },
      { gym: gymId, nombre: 'Florencia', apellido: 'Aguirre', rol: 'Profesora', especialidad: 'Spinning & Cardio', email: 'faguirre@sonnos.com', telefono: '011-4500-2222', activo: true },
      { gym: gymId, nombre: 'Roberto', apellido: 'Peralta', rol: 'Entrenador Personal', especialidad: 'Funcional y Cross', email: 'rperalta@sonnos.com', telefono: '011-4500-3333', activo: true },
      { gym: gymId, nombre: 'Ana', apellido: 'Castillo', rol: 'Profesora', especialidad: 'Yoga & Pilates', email: 'acastillo@sonnos.com', telefono: '011-4500-4444', activo: true },
      { gym: gymId, nombre: 'Pablo', apellido: 'Ríos', rol: 'Nutricionista', especialidad: 'Nutrición Deportiva', email: 'prios@sonnos.com', telefono: '011-4500-5555', activo: true },
      { gym: gymId, nombre: 'Daniela', apellido: 'Herrera', rol: 'Profesora', especialidad: 'Zumba & Aeróbica', email: 'dherrera@sonnos.com', telefono: '011-4500-6666', activo: false },
    ]);
    console.log('✅ Profesores / Personal creados en DB.');
  }

  // 4. Socios
  const memberCount = await Member.countDocuments({ gym: gymId });
  if (memberCount === 0) {
    const planMensual = createdPlans.find(p => p.nombre === 'Pase Libre Mensual');
    const planTrimestral = createdPlans.find(p => p.nombre === 'Plan Trimestral Fit');
    const planSemestral = createdPlans.find(p => p.nombre === 'Plan Semestral Pro');
    const planAnual = createdPlans.find(p => p.nombre === 'Plan Anual Elite');

    const sociosData = [
      { gym: gymId, nombre: 'Valentina', apellido: 'García', dni: '38192831', telefono: '011-4532-8901', email: 'vgarcia@email.com', tipoSuscripcion: 'Pase Libre Mensual', plan: planMensual?._id, fechaVencimiento: getOffsetDate(22), activo: true },
      { gym: gymId, nombre: 'Matías', apellido: 'Rodríguez', dni: '39102938', telefono: '011-4567-2345', email: 'mrodriguez@email.com', tipoSuscripcion: 'Plan Trimestral Fit', plan: planTrimestral?._id, fechaVencimiento: getOffsetDate(5), activo: true },
      { gym: gymId, nombre: 'Luciana', apellido: 'Martínez', dni: '40192837', telefono: '011-4598-1122', email: 'lmartinez@email.com', tipoSuscripcion: 'Plan Anual Elite', plan: planAnual?._id, fechaVencimiento: getOffsetDate(150), activo: true },
      { gym: gymId, nombre: 'Diego', apellido: 'López', dni: '37182930', telefono: '011-4511-9988', email: 'dlopez@email.com', tipoSuscripcion: 'Pase Libre Mensual', plan: planMensual?._id, fechaVencimiento: getOffsetDate(-14), activo: true },
      { gym: gymId, nombre: 'Camila', apellido: 'Fernández', dni: '41928374', telefono: '011-4523-4455', email: 'cfernandez@email.com', tipoSuscripcion: 'Plan Semestral Pro', plan: planSemestral?._id, fechaVencimiento: getOffsetDate(3), activo: true },
      { gym: gymId, nombre: 'Nicolás', apellido: 'Sánchez', dni: '39281726', telefono: '011-4544-7766', email: 'nsanchez@email.com', tipoSuscripcion: 'Pase Libre Mensual', plan: planMensual?._id, fechaVencimiento: getOffsetDate(15), activo: true },
      { gym: gymId, nombre: 'Sofía', apellido: 'Torres', dni: '42819201', telefono: '011-4555-3311', email: 'storres@email.com', tipoSuscripcion: 'Plan Trimestral Fit', plan: planTrimestral?._id, fechaVencimiento: getOffsetDate(-3), activo: true },
      { gym: gymId, nombre: 'Joaquín', apellido: 'Romero', dni: '36192837', telefono: '011-4566-8822', email: 'jromero@email.com', tipoSuscripcion: 'Plan Anual Elite', plan: planAnual?._id, fechaVencimiento: getOffsetDate(210), activo: true },
      { gym: gymId, nombre: 'Martina', apellido: 'Díaz', dni: '43918273', telefono: '011-4577-5544', email: 'mdiaz@email.com', tipoSuscripcion: 'Pase Libre Mensual', plan: planMensual?._id, fechaVencimiento: getOffsetDate(1), activo: true },
      { gym: gymId, nombre: 'Sebastián', apellido: 'Moreno', dni: '38291029', telefono: '011-4588-6633', email: 'smoreno@email.com', tipoSuscripcion: 'Plan Semestral Pro', plan: planSemestral?._id, fechaVencimiento: getOffsetDate(85), activo: true },
    ];

    for (const s of sociosData) {
      s.estado = Member.calcularEstado(s.fechaVencimiento, s.activo);
      await Member.create(s);
    }
    console.log('✅ 10 Socios iniciales creados en DB.');
  }

  // 5. Productos
  const prodCount = await Product.countDocuments({ gym: gymId });
  if (prodCount === 0) {
    await Product.create([
      { gym: gymId, codigo: 'PROT-WHEY-1K', nombre: 'Proteína Whey Isolate 1kg Vainilla', categoria: 'Suplementos', costo: 28000, margen: 35, precioVenta: 38000, stock: 15, stockMinimo: 5, activo: true },
      { gym: gymId, codigo: 'CREAT-500G', nombre: 'Creatina Monohidrato Creapure 500g', categoria: 'Suplementos', costo: 22000, margen: 35, precioVenta: 30000, stock: 20, stockMinimo: 5, activo: true },
      { gym: gymId, codigo: 'BCAA-300G', nombre: 'Aminoácidos BCAA 2:1:1 300g Frutos Rojos', categoria: 'Suplementos', costo: 14000, margen: 35, precioVenta: 19000, stock: 12, stockMinimo: 4, activo: true },
      { gym: gymId, codigo: 'REM-SONNOS-M', nombre: 'Remera Técnica Sonnos Dry-Fit Talle M', categoria: 'Indumentaria', costo: 12000, margen: 40, precioVenta: 17000, stock: 25, stockMinimo: 5, activo: true },
      { gym: gymId, codigo: 'CARAMA-750', nombre: 'Botella Caramañola Deportiva Sonnos 750ml', categoria: 'Accesorios', costo: 4500, margen: 45, precioVenta: 6500, stock: 30, stockMinimo: 8, activo: true },
      { gym: gymId, codigo: 'BEB-ISOTONIC', nombre: 'Bebida Isotónica Hidratante 500ml Citrus', categoria: 'Bebidas', costo: 1200, margen: 50, precioVenta: 1800, stock: 40, stockMinimo: 10, activo: true },
      { gym: gymId, codigo: 'BAR-PROT', nombre: 'Barra de Proteína Crunch 60g Chocolate', categoria: 'Snacks', costo: 1500, margen: 40, precioVenta: 2100, stock: 50, stockMinimo: 15, activo: true },
    ]);
    console.log('✅ Productos iniciales creados en DB.');
  }

  console.log('🎉 Seed finalizado exitosamente.');
  await disconnectDatabase();
}

seed().catch(err => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
