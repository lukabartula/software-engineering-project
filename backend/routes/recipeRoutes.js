const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe
} = require('../controllers/recipeController');

// Only logged in users can manipulate recipes
router.post('/', verifyToken, createRecipe);
router.put('/:id', verifyToken, updateRecipe);
router.delete('/:id', verifyToken, deleteRecipe);

// Public routes
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);

module.exports = router;
