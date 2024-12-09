import React from "react"; // Removed useState since it's not used
import Sidebar from "../Sidebar";
import Header from "../Header";
import Footer from "../Footer";
import { Bell, CheckCircle, AlertTriangle } from "lucide-react";

const NotificationItem = ({ icon, title, description, time, isRead }) => (
  <div
    className={`flex items-center justify-between p-4 rounded-lg shadow ${
      isRead ? "bg-gray-100" : "bg-white"
    }`}
  >
    <div className="flex items-center space-x-3">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isRead ? "bg-gray-300" : "bg-blue-100"
        }`}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
    <div className="text-right">
      <span className="text-xs text-gray-400">{time}</span>
    </div>
  </div>
);

const NotificationPage = () => {
  const notifications = [
    {
      icon: <Bell className="text-blue-600" size={24} />,
      title: "New Session Booked",
      description: "Jane Smith booked a new tutoring session.",
      time: "10 mins ago",
      isRead: false,
    },
    {
      icon: <CheckCircle className="text-green-600" size={24} />,
      title: "Session Completed",
      description: "Mike Johnson completed a tutoring session.",
      time: "2 hours ago",
      isRead: true,
    },
    {
      icon: <AlertTriangle className="text-yellow-600" size={24} />,
      title: "Profile Update Required",
      description: "John Doe needs to update profile settings.",
      time: "1 day ago",
      isRead: false,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          <div className="container mx-auto max-w-7xl">
            {/* Page Title */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">Notifications</h1>
              <p className="text-sm text-gray-600">
                View and manage all your notifications.
              </p>
            </div>

            {/* Notifications List */}
            <div className="grid grid-cols-1 gap-4">
              {notifications.map((notification, index) => (
                <NotificationItem
                  key={index}
                  icon={notification.icon}
                  title={notification.title}
                  description={notification.description}
                  time={notification.time}
                  isRead={notification.isRead}
                />
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default NotificationPage;
