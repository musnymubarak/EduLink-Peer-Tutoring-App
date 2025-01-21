import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function EnrolledSubjects() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Added search state
  const [modal, setModal] = useState({
    isOpen: false,
    categoryIndex: null,
    subjectIndex: null,
  });
  const [form, setForm] = useState({
    rating: "",
    feedback: "",
  });

  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        if (!token) {
          alert("Authentication token is missing. Please log in.");
          return;
        }

        const response = await axios.get(
          "http://localhost:4000/api/v1/enrollment/enrolled-courses",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add token in headers
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
                rating: course.averageRating || 0, // Ensure it's always a number
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
    navigate(`/dashboard/student/subject/${courseId}`); // Redirect to the course page
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
    <div className="flex min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Enrolled Courses</h1>

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
          {categories.length === 0 ? (
            <p>No enrolled courses available.</p>
          ) : (
            categories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-2xl font-semibold text-richblue-700 mb-4">
                  {category.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.subjects.map((subject, subjectIndex) => (
                    <div
                      className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition duration-200 cursor-pointer"
                      key={subject.id}
                      onClick={() => handleNavigateToCourse(subject.id)} // Add click handler
                    >
                      <h3 className="text-lg font-semibold text-gray-800">
                        {subject.title}
                      </h3>
                      <p className="text-gray-600">{subject.description}</p>
                      <p className="text-gray-500 text-sm">
                        <strong>By:</strong> {subject.author}
                      </p>
                      <p className="text-yellow-500">
                        <strong>Rating:</strong>{" "}
                        {"⭐".repeat(Math.min(subject.rating, 5))}
                      </p>
                      {subject.feedback && (
                        <p className="text-gray-500 text-sm mt-2">
                          <strong>Feedback:</strong> {subject.feedback}
                        </p>
                      )}

                      <div className="mt-4">
                        <p className="text-gray-600">Progress</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-500 h-2.5 rounded-full"
                            style={{ width: `${subject.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <button
                        className="mt-4 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent click bubbling to parent
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
    </div>
  );
}
