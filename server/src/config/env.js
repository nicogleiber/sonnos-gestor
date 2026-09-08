const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../../config.env') });

const requiredVars = ['NODE_ENV', 'PORT', 'MONGODB_URI', 'JWT_SECRET', 'JWT_EXPIRES_IN', 'CLIENT_URL'];

const defaults = {
  NODE_ENV: 'development',
  PORT: '5050',
  JWT_EXPIRES_IN: '1d',
  CLIENT_URL: 'http://localhost:5173'
}

const missingVars = requiredVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  throw new Error(
    `Faltan variables de entorno obligatorias: ${missingVars.join(', ')}. Revisá tu archivo config.env.`
  );
}

const port = parseInt(process.env.PORT, 10);

if (Number.isNaN(port)) {
  throw new Error(`PORT tiene un valor inválido: "${process.env.PORT}"`);
}


// Mostrar configuración cargada (útil para debug)
console.log('✅ Variables de entorno cargadas correctamente:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`   PORT: ${process.env.PORT}`);
console.log(`   MONGODB_URI: ${process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`); // Oculta credenciales
console.log(`   JWT_EXPIRES_IN: ${process.env.JWT_EXPIRES_IN}`);
console.log(`   CLIENT_URL: ${process.env.CLIENT_URL}`);

//Exportar variables validadas 
const env = {
  nodeEnv: process.env.NODE_ENV,
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  port,
  mongoUri: process.env.MONGODB_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
};

module.exports = env;