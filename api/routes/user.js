         //express
const express = require('express');
const router = express.Router();
//-----------------------------

const checkAuth = require('../middleware/check-auth');


const UsersController = require('../controllers/users');

router.post('/signup', UsersController.Users_create_user);


router.post('/login', UsersController.Users_login_user);


router.delete('/:userID', checkAuth, UsersController.Users_delete_user);
 module.exports = router;


 