'use strict';

/** @type {import('jest').Config} */
const config = {
  // El proyecto es CommonJS puro: no se necesita transform/babel.
  testEnvironment: 'node',

  // Dónde buscar los tests.
  testMatch: ['**/tests/**/*.test.js'],

  // Inyecta process.env ANTES de que Jest cargue cualquier módulo del proyecto.
  // Crítico porque src/config/env.js valida vars al importarse.
  setupFiles: ['./tests/setup/env.setup.js'],

  // Conecta/desconecta Mongoose y limpia colecciones entre tests.
  setupFilesAfterEnv: ['./tests/setup/jest.setup.js'],

  // Levanta/para MongoMemoryReplSet en procesos separados (una sola vez para toda la suite).
  globalSetup: './tests/setup/globalSetup.js',
  globalTeardown: './tests/setup/globalTeardown.js',

  // Timeout generoso: MongoMemoryReplSet puede tardar en arrancar en CI.
  testTimeout: 30000,

  // Serializar suites para evitar colisiones de deleteMany en la BD en memoria compartida
  maxWorkers: 1,

  // Mostrar cada test individualmente en la salida.
  verbose: true,
};

module.exports = config;
