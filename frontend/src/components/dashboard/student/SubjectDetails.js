import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";

export default function SubjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [tutor, setTutor] = useState(null);
  const [ratingsAndReviews, setRatingsAndReviews] = useState([]);
  const [sections, setSections] = useState([]); // State for course sections
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClassType, setSelectedClassType] = useState("group");
  const [formData, setFormData] = useState({
    time: "",
    suggestions: "",
  });
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/courses/${id}`);
        setCourse(response.data.data);
        const tutorId = response.data.data.tutor._id;
        fetchTutor(tutorId);
        fetchSections(id); // Fetch sections when the course is fetched
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    const fetchTutor = async (tutorId) => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/tutor/${tutorId}`);
        setTutor(response.data.data);
      } catch (error) {
        console.error("Error fetching tutor details:", error);
      }
    };

    const fetchSections = async (courseId) => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/sections/course/${courseId}`);
        setSections(response.data.data); // Assuming the API returns an array of sections
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    const fetchRatingsAndReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/rating/${id}`);
        setRatingsAndReviews(response.data.data);
      } catch (error) {
        console.error("Error fetching ratings and reviews:", error);
      }
    };

    const checkEnrollment = async () => {
      try {
        setIsCheckingEnrollment(true);
        const response = await axios.get("http://localhost:4000/api/v1/profile/student", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const userCourses = response.data.courses.map((course) => course._id || course.$oid);
        setIsEnrolled(userCourses.includes(id));
      } catch (error) {
        console.error("Error checking enrollment status:", error);
      } finally {
        setIsCheckingEnrollment(false);
      }
    };

    fetchCourse();
    fetchRatingsAndReviews();
    checkEnrollment();
  }, [id]);

  const handleEnroll = async () => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/v1/enrollment/enroll/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Enrolled successfully!");
      setIsEnrolled(true);
    } catch (error) {
      console.error("Error enrolling:", error.response?.data || error);
      alert(error.response?.data?.message || "An error occurred.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        type: selectedClassType,
        time: formData.time,
        suggestions: formData.suggestions,
      };

      const response = await axios.post(
        `http://localhost:4000/api/v1/classes/send-request/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Class request sent successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error sending class request:", error.response?.data || error);
      alert(error.response?.data?.error || "An error occurred. Please try again.");
    }
  };

  if (!course) {
    return <div className="p-8 text-center text-xl text-gray-700">Loading course details...</div>;
  }

  const category = course.category?.name || "Uncategorized";

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
          src={course.thumbnail}
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
          {tutor ? (
            <div className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-gray-700">
                {tutor.firstName} {tutor.lastName}
              </h3>
              <p className="text-gray-600"><strong>Email:</strong> {tutor.email}</p>
            </div>
          ) : (
            <p className="text-gray-600">No tutor assigned to this course.</p>
          )}
        </section>

        {/* Course Sections Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Course Sections</h2>
          {sections.length > 0 ? (
            <ul className="list-disc list-inside text-gray-600">
              {sections.map((section) => (
               <li key={section._id} className="cursor-pointer hover:text-blue-500" onClick={() => navigate(`/dashboard/student/section/${section._id}`)}>
               {section.sectionName}
             </li> // Displaying section names
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No sections available for this course.</p>
          )}
        </section>

        {/* Ratings and Reviews Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Ratings and Reviews</h2>
          <div className="space-y-6">
            {ratingsAndReviews.length > 0 ? (
              ratingsAndReviews.map((review, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg shadow">
                  <h3 className="text-xl font-bold text-gray-700">
                    {review.user.firstName} {review.user.lastName}
                  </h3>
                  <p className="text-gray-600"><strong>Rating:</strong> {review.rating}</p>
                  <p className="text-gray-600"><strong>Review:</strong> {review.review}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No ratings or reviews available for this course.</p>
            )}
          </div>
        </section>

        <div className="text-right">
          {isCheckingEnrollment ? (
            <button
              disabled
              className="px-6 py-3 bg-gray-400 text-white font-bold rounded-lg shadow"
            >
              Checking Enrollment...
            </button>
          ) : isEnrolled ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700"
            >
              Request to Class
            </button>
          ) : (
            <button
              onClick={handleEnroll}
              className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700"
            >
              Enroll
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Request Class</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="time">Preferred Time</label>
                <input
                  type="text"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg w-full p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="suggestions">Suggestions</label>
                <textarea
                  id="suggestions"
                  name="suggestions"
                  value={formData.suggestions}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg w-full p-2"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Class Type</label>
                <select
                  value={selectedClassType}
                  onChange={(e) => setSelectedClassType(e.target.value)}
                  className="border border-gray-300 rounded-lg w-full p-2"
                >
                  <option value="group">Group</option>
                  <option value="private">Private</option>
                </select>
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
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
