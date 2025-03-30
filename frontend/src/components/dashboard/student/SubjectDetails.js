import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import Header from "../Header";
import "../../css/student/SubjectDetails.css";

export default function SubjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [tutor, setTutor] = useState(null);
  const [ratingsAndReviews, setRatingsAndReviews] = useState([]);
  const [sections, setSections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClassType, setSelectedClassType] = useState("Group");
  const [availableGroupTimes, setAvailableGroupTimes] = useState([]);
  const [selectedGroupTime, setSelectedGroupTime] = useState("");
  const [formData, setFormData] = useState({
    time: "",
    suggestions: "",
    duration: 60, // Default duration in minutes
  });
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 2;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/courses/${id}`);
        setCourse(response.data.data);
        const tutorId = response.data.data.tutor._id;
        fetchTutor(tutorId);
        fetchSections(id);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    const fetchTutor = async (tutorId) => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/tutor/${tutorId}`);
        setTutor(response.data.data);
      } catch (error) {
        console.error("Error fetching tutor details:", error);
      }
    };

    const fetchSections = async (courseId) => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/sections/course/${courseId}`);
        setSections(response.data.data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    const fetchRatingsAndReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/rating/${id}`);
        setRatingsAndReviews(response.data.data);
      } catch (error) {
        console.error("Error fetching ratings and reviews:", error);
      }
    };

    const checkEnrollment = async () => {
      try {
        setIsCheckingEnrollment(true);
        const response = await axios.get("http://localhost:4000/api/v1/profile/student", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const userCourses = response.data.courses.map((course) => course._id || course.$oid);
        setIsEnrolled(userCourses.includes(id));
      } catch (error) {
        console.error("Error checking enrollment status:", error);
      } finally {
        setIsCheckingEnrollment(false);
      }
    };

    fetchCourse();
    fetchRatingsAndReviews();
    checkEnrollment();
  }, [id]);

  const handleEnroll = async () => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/v1/enrollment/enroll/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Enrolled successfully!");
      setIsEnrolled(true);
    } catch (error) {
      console.error("Error enrolling:", error.response?.data || error);
      alert(error.response?.data?.message || "An error occurred.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formatDateTimeForServer = (dateTimeString) => {
    const dateObj = new Date(dateTimeString);
    if (isNaN(dateObj.getTime())) {
      return null;
    }
    return dateObj.toISOString();
  };

  const fetchAvailableGroupTimes = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/v1/classes/available-group-times/${id}`);
      setAvailableGroupTimes(response.data.data);
    } catch (error) {
      console.error("Error fetching available group times:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    let payload;
    if (selectedClassType === "Group") {
      if (!selectedGroupTime) {
        setError("Please select a group class time.");
        setIsSubmitting(false);
        return;
      }
      payload = {
        type: selectedClassType,
        time: selectedGroupTime,
        duration: formData.duration, // Include duration
        suggestions: formData.suggestions,
      };
    } else {
      const formattedTime = formatDateTimeForServer(formData.time);
      if (!formattedTime) {
        setError("Please enter a valid date and time (YYYY-MM-DD HH:MM)");
        setIsSubmitting(false);
        return;
      }
      payload = {
        type: selectedClassType,
        time: formattedTime,
        duration: formData.duration, // Include duration
        suggestions: formData.suggestions,
      };
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/api/v1/classes/send-request/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Class request sent successfully!");
      setIsModalOpen(false);
      setFormData({ time: "", suggestions: "", duration: 60 }); // Reset form data
      setSelectedGroupTime("");
    } catch (error) {
      console.error("Error sending class request:", error.response?.data || error);
      setError(error.response?.data?.error || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate pagination for reviews
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = ratingsAndReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(ratingsAndReviews.length / reviewsPerPage);

  // Navigation handlers for pagination
  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  if (!course) {
    return (
      <div className="subject-details-container">
        <Header />
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading course details...</p>
        </div>
      </div>
    );
  }

  const category = course.category?.name || "Uncategorized";

  return (
    <div className="subject-details-container">
      <Header />
      <button
        onClick={() => navigate(-1)}
        className="back-button"
      >
        <IoArrowBack className="back-icon" />
        Back
      </button>

      <div className="thumbnail-container">
        <img
          src={course.thumbnail || "https://via.placeholder.com/800x400?text=No+Image"}
          alt={`${course.courseName} thumbnail`}
          className="thumbnail-image"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/800x400?text=No+Image";
          }}
        />
        <div className="thumbnail-overlay">
          <h1 className="thumbnail-title">{course.courseName}</h1>
        </div>
      </div>

      <div className="content-card">
        <section className="mb-8">
          <h2 className="section-title">Course Description</h2>
          <p className="section-description">{course.courseDescription || "No description available."}</p>
        </section>

        <section className="mb-8">
          <h2 className="section-title">Tutor</h2>
          {tutor ? (
            <div className="tutor-card">
              <h3 className="tutor-name">
                {tutor.firstName} {tutor.lastName}
              </h3>
              <p className="tutor-email"><strong>Email:</strong> {tutor.email}</p>
            </div>
          ) : (
            <p className="section-description">No tutor assigned to this course.</p>
          )}
        </section>

        <section className="mb-8">
          <h2 className="section-title">Course Sections</h2>
          {sections.length > 0 ? (
            <ul className="details-list">
              {sections.map((section) => (
                <li key={section._id} className="section-item" onClick={() => navigate(`/dashboard/student/section/${section._id}`)}>
                  {section.sectionName}
                </li>
              ))}
            </ul>
          ) : (
            <p className="section-description">No sections available for this course.</p>
          )}
        </section>

        <section className="mb-8">
          <h2 className="section-title">Ratings and Reviews</h2>
          <div className="space-y-6">
            {ratingsAndReviews.length > 0 ? (
              <>
                <div className="reviews-grid">
                  {currentReviews.map((review, index) => (
                    <div key={index} className="review-card">
                      <h3 className="reviewer-name">
                        {review.user?.firstName} {review.user?.lastName}
                      </h3>
                      <p className="review-content"><strong>Rating:</strong> {review.rating}</p>
                      <p className="review-content"><strong>Review:</strong> {review.review}</p>
                    </div>
                  ))}
                </div>
                
                {/* Pagination controls */}
                {ratingsAndReviews.length > reviewsPerPage && (
                  <div className="pagination-controls">
                    <button 
                      onClick={goToPrevPage} 
                      disabled={currentPage === 1}
                      className={`pagination-button ${currentPage === 1 ? 'pagination-button-disabled' : ''}`}
                    >
                      Previous
                    </button>
                    <span className="pagination-info">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button 
                      onClick={goToNextPage} 
                      disabled={currentPage === totalPages}
                      className={`pagination-button ${currentPage === totalPages ? 'pagination-button-disabled' : ''}`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="section-description">No ratings or reviews available for this course.</p>
            )}
          </div>
        </section>

        <div className="action-button">
          {isCheckingEnrollment ? (
            <button
              disabled
              className="button"
            >
              Checking Enrollment...
            </button>
          ) : isEnrolled ? (
            <button
              onClick={() => {
                setIsModalOpen(true);
                if (selectedClassType === "Group") {
                  fetchAvailableGroupTimes();
                }
              }}
              className="button button-request"
            >
              Request to Class
            </button>
          ) : (
            <button
              onClick={handleEnroll}
              className="button button-enroll"
            >
              Enroll
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Request Class</h2>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Class Type</label>
                <select
                  value={selectedClassType}
                  onChange={(e) => {
                    setSelectedClassType(e.target.value);
                    if (e.target.value === "Group") {
                      fetchAvailableGroupTimes();
                    }
                  }}
                  className="form-select"
                >
                  <option value="Group">Group</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              {selectedClassType === "Group" ? (
                <div className="form-group">
                  <label className="form-label">Available Group Class Times</label>
                  <select
                    value={selectedGroupTime}
                    onChange={(e) => setSelectedGroupTime(e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="">Select a time</option>
                    {availableGroupTimes.map((time) => (
                      <option key={time} value={time}>
                        {new Date(time).toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label" htmlFor="time">Preferred Time</label>
                  <input
                    type="datetime-local"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                  <p className="help-text">
                    Please select a date and time for your session (30-minute intervals).
                  </p>
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="duration">Duration (minutes)</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="form-input"
                  min="30"
                  step="30"
                  required
                />
                <p className="help-text">
                  Please enter the duration of the session in minutes (minimum 30 minutes).
                </p>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="suggestions">Suggestions</label>
                <textarea
                  id="suggestions"
                  name="suggestions"
                  value={formData.suggestions}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Any specific topics you want to cover in this session?"
                  rows={4}
                  required
                ></textarea>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="button button-cancel"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`button button-submit ${isSubmitting ? 'opacity-50' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
