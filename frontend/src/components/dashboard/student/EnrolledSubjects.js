import React, { useState } from "react";
import Sidebar from "../Sidebar";
import axios from "axios";

export default function EnrolledSubjects() {
  const [categories, setCategories] = useState([
    {
      title: "IT Course",
      subjects: [
        { id: '6769192d9cabb6e36fb6e622', title: "C++", description: "Fundamentals of C++", author: "John", likes: 45, rating: 4, progress: 75, feedback: "" },
        { id: '6769192d9cabb6e36fb6e625', title: "Java", description: "OOP Concepts", author: "Smith", likes: 32, rating: 5, progress: 50, feedback: "" },
        { id: '6769192d9cabb6e36fb6e624', title: "HTML", description: "Basic Web", author: "David", likes: 21, rating: 3, progress: 40, feedback: "" },
      ],
    },
    {
      title: "Mathematics Course",
      subjects: [
        { id: '6769192d9cabb6e36fb6e623', title: "Discrete Math", description: "Math Fundamentals", author: "Maya", likes: 54, rating: 2, progress: 80, feedback: "" },
        { id: '6782b3061113d1eafa8c3931', title: "Calculus", description: "Differentiation and Integration", author: "Liam", likes: 40, rating: 4, progress: 60, feedback: "" },
      ],
    },
  ]);

  const [modal, setModal] = useState({
    isOpen: false,
    categoryIndex: null,
    subjectIndex: null,
  });

  const [form, setForm] = useState({
    rating: "",
    feedback: "",
  });

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
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      if (!token) {
        alert("Authentication token is missing. Please log in.");
        return;
      }
  
      // Decode the token payload to get the userId
      const base64Url = token.split(".")[1]; // Extract the payload part of the JWT
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Replace URL-safe characters
      const payload = JSON.parse(atob(base64)); // Decode Base64 and parse JSON
      const userId = payload.id; // Extract the userId (adjust if your payload uses a different key)
  
      const response = await axios.post(
        "http://localhost:4000/api/v1/rating/",
        {
          courseId,
          userId, // Include the userId
          rating: newRating,
          review: newFeedback,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        }
      );
  
      if (response.status === 201 || response.status === 200) {
        alert("Rating and review posted successfully!");
  
        // Update the local state to reflect the changes
        setCategories((prevCategories) => {
          const updatedCategories = [...prevCategories];
          updatedCategories[categoryIndex].subjects[subjectIndex].rating = newRating;
          updatedCategories[categoryIndex].subjects[subjectIndex].feedback = newFeedback;
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
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Enrolled Courses</h1>

        {/* Categories Section */}
        <div className="space-y-8">
          {categories.map((category, categoryIndex) => (
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
                      <strong>Rating:</strong> {"⭐".repeat(subject.rating)}
                    </p>
                    {subject.feedback && (
                      <p className="text-gray-500 text-sm mt-2">
                        <strong>Feedback:</strong> {subject.feedback}
                      </p>
                    )}

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <p className="text-gray-600">Progress</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-500 h-2.5 rounded-full"
                          style={{ width: `${subject.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Rate Button */}
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
          ))}
        </div>
      </div>

      {/* Modal */}
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
