import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../components/Auth/AuthContext'; 

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [pendingRecipes, setPendingRecipes] = useState([]);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/recipes/filter/status?status=pending', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPendingRecipes(response.data.recipes);
      } catch (err) {
        console.error('Error fetching pending recipes:', err);
      }
    };

    fetchPending();
  }, [token]);

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/recipes/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingRecipes(pendingRecipes.filter(recipe => recipe.id !== id));
    } catch (err) {
      console.error('Error approving recipe:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/recipes/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingRecipes(pendingRecipes.filter(recipe => recipe.id !== id));
    } catch (err) {
      console.error('Error rejecting recipe:', err);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard - Pending Recipes</h2>
      {pendingRecipes.length === 0 ? (
        <p>No pending recipes.</p>
      ) : (
        <ul>
          {pendingRecipes.map(recipe => (
            <li key={recipe.id}>
              <h3>{recipe.title}</h3>
              <button onClick={() => handleApprove(recipe.id)}>Approve</button>
              <button onClick={() => handleReject(recipe.id)}>Reject</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
