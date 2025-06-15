import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAverageRating, getRecipeById } from "../api/api";
import ReviewSection from "../components/ReviewSection";
import "../App.css";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");
  const [averageRating, setAverageRating] = useState(0);

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

  if (error) return <p className="error-text">{error}</p>;
  if (!recipe) return <p>Loading recipe...</p>;

  return (
    <div className="recipe-details-container">
      <h2>{recipe.title}</h2>
      <img
        src={recipe.image_url}
        alt={recipe.title}
        className="recipe-detail-image"
      />

      <div className="recipe-meta">
        <p>
          <strong>Category:</strong> {recipe.category}
        </p>
        <p>
          <strong>Prep Time:</strong> {recipe.prep_time} min
        </p>
        <p>
          <strong>Cook Time:</strong> {recipe.cook_time} min
        </p>
        <p>
          <strong>Average Rating:</strong>{" "}
          {averageRating > 0 ? `${averageRating} ⭐` : "No ratings yet."}
        </p>
      </div>

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
