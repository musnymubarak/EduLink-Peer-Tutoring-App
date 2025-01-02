import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import Navbar from "./Navbar";

export default function ExploreSingleCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [showStudentLoginMessage, setShowStudentLoginMessage] = useState(false); // Track if login message should show
  const [showTutorLoginMessage, setShowTutorLoginMessage] = useState(false); // Track if login message should show

  // Fetch course details based on course ID
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/courses/${id}`);
        setCourse(response.data.data);  // Set the fetched course data
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
    <div className="min-h-screen bg-gray-100">
      <Navbar/>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-6 text-blue-600 font-bold hover:underline"
      >
        <IoArrowBack className="mr-2 text-2xl" />
        Back
      </button>

      {/* Banner */}
      {course.thumbnail && (
        <div className="relative">
          <img
            src={course.thumbnail}
            alt={`${course.courseName} banner`}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg flex items-end p-4">
            <h1 className="text-4xl font-bold text-white">{course.courseName}</h1>
          </div>
        </div>
      )}

      {/* Course Details */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        {/* Course Name and Description */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Course Description</h2>
          <p className="text-gray-600">{course.courseDescription || "No description available."}</p>
        </section>

        {/* Category */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Category</h2>
          <p className="text-gray-600">{course.category?.name || "No category available."}</p>
        </section>

        {/* Instructor Details */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Instructor(s)</h2>
          {course.availableInstructors && course.availableInstructors.length > 0 ? (
            course.availableInstructors.map((inst, idx) => (
              <div key={idx} className="mb-4">
                <p className="text-gray-600"><strong>Name:</strong> {inst.firstName} {inst.lastName}</p>
                <p className="text-gray-600"><strong>Email:</strong> {inst.email}</p>
                <p className="text-gray-600"><strong>Experience:</strong> {inst.experience || "Not available"}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No instructor details available.</p>
          )}
        </section>

        {/* Rating and Reviews */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Ratings & Reviews</h2>
          {course.ratingAndReviews && course.ratingAndReviews.length > 0 ? (
            course.ratingAndReviews.map((review, idx) => (
              <div key={idx} className="mb-4">
                <p className="text-gray-600"><strong>Rating:</strong> {review.rating || "No rating provided"}</p>
                <p className="text-gray-600"><strong>Review:</strong> {review.comment || "No review provided"}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No ratings or reviews available.</p>
          )}
        </section>

        {/* Students Enrolled */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Students Enrolled</h2>
          <p className="text-gray-600">{course.studentsEnrolled?.length || "No students enrolled."}</p>
        </section>

        {/* Course Content */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Course Content</h2>
          {course.courseContent && course.courseContent.length > 0 ? (
            course.courseContent.map((content, idx) => (
              <div key={idx} className="mb-4">
                <p className="text-gray-600"><strong>Title:</strong> {content.title}</p>
                <p className="text-gray-600"><strong>Description:</strong> {content.description || "No description available"}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No course content available.</p>
          )}
        </section>

        {/* Tags */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Tags</h2>
          <p className="text-gray-600">{course.tag?.join(", ") || "No tags available."}</p>
        </section>

        {/* Course Status */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Status</h2>
          <p className="text-gray-600">{course.status || "No status available"}</p>
        </section>

        {/* Request Class Button */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleRequestClick}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Request to Class
          </button>
          <button
            onClick={handleEnrollClick}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Enroll as a Tutor
          </button>
        </div>
      </div>

      {/* Login Message */}
      {showStudentLoginMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">You need to be logged in as a Student to request a class.</h2>
            <button
              onClick={() => setShowStudentLoginMessage(false)}
              className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
  
      {showTutorLoginMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">You need to be logged in as a Tutor.</h2>
            <button
              onClick={() => setShowTutorLoginMessage(false)}
              className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
