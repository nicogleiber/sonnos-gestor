const express = require('express');
const inventoryController = require('../controllers/inventory.controller');
const authorize = require('../middleware/authorize');
const { PERMISSIONS } = require('../constants/permissions');

const router = express.Router({ mergeParams: true });

router.get(
  '/',
  authorize(PERMISSIONS.REGISTER_SALES),
  inventoryController.getMovements
);

module.exports = router;
