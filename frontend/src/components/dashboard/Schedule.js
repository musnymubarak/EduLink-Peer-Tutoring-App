import Sidebar from "./Sidebar";
import React from "react";
import SchedulePage from "./SchedulePage";

export default function Schedule(){
    return(
        <div className="flex min-h-screen bg-gray-100">
        <div className="w-64 bg-richblue-800 border-r border-richblack-700">
        <br/><br/>
          <Sidebar />
        </div>
        <div className="flex-1 p-8"><br/><br/>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Schedule</h1>
          <SchedulePage/>
        </div>
      </div>
    )
}