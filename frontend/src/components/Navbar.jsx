import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './Auth/AuthContext';
import '../App.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src="/logo-no-bg.svg" alt="Dessert Delight" className="navbar-logo-img" />
        </Link>
      </div>

      <div className="navbar-center">
        <Link to="/">HOME</Link>
        <Link to="/recipes">RECIPES</Link>
        <Link to="/about">ABOUT US</Link>
        {user && <Link to="/create-recipe">CREATE RECIPE</Link>}
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <Link to="/profile">PROFILE</Link>
            <button onClick={handleLogout} className="logout-button">LOGOUT</button>
          </>
        ) : (
          <>
            <Link to="/login">LOGIN</Link>
            <Link to="/register">REGISTER</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
