import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Sidebar from "../Sidebar";

export default function TAddCourses() {
  const [formData, setFormData] = useState({
    courseName: "",
    category: "",
    courseDescription: "",
    whatYouWillLearn: "",
    thumbnail: "",
    tag: "",
    instructions: "",
    status: "Draft",
  });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      if (!token) {
        setMessage({ type: "error", text: "Authentication token is missing. Please log in." });
        return;
      }

      // Decode the token payload to get the userId
      const base64Url = token.split(".")[1]; // Extract the payload part of the JWT
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Replace URL-safe characters
      const payload = JSON.parse(atob(base64)); // Decode Base64 and parse JSON
      const userId = payload.id; // Extract the userId (adjust if your payload uses a different key)

      const response = await axios.post(
        "http://localhost:4000/api/v1/courses/add",
        { ...formData, tutor: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        }
      );

      if (response.status === 201) {
        setMessage({ type: "success", text: "Course added successfully!" });
        setFormData({
          courseName: "",
          category: "",
          courseDescription: "",
          whatYouWillLearn: "",
          thumbnail: "",
          tag: "",
          instructions: "",
          status: "Draft",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = error.response?.data?.message || "An error occurred.";
      setMessage({ type: "error", text: errorMessage });
    }
  };

  const handleRedirect = () => {
    // Redirect to the AddSection page
    navigate("/dashboard/tutor/add-section"); // Adjust the route if necessary
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Add New Course</h1>

        {/* Feedback Message */}
        {message && (
          <div
            className={`p-4 mb-4 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          {/* Course Name */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Course Name</label>
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Description</label>
            <textarea
              name="courseDescription"
              value={formData.courseDescription}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* What You Will Learn */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">What You Will Learn</label>
            <textarea
              name="whatYouWillLearn"
              value={formData.whatYouWillLearn}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Thumbnail URL</label>
            <input
              type="text"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Instructions</label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          <button
            onClick={handleRedirect}
            className="mt-6 px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            Add Sections
          </button>

          {/* Status */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Create Course
          </button>
        </form>



      </div>
    </div>
  );
}
