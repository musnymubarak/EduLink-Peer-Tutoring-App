// Category.js
import React from "react";
import Card from "./Card";

const Category = ({ categoryTitle, subjects }) => {
  return (
    <div style={styles.category}>
      <h2>{categoryTitle}</h2>
      <div style={styles.cardsContainer}>
        {subjects.map((subject, index) => (
          <Card
            key={index}
            title={subject.title}
            description={subject.description}
            author={subject.author}
            likes={subject.likes}
            rating={subject.rating}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  category: {
    margin: "16px 0",
  },
  cardsContainer: {
    display: "flex",
    flexWrap: "wrap",
  },
};

export default Category;
