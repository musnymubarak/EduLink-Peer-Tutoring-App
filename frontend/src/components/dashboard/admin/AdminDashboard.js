import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  Bell 
} from 'lucide-react';

const StatCard = ({ icon, title, value, change, positive }) => (
  <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-center">
      <div className="bg-blue-100 p-3 rounded-full">
        {icon}
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
        <p className={`text-sm ${positive ? 'text-green-500' : 'text-red-500'}`}>
          {change}
        </p>
      </div>
    </div>
  </div>
);

const RecentActivityItem = ({ user, action, time }) => (
  <div className="flex items-center justify-between py-2 border-b last:border-b-0">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <Users size={20} className="text-blue-600" />
      </div>
      <div>
        <p className="text-sm font-medium">{user}</p>
        <p className="text-xs text-gray-500">{action}</p>
      </div>
    </div>
    <span className="text-xs text-gray-400">{time}</span>
  </div>
);

const AdminDashboard = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuSelect = (menuItem) => {
    setSelectedMenu(menuItem);
    console.log("Selected Menu:", menuItem);
  };

  
  const statsData = [
    {
      icon: <Users className="text-blue-600" size={24} />,
      title: "Total Users",
      value: "5,423",
      change: "+12.5%",
      positive: true
    },
    {
      icon: <BookOpen className="text-green-600" size={24} />,
      title: "Total Subjects",
      value: "45",
      change: "+5.3%",
      positive: true
    },
    {
      icon: <CheckCircle className="text-purple-600" size={24} />,
      title: "Completed Sessions",
      value: "2,300",
      change: "+8.7%",
      positive: true
    },
    {
      icon: <Bell className="text-red-600" size={24} />,
      title: "Notifications",
      value: "12",
      change: "-3.5%",
      positive: false
    }
  ];

  const recentActivityData = [
    {
      user: "John Doe",
      action: "Updated profile settings",
      time: "2 mins ago"
    },
    {
      user: "Jane Smith",
      action: "Booked a new tutoring session",
      time: "15 mins ago"
    },
    {
      user: "Mike Johnson",
      action: "Completed a tutoring session",
      time: "1 hour ago"
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        onMenuSelect={handleMenuSelect}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          <div className="container mx-auto max-w-7xl">
            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {statsData.map((stat, index) => (
                <StatCard 
                  key={index}
                  icon={stat.icon}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  positive={stat.positive}
                />
              ))}
            </div>

            {/* Dashboard Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Recent Activity */}
              <div className="bg-white shadow-md rounded-lg p-4 lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Recent Activity</h2>
                  <Bell size={20} className="text-gray-500" />
                </div>
                {recentActivityData.map((activity, index) => (
                  <RecentActivityItem 
                    key={index}
                    user={activity.user}
                    action={activity.action}
                    time={activity.time}
                  />
                ))}
              </div>

              {/* Quick Stats */}
              <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending Sessions</span>
                    <span className="font-bold text-orange-500">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Upcoming Sessions</span>
                    <span className="font-bold text-blue-500">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Signups</span>
                    <span className="font-bold text-green-500">23</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Original Children Content */}
            {children}

            {selectedMenu && (
              <div className="mt-4 bg-white p-4 rounded-lg shadow">
                <p>You have selected: {selectedMenu}</p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AdminDashboard;
