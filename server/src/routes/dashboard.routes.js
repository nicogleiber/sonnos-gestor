'use strict';
const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');

const router = express.Router({ mergeParams: true });

router.get('/', dashboardController.getDashboard);

module.exports = router;
