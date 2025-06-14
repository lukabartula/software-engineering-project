import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './Auth/AuthContext';
import '../App.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/logo.png" alt="Dessert Delight" className="navbar-logo-img" />
        <span>Dessert Delight</span>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/about">About Us</Link>

        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <button onClick={logout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
