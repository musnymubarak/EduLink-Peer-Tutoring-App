import React, { useState, useEffect } from "react";
import RatingModal from "./RatingModal";
import ReportModal from "./ReportModel"; // Import the new ReportModal component
import Sidebar from "../Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import "../../css/student/EnrolledSubject.css";

export default function EnrolledSubjects() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingModal, setRatingModal] = useState({
    isOpen: false,
    categoryIndex: null,
    subjectIndex: null,
  });
  const [reportModal, setReportModal] = useState({
    isOpen: false,
    courseId: null,
  });
  const [rating, setRating] = useState("");
  const [feedback, setFeedback] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Authentication token is missing. Please log in.");
          return;
        }

        const response = await axios.get(
          "http://localhost:4000/api/v1/enrollment/enrolled-courses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          setCategories([
            {
              subjects: response.data.data.map((course) => ({
                id: course.courseId,
                title: course.courseName,
                description: course.courseDescription,
                author: `${course.tutor.firstName} ${course.tutor.lastName}`,
                rating: course.averageRating || 0,
              })),
            },
          ]);
        } else {
          alert("Failed to load enrolled courses");
        }
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        alert("An error occurred while fetching the courses.");
      }
    };

    fetchEnrolledCourses();
  }, []);

  const handleUnenroll = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication token is missing. Please log in.");
        return;
      }

      const response = await axios.post(
        `http://localhost:4000/api/v1/enrollment/unenroll/${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert("Successfully unenrolled from the course.");
        setCategories((prevCategories) => {
          return prevCategories.map((category) => ({
            ...category,
            subjects: category.subjects.filter((subject) => subject.id !== courseId),
          }));
        });
      }
    } catch (error) {
      console.error("Error unenrolling from course:", error);
      alert("Failed to unenroll from the course.");
    }
  };
  const handleRatingSubmit = async (event) => {
    event.preventDefault();
    
    // Validate inputs
    if (!rating) {
      alert("Please select a rating");
      return;
    }
    
    // API expects "review" field, so ensure it's not empty
    if (!feedback) {
      alert("Please provide a review");
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication token is missing. Please log in.");
        return;
      }
      
      // Get the course ID from the selected subject
      const courseId = categories[ratingModal.categoryIndex].subjects[ratingModal.subjectIndex].id;
      
      // Prepare payload with the correct field names
      const payload = {
        rating: parseInt(rating),
        review: feedback  // Change from "feedback" to "review"
      };
      
      console.log("Submitting rating with payload:", payload);
      
      const response = await axios.post(
        `http://localhost:4000/api/v1/rating/${courseId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        alert("Rating submitted successfully");
        // Update the local state to reflect the new rating
        setCategories(prevCategories => {
          const newCategories = [...prevCategories];
          const subject = newCategories[ratingModal.categoryIndex].subjects[ratingModal.subjectIndex];
          subject.rating = parseInt(rating); // Update the rating
          return newCategories;
        });
        
        // Close the modal and reset form
        setRatingModal({ isOpen: false, categoryIndex: null, subjectIndex: null });
        setRating("");
        setFeedback("");
      } else {
        alert(`Failed to submit rating: ${response.data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      // Show more detailed error information
      if (error.response) {
        console.log("Error response data:", error.response.data);
        alert(`Rating submission failed: ${error.response.data.message || error.response.statusText}`);
      } else {
        alert("An error occurred while submitting your rating");
      }
    }
  };

  return (
    <>
      <div className="enrolled-subjects-container pb-20 pt-20">
        <Header />
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="main-content">
          <h1 className="page-title">Enrolled Courses</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for a course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              className="search-input"
            />
          </div>
          <div className="categories-container">
            {categories.length === 0 ? (
              <p>No enrolled courses available.</p>
            ) : (
              categories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <div className="subjects-grid">
                    {category.subjects
                      .filter(subject => 
                        subject.title.toLowerCase().includes(searchQuery) || 
                        subject.description.toLowerCase().includes(searchQuery) ||
                        subject.author.toLowerCase().includes(searchQuery)
                      )
                      .map((subject, subjectIndex) => (
                        <div className="subject-card" key={subject.id}>
                          <h3 className="subject-title">{subject.title}</h3>
                          <p className="subject-description">{subject.description}</p>
                          <p className="subject-author">
                            <strong>By:</strong> {subject.author}
                          </p>
                          <p className="subject-rating">
                            <strong>Rating:</strong> {"⭐".repeat(Math.min(subject.rating, 5))}
                          </p>
                          <button
                            className="rate-button"
                            onClick={() => setRatingModal({ isOpen: true, categoryIndex, subjectIndex })}
                          >
                            Rate
                          </button>
                          <button
                            className="unenroll-button"
                            onClick={() => handleUnenroll(subject.id)}
                          >
                            Unenroll
                          </button>
                          <button
                            className="report-button"
                            onClick={() => setReportModal({ isOpen: true, courseId: subject.id })}
                          >
                            Report
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <RatingModal
          isOpen={ratingModal.isOpen}
          onClose={() => setRatingModal({ isOpen: false, categoryIndex: null, subjectIndex: null })}
          rating={rating}
          setRating={setRating}
          feedback={feedback}
          setFeedback={setFeedback}
          onSubmit={handleRatingSubmit}
        />
        <ReportModal
          isOpen={reportModal.isOpen}
          onClose={() => setReportModal({ isOpen: false, courseId: null })}
          courseId={reportModal.courseId}
        />
        <Footer />
      </div>
    </>
  );
}