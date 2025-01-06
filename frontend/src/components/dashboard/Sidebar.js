import React, { useState } from "react";
import { sidebarLinks as LINKS } from "../../data/dashboard-links";
import SidebarLinks from "./SideBarLinks";
import { VscSignOut } from "react-icons/vsc";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { useAccountType } from "./AccountTypeContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const Sidebar = () => {
  const [clicked, setClicked] = useState(true); // Default to true to show sidebar initially
  const { accountType } = useAccountType(); // Fetch account type from context
  const navigate = useNavigate(); // Hook for navigation

  // Ensure accountType is in lowercase
  const normalizedAccountType = accountType.toLowerCase();

  // Function to handle logout
  const handleLogout = () => {
    // Clear authentication data from localStorage or context (e.g., JWT token)
    localStorage.removeItem("token"); // Clear token from localStorage
    // You can also remove any other related user data if stored (e.g., user info)

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <div
      className={`flex flex-col transition-all ease-out duration-200 w-64 border-r-[1px] border-richblack-700 h-full bg-richblue-800 py-10
          fixed z-[5000] ${
            clicked ? "left-0" : "left-[-222px]"
          } md:relative md:left-0`}
    >
      <p
        onClick={() => setClicked((prev) => !prev)}
        className="absolute text-[25px] visible md:hidden top-2 right-[-20px] z-[1000] text-red-500"
      >
        {!clicked ? <FaArrowAltCircleRight /> : <IoMdCloseCircle />}
      </p>

      <div className="flex flex-col h-full">
        {LINKS.map((link) => {
          // Filter links based on the normalized account type
          if (link.type && link.type.toLowerCase() !== normalizedAccountType) {
            return null;
          }
          return (
            <SidebarLinks
              setClicked={setClicked}
              key={link.id}
              iconName={link.icon}
              link={link}
            />
          );
        })}
      </div>

      <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-600">
        <button className="text-sm font-medium text-richblack-300" />
        <div
          onClick={handleLogout} // Add onClick to trigger logout
          className="flex text-center text-[13px] px-6 py-2 hover:cursor-pointer hover:scale-95 transition-all duration-200 rounded-md font-bold bg-red-500 text-black items-center gap-x-2 justify-center"
        >
          <VscSignOut className="text-lg" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
