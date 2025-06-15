const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  approveRecipe,
  rejectRecipe,
  getRecipesByStatus,
} = require("../controllers/recipeController");

// Admin moderation routes
router.put("/:id/approve", verifyToken, approveRecipe);
router.put("/:id/reject", verifyToken, rejectRecipe);

// Only logged in users can manipulate recipes
router.post("/", verifyToken, createRecipe);
router.put("/:id", verifyToken, updateRecipe);
router.delete("/:id", verifyToken, deleteRecipe);

// Public routes
router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);
router.get("/filter/status", verifyToken, getRecipesByStatus);

module.exports = router;
