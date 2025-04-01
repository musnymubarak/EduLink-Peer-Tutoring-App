import React from 'react';
import '../../css/student/CourseCard.css'; // Assuming a CSS file for styling

const CourseCard = ({ title, description, tutorName,type,time, meetLink }) => {
  return (
    <div className="course-card">
      <h3 className="course-title">{title}</h3>
      
      <p className="course-type">Type: {type}</p>
      <p className="course-time">Time: {time}</p>
      <p className="student-name">Tutor: {tutorName}</p>
      {meetLink && (
        <a href={meetLink} target="_blank" rel="noopener noreferrer" className="meet-link">
          Join Meeting
        </a>
      )}
    </div>
  );
};

export default CourseCard;
