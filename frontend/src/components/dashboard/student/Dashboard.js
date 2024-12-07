import Sidebar from "../Sidebar";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  // Attendance Data (Replace this with real data from your backend)
  const attendanceData = [2, 3, 4, 5, 3, 4, 5]; // Days in a week (e.g., Mon-Sun)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // ChartJS configuration
  const chartData = {
    labels: days,
    datasets: [
      {
        label: "Attendance (Hours)",
        data: attendanceData,
        backgroundColor: "rgba(34, 197, 94, 0.8)", // Stylish green
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Dashboard</h1>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-richblue-800 to-blue-600 text-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold">Welcome, [Student Name]!</h2>
          <p className="mt-2">"Keep pushing forward—success is just around the corner!"</p>
        </div>

        {/* Attendance Chart */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Attendance Graph</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-xl font-bold text-gray-800">Subjects Enrolled</h3>
            <p className="text-3xl font-bold text-richblue-800 mt-2">5</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-xl font-bold text-gray-800">Upcoming Schedule</h3>
            <p className="text-lg text-gray-600 mt-2">Math Class - 10:00 AM</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-xl font-bold text-gray-800">Community Updates</h3>
            <p className="text-lg text-gray-600 mt-2">3 new posts</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Notifications</h3>
          <ul className="space-y-4">
            <li className="flex items-center justify-between">
              <p className="text-gray-600">Math Quiz tomorrow at 9:00 AM</p>
              <span className="bg-red-100 text-red-500 px-3 py-1 rounded-full text-xs">Urgent</span>
            </li>
            <li className="flex items-center justify-between">
              <p className="text-gray-600">New announcement in Community</p>
              <span className="bg-blue-100 text-blue-500 px-3 py-1 rounded-full text-xs">New</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
