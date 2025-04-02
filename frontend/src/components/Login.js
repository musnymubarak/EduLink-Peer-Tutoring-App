import { useState } from "react";
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import { useAccountType } from "./dashboard/AccountTypeContext";
import "./css/Login.css";

export default function Login() {
  const { setAccountType } = useAccountType();
  const tabData = [
    { id: 1, tabName: "Student", type: "Student" },
    { id: 2, tabName: "Tutor", type: "Tutor" },
  ];

  const [field, setField] = useState("Student");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await axios.post("http://localhost:4000/api/v1/auth/login", {
        email,
        password,
        accountType: field,
      });

      console.log(response.data);

      const { token, user } = response.data;
      const { accountType } = user;

      if (!accountType) {
        throw new Error("Account type is missing from the response");
      }

      localStorage.setItem("token", token);
      setAccountType(accountType);
      if(accountType.toLowerCase()=='tutor'){
        navigate('/dashboard/tutor/your-subjects')
      }else if(accountType.toLowerCase()=='student'){
        navigate('/dashboard/student/subjects');
      }
      
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
      <div className="flex justify-center items-center min-h-screen login-container">
        <div className="w-full max-w-lg bg-richblack-800 p-8 rounded-xl shadow-xl transform transition-transform hover:scale-105 hover:shadow-2xl duration-500 mt-20 login-form-container">
          <h1 className="text-3xl font-semibold mb-8 text-center">Login Here</h1>

          <div className="relative flex bg-richblack-800 p-1 gap-x-1 my-6 rounded-full max-w-max">
            {tabData.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setField(tab.type)}
                className={`tab-button py-2 px-5 rounded-lg transition-all duration-200 text-lg font-semibold ${
                  field === tab.type ? "active" : ""
                }`}
              >
                {tab?.tabName}
              </button>
            ))}
          </div>

          <form className="flex w-full flex-col gap-y-6" onSubmit={handleLogin}>
            <label className="w-full">
            <p className="mb-2 text-[0.875rem] leading-[1.375rem] text-white">
              Email Address <sup className="text-pink-200">*</sup>
            </p>

              <input
                required
                type="email"
                name="email"
                placeholder="Enter email address"
                className="login-input w-full max-w-md rounded-lg p-[14px] border border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-opacity-50 transition-all hover:border-yellow-300"
              />
            </label>
            <label className="w-full relative">
            <p className="mb-2 text-[0.875rem] leading-[1.375rem] text-white">
              Password <sup className="text-pink-200">*</sup>
            </p>

              <input
                required
                type="password"
                name="password"
                placeholder="Enter Password"
                className="login-input w-full max-w-md rounded-lg p-[14px] border border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-opacity-50 transition-all hover:border-yellow-300"
              />
            </label>
            <button
              type="submit"
              className="login-button mt-6 w-full max-w-md rounded-lg py-3 px-6 text-lg font-medium transition-all hover:scale-105 duration-300"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
