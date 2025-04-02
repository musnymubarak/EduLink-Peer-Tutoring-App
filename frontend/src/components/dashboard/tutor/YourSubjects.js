import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import axios from "axios";
import Header from "../Header";
import Footer from "../Footer";
import EditCourse from "./EditCourse";
import "../../css/tutor/YourSubjects.css";
import { Link } from "react-router-dom";

export default function YourSubjects() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Authentication token is missing. Please log in.");
          return;
        }
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64));
        const tutorId = payload.id;
        console.log(courses)
        const response = await axios.get("http://localhost:4000/api/v1/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          const tutorCourses = response.data.data.filter(course => course.tutor._id.toString() === tutorId);
          setCourses(tutorCourses || []);
        } else {
          alert("Failed to load courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        alert("An error occurred while fetching the courses.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleEditCourse = (courseId) => {
    setSelectedCourseId(courseId);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedCourseId(null);
  };

  if (isLoading) {
    return (
      <div className="your-subjects-container">
        <Header />
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="your-subjects-container">
      <Header />
      <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="page-title">Your Courses</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a course..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="courses-grid">
          {courses.length === 0 ? (
            <div className="no-courses">
              <p className="no-courses-text">No courses available.</p>
            </div>
          ) : (
            courses
              .filter(
                (course) =>
                  course.courseName.toLowerCase().includes(searchQuery) ||
                  course.courseDescription.toLowerCase().includes(searchQuery)
              )
              .map((course) => (
                
                <Link
                        to={`/dashboard/tutor/subject/${course._id}`}
                        //key={i}
                        className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition duration-200"
                      >
                <div key={course._id} className="course-card">
                  <img
                    src={course.thumbnail || "https://via.placeholder.com/400x200?text=No+Image"}
                    alt={course.courseName}
                    className="course-image"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x200?text=No+Image";
                    }}
                  />
                  <div className="course-content">
                    <h3 className="course-title">{course.courseName}</h3>
                    <p className="course-description">{course.courseDescription}</p>
                  </div>
                </div>
                </Link>
              ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
