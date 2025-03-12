import React, { useState } from 'react';
import '../../css/student/SchedulePage.css';

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

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');

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
          <div className="grid-calendar">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="day-header">{day}</div>
            ))}
            {calendarData.map((day, index) => (
              <div 
                key={index} 
                className={`calendar-cell ${day ? 'cell-active' : 'cell-inactive'} ${day && isToday(day.date) ? 'cell-today' : ''}`}
              >
                {day && (
                  <>
                    <div className="date-number">{day.date.getDate()}</div>
                    {day.events.map(event => (
                      <div 
                        key={event.id} 
                        className="event-item"
                      >
                        <span>{event.title}</span>
                        <button 
                          onClick={() => deleteEvent(event.id)}
                          className="delete-btn"
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
                    {day.events.map(event => (
                      <div 
                        key={event.id} 
                        className="event-item"
                      >
                        <span>{event.title}</span>
                        <button 
                          onClick={() => deleteEvent(event.id)}
                          className="delete-btn"
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

  return (
    <div className="schedule-container">
      <div className="schedule-content">
        <div className="header-container">
          <h1 className="main-title">
            Class Schedule
          </h1>
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

      </div>
    </div>
  );
}