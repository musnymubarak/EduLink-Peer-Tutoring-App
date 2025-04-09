import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import Header from "../Header";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [classDetailsModal, setClassDetailsModal] = useState({
    show: false,
    type: "",
    requestId: null,
    courseId: null,
  });
  const [classDetails, setClassDetails] = useState({
    date: "",
    time: "",
    classLink: "",
    duration: "",
  });
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(4);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:4000/api/v1/classes/class-requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const requestsWithCourses = await Promise.all(
          response.data.classRequests.map(async (req) => {
            // Only process the request if it's pending
            if (req.status !== "Pending") return null;

            const courseResponse = await axios.get(
              `http://localhost:4000/api/v1/courses/${req.course._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const courseName =
              courseResponse.data.data.courseName || "Unknown Course";
            const eventTime = new Date(req.time);
            return {
              id: req._id,
              student: req.student.email,
              topic: courseName,
              courseId: req.course._id,
              date: eventTime.toLocaleDateString(),
              time: eventTime.toLocaleTimeString(),
              fullTime: eventTime,
              status: req.status,
              type: req.type,
              duration: req.duration || "Not specified",
              isNew: true,
              classLink: req.classLink || "",
            };
          })
        );

        // Filter out null values (non-pending requests)
        const pendingRequests = requestsWithCourses.filter(
          (req) => req !== null
        );

        // Sort by proximity to current time
        const now = new Date();
        const sortedRequests = pendingRequests.sort((a, b) => {
          // If both are in the future
          if (a.fullTime > now && b.fullTime > now) {
            return a.fullTime - b.fullTime;
          }
          // If a is in the future but b is in the past
          if (a.fullTime > now && b.fullTime <= now) {
            return -1; // a comes first (future events before past)
          }
          // If b is in the future but a is in the past
          if (b.fullTime > now && a.fullTime <= now) {
            return 1; // b comes first
          }
          // If both are in the past, show most recent first
          return b.fullTime - a.fullTime;
        });

        setRequests(sortedRequests);
        setFilteredRequests(sortedRequests);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Failed to fetch class requests. Please try again.");
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = requests.filter(
      (req) =>
        req.student.toLowerCase().includes(query) ||
        req.topic.toLowerCase().includes(query)
    );

    setFilteredRequests(filtered);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleDeclineAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:4000/api/v1/classes/handle-request/${id}`,
        { status: action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove the declined request from the list entirely
      const updatedRequests = requests.filter((req) => req.id !== id);

      setRequests(updatedRequests);
      setFilteredRequests(
        updatedRequests.filter(
          (req) =>
            req.student.toLowerCase().includes(searchQuery) ||
            req.topic.toLowerCase().includes(searchQuery)
        )
      );
    } catch (err) {
      console.error("Error declining request:", err);
      alert("Failed to update request status. Please try again.");
    }
  };

  const handleAcceptAction = async (request, action) => {
    try {
      const requestDetails = requests.find((r) => r.id === request.id);
      
      // Set initial class link based on the class type
      const initialClassLink = request.type === "Group" ? "Using existing group class link" : "";
      
      setClassDetails({
        date: requestDetails.date,
        time: requestDetails.time,
        classLink: initialClassLink,
        duration: requestDetails.duration || "0",
      });

      setClassDetailsModal({
        show: true,
        type: request.type,
        requestId: request.id,
        courseId: request.courseId,
      });
    } catch (err) {
      console.error("Error in accept action:", err);
      alert("Failed to process request. Please try again.");
    }
  };

  const handleCreateClass = async () => {
    try {
      const token = localStorage.getItem("token");
      const requestId = classDetailsModal.requestId;
      const classType = classDetailsModal.type;

      // Ensure request ID is present
      if (!requestId) {
        alert("Request ID is missing. Please try again.");
        return;
      }

      // Different validation for Personal vs Group classes
      if (classType === "Personal" && !classDetails.classLink) {
        alert("Please enter a Zoom link for this personal class");
        return;
      }

      // For Group classes, we don't need to send a class link as it uses the existing one
      const requestData = {
        status: "Accepted",
        ...(classType === "Personal" && { classLink: classDetails.classLink }),
      };

      const response = await axios.post(
        `http://localhost:4000/api/v1/classes/handle-request/${requestId}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Full Response:", response.data);

      // Remove the accepted request from the list entirely
      const updatedRequests = requests.filter((req) => req.id !== requestId);

      setRequests(updatedRequests);
      setFilteredRequests(
        updatedRequests.filter(
          (req) =>
            req.student.toLowerCase().includes(searchQuery) ||
            req.topic.toLowerCase().includes(searchQuery)
        )
      );

      // Reset modals and details
      setClassDetailsModal({
        show: false,
        type: "",
        requestId: null,
        courseId: null,
      });
      setClassDetails({
        date: "",
        time: "",
        classLink: "",
        duration: "",
      });

      // Provide user feedback
      alert("Class created successfully!");
    } catch (err) {
      // More detailed error handling
      console.error("Detailed Error:", err.response?.data || err.message);

      // Provide specific error message to user
      const errorMessage =
        err.response?.data?.details ||
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to create class";

      alert(`Error: ${errorMessage}`);
    }
  };

  const gotoSchedule = () => {
    navigate("/dashboard/tutor/schedule");
  };

  // Pagination logic
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex min-h-screen bg-gray-100 pt-20">
      <Header />
      <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Requests
        </h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by student or topic..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full border text-black border-gray-300 rounded-lg p-3 placeholder-gray-600"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <p className="text-gray-600">Loading requests...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : filteredRequests.length === 0 ? (
            <p className="text-gray-600">No pending requests available.</p>
          ) : (
            <>
              <ul className="space-y-4">
                {currentRequests.map((request) => (
                  <li
                    key={request.id}
                    className={`flex items-center justify-between border-b pb-2 ${
                      request.isNew ? "bg-yellow-100 border-yellow-300" : ""
                    }`}
                  >
                    <div>
                      <p className="text-gray-800 font-semibold">
                        {request.student}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Topic: {request.topic} | Date: {request.date} | Time:{" "}
                        {request.time} | Type: {request.type}
                      </p>
                      <p className="mt-1 text-sm font-medium text-yellow-600">
                        Status: Pending
                      </p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                      >
                        View Request
                      </button>
                      <button
                        onClick={() => handleAcceptAction(request, "Accepted")}
                        className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleDeclineAction(request.id, "Rejected")
                        }
                        className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
                      >
                        Decline
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {indexOfFirstRequest + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastRequest, filteredRequests.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredRequests.length}
                    </span>{" "}
                    requests
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 border rounded-md ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Previous
                    </button>

                    {/* Page numbers */}
                    <div className="flex space-x-1">
                      {[...Array(totalPages).keys()].map((number) => (
                        <button
                          key={number + 1}
                          onClick={() => paginate(number + 1)}
                          className={`px-3 py-1 border rounded-md ${
                            currentPage === number + 1
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {number + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 border rounded-md ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* View Request Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Request Details
            </h2>
            <p className="mb-2">
              <strong>Student:</strong> {selectedRequest.student}
            </p>
            <p className="mb-2">
              <strong>Topic:</strong> {selectedRequest.topic}
            </p>
            <p className="mb-2">
              <strong>Date:</strong> {selectedRequest.date}
            </p>
            <p className="mb-2">
              <strong>Time:</strong> {selectedRequest.time}
            </p>
            <p className="mb-2">
              <strong>Type:</strong> {selectedRequest.type}
            </p>
            <p className="mb-2">
              <strong>Duration:</strong> {selectedRequest.duration}
            </p>
            <p className="mb-4">
              <strong>Status:</strong> Pending
            </p>
            <div className="text-right">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Class Details Modal */}
      {classDetailsModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {classDetailsModal.type === "Personal"
                ? "Personal Class Details"
                : "Group Class Details"}
            </h2>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Class Date
              </label>
              <input
                type="text"
                value={classDetails.date}
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Class Time
              </label>
              <input
                type="text"
                value={classDetails.time}
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>

            {classDetailsModal.type === "Personal" ? (
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Class Link
                </label>
                <input
                  type="text"
                  placeholder="Enter Zoom/Meet link"
                  value={classDetails.classLink}
                  onChange={(e) =>
                    setClassDetails((prev) => ({
                      ...prev,
                      classLink: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Class Link
                </label>
                <input
                  type="text"
                  value="Using existing group class link"
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                  disabled
                />
                <p className="text-sm text-gray-600 mt-1">
                  Group classes use the previously configured class link
                </p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Duration
              </label>
              <input
                type="text"
                value={classDetails.duration}
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() =>
                  setClassDetailsModal({
                    show: false,
                    type: "",
                    requestId: null,
                    courseId: null,
                  })
                }
                className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateClass}
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
              >
                Create Class
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}