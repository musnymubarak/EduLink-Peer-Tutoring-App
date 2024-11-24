import { useState } from "react";
import React from 'react';
import { motion } from 'framer-motion';

export default function SignUp() {
  const tabData = [
    {
      id: 1,
      tabName: "Student",
      type: "student", 
    },
    {
      id: 2,
      tabName: "Tutor",
      type: "tutor", 
    },
  ];

  const [field, setField] = useState("student"); 

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }} 
      animate={{ scale: 1, opacity: 1 }} 
      transition={{ duration: 0.8 }}
    >
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#121212] to-[#00bcd4]">
        <div className="w-full max-w-lg bg-richblack-800 p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl duration-500 mt-20">
        <h1 className="text-2xl font-semibold text-richblack-5 mb-6 text-center">Register Here</h1>
            
            <div
            style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="relative flex bg-richblack-800 p-1 gap-x-1 my-6 rounded-full max-w-max"
            >
            {tabData.map((tab) => (
                <button
                key={tab.id}
                onClick={() => setField(tab.type)}
                className={`py-2 px-5 rounded-lg transition-all duration-200 text-lg font-semibold
                  ${field === tab.type ? 'bg-yellow-200 text-richblack-900' : 'bg-transparent text-richblack-5'}`}
                >
                {tab?.tabName}
                </button>
            ))}

            
            <div
                className="absolute bottom-0 left-0 h-0.5 bg-yellow-300 transition-all duration-300"
                style={{
                width: field === "student" ? "50%" : "50%",
                transform: field === "student" ? "translateX(0%)" : "translateX(100%)",
                }}
            />
            </div>

            
            <form className="flex w-full flex-col gap-y-4">
            <div className="flex gap-x-4">
                <label className="w-full">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                    First Name <sup className="text-pink-200">*</sup>
                </p>
                <input
                    required
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }}
                    className="w-full max-w-md rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 border border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-opacity-50 transition-all hover:border-yellow-300"
                />
                </label>
                <label className="w-full">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                    Last Name <sup className="text-pink-200">*</sup>
                </p>
                <input
                    required
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }}
                    className="w-full max-w-md rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 border border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-opacity-50 transition-all hover:border-yellow-300"
                />
                </label>
            </div>
            <label className="w-full">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Email Address <sup className="text-pink-200">*</sup>
                </p>
                <input
                required
                type="email"
                name="email"
                placeholder="Enter email address"
                style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className="w-full max-w-md rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 border border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-opacity-50 transition-all hover:border-yellow-300"
                />
            </label>
            <div className="flex gap-x-4">
                <label className="w-full relative">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                    Create Password <sup className="text-pink-200">*</sup>
                </p>
                <input
                    required
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }}
                    className="w-full max-w-md rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5 border border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-opacity-50 transition-all hover:border-yellow-300"
                />
                </label>
                <label className="w-full relative">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                    Confirm Password <sup className="text-pink-200">*</sup>
                </p>
                <input
                    required
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }}
                    className="w-full max-w-md rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5 border border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-opacity-50 transition-all hover:border-yellow-300"
                />
                </label>
            </div>
            <button
                type="submit"
                className="mt-6 w-full max-w-md rounded-[8px] bg-yellow-200 py-[8px] px-[12px] font-medium text-richblack-900 transition-all hover:scale-105 duration-300"
            >
                Create Account
            </button>
            </form>
        </div>
        </div>
    </motion.div>
  );
}
