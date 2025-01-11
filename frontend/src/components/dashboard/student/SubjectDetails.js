import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";

export default function SubjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    studentAge: "",
    educationBackground: "",
    preferredTimes: [],
    suggestions: "",
  });

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

  if (!course) {
    return <div className="p-8 text-center text-xl text-gray-700">Loading course details...</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePreferredTimesChange = (e) => {
    const { options } = e.target;
    const selectedTimes = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    setFormData({ ...formData, preferredTimes: selectedTimes });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted: ", formData);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-6 text-blue-600 font-bold hover:underline"
      >
        <IoArrowBack className="mr-2 text-2xl" />
        Back
      </button>

      <div className="relative">
        <img
          src={course.thumbnail} // Dynamic thumbnail
          alt={`${course.courseName} thumbnail`}
          className="w-full h-96 object-cover rounded-lg shadow-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg flex items-end p-4">
          <h1 className="text-4xl font-bold text-white">{course.courseName}</h1>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Course Description</h2>
          <p className="text-gray-600">{course.courseDescription}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">What You Will Learn</h2>
          <p className="text-gray-600">{course.whatYouWillLearn}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Instructions</h2>
          <ul className="list-disc list-inside text-gray-600">
            {course.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {course.tag.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Additional Details</h2>
          <ul className="list-disc list-inside text-gray-600">
            <li><strong>Status:</strong> {course.status}</li>
            <li><strong>Category ID:</strong> {course.category}</li>
            <li><strong>Created At:</strong> {new Date(course.createdAt).toLocaleString()}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Tutor</h2>
          <ul className="list-disc list-inside text-gray-600">
            {course.availableInstructors.map((instructor, index) => (
              <li key={index}>{instructor}</li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Enrolled Students</h2>
          <ul className="list-disc list-inside text-gray-600">
            {course.studentsEnrolled.map((student, index) => (
              <li key={index}>{student}</li>
            ))}
          </ul>
        </section>

        <div className="text-right">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Request to Class
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg mx-auto relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Request to Class</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Preferred Times</label>
                <select
                  name="preferredTimes"
                  multiple
                  value={formData.preferredTimes}
                  onChange={handlePreferredTimesChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                >
                  <option value="Monday Morning">Monday Morning</option>
                  <option value="Monday Evening">Monday Evening</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Hold Ctrl (Windows) or Cmd (Mac) to select multiple options.
                </p>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Suggestions</label>
                <textarea
                  name="suggestions"
                  value={formData.suggestions}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  rows="4"
                />
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700"
                >
                  Send Request to Teacher
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="ml-4 px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
