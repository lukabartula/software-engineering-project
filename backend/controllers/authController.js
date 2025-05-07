const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

// Register User
const registerUser = async (req, res) => {
  const { first_name, last_name, username, email, dietary_preferences, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required.' });
  }

  try {
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
      INSERT INTO users (first_name, last_name, username, email, dietary_preferences, password)
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id, first_name, last_name, email, dietary_preferences;
    `;
    const result = await db.query(insertQuery, [
        first_name,
        last_name,
        username,
        email,
        dietary_preferences ? `{${dietary_preferences}}` : '{}',
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
    const query = 'SELECT id, username, email, first_name, last_name, password FROM users WHERE username = $1';
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
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, user: { id: user.id, username: user.username, email: user.email, first_name: user.first_name, last_name: user.last_name } });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

module.exports = { registerUser, loginUser };
