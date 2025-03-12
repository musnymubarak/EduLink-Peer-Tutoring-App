import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import Header from "../Header";
import Footer from "../Footer";
import "../../css/student/Dashboard.css"; // Import CSS file

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [userName, setUserName] = useState("");

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/v1/profile/student", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUserName(response.data.name);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Attendance Data
  const attendanceData = [2, 3, 4, 5, 3, 4, 5];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const chartData = {
    labels: days,
    datasets: [
      {
        label: "Attendance (Hours)",
        data: attendanceData,
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Weekly Attendance Overview",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Hours",
        },
      },
      x: {
        title: {
          display: true,
          text: "Days",
        },
      },
    },
  };

  return (
    <div className="dashboard-container">
      <Header />

      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        <h1 className="dashboard-title">Dashboard</h1>

        {/* Welcome Section */}
        <div className="welcome-section">
          <h2 className="welcome-title">Welcome, {userName || "Student"}!</h2>
          <p className="welcome-text">"Keep pushing forward—success is just around the corner!"</p>
        </div>

        {/* Attendance Chart */}
        <div className="chart-container">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Attendance Graph</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Overview Cards */}
        <div className="overview-grid">
          <div className="overview-card">
            <h3>Subjects Enrolled</h3>
            <p>5</p>
          </div>
          <div className="overview-card">
            <h3>Upcoming Schedule</h3>
            <p className="text-lg text-gray-600 mt-2">Math Class - 10:00 AM</p>
          </div>
          <div className="overview-card">
            <h3>Community Updates</h3>
            <p className="text-lg text-gray-600 mt-2">3 new posts</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="notifications-container">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Notifications</h3>
          <ul className="space-y-4">
            <li className="notification-item">
              <p className="text-gray-600">Math Quiz tomorrow at 9:00 AM</p>
              <span className="notification-badge urgent">Urgent</span>
            </li>
            <li className="notification-item">
              <p className="text-gray-600">New announcement in Community</p>
              <span className="notification-badge new">New</span>
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}
