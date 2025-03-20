import React, { useState, useEffect } from "react";
import axios from "axios";

const EditCourse = ({ courseId, onClose, onUpdate }) => {
  const [courseData, setCourseData] = useState({
    courseName: "",
    courseDescription: "",
  });

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
        onUpdate(); // Call the onUpdate function to refresh the course list
        onClose(); // Close the edit form
      } else {
        alert("Failed to update course");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      alert("An error occurred while updating the course.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Course</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Course Name:</label>
            <input
              type="text"
              name="courseName"
              value={courseData.courseName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Course Description:</label>
            <textarea
              name="courseDescription"
              value={courseData.courseDescription}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Update Course</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;
