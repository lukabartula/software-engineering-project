import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const EditProfileModal = ({ profile, closeModal, refreshProfile }) => {
  const [formData, setFormData] = useState({
    username: profile.username,
    email: profile.email,
    first_name: profile.first_name,
    last_name: profile.last_name,
    dietary_preferences: profile.dietary_preferences.join(', '),
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const dietary_preferences_array = formData.dietary_preferences.split(',').map(p => p.trim());
      
      await axios.put(
        `http://localhost:5000/api/users/${profile.id}`,
        { ...formData, dietary_preferences: dietary_preferences_array },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Profile updated successfully.');
      refreshProfile();
      closeModal(); // Close after successful update
    } catch (err) {
      console.error(err);
      setError('Failed to update profile.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Edit Profile</h3>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>First Name:</label>
            <input name="first_name" value={formData.first_name} onChange={handleChange} className="form-input" />
          </div>

          <div className="form-group">
            <label>Last Name:</label>
            <input name="last_name" value={formData.last_name} onChange={handleChange} className="form-input" />
          </div>

          <div className="form-group">
            <label>Username:</label>
            <input name="username" value={formData.username} onChange={handleChange} className="form-input" />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input name="email" value={formData.email} onChange={handleChange} className="form-input" />
          </div>

          <div className="form-group">
            <label>Dietary Preferences (comma separated):</label>
            <input name="dietary_preferences" value={formData.dietary_preferences} onChange={handleChange} className="form-input" />
          </div>

          <button type="submit" className="login-button">Save Changes</button>
          <button type="button" className="cancel-button" onClick={closeModal}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
