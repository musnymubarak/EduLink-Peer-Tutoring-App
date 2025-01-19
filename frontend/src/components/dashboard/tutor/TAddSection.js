import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import { useNavigate } from "react-router-dom";

export default function TAddSection() {
  const [sections, setSections] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // Fetch sections for the current user
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        if (!token) {
          setMessage({
            type: "error",
            text: "Authentication token is missing. Please log in.",
          });
          return;
        }

        // Fetch sections from the API
        const response = await axios.get(
          "http://localhost:4000/api/v1/sections/tutor",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Corrected the syntax
            },
          }
        );

        if (response.status === 200) {
          console.log("Fetched sections:", response.data.data); // Debugging the response
          setSections(response.data.data); // Access sections from `data` key
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
        const errorMessage =
          error.response?.data?.message || "An error occurred.";
        setMessage({ type: "error", text: errorMessage });
      }
    };

    fetchSections();
  }, []);

  const handleAddSectionClick = () => {
    navigate("/add-section"); // Redirect to the add-section page
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Sections</h1>

        {/* Feedback Message */}
        {message && (
          <div
            className={`p-4 mb-4 rounded ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Sections List */}
        <div className="space-y-4">
          {sections.length > 0 ? (
            sections.map((section) => (
              <div
                key={section._id}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-bold text-gray-800">
                  {section.sectionName}
                </h2>
                <p className="text-gray-600">{section.description}</p>
                <p className="text-sm text-gray-500">
                  Status: {section.status || "N/A"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No sections found.</p>
          )}
        </div>

        {/* Add Section Button */}
        <button
          onClick={handleAddSectionClick}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none mt-8"
        >
          Add New Section
        </button>
      </div>
    </div>
  );
}
