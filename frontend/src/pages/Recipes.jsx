import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import '../App.css';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/recipes');
        setRecipes(response.data.recipes);
      } catch (err) {
        console.error(err);
        setError('Failed to load recipes.');
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="recipes-page">
      <h2>All Recipes</h2>
      {error && <p className="error-text">{error}</p>}

      <div className="products-grid">
        {recipes.map((recipe) => (
            <RecipeCard
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                description={recipe.description}
                image_url={recipe.image_url}
            />
        ))}
      </div>
    </div>
  );
};

export default Recipes;
