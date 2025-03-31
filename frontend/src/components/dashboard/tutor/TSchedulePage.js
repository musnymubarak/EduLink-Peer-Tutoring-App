import React, { useState, useEffect } from 'react';
import '../../css/student/SchedulePage.css';

export default function TSchedulePage() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [fetchingClasses, setFetchingClasses] = useState(true);
  const [groupClasses, setGroupClasses] = useState([]);
  const [error, setError] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    description: "",
    meetLink: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch classes on component mount
  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchAcceptedClasses();
    fetchGroupClasses();
  }, []);

  const fetchClasses = async () => {
    setFetchingClasses(true);
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.error("No authentication token found");
        return;
      }
  
      // Use the acceptedClasses endpoint
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
        // Log the raw data to see its structure
        console.log("Raw API response:", data);
        
        // The API returns classRequests instead of acceptedClasses
        const classItems = data.acceptedClasses || [];
        
        // Transform the class requests into calendar events
        const transformedEvents = classItems.map(classItem => {
          const startTime = new Date(classItem.time);
          const validStartTime = isNaN(startTime.getTime()) ? new Date() : startTime;
          const endTime = new Date(validStartTime.getTime() + (classItem.duration || 60) * 60000);
          
          console.log(classItem.student)
          return {
            id: classItem._id,
            title: classItem.course?.courseName || "Untitled Class",
            start: validStartTime,
            end: endTime,
            description: classItem.course?.courseDescription || "No description provided",
            meetLink: classItem.classLink || "",
            studentName: classItem.student?.firstName || classItem.student?.email || "Unknown Student",
            type: classItem.type // Personal or Group
          };
        });
  
        console.log("Transformed events:", transformedEvents);
        setEvents(transformedEvents);
      } else {
        console.error("Failed to fetch accepted classes:", data.error);
      }
    } catch (error) {
      console.error("Error fetching accepted classes:", error);
    } finally {
      setFetchingClasses(false);
    }
  };

  const addEvent = async () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end || !newEvent.description) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No authentication token found");
        return;
      }
      
      // Convert dates to ISO strings if they aren't already
      const startDate = new Date(newEvent.start).toISOString();
      const endDate = new Date(newEvent.end).toISOString();
      
      // Calculate duration in minutes
      const durationMs = new Date(endDate) - new Date(startDate);
      const durationMinutes = Math.floor(durationMs / 60000);
      
      const classData = {
        courseName: newEvent.title,
        courseDescription: newEvent.description,
        time: startDate,
        duration: durationMinutes,
        classLink: newEvent.meetLink || ""
      };
      
      const response = await fetch("http://localhost:4000/api/v1/classes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(classData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Add event to local state
        const eventToAdd = {
          id: data.class._id || String(Date.now()),
          title: newEvent.title,
          start: new Date(newEvent.start),
          end: new Date(newEvent.end),
          description: newEvent.description,
          meetLink: newEvent.meetLink || ""
        };
        
        setEvents(prevEvents => [...prevEvents, eventToAdd]);
        setNewEvent({
          title: "",
          start: "",
          end: "",
          description: "",
          meetLink: "",
        });
        setIsAddEventModalOpen(false);
      } else {
        console.error("Failed to create class:", data.error);
        alert("Failed to create class: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Error creating class. Please try again.");
    }
  };

  const generateMeetLink = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/meet/generate-meet-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newEvent.title,
          description: newEvent.description,
          start: newEvent.start,
          end: newEvent.end,
        }),
      });

      const data = await response.json();
      if (data.meetLink) {
        setNewEvent((prev) => ({ ...prev, meetLink: data.meetLink }));
      } else {
        alert("Failed to generate Google Meet link");
      }
    } catch (error) {
      console.error("Error generating Meet link:", error);
    } finally {
      setLoading(false); 
    }
  };
  
  const deleteEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No authentication token found");
        return;
      }
      
      const response = await fetch(`http://localhost:4000/api/v1/classes/${eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
      
      if (response.ok) {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      } else {
        const data = await response.json();
        console.error("Failed to delete class:", data.error);
        alert("Failed to delete class: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const generateCalendarView = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();

    switch(viewMode) {
      case 'month':
        return generateMonthView(year, month, events);
      case 'week':
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
      const dayEvents = allEvents.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.getFullYear() === year && 
               eventDate.getMonth() === month && 
               eventDate.getDate() === day;
      });
      
      days.push({ date: currentDate, events: dayEvents });
    }

    return days;
  };

  const generateWeekView = (year, month, day, allEvents) => {
    const weekStart = new Date(year, month, day - new Date(year, month, day).getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + i);

      // Filter events for this specific day
      const dayEvents = allEvents.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.getFullYear() === currentDate.getFullYear() && 
               eventDate.getMonth() === currentDate.getMonth() && 
               eventDate.getDate() === currentDate.getDate();
      });

      days.push({ date: currentDate, events: dayEvents });
    }

    return days;
  };

  const changeDate = (direction) => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + direction * 7);
    }
    setSelectedDate(newDate);
  };

  const isToday = (date) => {
    const today = new Date();
    return today.getDate() === date.getDate() &&
           today.getMonth() === date.getMonth() &&
           today.getFullYear() === date.getFullYear();
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
          <p>No accepted classes found. Create a new class or refresh to update.</p>
        </div>
      );
    }

    const calendarData = generateCalendarView();

    switch(viewMode) {
      case 'month':
        return (
          <div className="grid grid-cols-7 gap-2 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="font-bold text-gray-600">{day}</div>
            ))}
            {calendarData.map((day, index) => (
              <div 
                key={index} 
                className={`border p-2 min-h-[100px] ${day ? 'bg-white' : 'bg-gray-100'} ${day && isToday(day.date) ? 'bg-yellow-300' : ''}`}
              >
                {day && (
                  <>
                    <div className="date-number">{day.date.getDate()}</div>
                    {day.events.length > 0 ? (
                      day.events.map(event => (
                        <div 
                          key={event.id} 
                          className={`event-item ${event.type === 'Group' ? 'group-class' : 'personal-class'}`}
                        >
                          <div className="event-title">{event.title}</div>
                          <div className="event-details">
                            {event.studentName && (
                              <div className="student-name">Student: {event.studentName}</div>
                            )}
                            {event.type === 'Group' && (
                              <div className="class-type">Group Class</div>
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
                    ) : null}
                  </>
                )}
              </div>
            ))}
          </div>
        );
      case 'week':
        return (
          <div className="grid-calendar">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="day-header">{day}</div>
            ))}
            {calendarData.map((day, index) => (
              <div 
                key={index} 
                className={`calendar-cell week-cell ${day ? 'cell-active' : 'cell-inactive'} ${day && isToday(day.date) ? 'cell-today' : ''}`}
              >
                {day && (
                  <>
                    <div className="date-number">{day.date.getDate()}</div>
                    {day.events.length > 0 ? (
                      day.events.map(event => (
                        <div 
                          key={event.id} 
                          className={`event-item ${event.type === 'Group' ? 'group-class' : 'personal-class'}`}
                        >
                          <div className="event-title">{event.title}</div>
                          <div className="event-time">
                            {new Date(event.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                            {new Date(event.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                          <div className="event-details">
                            {event.studentName && (
                              <div className="student-name">Student: {event.studentName}</div>
                            )}
                            {event.type === 'Group' && (
                              <div className="class-type">Group Class</div>
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
                    ) : null}
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
          <h1 className="main-title">
            Accepted Classes
          </h1>
          <div className="buttons-container">
            <button 
              onClick={fetchClasses} 
              className="refresh-btn"
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        <div className="controls-container">
          <div className="view-toggle">
            <button 
              onClick={() => setViewMode('month')}
              className={`toggle-btn ${viewMode === 'month' ? 'active-toggle' : ''}`}
            >
              Month
            </button>
            <button 
              onClick={() => setViewMode('week')}
              className={`toggle-btn ${viewMode === 'week' ? 'active-toggle' : ''}`}
            >
              Week
            </button>
          </div>

          <div className="navigation-controls">
            <button 
              onClick={goToToday}
              className="today-btn"
            >
              Today
            </button>
            <button 
              onClick={() => changeDate(-1)}
              className="nav-btn"
            >
              Previous
            </button>
            <h2 className="date-title">
              {viewMode === 'month' ? selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' }) : selectedDate.toDateString()}
            </h2>
            <button 
              onClick={() => changeDate(1)}
              className="nav-btn"
            >
              Next
            </button>
          </div>
        </div>

        {renderView()}

        {isAddEventModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">Add New Class</h2>
              <div className="form-group">
                <label htmlFor="title">Class Title</label>
                <input
                  type="text"
                  id="title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="start">Start Time</label>
                <input
                  type="datetime-local"
                  id="start"
                  value={newEvent.start}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, start: e.target.value })
                  }
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="end">End Time</label>
                <input
                  type="datetime-local"
                  id="end"
                  value={newEvent.end}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, end: e.target.value })
                  }
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  className="form-textarea"
                />
              </div>
              <div className="form-group">
                <label htmlFor="meetLink">Meeting Link</label>
                <input
                  type="text"
                  id="meetLink"
                  value={newEvent.meetLink}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, meetLink: e.target.value })
                  }
                  className="form-input"
                />
                <button
                  onClick={generateMeetLink}
                  className="generate-link-btn"
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate Meeting Link"}
                </button>
              </div>

              <div className="modal-buttons">
                <button
                  onClick={addEvent}
                  className="submit-btn"
                >
                  Add Class
                </button>
                <button
                  onClick={() => setIsAddEventModalOpen(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}