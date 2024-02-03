const express = require('express');
const router = express.Router();
const verify_token = require('../controllers/auth_controller').verify_token;


const { signup, login, logout } = require('../controllers/auth_controller');


router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);


module.exports = router;
