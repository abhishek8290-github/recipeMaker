const express = require('express');
const router = express.Router();

const { makeRecipe} = require('../controllers/recipe_controller');
const verify_token = require('../controllers/auth_controller').verify_token;





router.post('/recipe',verify_token,(req, res) => makeRecipe(req, res));

module.exports = router;
