import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const AdminDashboard = ({ children }) => {
  return (
    <div className="admin-dashboard flex h-screen bg-gray-100">
      <Sidebar />
      <div className="main-content flex-1 flex flex-col">
        <Header />
        <div className="content-area flex-1 p-4">{children}</div>
        <Footer />
      </div>
    </div>
  );
};

export default AdminDashboard;
