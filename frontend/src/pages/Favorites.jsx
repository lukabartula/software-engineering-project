import React, { useEffect, useState } from 'react';
import { getFavorites } from '../api/api';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await getFavorites();
        setFavorites(response.data.favorites);
      } catch (err) {
        console.error('Failed to load favorites:', err);
      }
    };

    fetchFavorites();
  }, []);

  const handleRecipeClick = (id) => {
    navigate(`/recipes/${id}`);
  };

  return (
    <div className="favorites-container">
      <h2>My Favorite Recipes</h2>
      {favorites.length === 0 ? (
        <p>You have no favorite recipes yet.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map(recipe => (
            <div 
              key={recipe.id} 
              className="favorite-card"
              onClick={() => handleRecipeClick(recipe.id)}
              style={{ cursor: 'pointer' }}
            >
              <h3>{recipe.title}</h3>
              <img src={recipe.image_url} alt={recipe.title} width="200" />
              <p>{recipe.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
