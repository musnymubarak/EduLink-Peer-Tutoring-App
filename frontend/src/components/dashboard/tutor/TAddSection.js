import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import { useNavigate } from "react-router-dom";

export default function TAddSection() {
  const [sections, setSections] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage({
            type: "error",
            text: "Authentication token is missing. Please log in.",
          });
          return;
        }

        const response = await axios.get(
          "http://localhost:4000/api/v1/sections/tutor",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setSections(response.data.data);
          setFilteredSections(response.data.data);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "An error occurred.";
        setMessage({ type: "error", text: errorMessage });
      }
    };

    fetchSections();
  }, []);

  // Handle section selection
  const handleSelectSection = (sectionId) => {
    setSelectedSection(sectionId);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = sections.filter((section) =>
      section.sectionName.toLowerCase().includes(searchValue)
    );
    setFilteredSections(filtered);
  };

  // Handle confirm button click
  const handleConfirmSelection = () => {
    if (!selectedSection) {
      setMessage({ type: "error", text: "Please select a section first." });
      return;
    }

    localStorage.setItem("selectedSection", JSON.stringify(selectedSection));

    navigate(`/dashboard/tutor/add-course`, {
      state: { sectionId: selectedSection },
    });
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

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search for a section..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
        />

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
          {filteredSections.length > 0 ? (
            filteredSections.map((section) => (
              <div
                key={section._id}
                className={`p-4 rounded-lg shadow-md cursor-pointer ${
                  selectedSection === section._id
                    ? "bg-blue-200 border border-blue-500"
                    : "bg-white"
                }`}
                onClick={() => handleSelectSection(section._id)}
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

        {/* Confirm Button */}
        <button
          onClick={handleConfirmSelection}
          disabled={!selectedSection}
          className={`px-6 py-3 mt-6 font-bold rounded-lg shadow focus:ring-2 focus:outline-none ${
            selectedSection
              ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
}
