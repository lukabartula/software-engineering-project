import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { loginUser } from '../../api/api'; 
import '../../App.css';  // Import global styles

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ username, password });  // <-- Use centralized function

      const { token, user } = response.data;
      login(token, user);   // <-- order corrected for AuthContext
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src="/logo-no-bg.svg" alt="Dessert Delight Logo" className="login-logo" />

        <h2>Login to Dessert Delight</h2>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>
        <p>Don't have an account? </p>
        <a href="/register" className="register-link">Register here</a>
      </div>
    </div>
  );
};

export default Login;
