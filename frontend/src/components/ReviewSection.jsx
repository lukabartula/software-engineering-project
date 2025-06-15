import React, { useState, useEffect, useContext } from 'react';
import ReviewForm from './ReviewForm';
import { AuthContext } from './Auth/AuthContext';
import { getReviews, addReview } from '../api/api';

const ReviewSection = ({ recipeId }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await getReviews(recipeId);
      setReviews(response.data.reviews);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [recipeId]);

  const handleNewReview = async (reviewData) => {
    try {
      await addReview(recipeId, reviewData);
      await fetchReviews();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    }
  };

  return (
    <div className="review-section">
      {error && <p className="error-text">{error}</p>}
      {reviews.length === 0 && <p>No reviews yet. Be the first to write one!</p>}

      {reviews.map((review, index) => (
        <div key={index} className="review-card">
          <p><strong>{review.username}:</strong></p>
          <p>Rating: {review.rating} ⭐</p>
          <p>{review.review_text}</p>
          <p><small>{new Date(review.created_at).toLocaleDateString()}</small></p>
        </div>
      ))}

      {user && !showForm && (
        <button onClick={() => setShowForm(true)}>Add Review</button>
      )}

      {showForm && (
        <ReviewForm onSubmit={handleNewReview} onCancel={() => setShowForm(false)} />
      )}
    </div>
  );
};

export default ReviewSection;
