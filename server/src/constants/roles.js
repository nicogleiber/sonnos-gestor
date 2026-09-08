const ROLES = Object.freeze({
    OWNER: 'owner',
    ADMIN: 'admin',
    MANAGER: 'manager',
    STAFF: 'staff',
    TEACHER: 'teacher',
});

const GYM_STAFF_ROLES = Object.values(ROLES);

module.exports = { ROLES, GYM_STAFF_ROLES };