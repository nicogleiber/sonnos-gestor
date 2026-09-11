'use strict';
const express = require('express');
const paymentController = require('../controllers/payment.controller');
const authorize = require('../middleware/authorize');
const { PERMISSIONS } = require('../constants/permissions');

const router = express.Router({ mergeParams: true });

router.get('/', authorize(PERMISSIONS.VIEW_FINANCIAL_REPORTS), paymentController.getPayments);

module.exports = router;
