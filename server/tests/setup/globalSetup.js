'use strict';
/**
 * tests/setup/globalSetup.js
 *
 * Se ejecuta UNA SOLA VEZ en el proceso principal de Jest, antes de cualquier
 * test worker. Arranca MongoMemoryReplSet (necesario para las transacciones
 * que usa auth.service.js con mongoose.startSession) y escribe la URI en
 * un archivo temporal para que env.setup.js la lea en cada worker.
 *
 * Por qué ReplicaSet y no standalone:
 *   mongoose.startSession() + session.withTransaction() requieren un replica set.
 *   Un MongoMemoryServer standalone lanzaría "Transaction numbers are only allowed
 *   on a replica set member or mongos" al intentar abrir una sesión.
 *
 * Por qué escribir a archivo y no process.env:
 *   El proceso de globalSetup es distinto a los procesos worker de Jest.
 *   Las modificaciones a process.env en globalSetup NO se propagan automáticamente
 *   a los workers. La forma confiable es escribir a un archivo temporal y leerlo
 *   en setupFiles (que corre dentro del proceso worker).
 */

const { MongoMemoryReplSet } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Ruta del archivo temporal donde guardamos la URI para los workers.
const MONGO_URI_FILE = path.join(os.tmpdir(), 'jest-mongo-uri.txt');

let replSet;

async function globalSetup() {
  replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1 }, // Single node replica set — suficiente para transacciones
  });

  const uri = replSet.getUri();

  // Persistir la URI para que env.setup.js (worker) la pueda leer.
  fs.writeFileSync(MONGO_URI_FILE, uri, 'utf-8');

  // También lo dejamos en process.env del proceso principal (útil para globalTeardown).
  process.env.__MONGO_URI__ = uri;

  // Guardamos la referencia para globalTeardown (mismo proceso principal).
  global.__MONGOD__ = replSet;
  global.__MONGO_URI_FILE__ = MONGO_URI_FILE;
}

module.exports = globalSetup;
