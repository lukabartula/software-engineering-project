import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-links">
        <Link to="/about">About Us</Link> | 
        <Link to="/recipes" style={{ marginLeft: '10px' }}>Browse Recipes</Link>
      </div>
      <p>&copy; {new Date().getFullYear()} Dessert Delight. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
