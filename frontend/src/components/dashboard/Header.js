import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { VscSignOut } from "react-icons/vsc";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {

  return (
    <header className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center fixed top-0 left-0 z-50">
      {/* Logo (Left) */}
      <Link to="/" className="flex items-center">
        <img
          src="https://res.cloudinary.com/dhgyagjqw/image/upload/v1739942364/course_thumbnails/hmsikyqccdadddnkunuk.png"
          alt="EduLink Logo"
          className="h-12"
        />
      </Link>

      {/* Centered Text - EduLink with Matching Colors */}
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

      {/* Right Section: Profile & Logout */}
      <div className="flex gap-x-4 items-center">
        <button 
          onClick={handleProfileClick} 
          className="text-xl text-gray-700 hover:text-gray-900"
        >
          <FaUserCircle />
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
