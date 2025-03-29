import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import Header from "../Header";

export default function TSubjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    time: "",
    duration: 60,
    classLink: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/courses/${id}`);
        setCourse(response.data.data);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    const fetchSections = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/sections/course/${id}`);
        setSections(response.data.data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    fetchCourse();
    fetchSections();
  }, [id]);

  const handleRedirect = () => {
    // Pass the course ID to the add-section page
    navigate(`/dashboard/tutor/add-section?courseId=${id}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.time || !formData.duration) {
      setError("Class time and duration are required.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/api/v1/classes/create-group-class/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setIsModalOpen(false);
      alert("Group class created successfully!");
      console.log("Group class created:", response.data);
    } catch (error) {
      console.error("Error creating group class:", error);
      setError(error.response?.data?.error || "An error occurred. Please try again.");
    }
  };

  if (!course) {
    return <div className="p-8 text-center text-xl text-gray-700">Loading course details...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Header />
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

        {/* Course Sections Display */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Course Sections</h2>
          {sections.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {sections.map((section) => (
                <li 
                  key={section._id} 
                  className="py-3 px-4 hover:bg-blue-50 rounded cursor-pointer transition duration-150 ease-in-out"
                  onClick={() => navigate(`/dashboard/tutor/section/${section._id}`)}
                >
                  <div className="flex items-center">
                    <span className="text-lg text-gray-700">{section.sectionName}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 italic">No sections available for this course.</p>
          )}
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
                : " No students enrolled."}
            </span>
          </h2>
        </section>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleRedirect}
            className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            Add Sections
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Create Group Class
          </button>
        </div>
      </div>

      {/* Modal for Creating Group Class */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Create Group Class</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="time">Class Time</label>
                <input
                  type="datetime-local"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg w-full p-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="duration">Duration (minutes)</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg w-full p-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="classLink">Class Link</label>
                <input
                  type="url"
                  id="classLink"
                  name="classLink"
                  value={formData.classLink}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg w-full p-2"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}