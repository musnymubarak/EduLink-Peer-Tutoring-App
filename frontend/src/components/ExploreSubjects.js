import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";


export default function ExploreSubjects() {

    const [subjects, setSubjects] = useState([]); // Holds the list of subjects
    const [loading, setLoading] = useState(true); // Indicates loading state
    const [error, setError] = useState(null); 

    const navigate = useNavigate();

    useEffect(() => {
      // Fetch subjects from the API
      const fetchSubjects = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/v1/courses"
          ); // Replace with endpoint
          const data = response.data.data; 

          
          const formattedSubjects = data.map((course) => ({
            id: course._id,
            title: course.courseName,
            description:
              course.courseDescription || "No description available.",
            enrolledStudents: course.studentsEnrolled?.length || 0,
            rating: course.ratingAndReviews?.length || "No ratings yet",
            thumbnail: course.thumbnail || null,
            createdAt: new Date(course.createdAt).toLocaleDateString(),
          }));

          setSubjects(formattedSubjects);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching subjects:", err);
          setError("Failed to load subjects. Please try again later.");
          setLoading(false);
        }
      };

      fetchSubjects();
    }, []);

    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <p className="text-xl font-semibold text-gray-800">
            Loading subjects...
          </p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <p className="text-xl font-semibold text-red-600">{error}</p>
        </div>
      );
    }

    


}