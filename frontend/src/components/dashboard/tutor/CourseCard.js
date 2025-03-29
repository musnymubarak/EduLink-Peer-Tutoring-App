import React from 'react';
import './CourseCard.css'; // Assuming a CSS file for styling

const CourseCard = ({ title, description, studentName, meetLink }) => {
  return (
    <div className="course-card">
      <h3 className="course-title">{title}</h3>
      <p className="course-description">{description}</p>
      <p className="student-name">Student: {studentName}</p>
      {meetLink && (
        <a href={meetLink} target="_blank" rel="noopener noreferrer" className="meet-link">
          Join Meeting
        </a>
      )}
    </div>
  );
};

export default CourseCard;
