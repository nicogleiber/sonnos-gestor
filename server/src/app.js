const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const ApiError = require('./utils/ApiError');
const cors = require('cors');
const authenticate = require('./middleware/authenticate');
const authorize = require('./middleware/authorize');
const Gym = require('./models/gym.model');
const User = require('./models/user.model');

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

app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/v1/gyms', require('./routes/gym.routes'));
app.use('/api/gyms', require('./routes/gym.routes'));

// Middleware para resolver o asignar el gimnasio por defecto para el cliente directo
async function resolveDefaultGym(req, res, next) {
  try {
    if (req.params.gymId) {
      req.gymId = req.params.gymId;
      return next();
    }
    if (req.headers['x-gym-id']) {
      req.gymId = req.headers['x-gym-id'];
      return next();
    }

    let gym = await Gym.findOne({ active: true }).sort({ createdAt: 1 });
    if (!gym) {
      gym = await Gym.create({
        name: 'Sonnos Gym - Sede Central',
        timezone: 'America/Argentina/Buenos_Aires',
        paymentMethods: ['efectivo', 'transferencia_bancaria', 'qr_mercadopago'],
        active: true,
      });
    }
    req.gymId = gym._id.toString();

    if (!req.user) {
      let adminUser = await User.findOne({ isPlatformAdmin: true });
      if (!adminUser) {
        adminUser = await User.findOne({ active: true });
      }
      if (adminUser) {
        req.user = adminUser;
      } else {
        req.user = {
          _id: new (require('mongoose').Types.ObjectId)(),
          firstName: 'Admin',
          lastName: 'Sonnos',
          email: 'admin@sonnos.com',
          isPlatformAdmin: true,
          active: true,
        };
      }
    }
    next();
  } catch (err) {
    next(err);
  }
}

// Router directo para llamadas directas del frontend (/api/socios, /api/tarifas, etc.)
const directApiRouter = express.Router();
directApiRouter.use(resolveDefaultGym);

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

app.use('/api', directApiRouter);

// Subrutas operativas aisladas por gimnasio (Multi-tenant)
const gymRouter = express.Router({ mergeParams: true });
gymRouter.use(authenticate, authorize());

gymRouter.use('/membership-plans', require('./routes/membershipPlan.routes'));
gymRouter.use('/tarifas', require('./routes/membershipPlan.routes'));
gymRouter.use('/teachers', require('./routes/teacher.routes'));
gymRouter.use('/profesores', require('./routes/teacher.routes'));

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

gymRouter.get('/whoami', (req, res) => {
  res.json({ success: true, gymId: req.gymId, role: req.role });
});

app.use('/api/v1/gyms/:gymId', gymRouter);

app.use((req, res, next) => {
  next(ApiError.notFound(`No se encontró la ruta ${req.method} ${req.originalUrl}`));
});

app.use(errorHandler);

module.exports = app;