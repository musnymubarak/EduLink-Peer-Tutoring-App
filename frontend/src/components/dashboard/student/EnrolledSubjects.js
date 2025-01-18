import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import axios from "axios";

export default function EnrolledSubjects() {
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState({
    isOpen: false,
    categoryIndex: null,
    subjectIndex: null,
  });
  const [form, setForm] = useState({
    rating: "",
    feedback: "",
  });

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
              title: "Enrolled Courses",
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

  const handleOpenModal = (categoryIndex, subjectIndex) => {
    setModal({ isOpen: true, categoryIndex, subjectIndex });
  };

  const handleCloseModal = () => {
    setModal({ isOpen: false, categoryIndex: null, subjectIndex: null });
    setForm({ rating: "", feedback: "" });
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
                      className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition duration-200"
                      key={subject.id}
                    >
                      <h3 className="text-lg font-semibold text-gray-800">
                        {subject.title}
                      </h3>
                      <p className="text-gray-600">{subject.description}</p>
                      <p className="text-gray-500 text-sm">
                        <strong>By:</strong> {subject.author}
                      </p>
                      <p className="text-gray-500 text-sm">
                        <strong>Likes:</strong> {subject.likes}
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
                        onClick={() => handleOpenModal(categoryIndex, subjectIndex)}
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

      {modal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Provide Feedback
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="rating" className="block text-sm text-gray-600">
                  Rating (1-5):
                </label>
                <input
                  type="number"
                  name="rating"
                  id="rating"
                  min="1"
                  max="5"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="feedback" className="block text-sm text-gray-600">
                  Feedback:
                </label>
                <textarea
                  name="feedback"
                  id="feedback"
                  rows="3"
                  value={form.feedback}
                  onChange={(e) =>
                    setForm({ ...form, feedback: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded p-2"
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white rounded px-4 py-2 mr-2"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded px-4 py-2"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
