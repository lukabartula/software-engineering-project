import React, { useState } from 'react';
import { updateUserPassword } from '../../api/api';
import '../../App.css';

const ChangePasswordModal = ({ userId, closeModal }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("userId:", userId);
    console.log("oldPassword:", oldPassword);
    console.log("newPassword:", newPassword);

    if (newPassword.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }

    try {
        await updateUserPassword(userId, { oldPassword, newPassword });
        setSuccess(true);
        setError('');
        setOldPassword('');
        setNewPassword('');
    } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
        setError("Incorrect current password.");
        } else {
        setError("Failed to update password.");
        }
    }
    };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Change Password</h3>
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">Password updated!</p>}

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <label>Current Password:</label>
          <input 
            type="password" 
            value={oldPassword} 
            onChange={(e) => setOldPassword(e.target.value)} 
            required 
          />

          <label>New Password:</label>
          <input 
            type="password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            required 
          />

          <button type="submit" className="login-button">Save</button>
          <button type="button" onClick={closeModal} className="cancel-button">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
