import React from "react";
import { Link } from "react-router-dom"; // Use Link to navigate between pages

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-gray-800 text-white p-6">
      <h2 className="text-2xl font-semibold text-center mb-8">Admin Panel</h2>

      {/* Sidebar Links */}
      <ul>
        <li className="mb-4">
          <Link to="/dashboard/admin" className="hover:bg-gray-700 p-2 rounded-md block">
            Dashboard
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/dashboard/admin/add-course" className="hover:bg-gray-700 p-2 rounded-md block">
            Add Course
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/dashboard/admin/add-section" className="hover:bg-gray-700 p-2 rounded-md block">
            Add Section
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/dashboard/admin/list-courses" className="hover:bg-gray-700 p-2 rounded-md block">
            List Courses
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/dashboard/admin/list-tutors" className="hover:bg-gray-700 p-2 rounded-md block">
            List Tutors
          </Link>
        </li>
        {/* Add other links as needed */}
      </ul>
    </div>
  );
};

export default Sidebar;
