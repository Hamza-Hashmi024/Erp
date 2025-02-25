const express = require('express');
const router = express.Router();
const AuthController = require('../Controllers/Auth/AuthControllers');
const isAdmin = require('../Controllers/Auth/AuthMiddleware/isAdminMiddleware')


router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);
router.post('/register-admin', isAdmin , AuthController.registerAdmin);

module.exports = router;