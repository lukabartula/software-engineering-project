import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../components/Auth/AuthContext';
import { getRecipesByStatus, approveRecipe, rejectRecipe, getAllUsers, deleteUser } from '../api/api';

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('pending');
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch recipes by status when tab changes
  useEffect(() => {
    const fetchRecipes = async () => {
      if (activeTab === 'users') return; // skip if in user tab
      try {
        const response = await getRecipesByStatus(activeTab);
        setRecipes(response.data.recipes);
      } catch (err) {
        console.error('Error fetching recipes:', err);
      }
    };

    fetchRecipes();
  }, [activeTab]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      if (activeTab !== 'users') return;
      try {
        const response = await getAllUsers();
        setUsers(response.data.users);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, [activeTab]);

  const handleApprove = async (id) => {
    try {
      await approveRecipe(id);
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
    } catch (err) {
      console.error('Error approving recipe:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectRecipe(id);
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
    } catch (err) {
      console.error('Error rejecting recipe:', err);
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <div className="tabs">
        <button onClick={() => setActiveTab('pending')} className={activeTab === 'pending' ? 'active' : ''}>Pending Recipes</button>
        <button onClick={() => setActiveTab('published')} className={activeTab === 'published' ? 'active' : ''}>Published Recipes</button>
        <button onClick={() => setActiveTab('rejected')} className={activeTab === 'rejected' ? 'active' : ''}>Rejected Recipes</button>
        <button onClick={() => setActiveTab('users')} className={activeTab === 'users' ? 'active' : ''}>Users</button>
      </div>

      {/* Recipes Section */}
      {activeTab !== 'users' && (
        <div>
          {recipes.length === 0 ? (
            <p>No recipes found.</p>
          ) : (
            <ul>
              {recipes.map(recipe => (
                <li key={recipe.id}>
                  <h3>{recipe.title}</h3>
                  {activeTab === 'pending' && (
                    <>
                      <button onClick={() => handleApprove(recipe.id)}>Approve</button>
                      <button onClick={() => handleReject(recipe.id)}>Reject</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Users Section */}
      {activeTab === 'users' && (
        <div>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
