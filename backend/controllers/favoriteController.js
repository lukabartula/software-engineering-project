const db = require('../database/db');

//POST Add a recipe to favorites
const addFavorite = async (req, res) => {
  const userId = req.user.userId;
  const recipeId = req.params.recipeId;

  try {
    await db.query(
      'INSERT INTO favorites (user_id, recipe_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, recipeId]
    );
    res.status(200).json({ message: 'Recipe added to favorites' });
  } catch (err) {
    console.error('Error adding favorite:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE remove a recipe from favorites
const removeFavorite = async (req, res) => {
  const userId = req.user.userId;
  const recipeId = req.params.recipeId;

  try {
    await db.query(
      'DELETE FROM favorites WHERE user_id = $1 AND recipe_id = $2',
      [userId, recipeId]
    );
    res.status(200).json({ message: 'Recipe removed from favorites' });
  } catch (err) {
    console.error('Error removing favorite:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET get all favorites for the logged-in user
const getUserFavorites = async (req, res) => {
  const userId = req.user.userId;

  try {
    const query = `
      SELECT r.*
      FROM recipes r
      JOIN favorites f ON r.id = f.recipe_id
      WHERE f.user_id = $1
    `;
    const { rows } = await db.query(query, [userId]);
    res.status(200).json({ favorites: rows });
  } catch (err) {
    console.error('Error fetching favorites:', err.message);
    res.status(500).json({ message: 'Server error while fetching favorites.' });
  }
};

// Check if a recipe is favorited by the current user
const isRecipeFavorited = async (req, res) => {
  const userId = req.user.userId;
  const recipeId = req.params.recipeId;

  try {
    const { rows } = await db.query(
      'SELECT 1 FROM favorites WHERE user_id = $1 AND recipe_id = $2',
      [userId, recipeId]
    );

    const isFavorite = rows.length > 0;
    res.status(200).json({ isFavorite });
  } catch (err) {
    console.error('Error checking favorite:', err.message);
    res.status(500).json({ message: 'Server error while checking favorite status.' });
  }
};

module.exports = { addFavorite, removeFavorite, getUserFavorites, isRecipeFavorited };
