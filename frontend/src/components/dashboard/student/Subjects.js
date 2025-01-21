import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Sidebar";

export default function Subject() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  useEffect(() => {
    // Fetch courses from the backend
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/courses");
        const data = response.data.data;
    
        console.log(data);
    
        const groupedByCategory = data.reduce((acc, course) => {
          // Extract category name or use "Uncategorized"
          let categoryName = "Uncategorized";
          if (typeof course.category === "string") {
            categoryName = course.category;
          } else if (course.category && typeof course.category.name === "string") {
            categoryName = course.category.name;
          }

          if (!acc[categoryName]) acc[categoryName] = [];
          acc[categoryName].push(course);
          return acc;
        }, {});
    
        const formattedCategories = Object.entries(groupedByCategory).map(
          ([title, courses]) => ({
            title,
            subjects: courses.map((course) => ({
              id: course._id?.$oid || course._id, // Handle both string and object `_id`
              title: course.courseName,
              description: course.courseDescription || "No description available.",
              thumbnail: course.thumbnail || "",
              tags: Array.isArray(course.tag) ? course.tag : [], // Ensure tags are an array
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
        subject.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
    );

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

        <div className="space-y-8">
          {categories.map((category, index) => (
            <div key={index}>
              {/* Category Title */}
              <h2 className="text-2xl font-semibold text-richblue-700 mb-4">
                {category.title}
              </h2>
  
              {/* Courses */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.subjects.map((subject, i) =>  {
                const filteredSubjects = filterSubjects(category.subjects);
                return (
                  filteredSubjects.length > 0 && (
                  <Link
                    to={`/dashboard/student/subject/${subject.id}`}
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
                      <strong>Tags:</strong>{" "}
                      {subject.tags.length > 0
                        ? subject.tags.join(", ")
                        : "No tags available."}
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
                )
                );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
}
