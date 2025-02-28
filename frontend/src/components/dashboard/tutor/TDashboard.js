import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import Header from "../Header";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";

export default function TDashboard() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [classRequests, setClassRequests] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const tutorExtraDetails = {
    rating: 4.8,
    experience: "5 years",    
    upcomingSessions: [
      { id: 1, topic: "Functions in C", date: "2024-12-10", time: "10:00 AM" },
      { id: 2, topic: "Data Structures", date: "2024-12-11", time: "2:00 PM" },
    ],
  };

  // Debug function
  const logRequestData = (data) => {
    console.log("Request data structure:", JSON.stringify(data, null, 2));
  };

  // Fetch class requests with course details
  const fetchClassRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Authentication token is missing. Please log in.");
        return;
      }
      
      const response = await axios.get("http://localhost:4000/api/v1/classes/class-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if classRequests exists in the response
      if (response.data && response.data.classRequests) {
        // Simply set the requests first to ensure they appear
        setClassRequests(response.data.classRequests);
        
        // Then try to enrich them with course details if possible
        try {
          const requestsWithCourses = await Promise.all(
            response.data.classRequests.map(async (req) => {
              try {
                // Check if course ID exists before making the second request
                if (req.course && req.course._id) {
                  const courseResponse = await axios.get(
                    `http://localhost:4000/api/v1/courses/${req.course._id}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  
                  if (courseResponse.data && courseResponse.data.data) {
                    const courseName = courseResponse.data.data.courseName || "Unknown Course";
                    return {
                      ...req,
                      course: {
                        ...req.course,
                        title: courseName
                      }
                    };
                  }
                }
                // If we couldn't get course details, just ensure the title exists
                return {
                  ...req,
                  course: {
                    ...req.course,
                    title: req.course?.title || "Course"
                  }
                };
              } catch (err) {
                console.error("Error fetching course details:", err);
                // Return the original request with a fallback title
                return {
                  ...req,
                  course: {
                    ...req.course,
                    title: req.course?.title || "Course"
                  }
                };
              }
            })
          );
          
          // Sort requests by time (newest first)
          const sortedRequests = requestsWithCourses.sort((a, b) => {
            const timeA = a.time ? new Date(a.time).getTime() : 0;
            const timeB = b.time ? new Date(b.time).getTime() : 0;
            return timeB - timeA; // descending order (newest first)
          });
          
          setClassRequests(sortedRequests);
        } catch (err) {
          console.error("Error enriching request data:", err);
          // Keep the original requests if enrichment fails, but still sort them
          const sortedRequests = [...response.data.classRequests].sort((a, b) => {
            const timeA = a.time ? new Date(a.time).getTime() : 0;
            const timeB = b.time ? new Date(b.time).getTime() : 0;
            return timeB - timeA; // descending order (newest first)
          });
          setClassRequests(sortedRequests);
        }
      } else {
        console.error("Unexpected response format:", response.data);
        setError("Unexpected response format from the server");
      }
    } catch (err) {
      console.error("Error fetching class requests:", err);
      setError("Failed to fetch class requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch total enrolled students
  const fetchTotalStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token is missing. Please log in.");
        return;
      }

      // Decode the token to get tutorId
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));
      const tutorId = payload.id; // Extract tutor ID from token
      
      const response = await axios.get(`http://localhost:4000/api/v1/tutor/${tutorId}/enrolled-students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.success) {
        setTotalStudents(response.data.totalStudentsEnrolled);
      }
    } catch (err) {
      console.error("Error fetching total students:", err);
      setError("Failed to fetch student count. Please try again.");
    }
  };

  // Handle request actions
  const handleRequestAction = async (requestId, status) => {
    try {
      // Close modal first
      setIsModalOpen(false);
      
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token is missing. Please log in.");
        return;
      }
      
      // Make the API request
      await axios.post(
        `http://localhost:4000/api/v1/classes/handle-request/${requestId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // If we get here without an error being thrown, refresh the page
      window.location.reload();
      
    } catch (err) {
      console.error("Error handling request:", err);
      
      // Show alert with more detailed error information if available
      const errorMessage = err.response?.data?.message || "Failed to update request status. Please try again.";
      alert(errorMessage);
      
      // Re-open the modal in case of error
      setIsModalOpen(true);
    }
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleAccept = () => {
    if (selectedRequest && selectedRequest._id) {
      handleRequestAction(selectedRequest._id, "Accepted");
    } else {
      console.error("No request selected or missing ID");
      alert("Error: Cannot process request. Missing request ID.");
    }
  };

  const handleDecline = () => {
    if (selectedRequest && selectedRequest._id) {
      handleRequestAction(selectedRequest._id, "Rejected");
    } else {
      console.error("No request selected or missing ID");
      alert("Error: Cannot process request. Missing request ID.");
    }
  };

  const navigateToRequestsPage = () => {
    navigate("/dashboard/tutor/requests"); // Navigate to requests page
  };

  useEffect(() => {
    fetchClassRequests();
    fetchTotalStudents();
  }, []);

  // Helper function to safely access nested properties
  const safelyAccess = (obj, path, fallback = "") => {
    try {
      const keys = path.split('.');
      return keys.reduce((o, key) => (o || {})[key], obj) || fallback;
    } catch (err) {
      return fallback;
    }
  };

  // Get only the 3 latest requests (already sorted by time in fetchClassRequests)
  const latestRequests = classRequests.slice(0, 3);
  const hasMoreRequests = classRequests.length > 3;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Header/>
      <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Tutor Dashboard</h1>

        {/* Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-blue-700">Total Students</h2>
            <p className="text-3xl font-semibold text-gray-800 mt-4">{totalStudents}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-blue-700">Tutor Rating</h2>
            <p className="text-3xl font-semibold text-gray-800 mt-4">{tutorExtraDetails.rating} / 5</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-blue-700">Experience</h2>
            <p className="text-lg text-gray-600 mt-4">{tutorExtraDetails.experience}</p>
          </div>
        </div>

        {/* Recent Requests Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-700">Recent Requests</h2>
            {hasMoreRequests && (
              <button 
                onClick={navigateToRequestsPage}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                View More
              </button>
            )}
          </div>
          
          {loading ? (
            <p className="text-gray-600">Loading requests...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : latestRequests && latestRequests.length > 0 ? (
            <ul className="space-y-4">
              {latestRequests.map((request) => (
                <li
                  key={request._id || Math.random().toString()}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="text-gray-800 font-semibold">
                      {safelyAccess(request, 'student.name') || 
                       safelyAccess(request, 'student.email') || 
                       "Student"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {safelyAccess(request, 'course.title', 'Course')} - 
                      {safelyAccess(request, 'type', 'Class')} Class
                    </p>
                    <p className="text-gray-600 text-sm">
                      {request.time ? new Date(request.time).toLocaleString() : "Scheduled time not available"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded ${
                      request.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                      request.status === "Accepted" ? "bg-green-100 text-green-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {request.status || "Status unknown"}
                    </span>
                    {(!request.status || request.status === "Pending") && (
                      <button
                        onClick={() => handleViewRequest(request)}
                        className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        View Request
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No recent requests available.</p>
          )}
        </div>

        {/* Upcoming Sessions Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Upcoming Sessions</h2>
          {tutorExtraDetails.upcomingSessions.length > 0 ? (
            <ul className="space-y-4">
              {tutorExtraDetails.upcomingSessions.map((session) => (
                <li
                  key={session.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="text-gray-800 font-semibold">{session.topic}</p>
                    <p className="text-gray-600 text-sm">
                      {session.date} at {session.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No upcoming sessions.</p>
          )}
        </div>
      </div>

      {/* Modal for Viewing Request */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Request Details</h2>
            <p className="text-gray-600">
              <strong>Student:</strong> {safelyAccess(selectedRequest, 'student.name') || 
                                        safelyAccess(selectedRequest, 'student.email') || 
                                        "Student"}
            </p>
            <p className="text-gray-600">
              <strong>Course:</strong> {safelyAccess(selectedRequest, 'course.title', 'Course')}
            </p>
            <p className="text-gray-600">
              <strong>Type:</strong> {selectedRequest.type || "Class"}
            </p>
            <p className="text-gray-600">
              <strong>Time:</strong> {selectedRequest.time ? new Date(selectedRequest.time).toLocaleString() : "Not specified"}
            </p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleAccept}
                className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700"
              >
                Accept
              </button>
              <button
                onClick={handleDecline}
                className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow hover:bg-red-700"
              >
                Decline
              </button>
              <button
                onClick={handleCloseModal}
                className="px-6 py-3 bg-gray-500 text-white font-bold rounded-lg shadow hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer/>
    </div>
  );
}