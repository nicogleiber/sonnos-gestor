require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const http = require('http');
const app = require('./src/app');
const { connectDatabase, disconnectDatabase } = require('./src/config/database');
const User = require('./src/models/user.model');
const Gym = require('./src/models/gym.model');
const GymStaff = require('./src/models/gymStaff.model');
const MembershipPlan = require('./src/models/membershipPlan.model');
const Teacher = require('./src/models/teacher.model');

async function runHttpIntegrationTest() {
  console.log('=== Verificación de Endpoints HTTP (Fase 1) ===');
  await connectDatabase();

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api/v1`;
  console.log(`🚀 Servidor de pruebas iniciado en puerto ${port}`);

  try {
    const timestamp = Date.now();
    const testEmailOwner = `owner_${timestamp}@sonnostest.com`;
    const testPassword = 'Password123!';

    // 1. Registro de Usuario Dueño + Gimnasio
    console.log('\n1. Probando Registro de Dueño y Gimnasio...');
    const registerRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gymName: `Gimnasio Alpha ${timestamp}`,
        firstName: 'Lucas',
        lastName: 'Dueño',
        email: testEmailOwner,
        password: testPassword,
      }),
    });
    const registerJson = await registerRes.json();
    if (!registerRes.ok || !registerJson.success) {
      throw new Error(`Error en registro: ${JSON.stringify(registerJson)}`);
    }

    const tokenOwner = registerJson.data.token;
    const gymId = registerJson.data.gym._id;
    console.log(`✅ Registro exitoso. Gym ID: ${gymId}`);

    // 2. Whoami
    console.log('\n2. Probando endpoint /whoami...');
    const whoamiRes = await fetch(`${baseUrl}/gyms/${gymId}/whoami`, {
      headers: { Authorization: `Bearer ${tokenOwner}` },
    });
    const whoamiJson = await whoamiRes.json();
    console.log('✅ Whoami response:', whoamiJson);

    // 3. Crear Plan de Membresía
    console.log('\n3. Creando Plan de Membresía...');
    const createPlanRes = await fetch(`${baseUrl}/gyms/${gymId}/membership-plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenOwner}`,
      },
      body: JSON.stringify({
        nombre: 'Pase Libre Musculación',
        tipo: 'Plan Musculación',
        duracionMeses: 1,
        precio: 22000,
        frecuencia: 'Libre',
        cupos: 100,
        descripcion: 'Acceso ilimitado a todas las máquinas',
      }),
    });
    const createPlanJson = await createPlanRes.json();
    if (!createPlanRes.ok || !createPlanJson.success) {
      throw new Error(`Error al crear plan: ${JSON.stringify(createPlanJson)}`);
    }
    const planId = createPlanJson.data._id;
    console.log(`✅ Plan creado con ID: ${planId}, Nombre: ${createPlanJson.data.nombre}`);

    // 4. Listar Planes
    console.log('\n4. Listando Planes...');
    const listPlansRes = await fetch(`${baseUrl}/gyms/${gymId}/membership-plans`, {
      headers: { Authorization: `Bearer ${tokenOwner}` },
    });
    const listPlansJson = await listPlansRes.json();
    console.log(`✅ Planes obtenidos: ${listPlansJson.data.length}`);

    // 5. Crear Profesor
    console.log('\n5. Creando Profesor...');
    const createTeacherRes = await fetch(`${baseUrl}/gyms/${gymId}/teachers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenOwner}`,
      },
      body: JSON.stringify({
        nombre: 'Martín',
        apellido: 'Rodríguez',
        rol: 'Profesor de Crossfit',
        especialidad: 'Crossfit / HIIT',
        email: `martin_${timestamp}@sonnostest.com`,
        telefono: '1144556677',
      }),
    });
    const createTeacherJson = await createTeacherRes.json();
    if (!createTeacherRes.ok || !createTeacherJson.success) {
      throw new Error(`Error al crear profesor: ${JSON.stringify(createTeacherJson)}`);
    }
    const teacherId = createTeacherJson.data._id;
    console.log(`✅ Profesor creado con ID: ${teacherId}`);

    // 6. Agendar Consulta
    console.log('\n6. Agendando Consulta con Profesor...');
    const scheduleRes = await fetch(`${baseUrl}/gyms/${gymId}/teachers/${teacherId}/consultas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenOwner}`,
      },
      body: JSON.stringify({
        fecha: new Date().toISOString(),
        hora: '18:00',
        socioNombre: 'Esteban Test',
        tipo: 'Planificación de Entrenamiento',
        notas: 'Primera sesión introductoria',
      }),
    });
    const scheduleJson = await scheduleRes.json();
    if (!scheduleRes.ok || !scheduleJson.success) {
      throw new Error(`Error al agendar consulta: ${JSON.stringify(scheduleJson)}`);
    }
    console.log(`✅ Consulta agendada. Consultas del profesor: ${scheduleJson.data.consultasAcordadas.length}`);

    // 7. Probar Alias en Español (/tarifas y /profesores)
    console.log('\n7. Probando Alias en Español...');
    const tarifasAliasRes = await fetch(`${baseUrl}/gyms/${gymId}/tarifas`, {
      headers: { Authorization: `Bearer ${tokenOwner}` },
    });
    const tarifasAliasJson = await tarifasAliasRes.json();
    console.log(`✅ Alias /tarifas respondió OK con ${tarifasAliasJson.data.length} planes`);

    const profesoresAliasRes = await fetch(`${baseUrl}/gyms/${gymId}/profesores`, {
      headers: { Authorization: `Bearer ${tokenOwner}` },
    });
    const profesoresAliasJson = await profesoresAliasRes.json();
    console.log(`✅ Alias /profesores respondió OK con ${profesoresAliasJson.data.length} profesores`);

    // Limpieza
    console.log('\n8. Limpiando datos de prueba...');
    await MembershipPlan.deleteMany({ gym: gymId });
    await Teacher.deleteMany({ gym: gymId });
    await GymStaff.deleteMany({ gym: gymId });
    await Gym.findByIdAndDelete(gymId);
    await User.findOneAndDelete({ email: testEmailOwner });
    console.log('✅ Base de datos limpia.');

    console.log('\n🎉 --- TODOS LOS TESTS HTTP DE FASE 1 PASARON AL 100% ---');
  } finally {
    server.close();
    await disconnectDatabase();
  }
}

runHttpIntegrationTest().catch((err) => {
  console.error('❌ Error en test HTTP:', err);
  process.exit(1);
});
