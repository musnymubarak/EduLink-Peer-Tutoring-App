import { useState } from "react";
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
  
export default function AdminLogin() {
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate(); // To navigate after login

  // Handle login form submission
  const handleLogin = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      // Send login request with email, password, and accountType as "Admin"
      const response = await axios.post("http://localhost:4000/api/v1/auth/login", {
        email,
        password,
        accountType: "Admin", // Fixed accountType
      });

      const { token, user } = response.data;

      // Ensure the user has the "Admin" account type
      if (user.accountType !== "Admin") {
        throw new Error("Access denied. Only Admins can log in here.");
      }

      // Store the token in localStorage
      localStorage.setItem("token", token);
      console.log(localStorage.getItem("token"));

      // Redirect to the Admin dashboard
      navigate("/dashboard/admin");
    } catch (error) {
      console.error("Login failed:", error.message || error.response?.data?.message);
      setError(error.message || error.response?.data?.message || "Unexpected error");
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div
        className="flex justify-center items-center min-h-screen"
        style={{ background: "linear-gradient(135deg, #121212, #00bcd4)" }}
      >
        <div className="w-full max-w-lg bg-richblack-800 p-8 rounded-xl shadow-xl transform transition-transform hover:scale-105 hover:shadow-2xl duration-500 mt-20">
          <h1 className="text-3xl font-semibold text-richblack-5 mb-8 text-center">
            Admin Login
          </h1>

          {/* Display error message if login fails */}
          {error && (
            <div className="mb-4 text-red-500 text-center">
              {error}
            </div>
          )}

          {/* Login form */}
          <form className="flex w-full flex-col gap-y-6" onSubmit={handleLogin}>
            <label className="w-full">
              <p className="mb-2 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Email Address <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type="email"
                name="email"
                placeholder="Enter Admin email address"
                className="w-full max-w-md rounded-lg bg-richblack-800 p-[14px] text-richblack-5 border border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-opacity-50 transition-all hover:border-yellow-300"
              />
            </label>
            <label className="w-full relative">
              <p className="mb-2 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type="password"
                name="password"
                placeholder="Enter Admin Password"
                className="w-full max-w-md rounded-lg bg-richblack-800 p-[14px] text-richblack-5 border border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-opacity-50 transition-all hover:border-yellow-300"
              />
            </label>
            <button
              type="submit"
              className="mt-6 w-full max-w-md rounded-lg bg-black py-3 px-6 text-lg font-medium text-white transition-all hover:scale-105 duration-300"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
