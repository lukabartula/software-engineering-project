const jwt = require('jsonwebtoken');
require('dotenv').config;

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(403).json({ message: 'Access denied. No token provided.' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        userId: decoded.userId,
        role: decoded.role
      };
      next();
    } catch (err) {
      res.status(400).json({ message: 'Invalid token.' });
    }
  };
  
  module.exports = verifyToken;  