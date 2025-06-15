import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { registerUser, loginUser } from '../../api/api';
import '../.././App.css';

const Signup = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    dietary_preferences: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = {
        ...formData,
        dietary_preferences: formData.dietary_preferences
          ? formData.dietary_preferences.split(',').map(pref => pref.trim())
          : [],
      };

      await registerUser(body);  // <-- call centralized register function

      // OPTIONAL: Direct login after registration
      const loginResponse = await loginUser({
        username: formData.username,
        password: formData.password,
      });

      const { token, user } = loginResponse.data;
      login(token, user);  // <-- token first, same as AuthContext
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Registration failed. Make sure username/email are unique.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Register</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
            <div className="form-row">
                <div className="form-group half-width">
                    <label>First Name:</label>
                    <input name="first_name" value={formData.first_name} onChange={handleChange} required className="form-input" />
                </div>

                <div className="form-group half-width">
                    <label>Last Name:</label>
                    <input name="last_name" value={formData.last_name} onChange={handleChange} required className="form-input" />
                </div>
            </div>

          <div className="form-group">
            <label>Username:</label>
            <input name="username" value={formData.username} onChange={handleChange} required className="form-input" />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} required className="form-input" />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} required className="form-input" />
          </div>

          <div className="form-group">
            <label>Dietary Preferences (comma separated):</label>
            <input name="dietary_preferences" value={formData.dietary_preferences} onChange={handleChange} className="form-input" />
          </div>

          <button type="submit" className="login-button">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
