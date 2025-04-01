import React, { useEffect, useState } from "react";
import axios from "axios";

const ListCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:4000/api/v1/courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourses(response.data.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseDetails = async (courseId) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:4000/api/v1/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedCourse(response.data.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Failed to fetch course details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openCourseDetails = (courseId) => {
    fetchCourseDetails(courseId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-lg text-gray-600">Loading courses...</div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-lg text-red-600">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Course List</h1>
        </div>
        
        {courses.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No courses found. Try again later or contact an administrator.
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {course.courseName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {course.category?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            openCourseDetails(course._id);
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Course Details</h3>
              <button
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={closeModal}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Course Name</p>
                <p className="font-medium">{selectedCourse.courseName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-sm">{selectedCourse.courseDescription}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {selectedCourse.category?.name || "Uncategorized"}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {selectedCourse.status}
                </span>
              </div>
              {selectedCourse.tag && selectedCourse.tag.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedCourse.tag.map((tag, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-100 rounded-full text-gray-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedCourse.tutor && (
                <div className="border-t border-gray-200 pt-3 mt-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Instructor Information</p>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{selectedCourse.tutor.firstName} {selectedCourse.tutor.lastName || "N/A"}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedCourse.tutor.email || "N/A"}</p>
                  </div>
                </div>
              )}
              <div className="pt-4">
                <button
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListCourses;