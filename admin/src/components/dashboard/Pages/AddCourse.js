import React, { useState } from "react";
import Sidebar from "../Sidebar";
import axios from "axios";

const AddCourse = () => {
  const [subject, setSubject] = useState("");
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

    try {
      // Sending POST request to add subject/course
      const response = await axios.post(
        "http://localhost:4000/api/v1/courses/add",
        { courseName: subject }, // Sending subject name as part of request body
        {
          headers: {
            Authorization: `Bearer ${token}`, // Passing token in Authorization header
          },
        }
      );

      setSuccess("Subject added successfully!");
      setSubject(""); // Reset form
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
              <h1 className="text-2xl font-semibold">Add New Subject</h1>
              <p className="text-sm text-gray-600">
                Fill in the form below to add a new subject.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-md rounded-lg p-6 space-y-4"
            >
              <div className="flex flex-col">
                <label htmlFor="subject" className="text-gray-600 text-sm mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter subject name"
                  className="border border-gray-300 rounded-lg p-2"
                  required
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
                {loading ? "Adding..." : "Add Subject"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddCourse;
