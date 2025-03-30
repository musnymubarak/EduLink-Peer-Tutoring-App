import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import axios from "axios";
import Header from "../Header";
import Footer from "../Footer";

export default function TNotification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: No token found.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:4000/api/v1/notifications/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNotifications(response.data.notifications);
      } catch (err) {
        setError("Failed to fetch notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found.");
        return;
      }
      
      await axios.patch(
        `http://localhost:4000/api/v1/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, status: "read" }
            : notification
        )
      );
    } catch (err) {
      setError("Failed to mark notification as read.");
    }
  };

  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.message.toLowerCase().includes(searchQuery) ||
      notification.status.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="flex min-h-screen pt-20 bg-gray-100">
      <Header/>
      <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Notifications</h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search notifications by message or status..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full border text-black border-gray-300 rounded-lg p-3 placeholder-gray-600"
          />
        </div>
        {loading ? (
          <p className="text-gray-600">Loading notifications...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : filteredNotifications.length === 0 ? (
          <p className="text-gray-600">No notifications match your search.</p>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-lg shadow p-6 hover:shadow-lg transition duration-200 ${
                  notification.status === "unread"
                    ? "border-l-4 border-blue-500"
                    : "border-l-4 border-gray-300"
                }`}
              >
                <p className="text-gray-800 font-medium">{notification.message}</p>
                <p className="text-gray-600">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`${
                      notification.status === "unread"
                        ? "text-blue-500"
                        : "text-gray-500"
                    }`}
                  >
                    {notification.status}
                  </span>
                </p>
                <p className="text-gray-600">
                  <strong>Created At:</strong>{" "}
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
                {notification.status === "unread" && (
                  <button
                    onClick={() => handleMarkAsRead(notification._id)}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}