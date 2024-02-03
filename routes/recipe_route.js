const express = require('express');
const router = express.Router();

const { makeRecipe, getRecentRecipe , getFavoriteRecipe , getRecipe, addToFavorites} = require('../controllers/recipe_controller');
const verify_token = require('../controllers/auth_controller').verify_token;





router.post('/make',verify_token,(req, res) => makeRecipe(req, res));
router.get('/recent-recipes', (req, res) => getRecentRecipe(req, res));
router.post('/recent-recipes', (req, res) => getRecentRecipe(req, res));
router.get('/fav-recipes',verify_token, (req, res) => getFavoriteRecipe(req, res));
router.get('/recipe',(req, res) => getRecipe(req, res));
router.post('/favourite/add',verify_token, (req, res) => addToFavorites(req, res));
module.exports = router;
