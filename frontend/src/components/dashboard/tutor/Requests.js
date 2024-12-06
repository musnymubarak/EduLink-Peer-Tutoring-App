import Sidebar from "../Sidebar";

export default function Requests(){
    return(
        <div className="flex min-h-screen bg-gray-100">
        <div className="w-64 bg-richblue-800 border-r border-richblack-700">
        
          <Sidebar />
        </div>
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Requests</h1>
        </div>
      </div>
    )
}