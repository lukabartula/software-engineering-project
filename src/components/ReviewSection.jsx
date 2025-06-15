import React, { useState, useContext } from "react";
import ReviewForm from "./ReviewForm";
import { AuthContext } from "./Auth/AuthContext";
import { getReviews, addReview, deleteReview } from "../api/api";

const ReviewSection = ({ recipeId }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const error = useState("");
  const [showForm, setShowForm] = useState(false);

    // Function to fetch reviews
  const fetchReviews = async () => {
    try {
      const response = await getReviews(recipeId);
      setReviews(response.data);
      const reviewData = response.data;
      return reviewData;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
      return [];
    }
  };

  // Function to handle new review (e.g., after posting a new review)
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



  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
    } catch (err) {
      alert("Failed to delete review.");
      console.log(err);
    }
  };

  return (
    <div className="review-section">
      {error && <p className="error-text">{error}</p>}
      {reviews.length === 0 && (
        <p>No reviews yet. Be the first to write one!</p>
      )}

      {reviews.map((review) => (
        <div key={review.id} className="review-card">
          <p><strong>{review.username}:</strong></p>
          <p>Rating: {review.rating} ⭐</p>
          <p>{review.review_text}</p>
          <p><small>{new Date(review.created_at).toLocaleDateString()}</small></p>
          {user && (user.username === review.username || user.role === "admin") && (
            <button
              className="delete-review-btn"
              onClick={() => handleDeleteReview(review.id)}
            >
              Delete
            </button>
          )}
        </div>
      ))}

      {user && !showForm && (
        <button onClick={() => setShowForm(true)}>Add Review</button>
      )}

      {showForm && (
        <ReviewForm
          onSubmit={handleNewReview}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default ReviewSection;
