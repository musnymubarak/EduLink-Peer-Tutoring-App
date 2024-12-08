import React, { useState } from "react";
import { LayoutDashboard, Users, BookOpen, Bell, X } from "lucide-react";
import { NavLink } from "react-router-dom";

// Sidebar Component
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/AdminDashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Manage Tutors",
      icon: Users,
      subItems: [
        { name: "Add Tutor", path: "/add-tutor" },
        { name: "Tutor List", path: "/tutor-list" },
      ],
    },
    {
      name: "Manage Students",
      icon: Users,
      subItems: [
        { name: "Add Student", path: "/add-student" },
        { name: "Student List", path: "/student-list" },
      ],
    },
    {
      name: "Subjects",
      icon: BookOpen,
      subItems: [
        { name: "Add Subject", path: "/add-subject" },
        { name: "Subject List", path: "/subject-list" },
      ],
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: Bell,
    },
  ];

  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubmenu = (itemId) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <div
      className={`
        fixed md:relative z-40 w-64 bg-gray-800 text-white h-full
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <button className="md:hidden" onClick={toggleSidebar}>
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="py-4">
        {menuItems.map((item, index) => (
          <div key={index} className="group">
            <button
              onClick={() => {
                setActiveMenu(item.path || item.name.toLowerCase());
                item.subItems && toggleSubmenu(item.name);
              }}
              className={`
                w-full flex items-center p-3 hover:bg-gray-700 
                ${activeMenu === (item.path || item.name.toLowerCase()) ? "bg-gray-700 border-l-4 border-blue-500" : ""}
              `}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
              {item.subItems && (
                <span className="ml-auto">
                  {openSubmenus[item.name] ? "▼" : "►"}
                </span>
              )}
            </button>
            {item.subItems && openSubmenus[item.name] && (
              <div className="pl-10 bg-gray-900">
                {item.subItems.map((subItem, subIndex) => (
                  <NavLink
                    key={subIndex}
                    to={subItem.path}
                    className={`
                      block w-full text-left py-2 text-sm hover:text-blue-300
                      ${activeMenu === subItem.path ? "text-blue-500" : "text-gray-300"}
                    `}
                    onClick={() => setActiveMenu(subItem.path)}
                  >
                    {subItem.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
