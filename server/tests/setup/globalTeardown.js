'use strict';
/**
 * tests/setup/globalTeardown.js
 *
 * Se ejecuta UNA SOLA VEZ en el proceso principal de Jest, después de que
 * todos los tests terminaron. Para el MongoMemoryReplSet iniciado en globalSetup
 * y limpia el archivo temporal de la URI.
 *
 * Nota: global.__MONGOD__ funciona porque globalSetup y globalTeardown corren
 * en el mismo proceso principal de Jest (no en workers aislados).
 */

const fs = require('fs');

async function globalTeardown() {
  if (global.__MONGOD__) {
    await global.__MONGOD__.stop();
  }

  // Limpiar el archivo temporal de URI
  if (global.__MONGO_URI_FILE__) {
    try {
      fs.unlinkSync(global.__MONGO_URI_FILE__);
    } catch {
      // Si no existe, no es un error crítico
    }
  }
}

module.exports = globalTeardown;
