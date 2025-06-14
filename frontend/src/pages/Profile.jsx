import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../components/Auth/AuthContext';
import EditProfileModal from '../components/EditProfileModal';
import '../App.css';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/users/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(response.data.user);
    } catch (err) {
      console.error(err);
      setError('Failed to load profile.');
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      {error && <p className="error-text">{error}</p>}

      <div className="profile-info">
        <p><strong>First Name:</strong> {profile.first_name}</p>
        <p><strong>Last Name:</strong> {profile.last_name}</p>
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>
        <p><strong>Dietary Preferences:</strong> {profile.dietary_preferences.join(', ')}</p>
      </div>

      <button className="logout-button" onClick={() => setShowModal(true)}>Edit Profile</button>
      <button className="logout-button" onClick={logout}>Logout</button>

      {showModal && (
        <EditProfileModal
          profile={profile}
          closeModal={() => setShowModal(false)}
          refreshProfile={fetchProfile}
        />
      )}
    </div>
  );
};

export default Profile;
