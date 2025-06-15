import React, { useEffect, useState } from 'react';
import { getFavorites, removeFavorite } from '../api/api';
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

  const handleRemoveFavorite = async (id) => {
    try {
      await removeFavorite(id);
      setFavorites(prevFavorites => prevFavorites.filter(recipe => recipe.id !== id));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  return (
    <div className="favorites-container">
      <h2>My Favorite Recipes</h2>
      {favorites.length === 0 ? (
        <p>You have no favorite recipes yet.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map(recipe => (
            console.log(recipe),
            <div 
              key={recipe.id} 
              className="favorite-card"
              style={{ cursor: 'pointer' }}
            >
              <div onClick={() => handleRecipeClick(recipe.id)}>
                <h3>{recipe.title}</h3>
                <img src={recipe.image_url} alt={recipe.title} width="200" />
                <p>{recipe.description}</p>
              </div>

              <button 
                onClick={() => handleRemoveFavorite(recipe.id)} 
                className="remove-favorite-button"
              >
                Remove ❌
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
