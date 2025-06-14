import '../App.css';
import RecipeCard from '../components/RecipeCard';


const Home = () => {
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

    <div className="products-grid">
        <RecipeCard
        title="Chocolate Lava Cake"
        description="A rich and gooey chocolate dessert."
        image_url="https://example.com/lava.jpg"
        />
        <RecipeCard
        title="Vegan Berry Tart"
        description="A colorful tart with fresh berries."
        image_url="https://example.com/tart.jpg"
        />
        <RecipeCard
        title="No-Bake Cheesecake"
        description="Simple cheesecake you can chill instead of bake."
        image_url="https://example.com/cheesecake.jpg"
        />
    </div>
    </section>


    </div>
  );
};

export default Home;
