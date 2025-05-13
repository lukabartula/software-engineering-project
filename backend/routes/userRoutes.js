const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { 
    registerUser, 
    loginUser, 
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    getAllUsers
} = require('../controllers/userController');

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Admin routes
router.get('/all', verifyToken, getAllUsers);

// Protected routes for user profile management
router.get('/:id', verifyToken, getUserProfile);
router.put('/:id', verifyToken, updateUserProfile);
router.delete('/:id', verifyToken, deleteUserProfile);

module.exports = router;