import React from "react";
import { Link, useLocation } from "react-router-dom"; // Added useLocation to determine current path

const Sidebar = () => {
  const location = useLocation(); // Get current location
  const currentPath = location.pathname;

  // Function to determine if a link is active
  const isActive = (path) => {
    return currentPath === path;
  };

  // Get active link style
  const getActiveClass = (path) => {
    return isActive(path) 
      ? "bg-gray-600 text-white p-2 rounded-md block" 
      : "hover:bg-gray-700 p-2 rounded-md block";
  };

  return (
    <div className="w-64 min-h-screen bg-gray-800 text-white p-6">
      <h2 className="text-2xl font-semibold text-center mb-8">Admin Panel</h2>
      
      {/* Sidebar Links */}
      <ul>
        <li className="mb-4">
          <Link 
            to="/dashboard/admin" 
            className={getActiveClass("/dashboard/admin")}
          >
            Dashboard
          </Link>
        </li>
        <li className="mb-4">
          <Link 
            to="/dashboard/admin/list-courses" 
            className={getActiveClass("/dashboard/admin/list-courses")}
          >
            List Courses
          </Link>
        </li>
        <li className="mb-4">
          <Link 
            to="/dashboard/admin/list-tutors" 
            className={getActiveClass("/dashboard/admin/list-tutors")}
          >
            List Tutors
          </Link>
        </li>
        <li className="mb-4">
          <Link 
            to="/dashboard/admin/list-reports" 
            className={getActiveClass("/dashboard/admin/list-reports")}
          >
            List Reports
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;