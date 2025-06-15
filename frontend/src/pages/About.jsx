import "../App.css";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="about-container">
      <section className="about-header">
        <h1>About Dessert Delight</h1>
        <p>
          Bringing you the sweetest recipes from passionate bakers all around
          the world 🍰
        </p>
      </section>

      <section className="about-content">
        <h2>Our Mission</h2>
        <p>
          Dessert Delight was created for dessert lovers who want to discover,
          share, and explore creative recipes. Whether you're a professional
          baker or just someone with a sweet tooth, we provide a platform where
          everyone can contribute and enjoy the art of desserts.
        </p>

        <h2>Our Community</h2>
        <p>
          We are building a community of dessert enthusiasts who inspire each
          other every day with new ideas, innovative techniques, and beautiful
          creations.
        </p>

        <h2>Our Promise</h2>
        <p>
          Quality, simplicity, and joy. We believe desserts should bring
          happiness, and our platform makes discovering and sharing recipes
          simple and fun.
        </p>

        <Link to="/recipes" className="hero-button">
          Browse Recipes
        </Link>
      </section>
    </div>
  );
};

export default About;
