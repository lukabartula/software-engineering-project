import React, { useState } from 'react';
import { updateUserProfile } from '../api/api';
import '../App.css';

const EditProfileModal = ({ profile, closeModal, refreshProfile }) => {
  const [formData, setFormData] = useState({
    username: profile.username,
    email: profile.email,
    first_name: profile.first_name,
    last_name: profile.last_name,
    dietary_preferences: profile.dietary_preferences.join(', ')
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
          : []
      };

      await updateUserProfile(profile.id, body);  // <--- central API call
      await refreshProfile();
      closeModal();
    } catch (err) {
      console.error(err);
      setError('Failed to update profile.');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Edit Profile</h3>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <label>First Name:</label>
          <input name="first_name" value={formData.first_name} onChange={handleChange} required />

          <label>Last Name:</label>
          <input name="last_name" value={formData.last_name} onChange={handleChange} required />

          <label>Username:</label>
          <input name="username" value={formData.username} onChange={handleChange} required />

          <label>Email:</label>
          <input name="email" value={formData.email} onChange={handleChange} required />

          <label>Dietary Preferences (comma separated):</label>
          <input name="dietary_preferences" value={formData.dietary_preferences} onChange={handleChange} />

          <div className="modal-buttons">
            <button type="submit">Save Changes</button>
            <button type="button" onClick={closeModal}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
