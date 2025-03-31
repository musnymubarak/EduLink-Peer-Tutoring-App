import React, { useState, useEffect } from 'react';
import '../../css/student/SchedulePage.css';

export default function SchedulePage() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [fetchingClasses, setFetchingClasses] = useState(true);
  const [groupClasses, setGroupClasses] = useState([]);
  const [error, setError] = useState(null);

  // Fetch accepted classes and group classes on component mount
  useEffect(() => {
    fetchAcceptedClasses();
    fetchGroupClasses();
  }, []);

  // Combine individual and group classes whenever either is updated
  useEffect(() => {
    combineClassEvents();
  }, [groupClasses]);

  const fetchAcceptedClasses = async () => {
    setFetchingClasses(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No authentication token found");
        setError("Authentication token not found");
        return;
      }

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
        setError("Authentication token expired or invalid");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        const transformedEvents = data.acceptedClasses.map((classItem) => {
          const startTime = new Date(classItem.time);
          const validStartTime = isNaN(startTime.getTime())
            ? new Date()
            : startTime;
          const endTime = new Date(
            validStartTime.getTime() + (classItem.duration || 60) * 60000
          );

          return {
            id: classItem._id,
            title: classItem.course?.courseName || "Untitled Class",
            start: validStartTime,
            end: endTime,
            description:
              classItem.course?.courseDescription || "No description provided",
            meetLink: classItem.classLink || "",
            tutorName:
              classItem.tutor?.firstName ||
              classItem.tutor?.email ||
              "Unknown Tutor",
            type: "Individual",
          };
        });

        setEvents(transformedEvents);
      } else {
        setError(data.error || "Failed to fetch classes");
      }
    } catch (error) {
      console.error("Error fetching accepted classes:", error);
      setError("Failed to fetch individual classes");
    } finally {
      setFetchingClasses(false);
    }
  };

  const fetchGroupClasses = async () => {
    setFetchingClasses(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found");
        return;
      }

      // Fetch all courses first to get their IDs
      const coursesResponse = await fetch(
        "http://localhost:4000/api/v1/courses",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!coursesResponse.ok) {
        setError("Failed to fetch courses list");
        return;
      }

      const coursesData = await coursesResponse.json();

      // Handle different possible response structures
      const courses = Array.isArray(coursesData)
        ? coursesData
        : coursesData.courses || coursesData.data || [];

      if (!courses.length) {
        console.log("No courses available");
        setGroupClasses([]);
        return;
      }

      const allGroupClasses = [];
      const fetchPromises = courses.map(async (course) => {
        try {
          const response = await fetch(
            `http://localhost:4000/api/v1/classes/group-classes/${course._id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.groupClasses && data.groupClasses.length > 0) {
              const transformedGroupClasses = data.groupClasses.map(
                (classItem) => {
                  const startTime = new Date(classItem.time);
                  const validStartTime = isNaN(startTime.getTime())
                    ? new Date()
                    : startTime;
                  const endTime = new Date(
                    validStartTime.getTime() +
                      (classItem.duration || 60) * 60000
                  );

                  return {
                    id: classItem._id,
                    title: `[GROUP] ${
                      classItem.course?.courseName || "Group Class"
                    }`,
                    start: validStartTime,
                    end: endTime,
                    description:
                      classItem.course?.courseDescription ||
                      "No description provided",
                    meetLink: classItem.classLink || "",
                    tutorName:
                      classItem.tutor?.firstName ||
                      classItem.tutor?.email ||
                      "Unknown Tutor",
                    type: "Group",
                    courseId: course._id,
                  };
                }
              );
              return transformedGroupClasses;
            }
          }
          return [];
        } catch (error) {
          console.error(
            `Error fetching group classes for course ${course._id}:`,
            error
          );
          return [];
        }
      });

      // Wait for all group class fetches to complete
      const groupClassesArrays = await Promise.all(fetchPromises);
      const combinedGroupClasses = groupClassesArrays.flat();

      setGroupClasses(combinedGroupClasses);
    } catch (error) {
      console.error("Error in fetchGroupClasses:", error);
      setError("Failed to fetch group classes");
    } finally {
      setFetchingClasses(false);
    }
  };



  const deleteEvent = (eventId) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId)
    );
  };

  const combineClassEvents = () => {
    const allEvents = [
      ...events.filter((e) => e.type === "Individual"),
      ...groupClasses,
    ];
    setEvents(allEvents);
  };
  
  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const generateCalendarView = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();

    // Removed the week-only filter to properly display month view
    // Now we'll filter within each view generator function

    switch (viewMode) {
      case "month":
        return generateMonthView(year, month, events);
      case "week":
        return generateWeekView(year, month, day, events);
      default:
        return generateMonthView(year, month, events);
    }
  };

  const generateMonthView = (year, month, allEvents) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDayOfWeek = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);

      // Filter events for this specific day
      const dayEvents = allEvents.filter((event) => {
        const eventDate = new Date(event.start);
        return (
          eventDate.getFullYear() === year &&
          eventDate.getMonth() === month &&
          eventDate.getDate() === day
        );
      });

      days.push({ date: currentDate, events: dayEvents });
    }

    return days;
  };

  const generateWeekView = (year, month, day, allEvents) => {
    const weekStart = new Date(
      year,
      month,
      day - new Date(year, month, day).getDay()
    );

    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + i);

      // Filter events for this specific day
      const dayEvents = allEvents.filter((event) => {
        const eventDate = new Date(event.start);
        return (
          eventDate.getFullYear() === currentDate.getFullYear() &&
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getDate() === currentDate.getDate()
        );
      });

      days.push({ date: currentDate, events: dayEvents });
    }

    return days;
  };

  const changeDate = (direction) => {
    const newDate = new Date(selectedDate);
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + direction * 7);
    }
    setSelectedDate(newDate);
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      today.getDate() === date.getDate() &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear()
    );
  };

  const renderView = () => {
    if (fetchingClasses) {
      return (
        <div className="loading-container">
          <div className="loading-message">Loading classes...</div>
        </div>
      );
    }

    if (events.length === 0) {
      return (
        <div className="no-events-message">
          <p>
            No scheduled classes found. Check back later or refresh to update.
          </p>
        </div>
      );
    }

    const calendarData = generateCalendarView();

    switch (viewMode) {
      case "month":
        return (
          <div className="grid-calendar">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="day-header">
                {day}
              </div>
            ))}
            {calendarData.map((day, index) => (
              <div
                key={index}
                className={`calendar-cell ${
                  day ? "cell-active" : "cell-inactive"
                } ${day && isToday(day.date) ? "cell-today" : ""}`}
              >
                {day && (
                  <>
                    <div className="date-number">{day.date.getDate()}</div>
                    {day.events.length > 0
                      ? day.events.map((event) => (
                          <div key={event.id} className="event-item">
                            <div className="event-title">{event.title}</div>
                            <div className="event-details">
                              {event.tutorName && (
                                <div className="tutor-name">
                                  Tutor: {event.tutorName}
                                </div>
                              )}
                              {event.meetLink && (
                                <a
                                  href={event.meetLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="meet-link"
                                >
                                  Join Meeting
                                </a>
                              )}
                            </div>
                            <button
                              onClick={() => deleteEvent(event.id)}
                              className="delete-btn"
                            >
                              ✖
                            </button>
                          </div>
                        ))
                      : null}
                  </>
                )}
              </div>
            ))}
          </div>
        );
      case "week":
        return (
          <div className="grid-calendar">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="day-header">
                {day}
              </div>
            ))}
            {calendarData.map((day, index) => (
              <div
                key={index}
                className={`calendar-cell week-cell ${
                  day ? "cell-active" : "cell-inactive"
                } ${day && isToday(day.date) ? "cell-today" : ""}`}
              >
                {day && (
                  <>
                    <div className="date-number">{day.date.getDate()}</div>
                    {day.events.length > 0
                      ? day.events.map((event) => (
                          <div key={event.id} className="event-item">
                            <div className="event-title">{event.title}</div>
                            <div className="event-time">
                              {new Date(event.start).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              -
                              {new Date(event.end).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            <div className="event-details">
                              {event.tutorName && (
                                <div className="tutor-name">
                                  Tutor: {event.tutorName}
                                </div>
                              )}
                              {event.meetLink && (
                                <a
                                  href={event.meetLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="meet-link"
                                >
                                  Join Meeting
                                </a>
                              )}
                            </div>
                            <button
                              onClick={() => deleteEvent(event.id)}
                              className="delete-btn"
                            >
                              ✖
                            </button>
                          </div>
                        ))
                      : null}
                  </>
                )}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="schedule-container">
      <div className="schedule-content">
        <div className="header-container">
          <h1 className="main-title">Class Schedule</h1>
          <button onClick={fetchAcceptedClasses} className="refresh-btn">
            ↻ Refresh
          </button>
        </div>

        <div className="controls-container">
          <div className="view-toggle">
            <button
              onClick={() => setViewMode("month")}
              className={`toggle-btn ${
                viewMode === "month" ? "active-toggle" : ""
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`toggle-btn ${
                viewMode === "week" ? "active-toggle" : ""
              }`}
            >
              Week
            </button>
          </div>

          <div className="navigation-controls">
            <button onClick={goToToday} className="today-btn">
              Today
            </button>
            <button onClick={() => changeDate(-1)} className="nav-btn">
              Previous
            </button>
            <h2 className="date-title">
              {viewMode === "month"
                ? selectedDate.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })
                : selectedDate.toDateString()}
            </h2>
            <button onClick={() => changeDate(1)} className="nav-btn">
              Next
            </button>
          </div>
        </div>

        {renderView()}
      </div>
    </div>
  );
}