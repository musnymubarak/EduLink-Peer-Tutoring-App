import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import Footer from "../Footer";

export default function TDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [classRequests, setClassRequests] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const tutorExtraDetails = {
    rating: 4.8,
    experience: "5 years",    
    upcomingSessions: [
      { id: 1, topic: "Functions in C", date: "2024-12-10", time: "10:00 AM" },
      { id: 2, topic: "Data Structures", date: "2024-12-11", time: "2:00 PM" },
    ],
  };

  // Fetch class requests
  const fetchClassRequests = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/v1/classes/tutor-class-requests", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setClassRequests(data.classRequests);
      }
    } catch (error) {
      console.error("Error fetching class requests:", error);
    }
  };

  // Fetch total enrolled students
  const fetchTotalStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication token is missing. Please log in.");
        return;
      }

      // Decode the token to get tutorId
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));
      const tutorId = payload.id; // Extract tutor ID from token
      
      const response = await fetch(`http://localhost:4000/api/v1/tutor/${tutorId}/enrolled-students`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setTotalStudents(data.totalStudentsEnrolled);
      }
    } catch (error) {
      console.error("Error fetching total students:", error);
    }
  };

  // Handle request actions
  const handleRequestAction = async (requestId, status) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/classes/handle-request/${requestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        fetchClassRequests(); // Refresh the requests list
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error handling request:", error);
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
    handleRequestAction(selectedRequest._id, "Accepted");
  };

  const handleDecline = () => {
    handleRequestAction(selectedRequest._id, "Rejected");
  };

  useEffect(() => {
    fetchClassRequests();
    fetchTotalStudents();
  }, []);

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
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Recent Requests</h2>
          {classRequests.length > 0 ? (
            <ul className="space-y-4">
              {classRequests.map((request) => (
                <li
                  key={request._id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="text-gray-800 font-semibold">
                      {request.student.name}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {request.course.title} - {request.type} Class
                    </p>
                    <p className="text-gray-600 text-sm">
                      {new Date(request.time).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded ${
                      request.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                      request.status === "Accepted" ? "bg-green-100 text-green-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {request.status}
                    </span>
                    {request.status === "Pending" && (
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
            <p className="text-gray-600">No recent requests.</p>
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
              <strong>Student:</strong> {selectedRequest.student.name}
            </p>
            <p className="text-gray-600">
              <strong>Course:</strong> {selectedRequest.course.title}
            </p>
            <p className="text-gray-600">
              <strong>Type:</strong> {selectedRequest.type}
            </p>
            <p className="text-gray-600">
              <strong>Time:</strong> {new Date(selectedRequest.time).toLocaleString()}
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