import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/dashboard/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/dashboard/Sidebar'; // Import Sidebar
import ListCourses from './components/dashboard/Pages/ListCourses'; // Import ListCourses page
import ListTutors from './components/dashboard/Pages/ListTutors'; // Import ListTutors page

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login />} />

        {/* Fallback Route */}
        <Route path="*" element={<Login />} />

        {/* Protected Admin Dashboard Route */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar /> {/* Sidebar */}
                <AdminDashboard /> {/* Admin Dashboard Content */}
              </div>
            </ProtectedRoute>
          }
        />

        {/* Route for List Courses Page */}
        <Route
          path="/dashboard/admin/list-courses"
          element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar /> {/* Sidebar */}
                <ListCourses /> {/* List Courses Page */}
              </div>
            </ProtectedRoute>
          }
        />

        {/* Route for List Tutors Page */}
        <Route
          path="/dashboard/admin/list-tutors"
          element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar /> {/* Sidebar */}
                <ListTutors /> {/* List Tutors Page */}
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
