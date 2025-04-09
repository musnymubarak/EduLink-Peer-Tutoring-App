import React, { useState } from "react";
import "../../css/student/ReportModal.css";

export default function ReportModal({ isOpen, onClose, courseId }) {
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const reasonOptions = [
    "Unprofessional Behavior",
    "Lack of Subject Knowledge",
    "Cheating Assistance",
    "Technical Issues",
    "Financial Misconduct",
    "Safety Concerns",
    "Violation of Platform Rules",
    "Other"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token is missing. Please log in.");
        setIsSubmitting(false);
        return;
      }

      const finalReason = reason === "Other" ? otherReason : reason;
      
      if (!finalReason.trim()) {
        setError("Please provide a reason for your report");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(
        `http://localhost:4000/api/v1/report/${courseId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ reason: finalReason })
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Report submitted successfully.");
        setReason("");
        setOtherReason("");
        onClose();
      } else {
        setError(data.message || "Failed to submit report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      setError("An error occurred while submitting the report");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content report-modal">
        <h2>Report Course</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reason">Reason for reporting:</label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="select-input"
            >
              <option value="">Select a reason</option>
              {reasonOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {reason === "Other" && (
            <div className="form-group">
              <label htmlFor="otherReason">Please specify:</label>
              <textarea
                id="otherReason"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                required
                className="textarea-input"
                placeholder="Describe the issue..."
              />
            </div>
          )}

          <div className="modal-buttons">
            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}