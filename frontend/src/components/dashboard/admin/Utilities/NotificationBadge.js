import React from "react";

const NotificationBadge = ({ count }) => {
  return (
    <div className="relative inline-block">
      <span className="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-bold text-white bg-red-500 rounded-full">
        {count}
      </span>
    </div>
  );
};