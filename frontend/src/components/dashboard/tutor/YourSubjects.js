import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import axios from "axios";
import Header from "../Header";
import Footer from "../Footer";
import EditCourse from "./EditCourse"; // Import the EditCourse component

export default function YourSubjects() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(null); // State to hold the selected course ID
  const [isEditModalOpen, setEditModalOpen] = useState(false); // State to control the edit modal

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Authentication token is missing. Please log in.");
          return;
        }

        // Decode the token to get tutorId
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64));
        const tutorId = payload.id; // Extract tutor ID from token

        const response = await axios.get("http://localhost:4000/api/v1/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          const tutorCourses = response.data.data.filter(course => course.tutor._id.toString() === tutorId);
          setCourses(tutorCourses || []); // Ensure courses is always an array
        } else {
          alert("Failed to load courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        alert("An error occurred while fetching the courses.");
      }
    };

    fetchCourses();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleEditCourse = (courseId) => {
    setSelectedCourseId(courseId); // Set the selected course ID
    setEditModalOpen(true); // Open the edit modal
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false); // Close the edit modal
    setSelectedCourseId(null); // Reset the selected course ID
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Header />
      <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Subjects</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search for a course..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full border text-black border-gray-300 rounded-lg p-3 placeholder-gray-600"
          />
        </div>

        <div className="space-y-8">
          {courses.length === 0 ? (
            <p>No courses available.</p>
          ) : (
            courses
              .filter(
                (course) =>
                  course.courseName.toLowerCase().includes(searchQuery) ||
                  course.courseDescription.toLowerCase().includes(searchQuery)
              )
              .map((course) => (
                <div key={course._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition duration-200 w-64 max-w-sm">
                  <h3 className="text-lg font-semibold text-gray-800">{course.courseName}</h3>
                  <p className="text-gray-600">{course.courseDescription}</p>
                  <button
                    onClick={() => handleEditCourse(course._id)} // Call handleEditCourse on button click
                    className="mt-4 bg-blue-500 text-white rounded px-4 py-2"
                  >
                    Edit
                  </button>
                </div>
              ))
          )}
        </div>

        {isEditModalOpen && (
          <EditCourse
            courseId={selectedCourseId}
            onClose={handleCloseEditModal}
            onUpdate={() => {
              handleCloseEditModal();
              // Optionally, refresh the course list here
            }}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
