import Sidebar from "../Sidebar";

export default function YourSubjects(){
    return(
        <div className="flex min-h-screen bg-gray-100">
        <div className="w-64 bg-richblue-800 border-r border-richblack-700">
        <br/><br/>
          <Sidebar />
        </div>
        <div className="flex-1 p-8"><br/><br/>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Subjects</h1>
        </div>
      </div>
    )
}