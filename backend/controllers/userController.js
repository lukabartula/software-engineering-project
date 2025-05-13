const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

// Register User
const registerUser = async (req, res) => {
  const { first_name, last_name, username, email, dietary_preferences, role, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required.' });
  }

  const userRole = role ? role : 'user'; // Default role is 'user'

  try {

    console.log('Received Data:', { first_name, last_name, username, email, dietary_preferences, userRole, password });

    // Check for existing user
    const query = 'SELECT id FROM users WHERE email = $1 OR username = $2';
    const { rows } = await db.query(query, [email, username]);
    if (rows.length > 0) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const insertQuery = `
      INSERT INTO users (first_name, last_name, username, email, dietary_preferences, role, password)
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING id, first_name, last_name, email, role, dietary_preferences;
    `;
    const result = await db.query(insertQuery, [
        first_name,
        last_name,
        username,
        email,
        dietary_preferences ? `{${dietary_preferences}}` : "{}",
        userRole,
        hashedPassword
      ]);
      
    const newUser = result.rows[0];
    res.status(201).json({ user: newUser, message: 'User registered successfully.' });

  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const query = 'SELECT id, username, email, first_name, last_name, role, password FROM users WHERE username = $1';
    const { rows } = await db.query(query, [username]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, user: { id: user.id, username: user.username, email: user.email, first_name: user.first_name, last_name: user.last_name } });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  const { id } = req.params;
  const { userId, role } = req.user;

  try {
    if (parseInt(id) !== userId && role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to view this profile.' });
    }

    const { rows } = await db.query('SELECT id, username, email, first_name, last_name, dietary_preferences, role FROM users WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ user: rows[0] });
  } catch (err) {
    console.error('Error fetching user profile:', err.message);
    res.status(500).json({ message: 'Server error while fetching user profile.' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { userId, role } = req.user;
  const { username, email, first_name, last_name, dietary_preferences } = req.body;

  try {
    if (parseInt(id) !== userId && role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to update this profile.' });
    }

    const query = `
      UPDATE users
      SET username = $1, email = $2, first_name = $3, last_name = $4, dietary_preferences = $5
      WHERE id = $6
      RETURNING id, username, email, first_name, last_name, dietary_preferences;
    `;
    const values = [username, email, first_name, last_name, dietary_preferences, id];
    const { rows } = await db.query(query, values);

    res.status(200).json({ user: rows[0] });
  } catch (err) {
    console.error('Error updating user profile:', err.message);
    res.status(500).json({ message: 'Server error while updating profile.' });
  }
};

// Delete user profile
const deleteUserProfile = async (req, res) => {
  const { id } = req.params;
  const { userId, role } = req.user;

  try {
    if (parseInt(id) !== userId && role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to delete this profile.' });
    }

    await db.query('DELETE FROM users WHERE id = $1', [id]);

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Error deleting user profile:', err.message);
    res.status(500).json({ message: 'Server error while deleting profile.' });
  }
};

// Get All Users (Admin Only)
const getAllUsers = async (req, res) => {
  const { role } = req.user;

  // Check if the user is an admin
  if (role !== 'admin') {
    return res.status(403).json({ message: 'You are not authorized to view all users.' });
  }

  try {
    const query = `
      SELECT id, username, email, first_name, last_name, role, dietary_preferences 
      FROM users
    `;
    const { rows } = await db.query(query);
    res.status(200).json({ users: rows });
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
};


module.exports = { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  deleteUserProfile,
  getAllUsers
};
