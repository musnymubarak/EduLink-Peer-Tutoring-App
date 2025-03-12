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

  return (
    <div
      className={`flex flex-col transition-all ease-out duration-200 w-64 border-r-[1px] border-richblack-700 h-[calc(100vh-4rem)] 
          bg-richblue-800 py-10 fixed z-[5000] top-[4rem] overflow-y-auto
          ${clicked ? "left-0" : "left-[-222px]"} md:relative md:left-0`}
    >
      <p
        onClick={() => setClicked((prev) => !prev)}
        className="absolute text-[25px] visible md:hidden top-2 right-[-20px] z-[1000] text-red-500 cursor-pointer"
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

    </div>
  );
};

export default Sidebar;
