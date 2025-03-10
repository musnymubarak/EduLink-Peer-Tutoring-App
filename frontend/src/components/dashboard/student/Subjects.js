import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Sidebar";
import Header from "../Header";
import Footer from "../Footer";
import "../../css/student/Subjects.css"; // Import the CSS file

export default function Subject() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
    <div className="main-container">
      <Header/>
      {/* Sidebar */}
      <div className="sidebar-container">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="content-container">
        <h1 className="page-title">Courses</h1>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a subject by title, description, or tags..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="categories-container">
          {categories.map((category, index) => (
            <div key={index} className="category-section">
              {/* Category Title */}
              <h2 className="category-title">
                {category.title}
              </h2>
  
              {/* Courses */}
              <div className="subjects-grid">
                {category.subjects.map((subject, i) => {
                const filteredSubjects = filterSubjects(category.subjects);
                return (
                  filteredSubjects.length > 0 && (
                  <Link
                    to={`/dashboard/student/subject/${subject.id}`}
                    key={i}
                    className="subject-card"
                  >
                    {/* Course Title */}
                    <h3 className="subject-title">
                      {subject.title}
                    </h3>
  
                    {/* Course Description */}
                    <p className="subject-description">
                      {subject.description}
                    </p>
  
                    {/* Tags */}
                    <p className="subject-tags">
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
                        className="subject-thumbnail"
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
      <Footer/>
    </div>
  );
}