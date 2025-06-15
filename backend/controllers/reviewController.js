const db = require("../database/db");

// POST adding review
const addReview = async (req, res) => {
  const userId = req.user.userId;
  const recipeId = req.params.recipeId;
  const { rating, review_text } = req.body;

  // Validate rating (1-5)
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }

  try {
    // Check if the recipe exists
    const recipeResult = await db.query("SELECT 1 FROM recipes WHERE id = $1", [
      recipeId,
    ]);
    if (recipeResult.rowCount === 0) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    // Insert the review
    const query = `
      INSERT INTO reviews (user_id, recipe_id, rating, review_text)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [userId, recipeId, rating, review_text];
    const { rows } = await db.query(query, values);

    res
      .status(201)
      .json({ review: rows[0], message: "Review added successfully." });
  } catch (err) {
    console.error("Error adding review:", err.message);
    res.status(500).json({ message: "Server error while adding review." });
  }
};

// GET all reviews for recipe
const getReviewsForRecipe = async (req, res) => {
  const recipeId = req.params.recipeId;

  try {
    const { rows } = await db.query(
      "SELECT r.id, r.rating, r.review_text, r.created_at, u.username FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.recipe_id = $1",
      [recipeId]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this recipe." });
    }

    res.status(200).json({ reviews: rows });
  } catch (err) {
    console.error("Error fetching reviews:", err.message);
    res.status(500).json({ message: "Server error while fetching reviews." });
  }
};

//PUT updating review (might delete)
const updateReview = async (req, res) => {
  const userId = req.user.userId;
  const recipeId = req.params.recipeId;
  const { rating, review_text } = req.body;

  // Validate rating
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }

  try {
    // Check if the review exists and if it's owned by the user
    const { rows } = await db.query(
      "SELECT id, user_id FROM reviews WHERE user_id = $1 AND recipe_id = $2",
      [userId, recipeId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Review not found." });
    }

    // Update the review
    const updateQuery = `
      UPDATE reviews
      SET rating = $1, review_text = $2
      WHERE id = $3
      RETURNING *;
    `;
    const updatedReview = await db.query(updateQuery, [
      rating,
      review_text,
      rows[0].id,
    ]);

    res.status(200).json({
      review: updatedReview.rows[0],
      message: "Review updated successfully.",
    });
  } catch (err) {
    console.error("Error updating review:", err.message);
    res.status(500).json({ message: "Server error while updating review." });
  }
};

// DELETE review (author or admin)
const deleteReview = async (req, res) => {
  const userId = req.user.userId;
  const role = req.user.role;
  const reviewId = req.params.reviewId;

  if (!reviewId || isNaN(Number(reviewId))) {
    return res.status(400).json({ message: "Invalid review ID." });
  }

  try {
    // Find the review by ID
    const { rows } = await db.query(
      "SELECT user_id FROM reviews WHERE id = $1",
      [reviewId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Review not found." });
    }

    // Allow if admin or author
    if (role === "admin" || rows[0].user_id === userId) {
      await db.query("DELETE FROM reviews WHERE id = $1", [reviewId]);
      return res.status(200).json({ message: "Review deleted successfully." });
    } else {
      return res.status(403).json({ message: "Not authorized." });
    }
  } catch (err) {
    console.error("Error deleting review:", err.message);
    res.status(500).json({ message: "Server error while deleting review." });
  }
};

// GET average rating for a recipe
const getAverageRating = async (req, res) => {
  const { recipeId } = req.params;

  const recipeIdInt = parseInt(recipeId);
  try {
    const result = await db.query(
      'SELECT AVG(rating)::numeric(10,2) AS average_rating FROM reviews WHERE recipe_id = $1',
      [recipeIdInt]
    );



    const averageRating = result.rows[0].average_rating || 0;
    res.status(200).json({ average_rating: parseFloat(averageRating) });
  } catch (err) {
    console.error('Error calculating average rating:', err.message);
    res.status(500).json({ message: 'Server error while calculating average rating.' });
  }
};


module.exports = {
  addReview,
  getReviewsForRecipe,
  updateReview,
  deleteReview,
  getAverageRating
};
