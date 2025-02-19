import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import Footer from "../Footer";

export default function TDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const recentRequests = [
    { id: 1, student: "Alice Johnson", topic: "Control Structures", date: "2024-12-08" },
    { id: 2, student: "Bob Smith", topic: "OOP Basics", date: "2024-12-07" },
  ];

  const currentStudents = 5;
  const tutorDetails = {
    rating: 4.8,
    experience: "5 years",
    upcomingSessions: [
      { id: 1, topic: "Functions in C", date: "2024-12-10", time: "10:00 AM" },
      { id: 2, topic: "Data Structures", date: "2024-12-11", time: "2:00 PM" },
    ],
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
    console.log(`Accepted request: ${selectedRequest.id}`);
    handleCloseModal();
  };

  const handleDecline = () => {
    console.log(`Declined request: ${selectedRequest.id}`);
    handleCloseModal();
  };

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
            <h2 className="text-xl font-bold text-blue-700">Current Students</h2>
            <p className="text-3xl font-semibold text-gray-800 mt-4">{currentStudents}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-blue-700">Tutor Rating</h2>
            <p className="text-3xl font-semibold text-gray-800 mt-4">{tutorDetails.rating} / 5</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-blue-700">Experience</h2>
            <p className="text-lg text-gray-600 mt-4">{tutorDetails.experience}</p>
          </div>
        </div>

        {/* Recent Requests Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Recent Requests</h2>
          {recentRequests.length > 0 ? (
            <ul className="space-y-4">
              {recentRequests.map((request) => (
                <li
                  key={request.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="text-gray-800 font-semibold">{request.student}</p>
                    <p className="text-gray-600 text-sm">{request.topic}</p>
                  </div>
                  <button
                    onClick={() => handleViewRequest(request)}
                    className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    View Request
                  </button>
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
          {tutorDetails.upcomingSessions.length > 0 ? (
            <ul className="space-y-4">
              {tutorDetails.upcomingSessions.map((session) => (
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
              <strong>Student:</strong> {selectedRequest.student}
            </p>
            <p className="text-gray-600">
              <strong>Topic:</strong> {selectedRequest.topic}
            </p>
            <p className="text-gray-600">
              <strong>Date:</strong> {selectedRequest.date}
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
