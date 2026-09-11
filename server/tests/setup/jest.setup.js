'use strict';
/**
 * tests/setup/jest.setup.js
 *
 * Corre en cada WORKER de Jest (una vez por archivo de test), vía
 * setupFilesAfterFramework. Gestiona el ciclo de vida de la conexión
 * Mongoose y garantiza aislamiento entre tests.
 *
 * Estrategia de aislamiento:
 *   - beforeAll: conecta Mongoose (la URI ya está en process.env.MONGODB_URI
 *     gracias a env.setup.js que corrió antes).
 *   - afterEach: limpia todas las colecciones entre cada test individual,
 *     sin borrar índices (lo que sería más costoso). Esto hace que cada `it`
 *     arranque con una BD vacía sin depender del orden de ejecución.
 *   - afterAll: desconecta Mongoose al terminar el archivo de test.
 */

const mongoose = require('mongoose');

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
});

afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    await Promise.all(
      Object.values(collections).map((collection) => collection.deleteMany({}))
    );
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
});
