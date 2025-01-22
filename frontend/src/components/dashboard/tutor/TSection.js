import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function TSection() {
  const { sectionId } = useParams(); // Get section ID from URL
  const [section, setSection] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage({
            type: "error",
            text: "Authentication token is missing. Please log in.",
          });
          return;
        }

        const response = await axios.get(
          `http://localhost:4000/api/v1/sections/${sectionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setSection(response.data.data);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "An error occurred.";
        setMessage({ type: "error", text: errorMessage });
      }
    };

    fetchSection();
  }, [sectionId]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded shadow hover:bg-gray-400"
      >
        Back
      </button>

      {/* Feedback Message */}
      {message && (
        <div
          className={`p-4 mb-4 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Section Details */}
      {section ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {section.sectionName}
          </h1>

          {/* Video Player */}
          <div className="mb-4">
            <p className="text-gray-600 mb-2">
              <strong>Video:</strong>
            </p>
            <video
              controls
              className="w-full max-w-xl rounded shadow-lg"
              src={section.videoFile}
            >
              Your browser does not support the video tag.
            </video>
          </div>

          <p className="text-gray-600 mb-2">
            <strong>Tutor:</strong> {section.tutorId?.name || "N/A"} (
            {section.tutorId?.email || "N/A"})
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Associated Courses:</strong>
          </p>
          <ul className="list-disc list-inside mb-4">
            {section.courseIds && section.courseIds.length > 0 ? (
              section.courseIds.map((course) => (
                <li key={course._id}>{course.courseName}</li>
              ))
            ) : (
              <li>No associated courses</li>
            )}
          </ul>
          <p className="text-gray-600 mb-2">
            <strong>Quiz:</strong>
          </p>
          <ul className="list-disc list-inside mb-4">
            {section.quiz && section.quiz.length > 0 ? (
              section.quiz.map((question, index) => (
                <li key={index} className="mb-2">
                  <strong>Question:</strong> {question.questionText}
                  <ul className="list-decimal list-inside pl-4 mt-1">
                    {question.options.map((option, idx) => (
                      <li
                        key={idx}
                        className={
                          option.isCorrect
                            ? "text-green-600 font-semibold"
                            : "text-gray-800"
                        }
                      >
                        {option.optionText}
                      </li>
                    ))}
                  </ul>
                </li>
              ))
            ) : (
              <li>No quiz available</li>
            )}
          </ul>
          <p className="text-gray-600 mb-2">
            <strong>Created At:</strong>{" "}
            {new Date(section.createdAt).toLocaleString()}
          </p>
        </div>
      ) : (
        <p className="text-gray-500">Loading section details...</p>
      )}
    </div>
  );
}
