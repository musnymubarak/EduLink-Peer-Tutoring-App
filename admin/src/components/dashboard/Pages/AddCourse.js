import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select"; // For searchable dropdown

const AddCourse = () => {
  const [course, setCourse] = useState(""); // Course name state
  const [category, setCategory] = useState(""); // Category state
  const [tags, setTags] = useState(""); // Tags state
  const [sections, setSections] = useState([]); // Sections fetched from API
  const [selectedSections, setSelectedSections] = useState([]); // Selected sections
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [success, setSuccess] = useState(""); // Success message state

  // Fetch sections from the API
  useEffect(() => {
    const fetchSections = async () => {
      setLoading(true); // Set loading to true when the fetch starts
      try {
        const response = await axios.get("http://localhost:4000/api/v1/sections");
        console.log(response.data); // Log the fetched data to check the structure
        
        // Map the sections to the format required by react-select
        const sectionOptions = response.data.data.map((section) => ({
          value: section._id, // Assuming each section has an _id field
          label: section.sectionName || "Unnamed Section", // Accessing section name
        }));
        
        setSections(sectionOptions); // Set the fetched sections
      } catch (error) {
        setError("Failed to load sections.");
      } finally {
        setLoading(false); // Set loading to false once the fetch completes
      }
    };

    fetchSections();
  }, []);

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
        courseName: course, // Use course instead of subject
        category: category,
        tag: tagsArray, // Send tags as an array
        courseContent: selectedSections.map((section) => section.value), // Send selected sections
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
        setCourse(""); // Reset form
        setCategory(""); // Reset category input
        setTags(""); // Reset tags input
        setSelectedSections([]); // Reset selected sections
      }
    } catch (error) {
      if (error.response && error.response.data.message === "Course name must be unique.") {
        setError("Course name already exists. Please choose a different name.");
      } else {
        setError(error.response ? error.response.data.message : "An error occurred.");
      }
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
                <label htmlFor="course" className="text-gray-600 text-sm mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  id="course"
                  name="course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="Enter course name"
                  className="border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>

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

              {/* Sections dropdown */}
              <div className="flex flex-col">
                <label htmlFor="sections" className="text-gray-600 text-sm mb-1">
                  Sections
                </label>
                <Select
                  isMulti
                  name="sections"
                  options={sections}
                  value={selectedSections}
                  onChange={setSelectedSections}
                  getOptionLabel={(e) => e.label}
                  getOptionValue={(e) => e.value}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select sections"
                  isLoading={loading} // Show loading spinner while fetching data
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}

              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                disabled={loading}
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
