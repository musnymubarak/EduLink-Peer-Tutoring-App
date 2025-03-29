import React, { useState, useEffect } from "react";
import RatingModal from "./RatingModal"; // Import the new RatingModal component

import Sidebar from "../Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import "../../css/student/EnrolledSubject.css";

export default function EnrolledSubjects() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modal, setModal] = useState({
    isOpen: false,
    categoryIndex: null,
    subjectIndex: null,
  });
  const [rating, setRating] = useState(""); // State for rating input
  const [feedback, setFeedback] = useState(""); // State for feedback input

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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const mappedCategories = [
            {
              subjects: response.data.data.map((course) => ({
                id: course.courseId,
                title: course.courseName,
                description: course.courseDescription,
                author: `${course.tutor.firstName} ${course.tutor.lastName}`,
                rating: course.averageRating || 0,
                feedback: "",
              })),
            },
          ];
          setCategories(mappedCategories);
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleOpenModal = (categoryIndex, subjectIndex) => {
    setModal({ isOpen: true, categoryIndex, subjectIndex });
  };

  const handleCloseModal = () => {
    setModal({ isOpen: false, categoryIndex: null, subjectIndex: null });
    setRating(""); // Reset rating state
    setFeedback(""); // Reset feedback state
  };

  const handleNavigateToCourse = (courseId) => {
    navigate(`/dashboard/student/subject/${courseId}`);
  };

const handleSubmit = async (event) => {
    event.preventDefault();

    const { categoryIndex, subjectIndex } = modal;
    const newRating = parseInt(rating, 10);
    const subject = categories[categoryIndex].subjects[subjectIndex];
    const courseId = subject.id;

    console.log("Submitting rating:", { courseId, rating: newRating, feedback }); // Log the data being sent

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication token is missing. Please log in.");
        return;
      }

      const response = await axios.post(
        `http://localhost:4000/api/v1/rating/${courseId}`,
        {
          rating: newRating,
          review: feedback, // Include feedback in the request

        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (response.status === 201 || response.status === 200) {
        alert("Rating posted successfully!");

        // Update the categories state to reflect the new rating
        setCategories((prevCategories) => {
          const updatedCategories = [...prevCategories];
          updatedCategories[categoryIndex].subjects[subjectIndex].rating = newRating;
          return updatedCategories;
        });

        handleCloseModal(); // Close modal after submission
      }
    } catch (error) {
      console.error("Error posting rating:", error);
      const errorMessage = error.response?.data?.message || "An error occurred.";
      alert(errorMessage);
    }
  };

  return (
    <>
      <div className="enrolled-subjects-container">
        <Header />
        <div className="sidebar-container">
          <Sidebar />
        </div>

        <div className="main-content">
          <h1 className="page-title">Enrolled Courses</h1>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for a course by title, description, or author..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <div className="categories-container">
            {categories.length === 0 ? (
              <p>No enrolled courses available.</p>
            ) : (
              categories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h2 className="category-title">{category.title}</h2>
                  <div className="subjects-grid">
                    {category.subjects.map((subject, subjectIndex) => (
                      <div
                        className="subject-card"
                        key={subject.id}
                        onClick={() => handleNavigateToCourse(subject.id)}
                      >
                        <h3 className="subject-title">{subject.title}</h3>
                        <p className="subject-description">{subject.description}</p>
                        <p className="subject-author">
                          <strong>By:</strong> {subject.author}
                        </p>
                        <p className="subject-rating">
                          <strong>Rating:</strong>{" "}
                          {"⭐".repeat(Math.min(subject.rating, 5))}
                        </p>

                        <button
                          className="rate-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(categoryIndex, subjectIndex);
                          }}
                        >
                          Rate
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
          isOpen={modal.isOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          rating={rating}
          setRating={setRating}
          feedback={feedback}
          setFeedback={setFeedback} // Pass setFeedback to the modal
        />
        <Footer />
      </div>
    </>
  );
}
