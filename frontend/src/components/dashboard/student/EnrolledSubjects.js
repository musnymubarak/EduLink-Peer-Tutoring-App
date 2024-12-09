import React from "react";
import Sidebar from "../Sidebar";

export default function EnrolledSubjects() {
  const categories = [
    {
      title: "IT Subject",
      subjects: [
        { id: 1, title: "C++", description: "Fundamentals of C++", author: "John", likes: 45, rating: 4, progress: 75 },
        { id: 2, title: "Java", description: "OOP Concepts", author: "Smith", likes: 32, rating: 5, progress: 50 },
        { id: 3, title: "HTML", description: "Basic Web", author: "David", likes: 21, rating: 3, progress: 40 },
      ],
    },
    {
      title: "Math Subject",
      subjects: [
        { id: 4, title: "Discrete Math", description: "Math Fundamentals", author: "Maya", likes: 54, rating: 2, progress: 80 },
        { id: 5, title: "Calculus", description: "Differentiation and Integration", author: "Liam", likes: 40, rating: 4, progress: 60 },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Enrolled Subjects</h1>

        {/* Categories Section */}
        <div className="space-y-8">
          {categories.map((category, index) => (
            <div key={index}>
              <h2 className="text-2xl font-semibold text-richblue-700 mb-4">
                {category.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.subjects.map((subject, i) => (
                  <div
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition duration-200"
                    key={i}
                  >
                    <h3 className="text-lg font-semibold text-gray-800">
                      {subject.title}
                    </h3>
                    <p className="text-gray-600">{subject.description}</p>
                    <p className="text-gray-500 text-sm">
                      <strong>By:</strong> {subject.author}
                    </p>
                    <p className="text-gray-500 text-sm">
                      <strong>Likes:</strong> {subject.likes}
                    </p>
                    <p className="text-yellow-500">
                      <strong>Rating:</strong> {"⭐".repeat(subject.rating)}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <p className="text-gray-600">Progress</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-500 h-2.5 rounded-full"
                          style={{ width: `${subject.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
