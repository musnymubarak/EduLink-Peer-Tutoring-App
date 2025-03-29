import React, { useState, useEffect } from 'react';
import Footer from "../Footer";
import Header from "../Header";
import Sidebar from "../Sidebar";
import CourseCard from '../tutor/CourseCard'; // Import the CourseCard component

export default function Classes() {
    const [acceptedCourses, setAcceptedCourses] = useState([]);

    // Fetch accepted courses on component mount
    useEffect(() => {
        fetchAcceptedCourses();
    }, []);

    const fetchAcceptedCourses = async () => {
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

            if (response.ok) {
                const data = await response.json();
                setAcceptedCourses(data.acceptedClasses || []);
            } else {
                console.error("Failed to fetch accepted classes");
            }
        } catch (error) {
            console.error("Error fetching accepted classes:", error);
        }
    };

    return(
        <div className="flex min-h-screen bg-gray-100">
            <Header/>
            {/* Sidebar */}
            <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
                <Sidebar />
            </div>
    
            {/* Main Content */}
            <div className="flex-1 ml-64 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 pt-14">Classes</h1>
                <div className="flex flex-col gap-4">
                    {acceptedCourses.map(course => (
                        <CourseCard 
                            key={course._id}
                            title={course.course?.courseName || "Untitled Class"}
                            type={course.type || "Unknown Type"}
                            time={course.time || "Unknown Time"}
                            description={course.course?.courseDescription || "No description provided"}
                            studentName={course.student?.firstName || course.student?.email || "Unknown Student"}
                            meetLink={course.classLink}
                        />
                    ))}
                </div>
            </div>
            <Footer/>
        </div>
    )
}
