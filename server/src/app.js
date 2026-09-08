const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const ApiError = require('./utils/ApiError');
const cors = require('cors');
const authenticate = require('./middleware/authenticate');
const authorize = require('./middleware/authorize');

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'API funcionando correctamente' });
});

app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/gyms', require('./routes/gym.routes'));

// Temporal: ruta de prueba para confirmar que authenticate + authorize
// funcionan de punta a punta. La sacamos apenas exista el módulo real de Gym.
app.get('/api/v1/gyms/:gymId/whoami', authenticate, authorize(), (req, res) => {
  res.json({ success: true, gymId: req.gymId, role: req.gymRole });
});


app.use((req, res, next) => {
  next(ApiError.notFound(`No se encontró la ruta ${req.method} ${req.originalUrl}`));
});

app.use(errorHandler);

module.exports = app;