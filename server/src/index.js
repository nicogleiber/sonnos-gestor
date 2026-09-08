const env = require('./config/env');
const { connectDatabase } = require('./config/database');
const app = require('./app');


async function start() {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`[server] Escuchando en http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error('[server] Error fatal al iniciar el servidor:', error);
  process.exit(1);
});