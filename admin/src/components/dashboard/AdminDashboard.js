import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ students: 0, tutors: 0, courses: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [studentsRes, tutorsRes, coursesRes] = await Promise.all([
          axios.get("http://localhost:4000/api/students/count"),
          axios.get("http://localhost:4000/api/tutors/count"),
          axios.get("http://localhost:4000/api/courses/count"),
        ]);
        setCounts({
          students: studentsRes.data.count,
          tutors: tutorsRes.data.count,
          courses: coursesRes.data.count,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };
    fetchCounts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-semibold text-center mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Total Students</h2>
            <p className="text-2xl font-bold">{counts.students}</p>
          </div>
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Total Tutors</h2>
            <p className="text-2xl font-bold">{counts.tutors}</p>
          </div>
          <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Total Courses</h2>
            <p className="text-2xl font-bold">{counts.courses}</p>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
