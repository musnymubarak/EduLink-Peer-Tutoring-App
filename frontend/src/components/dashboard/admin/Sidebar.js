import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/", icon: "🏠" },
    { name: "Add Tutor", path: "/add-tutor", icon: "👩‍🏫" },
    { name: "Add Student", path: "/add-student", icon: "👩‍🎓" },
    { name: "Add Subject", path: "/add-subject", icon: "📚" },
    { name: "Manage Tutors", path: "/manage-tutors", icon: "👨‍🏫" },
    { name: "Manage Students", path: "/manage-students", icon: "🎓" },
    { name: "Manage Subjects", path: "/manage-subjects", icon: "📖" },
    { name: "Notifications", path: "/notifications", icon: "🔔" },
  ];

  return (
    <div className="sidebar w-60 bg-gray-800 text-white h-full">
      <h3 className="text-center text-lg font-bold py-4">Admin Panel</h3>
      <ul>
        {menuItems.map((item, index) => (
          <li key={index} className="p-4 hover:bg-gray-700">
            <NavLink to={item.path} className="flex items-center">
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
