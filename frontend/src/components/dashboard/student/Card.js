// Card.js
import React from "react";

const Card = ({ title, description, author, likes, rating }) => {
  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <p>{description}</p>
      <p><strong>By:</strong> {author}</p>
      <p><strong>Likes:</strong> {likes}</p>
      <p><strong>Rating:</strong> {"⭐".repeat(rating)}</p>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    margin: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },
};

export default Card;
