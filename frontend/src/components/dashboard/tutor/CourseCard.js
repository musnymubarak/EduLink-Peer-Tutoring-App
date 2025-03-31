import React, { useState } from 'react';
import '../../css/student/CourseCard.css';

const formatDate = (dateString) => {
    if (!dateString) return 'No date specified';
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }

    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

const CourseCard = ({
    id,
    title,
    type,
    time,
    description,
    studentName,
    participants = [],
    meetLink,
    duration
}) => {
    const [showDetails, setShowDetails] = useState(false);
    
    const formattedDate = formatDate(time);
    const isGroupClass = type === "Group";

    return (
        <div className="course-card">
            <div className="course-header">
                <h3 className="course-title">{title}</h3>
            </div>
            
            <div className="course-meta">
                <p><strong>Time:</strong> {formattedDate}</p>
                <p><strong>Duration:</strong> {duration} minutes</p>
                
                {!isGroupClass && (
                    <p><strong>Student:</strong> {studentName}</p>
                )}
                
                {isGroupClass && participants.length > 0 && (
                    <div className="participants-section">
                        <p>
                          <strong>Participants ({participants.length}):</strong>
                          {(<ul className="participants-list">
                              {participants.map(participant => (
                                <li key={participant.id}>
                                  {participant.name}
                                </li>
                          ))}
                          </ul>
                          )}
                        </p>
                        {showDetails && (
                            <ul className="participants-list">
                                {participants.map(participant => (
                                    <li key={participant.id}>
                                        {participant.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
                
                {isGroupClass && participants.length === 0 && (
                    <p><strong>Participants:</strong> No participants yet</p>
                )}
            </div>
            
            <div className="course-actions">
                {meetLink && (
                    <a 
                        href={meetLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="meet-link"
                    >
                        Join Class
                    </a>
                )}
            </div>
        </div>
    );
};

export default CourseCard;