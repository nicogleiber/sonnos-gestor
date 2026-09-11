const express = require('express');
const membershipController = require('../controllers/membership.controller');
const authorize = require('../middleware/authorize');
const { PERMISSIONS } = require('../constants/permissions');

const router = express.Router({ mergeParams: true });

router.get('/', membershipController.getMemberships);
router.get('/:id', membershipController.getMembershipById);

router.post(
  '/',
  authorize(PERMISSIONS.MANAGE_MEMBERS),
  membershipController.createMembership
);

router.post(
  '/renew',
  authorize(PERMISSIONS.MANAGE_MEMBERS),
  membershipController.renewMembership
);

router.delete(
  '/:id',
  authorize(PERMISSIONS.MANAGE_MEMBERS),
  membershipController.cancelMembership
);

module.exports = router;
