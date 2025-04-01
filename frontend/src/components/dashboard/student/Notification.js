import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import axios from "axios";
import Header from "../Header";
import Footer from "../Footer";
import "../../css/student/notification.css";

export default function Notification() {
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
    <div className="notification-container">
      <Header/>
      <div className="notification-sidebar">
        <Sidebar />
      </div>
      <div className="notification-main-content">
        <h1 className="notification-title">Notifications</h1>
        <div className="notification-search-bar">
          <input
            type="text"
            placeholder="Search notifications by message or status..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="notification-search-input"
          />
        </div>
        {loading ? (
          <p className="notification-status">Loading notifications...</p>
        ) : error ? (
          <p className="notification-status" style={{ color: 'red' }}>{error}</p>
        ) : filteredNotifications.length === 0 ? (
          <p className="notification-status">No notifications match your search.</p>
        ) : (
          <div className="notification-list">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`notification-item ${
                  notification.status === "unread" ? "unread" : "read"
                }`}
              >
                <p className="notification-message">{notification.message}</p>
                <p className="notification-status">
                  <strong>Status:</strong>{" "}
                  <span className={notification.status === "unread" ? "unread" : "read"}>
                    {notification.status}
                  </span>
                </p>
                <p className="notification-timestamp">
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