import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import axios from "axios";
import Header from "../Header";
import Footer from "../Footer";
import "../../css/student/notification.css";

export default function Notification() {
  // State to hold the fetched notifications
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // Fetch notifications from the API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from local storage
        if (!token) {
          setError("Unauthorized: No token found.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:4000/api/v1/notifications/",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in request header
            },
          }
        );
        setNotifications(response.data.notifications); // Adjust based on API response structure
      } catch (err) {
        setError("Failed to fetch notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filter notifications based on the search query
  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.message.toLowerCase().includes(searchQuery) ||
      notification.status.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="notification-container">
      <Header/>
      {/* Sidebar */}
      <div className="notification-sidebar">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="notification-main-content">
        <h1 className="notification-title">Notifications</h1>

        {/* Search Bar */}
        <div className="notification-search-bar">
          <input
            type="text"
            placeholder="Search notifications by message or status..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="notification-search-input"
          />
        </div>

        {/* Loading and Error States */}
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
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
