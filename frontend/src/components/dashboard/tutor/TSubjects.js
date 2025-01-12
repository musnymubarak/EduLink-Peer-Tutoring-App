import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import Sidebar from "../Sidebar";

export default function TSubjects() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/courses");
        const data = response.data.data;

        const groupedByCategory = data.reduce((acc, course) => {
          const category = course.category?.name || "Uncategorized"; // Ensure category.name exists
          if (!acc[category]) acc[category] = [];
          acc[category].push(course);
          return acc;
        }, {});

        const formattedCategories = Object.entries(groupedByCategory).map(
          ([title, courses]) => ({
            title,
            subjects: courses.map((course) => ({
              id: course._id,
              title: course.courseName,
              description: course.courseDescription || "No description available.",
              thumbnail: course.thumbnail || "No thumbnail available.",
              tags: course.tag?.join(", ") || "No tags available.",
            })),
          })
        );

        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filterSubjects = (subjects) =>
    subjects.filter(
      (subject) =>
        subject.title.toLowerCase().includes(searchQuery) ||
        subject.description.toLowerCase().includes(searchQuery) ||
        subject.tags.toLowerCase().includes(searchQuery)
    );

  const handleAddCourse = () => {
    navigate("/dashboard/tutor/add-course");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Courses</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search for a subject by title, description, or tags..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full border text-black border-gray-300 rounded-lg p-3 placeholder-gray-600"
          />
        </div>

        {/* Categories Section */}
        <div className="space-y-8">
          {categories.map((category, index) => {
            const filteredSubjects = filterSubjects(category.subjects);
            return (
              filteredSubjects.length > 0 && ( // Show category only if there are matching subjects
                <div key={index}>
                  {/* Category Title */}
                  <h2 className="text-2xl font-semibold text-richblue-700 mb-4">
                    {category.title}
                  </h2>

                  {/* Courses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSubjects.map((subject, i) => (
                      <Link
                        to={`/dashboard/tutor/subject/${subject.id}`}
                        key={i}
                        className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition duration-200"
                      >
                        {/* Course Title */}
                        <h3 className="text-lg font-semibold text-gray-800">
                          {subject.title}
                        </h3>

                        {/* Course Description */}
                        <p className="text-gray-600 mb-2">
                          {subject.description}
                        </p>

                        {/* Tags */}
                        <p className="text-gray-500 text-sm mb-2">
                          <strong>Tags:</strong> {subject.tags}
                        </p>

                        {/* Thumbnail */}
                        {subject.thumbnail && (
                          <img
                            src={subject.thumbnail}
                            alt={`${subject.title} Thumbnail`}
                            className="mt-4 w-full h-32 object-cover rounded-lg"
                          />
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            );
          })}
        </div>

        {/* Add New Course Button */}
        <div className="text-right">
          <button
            onClick={handleAddCourse} // Attach the click handler
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Add New Course
          </button>
        </div>
      </div>
    </div>
  );
}
