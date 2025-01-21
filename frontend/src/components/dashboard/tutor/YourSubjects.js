import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import axios from "axios";

export default function YourSubjects() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Added search state

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        if (!token) {
          alert("Authentication token is missing. Please log in.");
          return;
        }

        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64));
        const tutorId = payload.id; // Extract tutor ID from token

        const response = await axios.get(
          `http://localhost:4000/api/v1/courses?tutorId=${tutorId}`, // Pass tutorId as a query parameter
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add token in headers
            },
          }
        );

        if (response.data.success) {
          setCourses(response.data.data);
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Subjects</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search for a course by title, description, or author..."
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
              .map((course, index) => (
                <div key={index}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    <div
                      className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition duration-200 cursor-pointer"
                    >
                      <h3 className="text-lg font-semibold text-gray-800">
                        {course.courseName}
                      </h3>
                      <p className="text-gray-600">{course.courseDescription}</p>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
