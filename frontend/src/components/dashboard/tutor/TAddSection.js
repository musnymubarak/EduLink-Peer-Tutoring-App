import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";

export default function TAddSection() {
  const [sections, setSections] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSections, setSelectedSections] = useState([]);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract courseId from location state or query params
  const courseId = location.state?.courseId || new URLSearchParams(location.search).get('courseId');

  useEffect(() => {
    if (!courseId) {
      setMessage({ type: "error", text: "No course ID provided. Please select a course first." });
      return;
    }

    const fetchSections = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage({ type: "error", text: "Authentication token is missing. Please log in." });
          return;
        }

        const response = await axios.get("http://localhost:4000/api/v1/sections/tutor", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          // Filter out sections that are already assigned to this course
          const availableSections = response.data.data.filter(section => 
            !section.courseIds || !section.courseIds.includes(courseId)
          );
          
          setSections(availableSections);
          setFilteredSections(availableSections);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || "An error occurred.";
        setMessage({ type: "error", text: errorMessage });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSections();
  }, [courseId]);

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

  const handleConfirmSelection = async () => {
    if (selectedSections.length === 0) {
      setMessage({ type: "error", text: "Please select at least one section." });
      return;
    }

    if (!courseId) {
      setMessage({ type: "error", text: "No course ID provided. Cannot add sections." });
      return;
    }

    try {
      setIsLoading(true);
      setMessage(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({ type: "error", text: "Authentication token is missing. Please log in." });
        return;
      }

      // Update each selected section with the course ID
      // If your backend expects courseIds as an array, we need to handle that here
      const promises = selectedSections.map(sectionId => {
        // First, get the current section to check if it has courseIds
        return axios.get(`http://localhost:4000/api/v1/sections/${sectionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
          const section = response.data.data;
          // Create an updated courseIds array
          let updatedCourseIds = section.courseIds || [];
          
          // Only add the courseId if it's not already in the array
          if (!updatedCourseIds.includes(courseId)) {
            updatedCourseIds.push(courseId);
          }
          
          // Now update the section with the new courseIds array
          return axios.put(`http://localhost:4000/api/v1/sections/${sectionId}`, 
            { courseIds: updatedCourseIds },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        });
      });

      await Promise.all(promises);

      setMessage({ type: "success", text: "Sections added to course successfully!" });
      
      // Redirect back to course details
      setTimeout(() => {
        navigate(`/dashboard/tutor/subject/${courseId}`);
      }, 1500);
      
    } catch (error) {
      console.error("Error details:", error);
      const errorMessage = error.response?.data?.message || "An error occurred while adding sections to the course.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewSection = () => {
    // Pass the courseId to the new section page
    navigate(`/dashboard/tutor/add-new-section?courseId=${courseId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 pt-20 pb-20">
      <Header />
      <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Add Sections to Course</h1>
        {courseId ? (
          <p className="mb-4 text-gray-600"></p>
        ) : (
          <p className="mb-4 text-red-600 font-bold">No course ID provided. Please select a course first.</p>
        )}
        
        <button 
          onClick={handleAddNewSection} 
          className="mb-4 px-6 py-3 font-bold rounded-lg shadow bg-blue-600 text-white hover:bg-blue-700"
          disabled={!courseId || isLoading}
        >
          Add New Section
        </button>

        <input 
          type="text" 
          placeholder="Search for a section..." 
          value={searchTerm} 
          onChange={handleSearchChange} 
          className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
          disabled={isLoading}
        />

        {message && (
          <div className={`p-4 mb-4 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message.text}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-gray-600">Loading sections...</p>
          </div>
        ) : (
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
              <p className="text-gray-500">No available sections found.</p>
            )}
          </div>
        )}

        <button
          onClick={handleConfirmSelection}
          disabled={selectedSections.length === 0 || !courseId || isLoading}
          className={`px-6 py-3 mt-6 font-bold rounded-lg shadow focus:ring-2 focus:outline-none ${
            selectedSections.length > 0 && courseId && !isLoading
              ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500" 
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Adding Sections..." : "Add Selected Sections to Course"}
        </button>
      </div>
      <Footer />
    </div>
  );
}