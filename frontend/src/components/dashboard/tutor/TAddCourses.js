import Sidebar from "../Sidebar";

export default function TAddCourses(){
    return(
        <div>
            <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
            <Sidebar />
            </div>
    
            {/* Main Content */}
            <div className="flex-1 ml-64 p-8 overflow-y-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Add New Course</h1>

            </div>
            </div>
        </div>
    )
}