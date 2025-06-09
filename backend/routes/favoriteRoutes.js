const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  isRecipeFavorited
} = require('../controllers/favoriteController');

router.use(verifyToken);

router.post('/:recipeId', addFavorite);      // Add favorite
router.delete('/:recipeId', removeFavorite); // Remove favorite
router.get('/', getUserFavorites);           // Get all favorites
router.get('/:recipeId/check', isRecipeFavorited); // Check if recipe is in favorites

module.exports = router;
