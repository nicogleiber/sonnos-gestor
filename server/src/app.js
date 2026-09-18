const express = require('express');
const jwt = require('jsonwebtoken');
const errorHandler = require('./middleware/errorHandler');
const ApiError = require('./utils/ApiError');
const cors = require('cors');
const env = require('./config/env');
const authenticate = require('./middleware/authenticate');
const authorize = require('./middleware/authorize');
const Gym = require('./models/gym.model');
const User = require('./models/user.model');
const GymStaff = require('./models/gymStaff.model');

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'API funcionando correctamente' });
});
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API funcionando correctamente' });
});

// Rutas de Autenticación y Registro (Públicas)
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/v1/gyms', require('./routes/gym.routes'));
app.use('/api/gyms', require('./routes/gym.routes'));

// Middleware para resolver autenticación y contexto de gimnasio para el cliente directo (/api/...)
async function resolveDirectClientContext(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = jwt.verify(token, env.jwt.secret);
        const user = await User.findById(payload.sub);
        if (user && user.active) {
          req.user = user;
        }
      } catch (err) {
        throw ApiError.unauthorized('Token inválido o expirado');
      }
    }

    if (!req.user) {
      throw ApiError.unauthorized('Falta el token de autenticación');
    }

    let gymId = req.headers['x-gym-id'] || req.params.gymId;

    if (gymId) {
      req.gymId = gymId.toString();
    } else {
      const staff = await GymStaff.findOne({ user: req.user._id, status: 'active' });
      if (staff) {
        req.gymId = staff.gym.toString();
      } else {
        let defaultGym = await Gym.findOne({ active: true }).sort({ createdAt: 1 });
        if (!defaultGym) {
          defaultGym = await Gym.create({
            name: 'Sonnos Gym - Sede Central',
            timezone: 'America/Argentina/Buenos_Aires',
            paymentMethods: ['efectivo', 'transferencia_bancaria', 'qr_mercadopago'],
            active: true,
          });
        }
        req.gymId = defaultGym._id.toString();
      }
    }

    next();
  } catch (err) {
    next(err);
  }
}

// Router directo para llamadas del frontend (/api/socios, /api/tarifas, etc.)
const directApiRouter = express.Router();
directApiRouter.use(resolveDirectClientContext);

directApiRouter.use('/membership-plans', require('./routes/membershipPlan.routes'));
directApiRouter.use('/tarifas', require('./routes/membershipPlan.routes'));
directApiRouter.use('/planes', require('./routes/membershipPlan.routes'));
directApiRouter.use('/teachers', require('./routes/teacher.routes'));
directApiRouter.use('/profesores', require('./routes/teacher.routes'));
directApiRouter.use('/personal', require('./routes/teacher.routes'));

directApiRouter.use('/members', require('./routes/member.routes'));
directApiRouter.use('/socios', require('./routes/member.routes'));
directApiRouter.use('/memberships', require('./routes/membership.routes'));
directApiRouter.use('/membresias', require('./routes/membership.routes'));

directApiRouter.use('/classes', require('./routes/class.routes'));
directApiRouter.use('/clases', require('./routes/class.routes'));

directApiRouter.use('/products', require('./routes/product.routes'));
directApiRouter.use('/productos', require('./routes/product.routes'));
directApiRouter.use('/inventory-movements', require('./routes/inventoryMovement.routes'));
directApiRouter.use('/movimientos-inventario', require('./routes/inventoryMovement.routes'));

directApiRouter.use('/cash-register', require('./routes/cashRegister.routes'));
directApiRouter.use('/caja', require('./routes/cashRegister.routes'));
directApiRouter.use('/cash-movements', require('./routes/cashMovement.routes'));
directApiRouter.use('/movimientos-caja', require('./routes/cashMovement.routes'));
directApiRouter.use('/sales', require('./routes/sale.routes'));
directApiRouter.use('/ventas', require('./routes/sale.routes'));
directApiRouter.use('/payments', require('./routes/payment.routes'));
directApiRouter.use('/pagos', require('./routes/payment.routes'));

directApiRouter.use('/dashboard', require('./routes/dashboard.routes'));
directApiRouter.use('/configuracion/sedes', require('./routes/sede.routes'));
directApiRouter.use('/sedes', require('./routes/sede.routes'));
directApiRouter.use('/configuracion', require('./routes/gym.routes'));
directApiRouter.use('/gym', require('./routes/gym.routes'));

app.use('/api', directApiRouter);

// Subrutas operativas aisladas por gimnasio (Multi-tenant: /api/v1/gyms/:gymId/...)
const gymRouter = express.Router({ mergeParams: true });
gymRouter.use(authenticate, authorize());

gymRouter.use('/membership-plans', require('./routes/membershipPlan.routes'));
gymRouter.use('/tarifas', require('./routes/membershipPlan.routes'));
gymRouter.use('/planes', require('./routes/membershipPlan.routes'));
gymRouter.use('/teachers', require('./routes/teacher.routes'));
gymRouter.use('/profesores', require('./routes/teacher.routes'));
gymRouter.use('/personal', require('./routes/teacher.routes'));

gymRouter.use('/members', require('./routes/member.routes'));
gymRouter.use('/socios', require('./routes/member.routes'));
gymRouter.use('/memberships', require('./routes/membership.routes'));
gymRouter.use('/membresias', require('./routes/membership.routes'));

gymRouter.use('/classes', require('./routes/class.routes'));
gymRouter.use('/clases', require('./routes/class.routes'));

gymRouter.use('/products', require('./routes/product.routes'));
gymRouter.use('/productos', require('./routes/product.routes'));
gymRouter.use('/inventory-movements', require('./routes/inventoryMovement.routes'));
gymRouter.use('/movimientos-inventario', require('./routes/inventoryMovement.routes'));

gymRouter.use('/cash-register', require('./routes/cashRegister.routes'));
gymRouter.use('/caja', require('./routes/cashRegister.routes'));
gymRouter.use('/cash-movements', require('./routes/cashMovement.routes'));
gymRouter.use('/movimientos-caja', require('./routes/cashMovement.routes'));
gymRouter.use('/sales', require('./routes/sale.routes'));
gymRouter.use('/ventas', require('./routes/sale.routes'));
gymRouter.use('/payments', require('./routes/payment.routes'));
gymRouter.use('/pagos', require('./routes/payment.routes'));

gymRouter.use('/dashboard', require('./routes/dashboard.routes'));
gymRouter.use('/configuracion/sedes', require('./routes/sede.routes'));
gymRouter.use('/sedes', require('./routes/sede.routes'));
gymRouter.use('/configuracion', require('./routes/gym.routes'));

gymRouter.get('/whoami', (req, res) => {
  res.json({ success: true, gymId: req.gymId, role: req.role });
});

app.use('/api/v1/gyms/:gymId', gymRouter);

app.use((req, res, next) => {
  next(ApiError.notFound(`No se encontró la ruta ${req.method} ${req.originalUrl}`));
});

app.use(errorHandler);

module.exports = app;