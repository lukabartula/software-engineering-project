import React, { useState } from 'react';

const ReviewForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(initialData.rating || 5);
  const [reviewText, setReviewText] = useState(initialData.reviewText || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      alert("Rating must be between 1 and 5");
      return;
    }
    onSubmit({ rating, reviewText });
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <div>
        <label>Rating (1-5):</label>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          min="1"
          max="5"
        />
      </div>

      <div>
        <label>Review:</label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
      </div>

      <div className="review-buttons">
        <button type="submit">Submit Review</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default ReviewForm;
