import React, { useState } from 'react';

export default function SchedulePage() {
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
    description: ""
  });

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');

  const addEvent = () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert("Please fill in all required fields.");
      return;
    }

    const eventToAdd = {
      ...newEvent,
      id: String(Date.now())
    };

    setEvents(prevEvents => [...prevEvents, eventToAdd]);
    setNewEvent({ title: "", start: "", end: "", description: "" });
  };

  const deleteEvent = (eventId) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  };

  const goToToday = () => {
    setSelectedMonth(new Date());
  };

  const generateCalendarView = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });

    switch(viewMode) {
      case 'month':
        return generateMonthView(year, month, firstDay, lastDay, filteredEvents);
      case 'week':
        return generateWeekView(year, month, filteredEvents);
      default:
        return generateMonthView(year, month, firstDay, lastDay, filteredEvents);
    }
  };

  const generateMonthView = (year, month, firstDay, lastDay, filteredEvents) => {
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

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

  const generateWeekView = (year, month, filteredEvents) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const weekStart = new Date(firstDayOfMonth);
    weekStart.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

    const days = [];
    for (let j = 0; j < 7; j++) {
      const dayColumn = [];
      for (let i = 0; i < 6; i++) {
        const currentDate = new Date(weekStart);
        currentDate.setDate(weekStart.getDate() + j + (i * 7));

        const dayEvents = filteredEvents.filter(event => 
          new Date(event.start).toDateString() === currentDate.toDateString()
        );

        dayColumn.push({ 
          date: currentDate, 
          events: dayEvents,
          isCurrentMonth: currentDate.getMonth() === month
        });
      }
      days.push(dayColumn);
    }

    return days;
  };

  const changeMonth = (direction) => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setSelectedMonth(newMonth);
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
                className={`border p-2 min-h-[100px] ${day ? 'bg-white' : 'bg-gray-100'}`}
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
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, dayIndex) => (
              <div key={day} className="bg-white border">
                <div className="font-bold text-gray-600 text-center py-2">{day}</div>
                {calendarData[dayIndex].map(weekDay => (
                  <div 
                    key={weekDay.date.toISOString()} 
                    className={`p-2 min-h-[80px] ${weekDay.isCurrentMonth ? 'bg-white' : 'bg-gray-100'}`}
                  >
                    <div className="text-sm text-gray-500">
                      {weekDay.date.getDate()}
                    </div>
                    {weekDay.events.map(event => (
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
                  </div>
                ))}
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
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded flex items-center ${viewMode === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Month
            </button>
            <button 
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded flex items-center ${viewMode === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
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
              onClick={() => changeMonth(-1)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Previous
            </button>
            <h2 className="text-2xl font-bold">
              {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <button 
              onClick={() => changeMonth(1)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>

        {renderView()}

        {isAddEventModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Add New Class</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Class Title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex space-x-2">
                  <div className="w-1/2">
                    <label className="block text-sm text-gray-600 mb-1">Start Time</label>
                    <input
                      type="datetime-local"
                      value={newEvent.start}
                      onChange={(e) => setNewEvent({...newEvent, start: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm text-gray-600 mb-1">End Time</label>
                    <input
                      type="datetime-local"
                      value={newEvent.end}
                      onChange={(e) => setNewEvent({...newEvent, end: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <textarea
                  placeholder="Class Description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                ></textarea>
                <div className="flex justify-end space-x-4">
                  <button 
                    onClick={() => setIsAddEventModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      addEvent();
                      setIsAddEventModalOpen(false);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Add Class
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
