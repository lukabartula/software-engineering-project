const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const {
  addReview,
  getReviewsForRecipe,
  updateReview,
  deleteReview,
  getAverageRating,
} = require("../controllers/reviewController");

router.get("/:recipeId/average", getAverageRating); // Get average rating for a recipe

// Protected routes (only logged-in users can add, update, or delete reviews)
router.post("/:recipeId", verifyToken, addReview); // Add a review
router.put("/:recipeId", verifyToken, updateReview); // Update a review
router.delete("/:reviewId", verifyToken, deleteReview); // Delete a review

// Public route (anyone can see reviews for a recipe)
router.get("/:recipeId", getReviewsForRecipe); // Get reviews for a recipe

module.exports = router;
