import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ExploreCourses() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch courses from the backend
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/courses");
        const data = response.data.data;
    
        console.log(data);
    
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
              author: course.availableInstructors?.map(
                (inst) => `${inst.firstName} ${inst.lastName}`
              ).join(", ") || "N/A",
              whatYouWillLearn: course.whatYouWillLearn || "Details not provided.",
              courseContentCount: course.courseContent?.length || 0, // Number of sections
              thumbnail: course.thumbnail || "No thumbnail available.",
              tags: course.tag?.join(", ") || "No tags available.",
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
      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Subjects</h1>
        <div className="space-y-8">
          {categories.map((category, index) => (
            <div key={index}>  
              {/* Courses */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.subjects.map((subject, i) => (
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
  
                    {/* What You'll Learn */}
                    <p className="text-gray-500 text-sm mb-2">
                      <strong>What You’ll Learn:</strong> {subject.whatYouWillLearn}
                    </p>
  
                    {/* Instructors */}
                    <p className="text-gray-500 text-sm mb-2">
                      <strong>Instructors:</strong> {subject.author}
                    </p>
  
                    {/* Tags */}
                    <p className="text-gray-500 text-sm mb-2">
                      <strong>Tags:</strong> {subject.tags}
                    </p>
  
                    {/* Likes */}
                    <p className="text-gray-500 text-sm mb-2">
                      <strong>Likes:</strong> {subject.likes}
                    </p>
  
                    {/* Rating */}
                    <p className="text-yellow-500 mb-2">
                      <strong>Rating:</strong> {"⭐".repeat(subject.rating)}
                    </p>
  
                    {/* Status */}
                    <p className={`text-sm ${subject.status === "Published" ? "text-green-500" : "text-red-500"}`}>
                      <strong>Status:</strong> {subject.status}
                    </p>
  
                    {/* Thumbnail */}
                    {subject.thumbnail && (
                      <img
                        src={subject.thumbnail}
                        alt={`${subject.title} Thumbnail`}
                        className="mt-4 w-full h-32 object-cover rounded-lg"
                      />
                    )}
  
                    {/* Created At */}
                    <p className="text-gray-400 text-sm mt-2">
                      <strong>Created On:</strong> {subject.createdAt}
                    </p>
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
