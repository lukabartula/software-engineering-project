import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../components/Auth/AuthContext';

const AddRecipe = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    ingredients: '',
    instructions: '',
    prep_time: '',
    cook_time: '',
    image_url: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const dataToSubmit = {
    ...formData,
    prep_time: formData.prep_time ? parseInt(formData.prep_time) : null,
    cook_time: formData.cook_time ? parseInt(formData.cook_time) : null
  };

  console.log("Submitting cleaned data:", dataToSubmit);

  try {
    await axios.post('http://localhost:5000/api/recipes', dataToSubmit, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("Recipe submitted successfully!");
    navigate('/recipes');
  } catch (err) {
    console.error(err);
    alert("Failed to add recipe.");
  }
};


  return (
    <div className="add-recipe-container">
      <h2>Add New Recipe</h2>
      <form onSubmit={handleSubmit}>

        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />

        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />

        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} />

        <textarea name="ingredients" placeholder="Ingredients (comma separated)" value={formData.ingredients} onChange={handleChange} required />

        <textarea name="instructions" placeholder="Instructions" value={formData.instructions} onChange={handleChange} required />

        <input type="number" name="prep_time" placeholder="Prep Time (minutes)" value={formData.prep_time} onChange={handleChange} />

        <input type="number" name="cook_time" placeholder="Cook Time (minutes)" value={formData.cook_time} onChange={handleChange} />

        {/* Image Upload Placeholder */}
        <div className="upload-placeholder">
          <p>Drag & Drop Image Upload (Coming Soon)</p>
          <p>For now, paste image URL manually below:</p>
          <input type="text" name="image_url" placeholder="Image URL" value={formData.image_url} onChange={handleChange} />
        </div>

        <button type="submit">Submit Recipe</button>

      </form>
    </div>
  );
};

export default AddRecipe;
