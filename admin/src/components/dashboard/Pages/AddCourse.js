import React, { useState } from "react";
import axios from "axios";

const AddCourse = () => {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState(""); // State for category input
  const [tags, setTags] = useState(""); // State for tags input
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For error handling
  const [success, setSuccess] = useState(""); // For success message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess("");

    // Get token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    if (!category) {
      setError("Please enter a category.");
      setLoading(false);
      return;
    }

    // Split tags by commas, trim spaces, and filter out empty tags
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag); // Remove any empty strings from the array

    if (tagsArray.length === 0) {
      setError("Please enter at least one tag.");
      setLoading(false);
      return;
    }

    try {
      const courseData = {
        courseName: subject,
        category: category,
        tag: tagsArray, // Send tags as an array
      };

      // Sending POST request to add course
      const response = await axios.post(
        "http://localhost:4000/api/v1/courses/add",
        courseData, // Send course data
        {
          headers: {
            Authorization: `Bearer ${token}`, // Passing token in Authorization header
            "Content-Type": "application/json", // Send as JSON since no file is involved
          },
        }
      );

      if (response.data.success) {
        setSuccess("Course added successfully!");
        setSubject(""); // Reset form
        setCategory(""); // Reset category input
        setTags(""); // Reset tags input
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : "An error occurred.");
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">Add New Course</h1>
              <p className="text-sm text-gray-600">
                Fill in the form below to add a new course.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-md rounded-lg p-6 space-y-4"
            >
              <div className="flex flex-col">
                <label htmlFor="subject" className="text-gray-600 text-sm mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter course name"
                  className="border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>

              {/* Category input field */}
              <div className="flex flex-col">
                <label htmlFor="category" className="text-gray-600 text-sm mb-1">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Enter category"
                  className="border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>

              {/* Tags input field */}
              <div className="flex flex-col">
                <label htmlFor="tags" className="text-gray-600 text-sm mb-1">
                  Tags (separate by commas)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Enter tags separated by commas"
                  className="border border-gray-300 rounded-lg p-2"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              {success && (
                <p className="text-green-500 text-sm">{success}</p>
              )}

              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                disabled={loading} // Disable button when loading
              >
                {loading ? "Adding..." : "Add Course"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddCourse;
