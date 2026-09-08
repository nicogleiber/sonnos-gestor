const { ROLES } = require('./roles');

const PERMISSIONS = Object.freeze({
  MANAGE_MEMBERS: 'manage_members',
  MANAGE_CLASSES: 'manage_classes',
  REGISTER_SALES: 'register_sales',
  MANAGE_CASH_MOVEMENTS: 'manage_cash_movements',
  CLOSE_CASH_REGISTER: 'close_cash_register',
  VIEW_FINANCIAL_REPORTS: 'view_financial_reports',
  MANAGE_MEMBERSHIP_PLANS: 'manage_membership_plans',
  MANAGE_STAFF: 'manage_staff',
  MANAGE_GYM_SETTINGS: 'manage_gym_settings',
});

const ALL_PERMISSIONS = Object.values(PERMISSIONS);

// Matriz de la Fase 1 (G.1), traducida a código. Un solo lugar para ajustar
// quién puede qué — cuando quieras mover un casillero, es acá y en ningún otro lado.
const ROLE_PERMISSIONS = {
  [ROLES.OWNER]: ALL_PERMISSIONS,
  [ROLES.ADMIN]: ALL_PERMISSIONS.filter((p) => p !== PERMISSIONS.MANAGE_GYM_SETTINGS),
  [ROLES.MANAGER]: [
    PERMISSIONS.MANAGE_MEMBERS,
    PERMISSIONS.MANAGE_CLASSES,
    PERMISSIONS.REGISTER_SALES,
    PERMISSIONS.MANAGE_CASH_MOVEMENTS,
    PERMISSIONS.CLOSE_CASH_REGISTER,
  ],
  [ROLES.STAFF]: [
    PERMISSIONS.MANAGE_MEMBERS,
    PERMISSIONS.REGISTER_SALES,
    PERMISSIONS.MANAGE_CASH_MOVEMENTS,
  ],
  [ROLES.TEACHER]: [],
};

function hasPermission(role, permission) {
  return (ROLE_PERMISSIONS[role] || []).includes(permission);
}

module.exports = { PERMISSIONS, ROLE_PERMISSIONS, hasPermission };