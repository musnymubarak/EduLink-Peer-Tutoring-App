import React from "react";
import Sidebar from "../Sidebar";

export default function TAddCourses() {

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Add New Course</h1>

        {/* Form */}
        <form className="bg-white p-6 rounded-lg shadow-md space-y-4">
          {/* Course Name */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Course Name</label>
            <input
              type="text"
              name="courseName"
              required
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Category</label>
            <input
              type="text"
              name="category"
              required
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Description</label>
            <textarea
              name="courseDescription"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* What You Will Learn */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">What You Will Learn</label>
            <textarea
              name="whatYouWillLearn"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Thumbnail URL</label>
            <input
              type="text"
              name="thumbnail"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              name="tag"
              required
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Instructions</label>
            <textarea
              name="instructions"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Status</label>
            <select
              name="status"
              className="w-full border border-gray-300 rounded-lg p-3"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
}
