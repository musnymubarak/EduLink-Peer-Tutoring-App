import React, { useEffect, useState } from "react";
import axios from "axios";

const ListReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:4000/api/v1/report", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReports(response.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading reports...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "20px auto" }}>
      <h1>Reports List</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ backgroundColor: "#4CAF50", color: "white", padding: "10px" }}>
              Reported By
            </th>
            <th style={{ backgroundColor: "#4CAF50", color: "white", padding: "10px" }}>
              Course Name
            </th>
            <th style={{ backgroundColor: "#4CAF50", color: "white", padding: "10px" }}>
              Tutor Email
            </th>
            <th style={{ backgroundColor: "#4CAF50", color: "white", padding: "10px" }}>
              Reason
            </th>
            <th style={{ backgroundColor: "#4CAF50", color: "white", padding: "10px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((report) => (
              <tr key={report._id}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {report.reportedBy?.email || "N/A"}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {report.courseId?.courseName || "N/A"}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {report.courseCreatorId?.email || "N/A"} {/* Updated Tutor Email */}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {report.reason || "N/A"}
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
                    onClick={() => alert(`Viewing report details for report ID: ${report._id}`)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
                No reports found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListReports;
