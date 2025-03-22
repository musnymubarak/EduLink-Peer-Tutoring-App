import React, { useState, useEffect } from "react";
import axios from "axios";

const EditCourse = ({ courseId, onClose, onUpdate }) => {
  const [courseData, setCourseData] = useState({
    courseName: "",
    courseDescription: "",
    category: "", // Add category field
    whatYouWillLearn: "", // Set what you will learn
    thumbnail: "", // Add thumbnail field
    tags: "", // Add tags field
    instructions: "", // Add instructions field
    status: "", // Add status field
  });

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:4000/api/v1/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }, // Ensure token is sent
          params: { includeFeedback: true }, // Include feedback in the request
        });

        if (response.data.success) {
          setCourseData({
            courseName: response.data.data.courseName,
            courseDescription: response.data.data.courseDescription,
            category: response.data.data.category.name, // Set category
            whatYouWillLearn: response.data.data.whatYouWillLearn, // Set what you will learn
            thumbnail: response.data.data.thumbnail, // Set thumbnail
            tags: response.data.data.tag ? response.data.data.tag.join(", ") : "", // Set tags as a comma-separated string
            instructions: response.data.data.instructions, // Set instructions
            status: response.data.data.status, // Set status
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
            <label>Category:</label>
            <input
              type="text"
              name="category"
              value={courseData.category}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>What You Will Learn:</label>
            <textarea 
              name="whatYouWillLearn" 
              value={courseData.whatYouWillLearn} 
              onChange={handleChange} 
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
          <div>
            <label>Thumbnail:</label>
            <input type="file" accept="image/*" />
          </div>
          <div>
            <label>Tags:</label>
            <input
              type="text"
              name="tags"
              value={courseData.tags}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Instructions:</label>
            <textarea
              name="instructions"
              value={courseData.instructions}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Status:</label>
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
          <button type="submit" className='bg-blue-600 text-white p-2 rounded'>Update Course</button>
          <button type="button" className='bg-blue-600 text-white p-2 rounded' onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;
