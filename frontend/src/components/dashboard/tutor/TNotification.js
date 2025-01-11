import React from "react";
import Sidebar from "../Sidebar";

export default function TNotification() {
  // Sample notifications data
  const notifications = [
    {
      id: 1,
      courseName: "C++ Programming",
      studentName: "John Doe",
      email: "john.doe@example.com",
      scheduledTime: "10:30 AM",
      scheduledDate: "2025-01-10",
    },
    {
      id: 2,
      courseName: "Java OOP Concepts",
      studentName: "Jane Smith",
      email: "jane.smith@example.com",
      scheduledTime: "2:00 PM",
      scheduledDate: "2025-01-12",
    },
    {
      id: 3,
      courseName: "HTML Basics",
      studentName: "David Brown",
      email: "david.brown@example.com",
      scheduledTime: "4:15 PM",
      scheduledDate: "2025-01-15",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Notifications</h1>

        {/* Notifications Section */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition duration-200"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {notification.courseName}
              </h2>
              <p className="text-gray-600">
                <strong>Student:</strong> {notification.studentName}
              </p>
              <p className="text-gray-600">
                <strong>Email:</strong> {notification.email}
              </p>
              <p className="text-gray-600">
                <strong>Scheduled Time:</strong> {notification.scheduledTime}
              </p>
              <p className="text-gray-600">
                <strong>Scheduled Date:</strong> {notification.scheduledDate}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
