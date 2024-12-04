import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react"; // React wrapper
import dayGridPlugin from "@fullcalendar/daygrid"; // Day grid view
import interactionPlugin from "@fullcalendar/interaction"; // Interactivity

export default function SchedulePage() {
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "C++ Class",
      start: "2024-12-12T08:00:00",
      end: "2024-12-12T10:00:00",
      description: "Learn the fundamentals of C++ programming.",
    },
  ]);

  // Add new event dynamically
  const addEvent = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  // Handle event click
  const handleEventClick = (clickInfo) => {
    alert(`Class: ${clickInfo.event.title}\nDetails: ${clickInfo.event.extendedProps.description}`);
    // Optionally launch the reminder functionality
  };

  // Set Reminder Functionality
  const setReminder = (event) => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Class Reminder", {
            body: `Reminder: ${event.title} at ${new Date(event.start).toLocaleTimeString()}`,
          });
        }
      });
    } else {
      alert("Browser does not support notifications!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Class Schedule</h1>

      {/* FullCalendar Component */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={(clickInfo) => {
          handleEventClick(clickInfo);
          setReminder({
            title: clickInfo.event.title,
            start: clickInfo.event.start,
          });
        }}
        eventContent={(eventInfo) => (
          <div className="bg-blue-500 text-white rounded-md p-1 shadow-md">
            <div>{eventInfo.event.title}</div>
          </div>
        )}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek",
        }}
        dayMaxEvents={true}
      />

      {/* Example Add Event Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() =>
            addEvent({
              id: "2",
              title: "Python Class",
              start: "2024-12-13T10:00:00",
              end: "2024-12-13T12:00:00",
              description: "Learn Python basics.",
            })
          }
          className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700"
        >
          Add Python Class
        </button>
      </div>
    </div>
  );
}
