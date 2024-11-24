import { useState } from "react";
import React from 'react';
import { motion } from 'framer-motion';

export default function Login() {
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
      <div className="flex justify-center items-center min-h-screen" 
        style={{ background: 'linear-gradient(135deg, #121212, #00bcd4)' }}>

        <div className="w-full max-w-lg bg-richblack-800 p-8 rounded-xl shadow-xl transform transition-transform hover:scale-105 hover:shadow-2xl duration-500 mt-20">
          <h1 className="text-3xl font-semibold text-richblack-5 mb-8 text-center">Login Here</h1>

          <div
            className="relative flex bg-richblack-800 p-1 gap-x-1 my-6 max-w-max"
          >
            {tabData.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setField(tab.type)}
                className={`py-3 px-6 rounded-lg text-lg font-semibold transition-all duration-200 ease-in-out`}>
                {tab.tabName}
              </button>
            ))}

            
            <div
              className="absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-300"
              style={{
                width: field === "student" ? "50%" : "50%",
                transform: field === "student" ? "translateX(0%)" : "translateX(100%)",
              }}
            />
          </div>

          
          <form className="flex w-full flex-col gap-y-6">
            <label className="w-full">
              <p className="mb-2 text-[0.875rem] leading-[1.375rem] text-richblack-5">
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
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className="w-full max-w-md rounded-lg bg-richblack-800 p-[14px] pr-10 text-richblack-5 border border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-opacity-50 transition-all hover:border-yellow-300"
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
