import Sidebar from "../Sidebar";

export default function YourSubjects(){
    return(
        <div className="flex min-h-screen bg-gray-100">
        <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        
          <Sidebar />
        </div>
        <div className="flex-1 ml-64 p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Subjects</h1>
        </div>
      </div>
    )
}