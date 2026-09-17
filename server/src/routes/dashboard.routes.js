'use strict';
const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');

const router = express.Router({ mergeParams: true });

router.get('/', dashboardController.getDashboard);
router.get('/metricas', dashboardController.getDashboard);

module.exports = router;
