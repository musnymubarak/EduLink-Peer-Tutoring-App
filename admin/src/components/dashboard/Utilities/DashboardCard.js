import React from "react";

const DashboardCard = ({ title, count, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow flex items-center">
      <div className="text-3xl mr-4">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600">{count}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
