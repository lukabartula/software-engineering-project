const db = require('../database/db');

// Admin approves a recipe
const approveRecipe = async (req, res) => {
  const { id } = req.params;
  const role = req.user.role;

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can approve recipes.' });
  }

  try {
    const { rowCount } = await db.query('UPDATE recipes SET status = $1 WHERE id = $2', ['published', id]);
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }
    res.status(200).json({ message: 'Recipe approved successfully.' });
  } catch (err) {
    console.error('Error approving recipe:', err.message);
    res.status(500).json({ message: 'Server error while approving recipe.' });
  }
};

// Admin rejects a recipe
const rejectRecipe = async (req, res) => {
  const { id } = req.params;
  const role = req.user.role;

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can reject recipes.' });
  }

  try {
    const { rowCount } = await db.query('UPDATE recipes SET status = $1 WHERE id = $2', ['rejected', id]);
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }
    res.status(200).json({ message: 'Recipe rejected successfully.' });
  } catch (err) {
    console.error('Error rejecting recipe:', err.message);
    res.status(500).json({ message: 'Server error while rejecting recipe.' });
  }
};

// Optional: Get all recipes by status (pending, approved, rejected)
const getRecipesByStatus = async (req, res) => {
  const { status } = req.query;

  try {
    const { rows } = await db.query('SELECT * FROM recipes WHERE status = $1', [status]);
    res.status(200).json({ recipes: rows });
  } catch (err) {
    console.error('Error fetching recipes by status:', err.message);
    res.status(500).json({ message: 'Server error while fetching recipes.' });
  }
};

// Create a new recipe
const createRecipe = async (req, res) => {
  const { title, description, category, ingredients, instructions, prep_time, cook_time, image_url } = req.body;
  const author_id = req.user.userId;
  console.log('Creating recipe:', req.body);
  if (!title || !ingredients || !instructions || !author_id) {
    return res.status(400).json({ message: 'Title, ingredients, instructions, and author_id are required.' });
  }

  console.log('Author: ', req.user);

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
    const { rows } = await db.query('SELECT * FROM recipes WHERE status = $1', ['published']);
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

module.exports = { 
  createRecipe, 
  getAllRecipes, 
  getRecipeById, 
  updateRecipe, 
  deleteRecipe,
  approveRecipe,
  rejectRecipe,
  getRecipesByStatus
};
