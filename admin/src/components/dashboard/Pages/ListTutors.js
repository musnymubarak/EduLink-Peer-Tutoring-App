import React, { useEffect, useState } from "react";
import axios from "axios";

const ListTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);

  const fetchTutors = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:4000/api/v1/tutor/alltutors/getall", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTutors(response.data.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Failed to fetch tutors");
    } finally {
      setLoading(false);
    }
  };

  const fetchTutorDetails = async (tutorId) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:4000/api/v1/tutor/${tutorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedTutor(response.data.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Failed to fetch tutor details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  const openTutorDetails = (tutorId) => {
    fetchTutorDetails(tutorId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTutor(null);
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading tutors...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "20px auto" }}>
      <h1>Tutor List</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ backgroundColor: "#4CAF50", color: "white", padding: "10px" }}>First Name</th>
            <th style={{ backgroundColor: "#4CAF50", color: "white", padding: "10px" }}>Last Name</th>
            <th style={{ backgroundColor: "#4CAF50", color: "white", padding: "10px" }}>Email</th>
            <th style={{ backgroundColor: "#4CAF50", color: "white", padding: "10px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tutors.map((tutor) => (
            <tr key={tutor._id}>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{tutor.firstName}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{tutor.lastName}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{tutor.email}</td>
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
                    openTutorDetails(tutor._id);
                  }}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedTutor && (
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
            <h3>Tutor Details</h3>
            <p>
              <strong>Name:</strong> {selectedTutor.firstName} {selectedTutor.lastName}
            </p>
            <p>
              <strong>Email:</strong> {selectedTutor.email}
            </p>
            <p>
              <strong>Status:</strong> {selectedTutor.active ? "Active" : "Inactive"}
            </p>
            <p>
              <strong>Resume:</strong> <a href={selectedTutor.resumePath} target="_blank" rel="noopener noreferrer">View Resume</a>
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

export default ListTutors;
