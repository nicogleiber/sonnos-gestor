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

// Subrutas operativas aisladas por gimnasio (Multi-tenant)
const gymRouter = express.Router({ mergeParams: true });
gymRouter.use(authenticate, authorize());

// Fase 1: Catálogos Base (Tarifas/Planes & Profesores)
gymRouter.use('/membership-plans', require('./routes/membershipPlan.routes'));
gymRouter.use('/tarifas', require('./routes/membershipPlan.routes'));
gymRouter.use('/teachers', require('./routes/teacher.routes'));
gymRouter.use('/profesores', require('./routes/teacher.routes'));

// Temporal: ruta de prueba para confirmar autenticación y rol
gymRouter.get('/whoami', (req, res) => {
  res.json({ success: true, gymId: req.gymId, role: req.role });
});

app.use('/api/v1/gyms/:gymId', gymRouter);


app.use((req, res, next) => {
  next(ApiError.notFound(`No se encontró la ruta ${req.method} ${req.originalUrl}`));
});

app.use(errorHandler);

module.exports = app;