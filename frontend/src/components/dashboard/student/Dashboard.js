import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import Header from "../Header";
import Footer from "../Footer";
import "../../css/student/Dashboard.css";

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [nextClass, setNextClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coursesCount, setCoursesCount] = useState(0);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No authentication token found");
        return;
      }
      
      const response = await axios.get("http://localhost:4000/api/v1/profile/student", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Set the user's full name
      setUserName(
        response.data.firstName && response.data.lastName 
          ? `${response.data.firstName} ${response.data.lastName}`
          : response.data.firstName || response.data.name || "Student"
      );
      
      // Set the courses count using the courses array from user data
      if (response.data.courses && Array.isArray(response.data.courses)) {
        setCoursesCount(response.data.courses.length);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch upcoming classes from the same endpoint used in SchedulePage
  const fetchUpcomingClasses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No authentication token found");
        return;
      }
      
      const response = await fetch("http://localhost:4000/api/v1/classes/accepted-classes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.status === 401) {
        console.error("Authentication token expired or invalid");
        return;
      }
      
      const data = await response.json();
      
      if (response.ok) {
        // Process classes and get only upcoming ones
        const transformedEvents = data.acceptedClasses.map(classItem => {
          const startTime = new Date(classItem.time);
          const validStartTime = isNaN(startTime.getTime()) ? new Date() : startTime;
          const endTime = new Date(validStartTime.getTime() + (classItem.duration || 60) * 60000);
          
          return {
            id: classItem._id,
            title: classItem.course?.courseName || "Untitled Class",
            start: validStartTime,
            end: endTime,
            description: classItem.course?.courseDescription || "No description provided",
            meetLink: classItem.classLink || "",
            tutorName: classItem.tutor?.firstName || classItem.tutor?.email || "Unknown Tutor"
          };
        });
        
        // Filter to get only upcoming classes (today and future)
        const now = new Date();
        const upcoming = transformedEvents
          .filter(event => event.start >= now)
          .sort((a, b) => a.start - b.start); // Sort by start time
        
        // Set the next immediate class
        if (upcoming.length > 0) {
          setNextClass(upcoming[0]);
        }
        
        // Set remaining upcoming classes (skip the first one as it's already shown as next class)
        setUpcomingClasses(upcoming.slice(1, 3));
      } else {
        console.error("Failed to fetch classes:", data.error);
      }
    } catch (error) {
      console.error("Error fetching accepted classes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchUpcomingClasses();
  }, []);

  // Format date and time for display
  const formatDateTime = (dateObj) => {
    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    return `${date} at ${time}`;
  };

  // Calculate time until class starts
  const getTimeUntilClass = (startTime) => {
    const now = new Date();
    const diff = startTime - now;
    
    // Convert milliseconds to hours and minutes
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `in ${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `in ${hours} hr${hours > 1 ? 's' : ''} ${minutes} min`;
    } else if (minutes > 0) {
      return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return "starting now";
    }
  };

  return (
    <div className="dashboard-container">
      <Header />
      
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>
      
      {/* Dashboard Content */}
      <div className="dashboard-content">
        <h1 className="dashboard-title">Dashboard</h1>
        
        {/* Welcome Section */}
        <div className="welcome-section">
          <h2 className="welcome-title">Welcome, {userName || "Student"}!</h2>
          <p className="welcome-text">"Keep pushing forward—success is just around the corner!"</p>
        </div>
        
         
        {/* Overview Cards */}
        <div className="overview-grid">
          <div className="overview-card">
            <h3>Subjects Enrolled</h3>
            <p>{coursesCount}</p>
          </div>
          
        {/* Next Class Card - Prominently displayed */}
        {loading ? (
          <div className="next-class-card loading">
            <p>Loading your next class...</p>
          </div>
        ) : nextClass ? (
          <div className="next-class-card">
            <div className="next-class-header">
              <h2>Your Next Class</h2>
              {nextClass.meetLink && (
                <a 
                  href={nextClass.meetLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="join-class-btn"
                >
                  Join Class
                </a>
              )}
              <span className="time-badge">{getTimeUntilClass(nextClass.start)}</span>
            </div>
            <div className="next-class-details">
              <h3>{nextClass.title}</h3>
              <p className="class-time">{formatDateTime(nextClass.start)}<span className="class-tutor"> with {nextClass.tutorName}</span></p>
            </div>
          </div>
        ) : (
          <div className="next-class-card empty">
            <h2>No Upcoming Classes</h2>
            <p>You don't have any classes scheduled at the moment.</p>
          </div>
        )}
        </div>
      </div>
      <Footer />
    </div>
  );
}