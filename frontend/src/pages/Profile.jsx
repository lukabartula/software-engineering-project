import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../components/Auth/AuthContext';
import EditProfileModal from '../components/EditProfileModal';
import ChangePasswordModal from '../components/Auth/ChangePasswordModal';
import '../App.css';
import { getUserProfile, deleteUserProfile } from '../api/api';  
import { useNavigate } from 'react-router-dom'; 

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const navigate = useNavigate();  

  const fetchProfile = async () => {
    try {
      const response = await getUserProfile(user.id);
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

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmed) return;

    try {
      setDeleting(true);
      await deleteUserProfile(user.id);
      alert('Account deleted successfully.');
      logout();
    } catch (err) {
      console.error(err);
      alert('Failed to delete account.');
    } finally {
      setDeleting(false);
    }
  };

  if (!profile) return <p>Loading profile...</p>;

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

      {/* Favorites button */}
      <button className="logout-button" onClick={() => navigate('/favorites')}>
        Favorites
      </button>

      <button className="logout-button" onClick={() => setShowModal(true)}>Edit Profile</button>
      <button className="logout-button" onClick={logout}>Logout</button>
      <button className="logout-button" onClick={handleDeleteAccount} disabled={deleting}>
        {deleting ? 'Deleting...' : 'Delete My Account'}
      </button>
      <button className="logout-button" onClick={() => setShowPasswordModal(true)}>Change Password</button>     

      {/* Admin Dashboard Button */}
      {profile.role === 'admin' && (
        <button 
          className="logout-button"
          onClick={() => navigate('/admin')}
        >
          Admin Dashboard
        </button>
      )}

      {showModal && (
        <EditProfileModal
          profile={profile}
          closeModal={() => setShowModal(false)}
          refreshProfile={fetchProfile}
        />
      )}

      {showPasswordModal && (
        <ChangePasswordModal 
          userId={user.id} 
          closeModal={() => setShowPasswordModal(false)} 
        />
      )}
    </div>
  );
};

export default Profile;
