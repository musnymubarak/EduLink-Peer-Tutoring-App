import React from 'react';
import '../../css/student/RatingModal.css'; 

const RatingModal = ({ isOpen, onClose, onSubmit, rating, feedback, setRating, setFeedback }) => {
  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(event);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className=' text-lg'>Rate Course</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Rating:</label>
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="">Select Rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div>
            <label>Feedback:</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback"
            />
          </div>
          <button type="submit" className='bg-blue-600 text-white p-2 rounded'>Submit</button>
          <button type="button" className='bg-blue-600 text-white p-2 rounded' onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
