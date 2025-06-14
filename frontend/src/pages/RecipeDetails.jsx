import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../App.css';

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setRecipe(response.data.recipe);
      } catch (err) {
        console.error(err);
        setError('Failed to load recipe.');
      }
    };

    fetchRecipe();
  }, [id]);

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
      </div>

      <div className="recipe-section">
        <h3>Ingredients:</h3>
        <p>{recipe.ingredients}</p>
      </div>

      <div className="recipe-section">
        <h3>Instructions:</h3>
        <p>{recipe.instructions}</p>
      </div>
    </div>
  );
};

export default RecipeDetails;
