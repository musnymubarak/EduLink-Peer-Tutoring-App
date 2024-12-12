import { useState } from "react";
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import { useAccountType } from "./dashboard/AccountTypeContext"; // Import context for managing account type

export default function Login() {
  const { setAccountType } = useAccountType(); // Access the context to set the account type

  // Tab data for account type selection
  const tabData = [
    { id: 1, tabName: "Student", type: "Student" },
    { id: 2, tabName: "Tutor", type: "Instructor" },
    { id: 3, tabName: "Admin", type: "Admin" },
  ];

  // Default field is "Student", this will be updated based on user selection
  const [field, setField] = useState("Student");

  const navigate = useNavigate(); // To navigate after login

  // Handle login form submission
  const handleLogin = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      // Send login request with email, password, and selected accountType
      const response = await axios.post("http://localhost:4000/api/v1/auth/login", {
        email,
        password,
        accountType: field,
      });

      // Log the response to check the structure
      console.log(response.data);

      const { token, user } = response.data;  // Destructure the user object
      const { accountType } = user;  // Access accountType from the user object

      // Ensure accountType is present
      if (!accountType) {
        throw new Error("Account type is missing from the response");
      }

      // Store the token and accountType in localStorage
      localStorage.setItem("token", token);
      setAccountType(accountType); // Set the accountType in the context

      // Redirect to the appropriate dashboard based on accountType
      navigate(`/dashboard/${accountType.toLowerCase()}`);
    } catch (error) {
      console.error("Login failed:", error.message || error.response?.data?.message);
      alert("Login failed: " + (error.message || error.response?.data?.message || "Unexpected error"));
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Navbar />
      <div
        className="flex justify-center items-center min-h-screen"
        style={{ background: "linear-gradient(135deg, #121212, #00bcd4)" }}
      >
        <div className="w-full max-w-lg bg-richblack-800 p-8 rounded-xl shadow-xl transform transition-transform hover:scale-105 hover:shadow-2xl duration-500 mt-20">
          <h1 className="text-3xl font-semibold text-richblack-5 mb-8 text-center">
            Login Here
          </h1>

          {/* Tab buttons for account type selection */}
          <div className="relative flex bg-richblack-800 p-1 gap-x-1 my-6 max-w-max">
            {tabData.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setField(tab.type)} // Update the field on tab click
                className={`py-3 px-6 rounded-lg text-lg font-semibold transition-all duration-200 ease-in-out ${
                  field === tab.type ? "bg-yellow-300 text-black" : "text-white"
                }`}
              >
                {tab.tabName}
              </button>
            ))}
            {/* Bottom indicator to show the selected account type */}
            <div
              className="absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-300"
              style={{
                width: "33.33%",
                transform:
                  field === "Student"
                    ? "translateX(0%)"
                    : field === "Instructor"
                    ? "translateX(100%)"
                    : "translateX(200%)",
              }}
            />
          </div>

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
                placeholder="Enter email address"
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
                placeholder="Enter Password"
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