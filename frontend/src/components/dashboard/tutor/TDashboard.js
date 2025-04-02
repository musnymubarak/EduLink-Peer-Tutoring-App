import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import Header from "../Header";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";

export default function TDashboard() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [classRequests, setClassRequests] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const [courseRatings, setCourseRatings] = useState({});
  const [averageRating, setAverageRating] = useState(0);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [fetchingUpcomingSessions, setFetchingUpcomingSessions] =
    useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Authentication token is missing. Please log in.");
          return;
        }

        // Decode the token to get tutorId
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64));
        const tutorId = payload.id; // Extract tutor ID from token

        const response = await axios.get(
          "http://localhost:4000/api/v1/courses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const tutorCourses = response.data.data.filter(
            (course) => course.tutor._id.toString() === tutorId
          );
          console.log(tutorCourses);
          setCourses(tutorCourses || []); // Ensure courses is always an array

          // Fetch ratings for each course
          fetchCourseRatings(tutorCourses, token);
        } else {
          alert("Failed to load courses");
        }
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        alert("An error occurred while fetching the courses.");
      }
    };

    fetchCourses();
    fetchUpcomingSessions();
  }, []);

  // New function to fetch upcoming sessions
  const fetchUpcomingSessions = async () => {
    setFetchingUpcomingSessions(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No authentication token found");
        return;
      }

      // Use the acceptedClasses endpoint to get upcoming sessions
      const response = await fetch(
        "http://localhost:4000/api/v1/classes/accepted-classes",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        console.error("Authentication token expired or invalid");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        // Log the raw data to see its structure
        console.log("Raw API response for upcoming sessions:", data);

        // Get accepted classes
        const classItems = data.acceptedClasses || [];

        // Transform the class data into upcoming sessions format
        // and filter for only future sessions
        const now = new Date();
        const transformedSessions = classItems
          .filter((classItem) => {
            const sessionTime = new Date(classItem.time);
            return !isNaN(sessionTime.getTime()) && sessionTime > now;
          })
          .map((classItem) => {
            const startTime = new Date(classItem.time);
            const sessionDate = startTime.toLocaleDateString();
            const sessionTime = startTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return {
              id: classItem._id,
              topic: classItem.course?.courseName || "Untitled Class",
              date: sessionDate,
              time: sessionTime,
              studentName:
                classItem.student?.firstName ||
                classItem.student?.email ||
                "Unknown Student",
              type: classItem.type || "Personal",
              meetLink: classItem.classLink || "",
            };
          })
          .sort((a, b) => {
            // Sort by date (ascending)
            const dateA = new Date(`${a.date} ${a.time}`);
            const dateB = new Date(`${b.date} ${b.time}`);
            return dateA - dateB;
          });

        console.log("Transformed upcoming sessions:", transformedSessions);
        setUpcomingSessions(transformedSessions);
      } else {
        console.error("Failed to fetch upcoming sessions:", data.error);
      }
    } catch (error) {
      console.error("Error fetching upcoming sessions:", error);
    } finally {
      setFetchingUpcomingSessions(false);
    }
  };

  // New function to fetch ratings for each course
  const fetchCourseRatings = async (courses, token) => {
    try {
      const ratingsPromises = courses.map(async (course) => {
        try {
          const response = await axios.get(
            `http://localhost:4000/api/v1/rating/${course._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log(response.data);

          // Extract rating from the data array if it exists
          let rating = 0;
          if (
            response.data.success &&
            response.data.data &&
            response.data.data.length > 0
          ) {
            // If multiple ratings exist, we could calculate an average
            // For now, we'll take the first rating
            rating = response.data.data[0].rating || 0;

            // Log the extracted rating
            console.log(`Rating for course ${course._id}: ${rating}`);
          }

          return {
            courseId: course._id,
            rating: rating,
          };
        } catch (error) {
          console.error(
            `Error fetching rating for course ${course._id}:`,
            error
          );
          // Return 0 rating if error occurs
          return { courseId: course._id, rating: 0 };
        }
      });

      const ratingsResults = await Promise.all(ratingsPromises);

      // Convert array of results to an object with courseId as key
      const ratingsObj = {};
      ratingsResults.forEach((result) => {
        ratingsObj[result.courseId] = result.rating;
      });

      // Calculate average rating
      const totalRating = ratingsResults.reduce(
        (sum, item) => sum + item.rating,
        0
      );
      const avgRating =
        courses.length > 0 ? (totalRating / courses.length).toFixed(1) : 0;

      // Log the complete ratings object and average
      console.log("All course ratings:", ratingsObj);
      console.log("Average rating:", avgRating);

      setCourseRatings(ratingsObj);
      setAverageRating(avgRating);
    } catch (error) {
      console.error("Error in fetchCourseRatings:", error);
    }
  };

  // Debug function
  const logRequestData = (data) => {
    console.log("Request data structure:", JSON.stringify(data, null, 2));
  };

  // Fetch class requests with course details
  const fetchClassRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token is missing. Please log in.");
        return;
      }

      const response = await axios.get(
        "http://localhost:4000/api/v1/classes/class-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if classRequests exists in the response
      if (response.data && response.data.classRequests) {
        // Simply set the requests first to ensure they appear
        setClassRequests(response.data.classRequests);

        // Then try to enrich them with course details if possible
        try {
          const requestsWithCourses = await Promise.all(
            response.data.classRequests.map(async (req) => {
              try {
                // Check if course ID exists before making the second request
                if (req.course && req.course._id) {
                  const courseResponse = await axios.get(
                    `http://localhost:4000/api/v1/courses/${req.course._id}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  if (courseResponse.data && courseResponse.data.data) {
                    const courseName =
                      courseResponse.data.data.courseName || "Unknown Course";
                    return {
                      ...req,
                      course: {
                        ...req.course,
                        title: courseName,
                      },
                    };
                  }
                }
                // If we couldn't get course details, just ensure the title exists
                return {
                  ...req,
                  course: {
                    ...req.course,
                    title: req.course?.title || "Course",
                  },
                };
              } catch (err) {
                console.error("Error fetching course details:", err);
                // Return the original request with a fallback title
                return {
                  ...req,
                  course: {
                    ...req.course,
                    title: req.course?.title || "Course",
                  },
                };
              }
            })
          );

          // First sort by status (Pending first, then by time)
          const sortedRequests = requestsWithCourses.sort((a, b) => {
            // Prioritize Pending status
            if (a.status === "Pending" && b.status !== "Pending") return -1;
            if (a.status !== "Pending" && b.status === "Pending") return 1;

            // Then sort by time (newest first)
            const timeA = a.time ? new Date(a.time).getTime() : 0;
            const timeB = b.time ? new Date(b.time).getTime() : 0;
            return timeB - timeA;
          });

          setClassRequests(sortedRequests);
        } catch (err) {
          console.error("Error enriching request data:", err);
          // Keep the original requests if enrichment fails, but sort by status and time
          const sortedRequests = [...response.data.classRequests].sort(
            (a, b) => {
              // Prioritize Pending status
              if (a.status === "Pending" && b.status !== "Pending") return -1;
              if (a.status !== "Pending" && b.status === "Pending") return 1;

              // Then sort by time (newest first)
              const timeA = a.time ? new Date(a.time).getTime() : 0;
              const timeB = b.time ? new Date(b.time).getTime() : 0;
              return timeB - timeA;
            }
          );
          setClassRequests(sortedRequests);
        }
      } else {
        console.error("Unexpected response format:", response.data);
        setError("Unexpected response format from the server");
      }
    } catch (err) {
      console.error("Error fetching class requests:", err);
      setError("Failed to fetch class requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch total enrolled students
  const fetchTotalStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token is missing. Please log in.");
        return;
      }

      // Decode the token to get tutorId
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));
      const tutorId = payload.id; // Extract tutor ID from token

      const response = await axios.get(
        `http://localhost:4000/api/v1/tutor/${tutorId}/enrolled-students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setTotalStudents(response.data.totalStudentsEnrolled);
      }
    } catch (err) {
      console.error("Error fetching total students:", err);
      setError("No Requests yet.");
    }
  };

  // Handle request actions
  const handleRequestAction = async (requestId, status) => {
    try {
      // Close modal first
      setIsModalOpen(false);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token is missing. Please log in.");
        return;
      }

      // Make the API request
      await axios.post(
        `http://localhost:4000/api/v1/classes/handle-request/${requestId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If we get here without an error being thrown, refresh the page
      window.location.reload();
    } catch (err) {
      console.error("Error handling request:", err);

      // Show alert with more detailed error information if available
      const errorMessage =
        err.response?.data?.message ||
        "Failed to update request status. Please try again.";
      alert(errorMessage);

      // Re-open the modal in case of error
      setIsModalOpen(true);
    }
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleDecline = () => {
    if (selectedRequest && selectedRequest._id) {
      handleRequestAction(selectedRequest._id, "Rejected");
    } else {
      console.error("No request selected or missing ID");
      alert("Error: Cannot process request. Missing request ID.");
    }
  };

  const navigateToRequestsPage = () => {
    navigate("/dashboard/tutor/requests"); // Navigate to requests page
  };

  const navigateToSchedulePage = () => {
    navigate("/dashboard/tutor/schedule"); // Navigate to schedule page
  };

  useEffect(() => {
    fetchClassRequests();
    fetchTotalStudents();
  }, []);

  // Helper function to safely access nested properties
  const safelyAccess = (obj, path, fallback = "") => {
    try {
      const keys = path.split(".");
      return keys.reduce((o, key) => (o || {})[key], obj) || fallback;
    } catch (err) {
      return fallback;
    }
  };

  // Get only the 3 latest requests (already sorted by status and time in fetchClassRequests)
  const latestRequests = classRequests.slice(0, 3);
  const hasMoreRequests = classRequests.length > 3;

  // Get only the 3 nearest upcoming sessions
  const displayedSessions = upcomingSessions.slice(0, 3);
  const hasMoreSessions = upcomingSessions.length > 3;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Header />
      <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Tutor Dashboard
        </h1>

        {/* Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-blue-700">Total Students</h2>
            <p className="text-3xl font-semibold text-gray-800 mt-4">
              {totalStudents}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-blue-700">
              Average Tutor Rating
            </h2>
            <p className="text-3xl font-semibold text-gray-800 mt-4">
              {averageRating} / 5
            </p>
          </div>
        </div>

        {/* Course Ratings Section - New section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            Course Ratings
          </h2>
          {courses.length > 0 ? (
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <p className="text-gray-800 font-semibold">
                    {course.courseName || "Unnamed Course"}
                  </p>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="text-gray-700">
                      {courseRatings[course._id] || 0} / 5
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No courses available.</p>
          )}
        </div>

        {/* Recent Requests Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-700">
              Recent Requests
            </h2>
            {hasMoreRequests && (
              <button
                onClick={navigateToRequestsPage}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                View More
              </button>
            )}
          </div>

          {loading ? (
            <p className="text-gray-600">Loading requests...</p>
          ) : error ? (
            <p className="text-gray-700">{error}</p>
          ) : latestRequests && latestRequests.length > 0 ? (
            <ul className="space-y-4">
              {latestRequests.map((request) => (
                <li
                  key={request._id || Math.random().toString()}
                  className={`flex items-center justify-between border-b pb-2 ${
                    request.status === "Pending" ? "bg-yellow-50" : ""
                  }`}
                >
                  <div>
                    <p className="text-gray-800 font-semibold">
                      {safelyAccess(request, "student.name") ||
                        safelyAccess(request, "student.email") ||
                        "Student"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {safelyAccess(request, "course.title", "Course")} -
                      {safelyAccess(request, "type", "Class")} Class
                    </p>
                    <p className="text-gray-600 text-sm">
                      {request.time
                        ? new Date(request.time).toLocaleString()
                        : "Scheduled time not available"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        request.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : request.status === "Accepted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {request.status || "Status unknown"}
                    </span>
                    {(!request.status || request.status === "Pending") && (
                      <button
                        onClick={() => handleViewRequest(request)}
                        className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        View Request
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No recent requests available.</p>
          )}
        </div>

        {/* Upcoming Sessions Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-700">
              Upcoming Sessions
            </h2>
            {hasMoreSessions && (
              <button
                onClick={navigateToSchedulePage}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                View Schedule
              </button>
            )}
          </div>

          {fetchingUpcomingSessions ? (
            <p className="text-gray-600">Loading upcoming sessions...</p>
          ) : displayedSessions.length > 0 ? (
            <ul className="space-y-4">
              {displayedSessions.map((session) => (
                <li
                  key={session.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="text-gray-800 font-semibold">
                      {session.topic}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {session.date} at {session.time}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Student: {session.studentName} - {session.type} Class
                    </p>
                  </div>
                  {session.meetLink && (
                    <a
                      href={session.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      Join
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No upcoming sessions.</p>
          )}
        </div>
      </div>

      {/* Modal for Viewing Request */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Request Details
            </h2>
            <p className="text-gray-600">
              <strong>Student:</strong>{" "}
              {safelyAccess(selectedRequest, "student.name") ||
                safelyAccess(selectedRequest, "student.email") ||
                "Student"}
            </p>
            <p className="text-gray-600">
              <strong>Course:</strong>{" "}
              {safelyAccess(selectedRequest, "course.title", "Course")}
            </p>
            <p className="text-gray-600">
              <strong>Type:</strong> {selectedRequest.type || "Class"}
            </p>
            <p className="text-gray-600">
              <strong>Time:</strong>{" "}
              {selectedRequest.time
                ? new Date(selectedRequest.time).toLocaleString()
                : "Not specified"}
            </p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={navigateToRequestsPage}
                className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700"
              >
                Accept
              </button>
              <button
                onClick={handleDecline}
                className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow hover:bg-red-700"
              >
                Decline
              </button>
              <button
                onClick={handleCloseModal}
                className="px-6 py-3 bg-gray-500 text-white font-bold rounded-lg shadow hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
