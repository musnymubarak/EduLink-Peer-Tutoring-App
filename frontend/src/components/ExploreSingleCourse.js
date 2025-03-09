import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import Navbar from "./Navbar";
import "./css/ExploreSingleCourse.css";

export default function ExploreSingleCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [showStudentLoginMessage, setShowStudentLoginMessage] = useState(false); 
  const [showTutorLoginMessage, setShowTutorLoginMessage] = useState(false); 

  // Fetch course details based on course ID
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/courses/${id}`);
        setCourse(response.data.data);  
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    fetchCourse();

  }, [id]);

  if (!course) {
    return <div className="p-8 text-center text-xl text-gray-700">Course not found!</div>;
  }

  const handleRequestClick = () => {
    setShowStudentLoginMessage(true);
    setTimeout(() => setShowStudentLoginMessage(false), 5000);
  };
  
  const handleEnrollClick = () => {
    setShowTutorLoginMessage(true);
    setTimeout(() => setShowTutorLoginMessage(false), 5000);
  };

  return (
    <div className="course-container">
      <Navbar />
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-6 text-blue-600 font-bold hover:underline"
      >
        <IoArrowBack className="mr-2 text-2xl" />
        Back
      </button>

      {/* Banner */}
      {course.thumbnail && (
        <div className="course-banner">
          <img
            src={course.thumbnail}
            alt={`${course.courseName} banner`}
          />
          <div className="course-banner-overlay">
            <h1 className="course-banner-title">{course.courseName}</h1>
          </div>
        </div>
      )}

      {/* Course Details */}
      <div className="course-details">
        {/* Course Description */}
        <section>
          <h2 className="section-title">Course Description</h2>
          <p className="section-content">{course.courseDescription || "No description available."}</p>
        </section>

        {/* Category */}
        <section>
          <h2 className="section-title">Category</h2>
          <p className="section-content">{course.category?.name || "No category available."}</p>
        </section>

        {/* Instructor Details */}
        <section>
          <h2 className="section-title">Instructor(s)</h2>
          {course.availableInstructors && course.availableInstructors.length > 0 ? (
            course.availableInstructors.map((inst, idx) => (
              <div key={idx}>
                <p className="section-content"><strong>Name:</strong> {inst.firstName} {inst.lastName}</p>
                <p className="section-content"><strong>Email:</strong> {inst.email}</p>
                <p className="section-content"><strong>Experience:</strong> {inst.experience || "Not available"}</p>
              </div>
            ))
          ) : (
            <p className="section-content">No instructor details available.</p>
          )}
        </section>

        {/* Rating and Reviews */}
        <section>
          <h2 className="section-title">Ratings & Reviews</h2>
          {course.ratingAndReviews && course.ratingAndReviews.length > 0 ? (
            course.ratingAndReviews.map((review, idx) => (
              <div key={idx}>
                <p className="section-content"><strong>Rating:</strong> {review.rating || "No rating provided"}</p>
                <p className="section-content"><strong>Review:</strong> {review.comment || "No review provided"}</p>
              </div>
            ))
          ) : (
            <p className="section-content">No ratings or reviews available.</p>
          )}
        </section>

        {/* Students Enrolled */}
        <section>
          <h2 className="section-title">Students Enrolled</h2>
          <p className="section-content">{course.studentsEnrolled?.length || "No students enrolled."}</p>
        </section>

        {/* Course Content */}
        <section>
          <h2 className="section-title">Course Content</h2>
          {course.courseContent && course.courseContent.length > 0 ? (
            course.courseContent.map((content, idx) => (
              <div key={idx}>
                <p className="section-content"><strong>Title:</strong> {content.title}</p>
                <p className="section-content"><strong>Description:</strong> {content.description || "No description available"}</p>
              </div>
            ))
          ) : (
            <p className="section-content">No course content available.</p>
          )}
        </section>

        {/* Tags */}
        <section>
          <h2 className="section-title">Tags</h2>
          <p className="section-content">{course.tag?.join(", ") || "No tags available."}</p>
        </section>

        {/* Course Status */}
        <section>
          <h2 className="section-title">Status</h2>
          <p className="section-content">{course.status || "No status available"}</p>
        </section>

        {/* Request Class Button */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleRequestClick}
            className="button"
          >
            Request to Class
          </button>
          <button
            onClick={handleEnrollClick}
            className="button"
          >
            Enroll as a Tutor
          </button>
        </div>
      </div>

      {/* Login Message Modals */}
      {showStudentLoginMessage && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">You need to be logged in as a Student to request a class.</h2>
            <button
              onClick={() => setShowStudentLoginMessage(false)}
              className="button button-close"
            >
              Close
            </button>
          </div>
        </div>
      )}
  
      {showTutorLoginMessage && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">You need to be logged in as a Tutor.</h2>
            <button
              onClick={() => setShowTutorLoginMessage(false)}
              className="button button-close"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
