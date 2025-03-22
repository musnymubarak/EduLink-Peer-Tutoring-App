import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams and useNavigate
import Sidebar from "../Sidebar";
import Header from "../Header";
import Footer from "../Footer";
const EditCoursePage = () => {
  const { courseId } = useParams(); // Get courseId from URL parameters
  const [courseData, setCourseData] = useState({
    courseName: "",
    courseDescription: "",
    category: "",
    thumbnail: "",
    tags: "",
    instructions: "",
    status: "",
  });
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:4000/api/v1/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setCourseData({
            courseName: response.data.data.courseName,
            courseDescription: response.data.data.courseDescription,
            category: response.data.data.category,
            thumbnail: response.data.data.thumbnail,
            tags: response.data.data.tags.join(", "),
            instructions: response.data.data.instructions,
            status: response.data.data.status,
          });
        } else {
          alert("Failed to load course data");
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        alert("An error occurred while fetching the course data.");
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`http://localhost:4000/api/v1/courses/${courseId}`, courseData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        alert("Course updated successfully!");
        navigate("/dashboard/tutor/your-subjects"); // Navigate back to the subjects page
      } else {
        alert("Failed to update course");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      alert("An error occurred while updating the course.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
        <Header/>
      <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Edit Course</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Course Name:</label>
            <input
              type="text"
              name="courseName"
              value={courseData.courseName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Category:</label>
            <input
              type="text"
              name="category"
              value={courseData.category}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Thumbnail:</label>
            <input
              type="text"
              name="thumbnail"
              value={courseData.thumbnail}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Tags:</label>
            <input
              type="text"
              name="tags"
              value={courseData.tags}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Instructions:</label>
            <textarea
              name="instructions"
              value={courseData.instructions}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Status:</label>
            <select
              name="status"
              value={courseData.status}
              onChange={handleChange}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Course Description:</label>
            <textarea
              name="courseDescription"
              value={courseData.courseDescription}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className='bg-blue-600 text-white p-2 rounded'>Update Course</button>
          <button type="button" className='bg-blue-600 text-white p-2 rounded' onClick={() => navigate("/dashboard/tutor/your-subjects")}>Cancel</button>
        </form>
      </div>
      <Footer/>
    </div>
  );
}
