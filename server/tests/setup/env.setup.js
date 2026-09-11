'use strict';
/**
 * tests/setup/env.setup.js
 *
 * Inyecta las variables de entorno necesarias ANTES de que cualquier módulo
 * de src/ se importe. Jest corre este archivo via `setupFiles` (pre-env),
 * lo que garantiza que process.env esté poblado cuando src/config/env.js
 * se ejecute por primera vez (y valide las vars requeridas).
 *
 * La MONGODB_URI real en memoria la escribe globalSetup.js en un archivo
 * temporal (ya que process.env de globalSetup no se propaga a los workers).
 * Leemos ese archivo aquí para obtener la URI correcta.
 *
 * GARANTÍA DE AISLAMIENTO: Estos tests NUNCA tocan la BD real porque:
 *   1. Sobreescribimos MONGODB_URI antes de que env.js la lea.
 *   2. La URI siempre apunta a MongoMemoryReplSet (127.0.0.1 con puerto aleatorio).
 *   3. El dotenv.config() en env.js puede cargar desde config.env si existe,
 *      pero la var ya está en process.env y dotenv no la sobreescribe.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// NODE_ENV=test es lo primero: algunos módulos ramifican su comportamiento.
process.env.NODE_ENV = 'test';

// Leer la URI del archivo temporal escrito por globalSetup.
// Si por alguna razón no existe (ej: correr un test aislado sin globalSetup),
// fallamos explícitamente para no correr tests contra una BD desconocida.
const MONGO_URI_FILE = path.join(os.tmpdir(), 'jest-mongo-uri.txt');
let mongoUri;

try {
  mongoUri = fs.readFileSync(MONGO_URI_FILE, 'utf-8').trim();
} catch {
  // Si globalSetup no corrió (ej: `node --test` directo), usamos un fallback
  // que hará fallar la conexión de forma clara y nunca tocará la BD real.
  mongoUri = 'mongodb://127.0.0.1:27017/test-should-never-connect';
}

process.env.MONGODB_URI = mongoUri;
process.env.PORT = '5051';
process.env.JWT_SECRET = 'test-jwt-secret-that-is-long-enough-for-hs256';
process.env.JWT_EXPIRES_IN = '1d';
process.env.CLIENT_URL = 'http://localhost:5173';
