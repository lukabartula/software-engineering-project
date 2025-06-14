import '../App.css';
import { Link } from 'react-router-dom';

const RecipeCard = ({ id, title, description, image_url }) => {
  return (
    <div className="recipe-card">
      <img src={image_url} alt={title} className="recipe-image" />
      <div className="recipe-info">
        <h3>{title}</h3>
        <p>{description}</p>
        <Link to={`/recipes/${id}`} className="recipe-button">View Recipe</Link>
      </div>
    </div>
  );
};

export default RecipeCard;
