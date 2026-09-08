require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const { connectDatabase, disconnectDatabase } = require('./src/config/database');
const User = require('./src/models/user.model');
const Gym = require('./src/models/gym.model');
const GymStaff = require('./src/models/gymStaff.model');
const MembershipPlan = require('./src/models/membershipPlan.model');
const Teacher = require('./src/models/teacher.model');

async function testPhase1() {
  console.log('--- Iniciando verificación Fase 1 ---');
  try {
    await connectDatabase();
    console.log('✅ Conexión a MongoDB exitosa');

    // Limpieza de prueba previa si existiera
    const testGymName = 'Gym Test Fase 1 ' + Date.now();
    const gymA = await Gym.create({ name: testGymName });
    const gymB = await Gym.create({ name: 'Gym B Isolation Test ' + Date.now() });

    console.log('✅ Gimnasios creados:', gymA._id.toString(), gymB._id.toString());

    // 1. Probar Creación de MembershipPlan en Gym A
    const plan1 = await MembershipPlan.create({
      gym: gymA._id,
      nombre: 'Plan Musculación Full',
      tipo: 'Plan Musculación',
      duracionMeses: 1,
      precio: 15000,
      frecuencia: 'Pase Libre',
      cupos: 50,
      descripcion: 'Acceso total a sala de pesas',
      activo: true,
    });
    console.log('✅ MembershipPlan creado con éxito:', plan1.nombre, 'ID:', plan1._id.toString());

    // 2. Probar Creación de Profesor en Gym A
    const teacher1 = await Teacher.create({
      gym: gymA._id,
      nombre: 'Carlos',
      apellido: 'Pérez',
      rol: 'Entrenador Personal',
      especialidad: 'Fuerza e Hipertrofia',
      email: 'carlos.perez@testgym.com',
      telefono: '1122334455',
      consultasAcordadas: [
        {
          fecha: new Date(),
          hora: '15:00',
          socioNombre: 'Juan Gomez',
          tipo: 'Planificación Rutina',
          notas: 'Objetivo ganar masa muscular',
          estado: 'Programada',
        },
      ],
    });
    console.log('✅ Profesor creado con consulta:', teacher1.nombre, teacher1.apellido, 'ID:', teacher1._id.toString());

    // 3. Probar Aislamiento Multi-Tenant: Buscar planes y profesores de Gym B (debe retornar vacío)
    const plansGymB = await MembershipPlan.find({ gym: gymB._id });
    if (plansGymB.length !== 0) {
      throw new Error('FALLO: Gym B pudo ver planes de Gym A!');
    }
    console.log('✅ Aislamiento de planes confirmado: Gym B tiene 0 planes');

    const teachersGymB = await Teacher.find({ gym: gymB._id });
    if (teachersGymB.length !== 0) {
      throw new Error('FALLO: Gym B pudo ver profesores de Gym A!');
    }
    console.log('✅ Aislamiento de profesores confirmado: Gym B tiene 0 profesores');

    // 4. Probar actualización y soft-delete
    const updatedPlan = await MembershipPlan.findOneAndUpdate(
      { _id: plan1._id, gym: gymA._id },
      { precio: 17500, activo: false },
      { new: true }
    );
    if (!updatedPlan || updatedPlan.precio !== 17500 || updatedPlan.activo !== false) {
      throw new Error('FALLO: La actualización del plan falló');
    }
    console.log('✅ Actualización y baja lógica de plan confirmada:', updatedPlan.precio, 'Activo:', updatedPlan.activo);

    // 5. Probar agregado de consulta en Profesor
    teacher1.consultasAcordadas.push({
      fecha: new Date(),
      hora: '17:30',
      socioNombre: 'María López',
      tipo: 'Evaluación Física',
      estado: 'Programada',
    });
    await teacher1.save();
    console.log('✅ Consulta adicional agregada al profesor. Total consultas:', teacher1.consultasAcordadas.length);

    // Limpieza de datos de prueba
    await MembershipPlan.deleteMany({ gym: { $in: [gymA._id, gymB._id] } });
    await Teacher.deleteMany({ gym: { $in: [gymA._id, gymB._id] } });
    await Gym.deleteMany({ _id: { $in: [gymA._id, gymB._id] } });

    console.log('✅ Limpieza de datos completada');
    console.log('🎉 --- TODAS LAS PRUEBAS DE LA FASE 1 PASARON CON ÉXITO ---');
  } catch (error) {
    console.error('❌ Error durante la prueba de Fase 1:', error);
  } finally {
    await disconnectDatabase();
    process.exit(0);
  }
}

testPhase1();
