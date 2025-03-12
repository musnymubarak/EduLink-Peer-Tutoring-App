import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";

export default function TAddSection() {
  const [sections, setSections] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSections, setSelectedSections] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage({ type: "error", text: "Authentication token is missing. Please log in." });
          return;
        }

        const response = await axios.get("http://localhost:4000/api/v1/sections/tutor", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setSections(response.data.data);
          setFilteredSections(response.data.data);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || "An error occurred.";
        setMessage({ type: "error", text: errorMessage });
      }
    };

    fetchSections();
  }, []);

  const handleSelectSection = (sectionId) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    const filtered = sections.filter((section) => section.sectionName.toLowerCase().includes(searchValue));
    setFilteredSections(filtered);
  };

  const handleConfirmSelection = () => {
    if (selectedSections.length === 0) {
      setMessage({ type: "error", text: "Please select at least one section." });
      return;
    }

    localStorage.setItem("selectedSections", JSON.stringify(selectedSections));
    navigate(`/dashboard/tutor/add-course`, { state: { sectionIds: selectedSections } });
  };

  const handleAddNewSection = () => {
    navigate("/dashboard/tutor/add-new-section");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Header />
      <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Sections</h1>
        <button onClick={handleAddNewSection} className="mb-4 px-6 py-3 font-bold rounded-lg shadow bg-blue-600 text-white hover:bg-blue-700">
          Add New Section
        </button>

        <input type="text" placeholder="Search for a section..." value={searchTerm} onChange={handleSearchChange} className="w-full mb-4 p-2 border border-gray-300 rounded-lg" />

        {message && (
          <div className={`p-4 mb-4 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          {filteredSections.length > 0 ? (
            filteredSections.map((section) => (
              <div
                key={section._id}
                className={`p-4 rounded-lg shadow-md cursor-pointer ${selectedSections.includes(section._id) ? "bg-blue-200 border border-blue-500" : "bg-white"}`}
                onClick={() => handleSelectSection(section._id)}
              >
                <h2 className="text-xl font-bold text-gray-800">{section.sectionName}</h2>
                <p className="text-gray-600">{section.description}</p>
                <p className="text-sm text-gray-500">Status: {section.status || "N/A"}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No sections found.</p>
          )}
        </div>

        <button
          onClick={handleConfirmSelection}
          disabled={selectedSections.length === 0}
          className={`px-6 py-3 mt-6 font-bold rounded-lg shadow focus:ring-2 focus:outline-none ${selectedSections.length > 0 ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
        >
          Confirm Selection
        </button>
      </div>
      <Footer />
    </div>
  );
}