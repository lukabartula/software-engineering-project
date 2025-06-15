import React, { useEffect, useState } from 'react';
import { getAllRecipes } from '../api/api';  // <-- central API call
import { RecipeCardFactory } from '../components/RecipeCardFactory';
import '../App.css';

const Home = () => {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await getAllRecipes();  // <-- central API function
        const allRecipes = response.data.recipes;

        // Filter recipes by IDs you want as featured
        const featured = allRecipes.filter(recipe =>
          [1, 2, 3].includes(recipe.id)
        );

        setFeaturedRecipes(featured);
      } catch (err) {
        console.error(err);
        setError('Failed to load featured recipes.');
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Dessert Delight 🍰</h1>
          <p>Discover, share, and enjoy the world’s most delicious dessert recipes.</p>
          <a href="/recipes" className="hero-button">Browse Recipes</a>
        </div>
      </section>

      <section className="featured-section">
        <h2>Featured Recipes</h2>
        {error && <p className="error-text">{error}</p>}

        <div className="products-grid">
          {featuredRecipes.map(recipe =>
            RecipeCardFactory('featured', {
              id: recipe.id,
              title: recipe.title,
              description: recipe.description,
              image_url: recipe.image_url
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
