const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const gymController = require('../controllers/gym.controller');

const router = express.Router();

router.get('/:gymId', authenticate, authorize(), gymController.getGym);

module.exports = router;