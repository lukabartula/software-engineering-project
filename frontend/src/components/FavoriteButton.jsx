import React, { useState, useEffect, useContext } from 'react';
import { addFavorite, removeFavorite, isRecipeFavorited } from '../api/api';
import { AuthContext } from './Auth/AuthContext';

const FavoriteButton = ({ recipeId }) => {
  const { token } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const response = await isRecipeFavorited(recipeId);
        setIsFavorite(response.data.isFavorite);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) checkFavorite();
  }, [recipeId, token]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavorite(recipeId);
      } else {
        await addFavorite(recipeId);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={toggleFavorite} className="favorite-button">
      {isFavorite ? '❤️' : '🤍'}
    </button>
  );
};

export default FavoriteButton;
