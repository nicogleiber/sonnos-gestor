'use strict';

/**
 * Seed script: Inicializa en MongoDB el usuario administrador de prueba (admin@sonnos.com / sonnos2026),
 * el gimnasio principal y el rol de GymStaff ('owner').
 *
 * Ejecutar con: npm run seed
 */

const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/user.model');
const Gym = require('../models/gym.model');
const GymStaff = require('../models/gymStaff.model');
const { ROLES } = require('../constants/roles');

async function seed() {
  console.log('🌱 Conectando a MongoDB para inicializar datos de prueba...');
  await mongoose.connect(env.mongoUri);
  console.log('✅ Conexión establecida.');

  // 1. Crear o buscar Gimnasio Principal
  let gym = await Gym.findOne({ name: 'Sonnos Gym - Sede Central' });
  if (!gym) {
    gym = await Gym.findOne({ active: true }).sort({ createdAt: 1 });
  }

  if (!gym) {
    gym = await Gym.create({
      name: 'Sonnos Gym - Sede Central',
      timezone: 'America/Argentina/Buenos_Aires',
      paymentMethods: ['efectivo', 'transferencia_bancaria', 'qr_mercadopago'],
      telefono: '011-4500-0000',
      direccion: 'Av. Corrientes 1234, CABA',
      email: 'contacto@sonnos.com',
      sitioWeb: 'https://sonnos.com.ar',
      cuit: '30-71829304-9',
      aliasMercadoPago: 'sonnos.gym.mp',
      cvuTransferencia: '0000003100045892110293',
      horarioApertura: '06:00',
      horarioCierre: '22:00',
      diasApertura: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      capacidadMaxima: 150,
      sedes: [
        {
          nombre: 'Sede Central (Belgrano)',
          direccion: 'Av. Cabildo 2400',
          telefono: '011-4780-1234',
          principal: true,
        },
      ],
      active: true,
    });
    console.log(`🏢 Gimnasio creado: "${gym.name}" (ID: ${gym._id})`);
  } else {
    console.log(`🏢 Gimnasio existente: "${gym.name}" (ID: ${gym._id})`);
  }

  // 2. Crear o actualizar Usuario Administrador
  const email = 'admin@sonnos.com';
  const password = 'sonnos2026';
  let adminUser = await User.findOne({ email });

  if (!adminUser) {
    adminUser = await User.create({
      firstName: 'Administrador',
      lastName: 'Sonnos',
      email,
      password,
      isPlatformAdmin: true,
      active: true,
    });
    console.log(`👤 Usuario creado: ${email} (Contraseña: ${password})`);
  } else {
    // Si ya existía, actualizamos password y estado activo
    adminUser.password = password;
    adminUser.active = true;
    adminUser.isPlatformAdmin = true;
    await adminUser.save();
    console.log(`👤 Usuario actualizado: ${email}`);
  }

  // 3. Crear o verificar vinculación GymStaff
  let staff = await GymStaff.findOne({ gym: gym._id, user: adminUser._id });
  if (!staff) {
    staff = await GymStaff.create({
      gym: gym._id,
      user: adminUser._id,
      role: ROLES.OWNER,
      status: 'active',
    });
    console.log(`🔑 Vinculación GymStaff creada: ${adminUser.email} -> ${gym.name} (Rol: ${ROLES.OWNER})`);
  } else {
    staff.role = ROLES.OWNER;
    staff.status = 'active';
    await staff.save();
    console.log(`🔑 Vinculación GymStaff verificada: ${adminUser.email} (Rol: ${ROLES.OWNER})`);
  }

  console.log('\n🎉 Seed completado con éxito!');
  console.log('----------------------------------------------------');
  console.log(`Credenciales de prueba válidas en MongoDB:`);
  console.log(`📧 Email:    ${email}`);
  console.log(`🔒 Password: ${password}`);
  console.log(`🏢 Gym ID:   ${gym._id}`);
  console.log(`👑 Rol:      ${ROLES.OWNER}`);
  console.log('----------------------------------------------------');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
