import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import Header from "../Header";
import Footer from "../Footer";

export default function Community() {
  const [courses, setCourses] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get token and user ID
  const token = localStorage.getItem("token");
  let userId = "";
  if (token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));
      userId = payload.id;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  // Configure axios with authentication header
  const axiosWithAuth = axios.create({
    baseURL: "http://localhost:4000/api/v1",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // Fetch all published courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosWithAuth.get("/courses/");
        setCourses(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses. Please try again later.");
        setLoading(false);
      }
    };

    if (token) {
      fetchCourses();
    } else {
      setError("Please log in to access communities");
      setLoading(false);
    }
  }, [token]);

  // Fetch messages when a community (course) is selected
  useEffect(() => {
    if (selectedCommunity && token) {
      fetchMessages(selectedCommunity._id);
    }
  }, [selectedCommunity, token]);

  const fetchMessages = async (courseId) => {
    if (!courseId || !userId || !token) return;
    
    try {
      setError(null);
      const response = await axiosWithAuth.get(`/messages/${courseId}/${userId}`);
      setMessages(response.data.data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      if (error.response && error.response.status === 403) {
        setError("You don't have permission to access messages for this community. You may need to be enrolled in this course.");
      } else {
        setError("Failed to load messages. Please try again later.");
      }
      setMessages([]);
    }
  };

  const handleSelectCommunity = (course) => {
    setSelectedCommunity(course);
    setError(null);
  };

  const handleSendMessage = async () => {
    if (messageContent.trim() === "" || !selectedCommunity || !token) return;

    try {
      setError(null);
      const response = await axiosWithAuth.post("/messages", {
        courseId: selectedCommunity._id,
        userId,
        message: messageContent,
      });
      
      if (response.data && response.data.data) {
        setMessages([...messages, response.data.data]);
        setMessageContent("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      if (error.response && error.response.status === 403) {
        setError("You don't have permission to send messages in this community. You may need to be enrolled in this course.");
      } else {
        setError("Failed to send message. Please try again later.");
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredCourses = courses.filter((course) =>
    course.courseName?.toLowerCase().includes(searchQuery) || 
    course.category?.name?.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Header />
      <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Course Communities</h1>
        
        {!token && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
            <p>Please log in to access course communities.</p>
          </div>
        )}
        
        {token && (
          <>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search course communities..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full border text-black border-gray-300 rounded-lg p-3 placeholder-gray-600"
              />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Course Communities</h2>
              {loading ? (
                <p className="text-gray-600">Loading courses...</p>
              ) : error && !selectedCommunity ? (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                  <p>{error}</p>
                </div>
              ) : courses.length === 0 ? (
                <p className="text-gray-600">No courses available.</p>
              ) : (
                <ul>
                  {filteredCourses.map((course) => (
                    <li
                      key={course._id}
                      className={`bg-gray-100 p-4 mb-4 rounded cursor-pointer hover:bg-blue-100 ${
                        selectedCommunity?._id === course._id ? "border-2 border-blue-500" : ""
                      }`}
                      onClick={() => handleSelectCommunity(course)}
                    >
                      <div className="font-bold">{course.courseName}</div>
                      <div className="text-sm text-gray-600">
                        Category: {course.category?.name || "Uncategorized"}
                      </div>
                      <div className="text-sm text-gray-600">
                        Instructor: {course.tutor?.firstName} {course.tutor?.lastName}
                      </div>
                      <div className="text-sm text-gray-600">
                        Students: {course.studentsEnrolled?.length || 0}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {selectedCommunity && (
              <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {selectedCommunity.courseName} Community
                </h2>
                <p className="text-gray-600 mb-6">
                  Welcome to the {selectedCommunity.courseName} community! Discuss and share your thoughts with other students here.
                </p>
                
                {error && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                    <p>{error}</p>
                  </div>
                )}
                
                <div className="bg-gray-100 p-4 rounded mb-4 h-64 overflow-y-auto">
                  {messages.length === 0 ? (
                    <p className="text-gray-500 italic">
                      {error ? "Unable to load messages." : "No messages yet. Be the first to start the conversation!"}
                    </p>
                  ) : (
                    messages.map((message, index) => (
                      <div key={index} className="mb-2">
                        <strong className="text-gray-800">
                          {message.userId?.firstName} {message.userId?.lastName || "Unknown User"}:
                        </strong>
                        <span className="text-gray-600 ml-2">{message.message}</span>
                      </div>
                    ))
                  )}
                </div>
                
                <textarea
                  className="w-full p-4 mb-4 border rounded text-black"
                  rows="3"
                  placeholder="Type your message here..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  disabled={!!error}
                ></textarea>
                
                <button
                  onClick={handleSendMessage}
                  className={`text-white px-4 py-2 rounded-full ${
                    error ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                  }`}
                  disabled={!!error}
                >
                  Send Message
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}