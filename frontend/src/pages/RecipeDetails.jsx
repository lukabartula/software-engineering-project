import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getAverageRating, getRecipeById, isFavorite, addFavorite, removeFavorite } from "../api/api";
import ReviewSection from "../components/ReviewSection";
import { AuthContext } from "../components/Auth/AuthContext";
import "../App.css";

const RecipeDetails = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);

  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await getRecipeById(id);
        setRecipe(response.data.recipe);
      } catch (err) {
        console.error(err);
        setError("Failed to load recipe.");
      }
    };

    fetchRecipe();
  }, [id]);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await getAverageRating(id);
        setAverageRating(response.data.average_rating);
      } catch (err) {
        console.error(err);
        setAverageRating(0);
      }
    };

    if (id) {
      fetchAverageRating();
    }
  }, [id]);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        if (token) {
          const response = await isFavorite(id);
          setFavorited(response.data.isFavorite);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchFavoriteStatus();
  }, [id, token]);

  const toggleFavorite = async () => {
    try {
      if (favorited) {
        await removeFavorite(id);
        setFavorited(false);
      } else {
        await addFavorite(id);
        setFavorited(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (error) return <p className="error-text">{error}</p>;
  if (!recipe) return <p>Loading recipe...</p>;

  return (
    <div className="recipe-details-container">
      <h2>{recipe.title}</h2>
      <img src={recipe.image_url} alt={recipe.title} className="recipe-detail-image" />

      <div className="recipe-meta">
        <p><strong>Category:</strong> {recipe.category}</p>
        <p><strong>Prep Time:</strong> {recipe.prep_time} min</p>
        <p><strong>Cook Time:</strong> {recipe.cook_time} min</p>
        <p><strong>Average Rating:</strong> {averageRating > 0 ? `${averageRating} ⭐` : "No ratings yet."}</p>
      </div>

      {/* Favorite Button */}
      {token && (
        <div className="favorite-button-section">
          <button onClick={toggleFavorite} className="favorite-button">
            {favorited ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
          </button>
        </div>
      )}

      <div className="recipe-section">
        <h3>Ingredients:</h3>
        <p>{recipe.ingredients}</p>
      </div>

      <div className="recipe-section">
        <h3>Instructions:</h3>
        <p>{recipe.instructions}</p>
      </div>

      <div className="recipe-section">
        <h3>Reviews:</h3>
        <ReviewSection recipeId={id} />
      </div>
    </div>
  );
};

export default RecipeDetails;
