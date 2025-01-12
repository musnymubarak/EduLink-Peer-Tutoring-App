import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";

export default function SubjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClassType, setSelectedClassType] = useState("group"); // group or private
  const [selectedClassId, setSelectedClassId] = useState(null); // Selected group class ID
  const [formData, setFormData] = useState({
    name: "",
    studentAge: "",
    educationBackground: "",
    preferredTimes: [],
    suggestions: "",
  });

  // Dummy data for tutors
  const tutors = [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      rating: 4.8,
      classesConducted: 20,
      availableClasses: [
        { id: "class1", type: "Group", currentStudents: 5, maxStudents: 10 },
        { id: "class2", type: "Group", currentStudents: 8, maxStudents: 10 },
      ],
    }
  ];

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted: ", {
      formData,
      selectedClassType,
      selectedClassId,
    });
    setIsModalOpen(false);
  };

  // Ensure `category` is a string or fallback to "Uncategorized"
  const category =
    typeof course.category === "string"
      ? course.category
      : typeof course.category?.name === "string"
      ? course.category.name
      : "Uncategorized";

  // Ensure `studentsEnrolled` is an array of strings or use a fallback
  const studentsEnrolled = Array.isArray(course.studentsEnrolled)
    ? course.studentsEnrolled.map((student) => (typeof student === "string" ? student : JSON.stringify(student)))
    : [];

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
        {/* Existing course sections */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Course Description</h2>
          <p className="text-gray-600">{course.courseDescription}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Additional Details</h2>
          <ul className="list-disc list-inside text-gray-600">
            <li><strong>Status:</strong> {course.status}</li>
            <li><strong>Category:</strong> {category}</li>
            <li><strong>Created At:</strong> {new Date(course.createdAt).toLocaleString()}</li>
          </ul>
        </section>


        {/* Tutor Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Tutor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tutors.map((tutor, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-gray-700">{tutor.name}</h3>
                <p className="text-gray-600"><strong>Email:</strong> {tutor.email}</p>
                <p className="text-gray-600"><strong>Rating:</strong> {tutor.rating}/5</p>
                <p className="text-gray-600">
                  <strong>Classes Conducted:</strong> {tutor.classesConducted}
                </p>
                <p className="text-gray-600"><strong>Available Classes:</strong></p>
                <ul className="list-disc list-inside text-gray-600">
                  {tutor.availableClasses.map((cls) => (
                    <li key={cls.id}>
                      {cls.type} - {cls.currentStudents}/{cls.maxStudents} students
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Enrolled Students</h2>
          <ul className="list-disc list-inside text-gray-600">
            {studentsEnrolled.map((student, index) => (
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg mx-auto relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Request to Class</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Class Type</label>
                <div className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name="classType"
                      value="group"
                      checked={selectedClassType === "group"}
                      onChange={() => setSelectedClassType("group")}
                    />
                    <span className="ml-2 text-black">Group Class</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="classType"
                      value="private"
                      checked={selectedClassType === "private"}
                      onChange={() => setSelectedClassType("private")}
                    />
                    <span className="ml-2 text-black">Private Class</span>
                  </label>
                </div>
              </div>

              {selectedClassType === "group" && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Available Group Classes</label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    <option value="">Select a group class</option>
                    {tutors.flatMap((tutor) =>
                      tutor.availableClasses.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {tutor.name}'s {cls.type} - {cls.currentStudents}/{cls.maxStudents} slots
                        </option>
                      ))
                    )}
                  </select>
                </div>
              )}

              {/* Suggestions */}
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
