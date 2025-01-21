import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";

export default function TSubjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/courses/${id}`);
        setCourse(response.data.data); // Set the fetched course data
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    fetchCourse();
  }, [id]);
  
  const handleRedirect = () => {
    // Redirect to the AddSection page
    navigate("/dashboard/tutor/add-section"); // Adjust the route if necessary
  };

  if (!course) {
    return <div className="p-8 text-center text-xl text-gray-700">Loading course details...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-6 text-blue-600 font-bold hover:underline"
      >
        <IoArrowBack className="mr-2 text-2xl" />
        Back
      </button>

      <div className="relative">
        <img
          src={course.thumbnail || "https://via.placeholder.com/150"}
          alt={`${course.courseName || "Course"} thumbnail`}
          className="w-full h-96 object-cover rounded-lg shadow-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg flex items-end p-4">
          <h1 className="text-4xl font-bold text-white">{course.courseName || "Untitled Course"}</h1>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Course Description</h2>
          <p className="text-gray-600">{course.courseDescription || "No description available."}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Category</h2>
          <p className="text-gray-600">
            {course.category?.name || "No category assigned."}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">What You Will Learn</h2>
          <p className="text-gray-600">{course.whatYouWillLearn || "No details provided."}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Instructions</h2>
          <ul className="list-disc list-inside text-gray-600">
            {course.instructions?.length > 0 ? (
              course.instructions.map((instruction, index) => <li key={index}>{instruction}</li>)
            ) : (
              <li>No instructions available.</li>
            )}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {course.tag?.length > 0 ? (
              course.tag.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-gray-600">No tags available.</span>
            )}
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Number of students enrolled: 
            <span className="text-gray-600">{course.studentsEnrolled?.length > 0
                ? ` ${course.studentsEnrolled.length}`
                : "No students enrolled."}
            </span>
          </h2>
        </section>
        <button
            onClick={handleRedirect}
            className="mt-6 px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            Add Sections
          </button>
      </div>
    </div>
  );
}
