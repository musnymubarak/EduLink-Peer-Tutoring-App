import React, { useEffect, useState } from "react";
import axios from "axios";

const ListCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [courseToUpdate, setCourseToUpdate] = useState(null);
  const [updatedCourse, setUpdatedCourse] = useState({
    courseName: "",
    courseDescription: "",
    availableInstructors: [],
    price: "",
    thumbnail: "",
    tag: "",
    category: "",
    instructions: "",
    status: "",
  });

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:4000/api/v1/courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Update this part to match the new response structure.
      setCourses(response.data.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Authentication required. Please log in.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await axios.delete(`http://localhost:4000/api/v1/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Course deleted successfully");
      fetchCourses();
    } catch (err) {
      alert(err.response ? err.response.data.message : "Failed to delete course");
    }
  };

  const updateCourse = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Authentication required. Please log in.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:4000/api/v1/courses/${courseToUpdate._id}`,
        updatedCourse,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Course updated successfully");
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      alert(err.response ? err.response.data.message : "Failed to update course");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCourse((prevState) => ({
      ...prevState,
      [name]: name === "tag" ? value.split(",") : value, // Split tags by comma
    }));
  };

  const openUpdateModal = (course) => {
    setCourseToUpdate(course);
    setUpdatedCourse({
      courseName: course.courseName || "",
      courseDescription: course.courseDescription || "",
      availableInstructors: course.availableInstructors || [],
      price: course.price || "",
      thumbnail: course.thumbnail || "",
      tag: Array.isArray(course.tag) ? course.tag.join(", ") : "", // Ensure tag is an array and join it
      category: course.category?.name || "", // Safe access with optional chaining
      instructions: course.instructions || "",
      status: course.status || "Draft", // Default status if none provided
    });
    setShowModal(true);
  };

  const closeUpdateModal = () => {
    setShowModal(false);
    setUpdatedCourse({
      courseName: "",
      courseDescription: "",
      availableInstructors: [],
      price: "",
      thumbnail: "",
      tag: "",
      category: "",
      instructions: "",
      status: "",
    });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading courses...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  const containerStyle = {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    maxWidth: "800px",
    margin: "20px auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  };

  const thStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px",
    textAlign: "left",
  };

  const tdStyle = {
    padding: "10px",
    border: "1px solid #ddd",
  };

  const buttonStyle = {
    margin: "0 5px",
    padding: "5px 10px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#DC3545",
  };

  return (
    <div style={containerStyle}>
      <h1>Course List</h1>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Course Name</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course._id}>
              <td style={tdStyle}>{course.courseName}</td>
              <td style={tdStyle}>{course.category?.name || "N/A"}</td>
              <td style={tdStyle}>
                <button
                  style={buttonStyle}
                  onClick={() => openUpdateModal(course)}
                >
                  Update
                </button>
                <button
                  style={deleteButtonStyle}
                  onClick={() => deleteCourse(course._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3>Update Course</h3>
            <form>
              <div>
                <label>Course Name:</label>
                <input
                  type="text"
                  name="courseName"
                  value={updatedCourse.courseName}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "8px", margin: "8px 0" }}
                />
              </div>
              <div>
                <label>Course Description:</label>
                <textarea
                  name="courseDescription"
                  value={updatedCourse.courseDescription}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    margin: "8px 0",
                    height: "100px",
                  }}
                />
              </div>
              <div>
                <label>Price:</label>
                <input
                  type="number"
                  name="price"
                  value={updatedCourse.price}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "8px", margin: "8px 0" }}
                />
              </div>
              <div>
                <label>Tag:</label>
                <input
                  type="text"
                  name="tag"
                  value={updatedCourse.tag}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "8px", margin: "8px 0" }}
                />
              </div>
              <div>
                <label>Status:</label>
                <input
                  type="text"
                  name="status"
                  value={updatedCourse.status}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "8px", margin: "8px 0" }}
                />
              </div>
              <div>
                <label>Category:</label>
                <input
                  type="text"
                  name="category"
                  value={updatedCourse.category}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "8px", margin: "8px 0" }}
                />
              </div>
            </form>
            <button
              style={{
                ...buttonStyle,
                marginTop: "10px",
                backgroundColor: "#28a745",
              }}
              onClick={updateCourse}
            >
              Save Changes
            </button>
            <button
              style={{
                ...buttonStyle,
                marginTop: "10px",
                backgroundColor: "#6c757d",
              }}
              onClick={closeUpdateModal}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListCourses;
