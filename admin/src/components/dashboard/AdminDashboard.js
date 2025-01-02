import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token on logout
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-semibold text-center mb-6">Admin Dashboard</h1>

        {/* Placeholder for admin dashboard content */}
        <div className="text-center mb-6">
          <p>Welcome to the Admin Dashboard. Here you can manage various aspects of the platform.</p>
        </div>

        {/* Logout Button */}
        <div className="text-center mt-6">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
