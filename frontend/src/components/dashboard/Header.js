import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { VscSignOut } from "react-icons/vsc";
import { HiOutlineUserCircle, HiUserCircle } from "react-icons/hi";
import { IoIosNotificationsOutline, IoIosNotifications } from "react-icons/io";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [accountType, setAccountType] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const storedAccountType = localStorage.getItem("accountType");
    if (storedAccountType) {
      setAccountType(storedAccountType.toLowerCase());
    }
  }, []);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:4000/api/v1/notifications/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const unreadNotifications = response.data.notifications.filter(
          (notification) => notification.status === "unread"
        ).length;

        setUnreadCount(unreadNotifications);
      } catch (error) {
        console.error("Failed to fetch unread notifications count", error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accountType");
    navigate("/login");
  };

  const handleProfileClick = () => {
    if (accountType === "student") {
      navigate("/dashboard/student/profile");
    } else if (accountType === "tutor") {
      navigate("/dashboard/tutor/profile");
    } else {
      navigate("/login");
    }
  };

  const handleNotificationClick = () => {
    if (accountType === "student") {
      navigate("/dashboard/student/noti");
    } else if (accountType === "tutor") {
      navigate("/dashboard/tutor/noti");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center fixed top-0 left-0 z-50">
      <Link to="/" className="flex items-center">
        <img
          src="https://res.cloudinary.com/dhgyagjqw/image/upload/v1739942364/course_thumbnails/hmsikyqccdadddnkunuk.png"
          alt="EduLink Logo"
          className="h-12"
        />
      </Link>

      <h1
        className="text-3xl font-extrabold tracking-wide"
        style={{
          fontFamily: "'Poppins', sans-serif",
          background: "linear-gradient(to right, #4CAF50, #222, #2196F3)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        EduLink
      </h1>

      <div className="flex gap-x-4 items-center">
        <button
          onClick={handleNotificationClick}
          className={`relative text-3xl hover:text-gray-900 transition-all ${location.pathname.includes("noti") ? "text-blue-500" : "text-gray-700"}`}
        >
          {location.pathname.includes("noti") ? <IoIosNotifications /> : <IoIosNotificationsOutline />}
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-0.5 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={handleProfileClick}
          className={`text-3xl hover:text-gray-900 transition-all ${location.pathname.includes("profile") ? "text-blue-500" : "text-gray-700"}`}
        >
          {location.pathname.includes("profile") ? <HiUserCircle /> : <HiOutlineUserCircle />}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-x-2 text-white bg-red-500 px-4 py-2 rounded-md hover:scale-95 transition-all duration-200"
        >
          <VscSignOut />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;