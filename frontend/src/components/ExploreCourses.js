import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import Navbar from "./Navbar";

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
    <div className="flex min-h-screen bg-gray-100">
      <Navbar/>
      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center mb-6 text-blue-600 font-bold hover:underline"
        >
          <IoArrowBack className="mr-2 text-2xl" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Subjects</h1>
        
        <div className="space-y-8">
          {categories.map((category, index) => (
            <div key={index}>
              {/* Courses */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.subjects.map((subject, i) => (
                  <Link
                    to={`/explore/${subject.id}`}
                    key={i}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition duration-200"
                  >
                    {/* Course Title */}
                    <h3 className="text-lg font-semibold text-gray-800">
                      {subject.title}
                    </h3>

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
          ))}
        </div>
      </div>
    </div>
  );
}
