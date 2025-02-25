
const express = require('express');
const router = express.Router();
const UsersControllers = require ('../Controllers/Users/users')
const authMiddleware = require('../Controllers/Auth/AuthMiddleware/authMiddleware');
const authorize = require('../Controllers/Auth/AuthMiddleware/AuthorizeMiddleware');


// get All users 
router.get('/',authMiddleware, authorize(['read_users']), UsersControllers.getAllusers);
router.get('/user/:id', authMiddleware, authorize(['read_users']), UsersControllers.getUsersById);
router.post('/', authMiddleware, authorize(['create_users']), UsersControllers.createUser);
router.put('/user/:id',authMiddleware, authorize(['update_users']), UsersControllers.updateUser);
router.delete('/user/:id', authMiddleware, authorize(['delete_users']), UsersControllers.deleteUser);
router.get('/filter',authMiddleware, authorize(['read_users']), UsersControllers.getUsersByFilter);


module.exports = router;
