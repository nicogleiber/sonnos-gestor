const express = require('express');
const membershipPlanController = require('../controllers/membershipPlan.controller');
const {
  createPlanValidator,
  updatePlanValidator,
} = require('../validator/membershipPlan.validator');
const validate = require('../middleware/validate');
const authorize = require('../middleware/authorize');
const { PERMISSIONS } = require('../constants/permissions');

const router = express.Router({ mergeParams: true });

router.get('/', membershipPlanController.getPlans);
router.get('/:id', membershipPlanController.getPlanById);

router.post(
  '/',
  authorize(PERMISSIONS.MANAGE_MEMBERSHIP_PLANS),
  createPlanValidator,
  validate,
  membershipPlanController.createPlan
);

router.put(
  '/:id',
  authorize(PERMISSIONS.MANAGE_MEMBERSHIP_PLANS),
  updatePlanValidator,
  validate,
  membershipPlanController.updatePlan
);

router.delete(
  '/:id',
  authorize(PERMISSIONS.MANAGE_MEMBERSHIP_PLANS),
  membershipPlanController.deletePlan
);

module.exports = router;
