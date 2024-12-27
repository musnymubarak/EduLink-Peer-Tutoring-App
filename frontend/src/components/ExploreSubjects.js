import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Link} from "react-router-dom";


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

    return (
      <div className="flex min-h-screen bg-gray-100">
        {/* Main Content */}
        <div className="flex-1 ml-64 p-8 overflow-y-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center mb-6 text-blue-600 font-bold hover:underline"
          >
            <IoArrowBack className="mr-2 text-2xl" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Explore Subjects
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Link
                to={`/subject/${subject.id}`}
                key={subject.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition duration-200"
              >
                {/* Thumbnail */}
                {subject.thumbnail && (
                  <img
                    src={subject.thumbnail}
                    alt={subject.title}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                )}

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {subject.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-2">
                  <strong>Description:</strong> {subject.description}
                </p>

                {/* Enrolled Students */}
                <p className="text-gray-500 text-sm mb-2">
                  <strong>Enrolled Students:</strong> {subject.enrolledStudents}
                </p>

                {/* Rating */}
                <p className="text-gray-500 text-sm mb-2">
                  <strong>Rating:</strong> {subject.rating}
                </p>

                {/* Created At */}
                <p className="text-gray-500 text-sm">
                  <strong>Created On:</strong> {subject.createdAt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );

}