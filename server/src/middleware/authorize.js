const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const GymStaff = require('../models/gymStaff.model');
const { hasPermission } = require('../constants/permissions');

// Uso: authorize() solo verifica pertenencia al gimnasio.
// authorize(PERMISSIONS.MANAGE_MEMBERS) además exige ese permiso.
function authorize(...requiredPermissions) {
    return catchAsync(async (req, res, next) => {
        const { gymId } = req.params;

        if (!gymId) {
            throw ApiError.badRequest('Falta gymId en la ruta');
        }

        // El platformAdmin puede entrar a cualquier gimnasio (soporte). Queda auditado.
        if (req.user.isPlatformAdmin) {
            console.warn(`[audit] platformAdmin ${req.user.email} accedió al gimnasio ${gymId}`);
            req.gymId = gymId;
            req.role = 'platformAdmin';
            return next();
        }

        // Nunca se confía en el gymId del cliente: se verifica contra la base en cada request.
        const staff = await GymStaff.findOne({ user: req.user._id, gym: gymId, status: 'active' });

        if (!staff) {
            // 404 y no 403: no revelamos que el gimnasio existe a usuarios ajenos (aislamiento multi-tenant).
            throw ApiError.notFound('Gimnasio no encontrado');
        }

        if (requiredPermissions.length > 0) {
            const allowed = requiredPermissions.every((p) => hasPermission(staff.role, p));
            if (!allowed) {
                throw ApiError.forbidden('Tu rol no tiene permiso para esta acción');
            }
        }

        req.gymId = gymId;
        req.role = staff.role;
        req.gymStaff = staff;
        next();
    });
}

module.exports = authorize;