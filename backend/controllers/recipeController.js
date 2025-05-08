const db = require('../database/db');

// Create a new recipe
const createRecipe = async (req, res) => {
  const { title, description, category, ingredients, instructions, prep_time, cook_time, image_url, author_id } = req.body;

  if (!title || !ingredients || !instructions || !author_id) {
    return res.status(400).json({ message: 'Title, ingredients, instructions, and author_id are required.' });
  }

  try {
    const query = `
      INSERT INTO recipes (title, description, category, ingredients, instructions, prep_time, cook_time, image_url, author_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const values = [title, description, category, ingredients, instructions, prep_time, cook_time, image_url, author_id];
    const { rows } = await db.query(query, values);
    res.status(201).json({ recipe: rows[0] });
  } catch (err) {
    console.error('Error creating recipe:', err.message);
    res.status(500).json({ message: 'Server error while creating recipe.' });
  }
};

// Get all recipes
const getAllRecipes = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM recipes');
    res.status(200).json({ recipes: rows });
  } catch (err) {
    console.error('Error fetching recipes:', err.message);
    res.status(500).json({ message: 'Server error while fetching recipes.' });
  }
};

// Get a recipe by ID
const getRecipeById = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await db.query('SELECT * FROM recipes WHERE id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    res.status(200).json({ recipe: rows[0] });
  } catch (err) {
    console.error('Error fetching recipe by ID:', err.message);
    res.status(500).json({ message: 'Server error while fetching recipe.' });
  }
};

// Update a recipe
const updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, ingredients, instructions, prep_time, cook_time, image_url } = req.body;

  try {
    // Check ownership
    const { rows: recipe } = await db.query('SELECT author_id FROM recipes WHERE id = $1', [id]);
    if (recipe.length === 0) return res.status(404).json({ message: 'Recipe not found.' });

    if (recipe[0].author_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to update this recipe.' });
    }

    const query = `
      UPDATE recipes
      SET title = $1, description = $2, category = $3, ingredients = $4, instructions = $5, prep_time = $6, cook_time = $7, image_url = $8
      WHERE id = $9
      RETURNING *;
    `;
    const values = [title, description, category, ingredients, instructions, prep_time, cook_time, image_url, id];
    const { rows } = await db.query(query, values);

    res.status(200).json({ recipe: rows[0] });
  } catch (err) {
    console.error('Error updating recipe:', err.message);
    res.status(500).json({ message: 'Server error while updating recipe.' });
  }
};

// Delete a recipe
const deleteRecipe = async (req, res) => {
  const { id } = req.params;

  try {
    // Check ownership
    const { rows: recipe } = await db.query('SELECT author_id FROM recipes WHERE id = $1', [id]);
    if (recipe.length === 0) return res.status(404).json({ message: 'Recipe not found.' });

    if (recipe[0].author_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to delete this recipe.' });
    }

    await db.query('DELETE FROM recipes WHERE id = $1', [id]);
    res.status(200).json({ message: 'Recipe deleted successfully.' });
  } catch (err) {
    console.error('Error deleting recipe:', err.message);
    res.status(500).json({ message: 'Server error while deleting recipe.' });
  }
};

module.exports = { createRecipe, getAllRecipes, getRecipeById, updateRecipe, deleteRecipe };
