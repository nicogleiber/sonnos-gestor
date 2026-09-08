const express = require('express');
const authController = require('../controllers/auth.controller.js');
const { registerValidator, loginValidator } = require('../validator/auth.validator.js');
const validate = require('../middleware/validate.js');
const authenticate = require('../middleware/authenticate.js');

const router = express.Router();

router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.get('/me', authenticate, authController.me);

module.exports = router;