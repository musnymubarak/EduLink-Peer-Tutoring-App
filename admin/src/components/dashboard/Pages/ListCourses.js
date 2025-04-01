import React, { useEffect, useState } from "react";
import axios from "axios";

const ListCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

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
      setCourses(response.data.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseDetails = async (courseId) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:4000/api/v1/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedCourse(response.data.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Failed to fetch course details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openCourseDetails = (courseId) => {
    fetchCourseDetails(courseId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading courses...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "20px auto" }}>
      <h1>Course List</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ backgroundColor: "#4CAF50", color: "white", padding: "10px" }}>Course Name</th>
            <th style={{ backgroundColor: "#4CAF50", color: "white", padding: "10px" }}>Category</th>
            <th style={{ backgroundColor: "#4CAF50", color: "white", padding: "10px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course._id}>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => openCourseDetails(course._id)}
              >
                {course.courseName}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                {course.category?.name || "N/A"}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                <button
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the modal from opening twice
                    openCourseDetails(course._id);
                  }}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedCourse && (
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
            <h3>Course Details</h3>
            <p>
              <strong>Name:</strong> {selectedCourse.courseName}
            </p>
            <p>
              <strong>Description:</strong> {selectedCourse.courseDescription}
            </p>
            <p>
              <strong>Category:</strong> {selectedCourse.category?.name || "N/A"}
            </p>
            <p>
              <strong>Tag:</strong> {selectedCourse.tag?.join(", ") || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {selectedCourse.status}
            </p>
            <p>
              <strong>Instructor Name:</strong> {selectedCourse.tutor?.firstName} {selectedCourse.tutor?.lastName || "N/A"}
            </p>
            <p>
              <strong>Instructor Email:</strong> {selectedCourse.tutor?.email || "N/A"}
            </p>
            <button
              style={{
                marginTop: "10px",
                backgroundColor: "#6c757d",
                color: "white",
                padding: "5px 10px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListCourses;
