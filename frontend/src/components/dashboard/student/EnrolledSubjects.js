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
                    {category.subjects.map((subject, subjectIndex) => (
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