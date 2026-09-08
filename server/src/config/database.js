const mongoose = require('mongoose');
const env = require('./env');

// strictQuery evita que una query con un campo que NO existe en el schema
// (típicamente un typo) devuelva de más o de menos silenciosamente.
// En un sistema multi-tenant, un filtro mal escrito es exactamente el tipo
// de bug que preferimos que explote temprano y no que devuelva datos de otro gimnasio.
mongoose.set('strictQuery', true);

mongoose.connection.on('error', (error) => {
  console.error('[database] Error de conexión a MongoDB:', error.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[database] Se perdió la conexión con MongoDB');
});

async function connectDatabase() {
  try {
    await mongoose.connect(env.mongoUri);
    console.log(`[database] Conectado a MongoDB (${env.nodeEnv})`);
  } catch (error) {
    console.error('[database] No se pudo conectar a MongoDB:', error.message);
    process.exit(1);
  }
}

async function disconnectDatabase() {
  await mongoose.disconnect();
}

module.exports = { connectDatabase, disconnectDatabase };