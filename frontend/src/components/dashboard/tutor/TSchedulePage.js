import React, { useState } from 'react';

export default function TSchedulePage() {
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "C++ Class",
      start: "2024-12-12T08:00:00",
      end: "2024-12-12T10:00:00",
      description: "Learn the fundamentals of C++ programming.",
    },
    {
      id: "2",
      title: "Python Workshop",
      start: "2024-12-13T14:00:00",
      end: "2024-12-13T16:00:00",
      description: "Advanced Python programming techniques.",
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    description: "",
    meetLink: "",
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [loading, setLoading] = useState(false); 

  const addEvent = () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end || !newEvent.description || !newEvent.meetLink) {
      alert("Please fill in all required fields.");
      return;
    }

    const eventToAdd = {
      ...newEvent,
      id: String(Date.now())
    };

    setEvents(prevEvents => [...prevEvents, eventToAdd]);
    setNewEvent({
      title: "",
      start: "",
      end: "",
      description: "",
      meetLink: "",
    });
  };

  const generateMeetLink = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/meet/generate-meet-link", {
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

  const deleteEvent = (eventId) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const generateCalendarView = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();

    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate >= new Date(year, month, day) && eventDate < new Date(year, month, day + 7);
    });

    switch(viewMode) {
      case 'month':
        return generateMonthView(year, month, filteredEvents);
      case 'week':
        return generateWeekView(year, month, day, filteredEvents);
      default:
        return generateMonthView(year, month, filteredEvents);
    }
  };

  const generateMonthView = (year, month, filteredEvents) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDayOfWeek = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dayEvents = filteredEvents.filter(event => 
        new Date(event.start).toDateString() === currentDate.toDateString()
      );
      days.push({ date: currentDate, events: dayEvents });
    }

    return days;
  };

  const generateWeekView = (year, month, day, filteredEvents) => {
    const weekStart = new Date(year, month, day - new Date(year, month, day).getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + i);

      const dayEvents = filteredEvents.filter(event => 
        new Date(event.start).toDateString() === currentDate.toDateString()
      );

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
    return today.toDateString() === date.toDateString();
  };

  const renderView = () => {
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
                    <div className="text-sm text-gray-500">{day.date.getDate()}</div>
                    {day.events.map(event => (
                      <div 
                        key={event.id} 
                        className="bg-blue-100 text-blue-800 rounded p-1 mt-1 text-xs flex justify-between items-center"
                      >
                        <span>{event.title}</span>
                        <button 
                          onClick={() => deleteEvent(event.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✖
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        );
      case 'week':
        return (
          <div className="grid grid-cols-7 gap-2 text-center h-full">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="font-bold text-gray-600">{day}</div>
            ))}
            {calendarData.map((day, index) => (
              <div 
                key={index} 
                className={`border p-2 flex flex-col justify-between ${day ? 'bg-white h-full' : 'bg-gray-100'} ${day && isToday(day.date) ? 'bg-yellow-300' : ''}`}
              >
                {day && (
                  <>
                    <div className="text-sm text-gray-500">{day.date.getDate()}</div>
                    {day.events.map(event => (
                      <div 
                        key={event.id} 
                        className="bg-blue-100 text-blue-800 rounded p-1 mt-1 text-xs flex justify-between items-center"
                      >
                        <span>{event.title}</span>
                        <button 
                          onClick={() => deleteEvent(event.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✖
                        </button>
                      </div>
                    ))}
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

  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Class Schedule
          </h1>

          <button
            onClick={() => setIsAddEventModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
          >
            + Add Class
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode("month")}
              className={`px-4 py-2 rounded flex items-center ${
                viewMode === "month" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-4 py-2 rounded flex items-center ${
                viewMode === "week" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Week
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Today
            </button>
            <button
              onClick={() => changeDate(-1)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Previous
            </button>
            <h2 className="text-2xl font-bold">
              {viewMode === "month"
                ? selectedDate.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })
                : selectedDate.toDateString()}
            </h2>
            <button
              onClick={() => changeDate(1)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>

        {renderView()}

        {isAddEventModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
              <h2 className="text-2xl font-bold mb-4">Add New Event</h2>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="start"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start
                </label>
                <input
                  type="datetime-local"
                  id="start"
                  value={newEvent.start}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, start: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="end"
                  className="block text-sm font-medium text-gray-700"
                >
                  End
                </label>
                <input
                  type="datetime-local"
                  id="end"
                  value={newEvent.end}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, end: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="meetLink"
                  className="block text-sm font-medium text-gray-700"
                >
                  Meeting Link
                </label>
                <input
                  type="text"
                  id="meetLink"
                  value={newEvent.meetLink}
                  readOnly
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <button
                  onClick={generateMeetLink}
                  className="px-4 py-2 bg-green-500 text-white rounded mt-2"
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate Meeting Link"}
                </button>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={addEvent}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Event
                </button>
                <button
                  onClick={() => setIsAddEventModalOpen(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
