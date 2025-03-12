import React, { useState, useEffect } from "react";
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
  const [form, setForm] = useState({
    rating: "",
    feedback: "",
  });

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
    setForm({ rating: "", feedback: "" });
  };

  const handleNavigateToCourse = (courseId) => {
    navigate(`/dashboard/student/subject/${courseId}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { categoryIndex, subjectIndex } = modal;
    const newRating = parseInt(form.rating, 10);
    const newFeedback = form.feedback;

    const subject = categories[categoryIndex].subjects[subjectIndex];
    const courseId = subject.id;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication token is missing. Please log in.");
        return;
      }

      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));
      const userId = payload.id;

      const response = await axios.post(
        "http://localhost:4000/api/v1/rating/",
        {
          courseId,
          userId,
          rating: newRating,
          review: newFeedback,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        alert("Rating and review posted successfully!");

        setCategories((prevCategories) => {
          const updatedCategories = [...prevCategories];
          updatedCategories[categoryIndex].subjects[subjectIndex].rating =
            newRating;
          updatedCategories[categoryIndex].subjects[subjectIndex].feedback =
            newFeedback;
          return updatedCategories;
        });

        handleCloseModal();
      }
    } catch (error) {
      console.error("Error posting rating and review:", error);
      const errorMessage = error.response?.data?.message || "An error occurred.";
      alert(errorMessage);
    }
  };

  return (
    <div className="enrolled-subjects-container">
      <Header/>
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
                <h2 className="category-title">
                  {category.title}
                </h2>
                <div className="subjects-grid">
                  {category.subjects.map((subject, subjectIndex) => (
                    <div
                      className="subject-card"
                      key={subject.id}
                      onClick={() => handleNavigateToCourse(subject.id)}
                    >
                      <h3 className="subject-title">
                        {subject.title}
                      </h3>
                      <p className="subject-description">{subject.description}</p>
                      <p className="subject-author">
                        <strong>By:</strong> {subject.author}
                      </p>
                      <p className="subject-rating">
                        <strong>Rating:</strong>{" "}
                        {"⭐".repeat(Math.min(subject.rating, 5))}
                      </p>
                      {subject.feedback && (
                        <p className="subject-feedback">
                          <strong>Feedback:</strong> {subject.feedback}
                        </p>
                      )}

                      <div className="progress-container">
                        <p className="progress-label">Progress</p>
                        <div className="progress-bg">
                          <div
                            className="progress-bar"
                            style={{ width: `${subject.progress}%` }}
                          ></div>
                        </div>
                      </div>

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
      <Footer/>
    </div>
  );
}