const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const ApiError = require('./utils/ApiError');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'API funcionando correctamente' });
});

// Acá se van a ir montando las rutas de cada módulo, por ejemplo:
// app.use('/api/v1/auth', require('./routes/auth.routes'));
// app.use('/api/v1/gyms', require('./routes/gym.routes'));

// Catch-all: cualquier ruta no definida arriba llega hasta acá.
app.use((req, res, next) => {
  next(ApiError.notFound(`No se encontró la ruta ${req.method} ${req.originalUrl}`));
});

// SIEMPRE al final: Express solo trata como "manejador de errores" a un
// middleware con 4 argumentos (err, req, res, next), y solo si está
// registrado después de todo lo demás.
app.use(errorHandler);

module.exports = app;