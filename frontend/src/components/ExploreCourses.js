import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import Navbar from "./Navbar";
import "../components/css/ExploreCourses.css";  // Import the updated CSS file

export default function ExploreCourses() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch courses from the backend
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/courses");
        const data = response.data.data;

        const groupedByCategory = data.reduce((acc, course) => {
          const category = course.category?.name || "Uncategorized";
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
              author: course.availableInstructors?.map(
                (inst) => `${inst.firstName} ${inst.lastName}`
              ).join(", ") || "N/A",
              whatYouWillLearn: course.whatYouWillLearn || "Details not provided.",
              courseContentCount: course.courseContent?.length || 0, 
              thumbnail: course.thumbnail || "No thumbnail available.",
              tags: Array.isArray(course.tag) && course.tag.length > 0 
                ? course.tag.join(", ") 
                : "No tags available",
              likes: course.studentsEnrolled?.length || 0,
              rating: course.ratingAndReviews?.length || 0,
              status: course.status || "Unknown",
              createdAt: new Date(course.createdAt).toLocaleDateString(),
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

  return (
    <div className="explore-courses-container">
      <Navbar />
      {/* Main Content */}
      <div className="explore-courses-content">
        <button
          onClick={() => navigate(-1)}
          className="back-button"
        >
          <IoArrowBack className="mr-2" />
          Back
        </button>
        <h1 className="page-title">Subjects</h1>
        
        <div className="category-container">
          {categories.map((category, index) => (
            <div key={index}>
              {/* Courses */}
              <h2>{category.title}</h2>
              <div className="subject-grid">
                {category.subjects.map((subject, i) => (
                  <Link
                    to={`/explore/${subject.id}`}
                    key={i}
                    className="subject-card"
                  >
                    {/* Course Title */}
                    <h3 className="subject-title">
                      {subject.title}
                    </h3>

                    {/* Tags */}
                    <p className="subject-tags">
                      <strong>Tags:</strong> {subject.tags}
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
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
