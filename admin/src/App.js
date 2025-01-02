import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/dashboard/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/dashboard/Sidebar'; // Import Sidebar
import AddCourse from './components/dashboard/Pages/AddCourse'; // Import AddCourse page
import AddSection from './components/dashboard/Pages/AddSection'; // Import AddSection page
import ListCourses from './components/dashboard/Pages/ListCourses'; // Import ListCourses page

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

        {/* Protected Routes for Admin Pages */}
        <Route
          path="/dashboard/admin/add-course"
          element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar /> {/* Sidebar */}
                <AddCourse /> {/* Add Course Page */}
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/admin/add-section"
          element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar /> {/* Sidebar */}
                <AddSection /> {/* Add Section Page */}
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
      </Routes>
    </Router>
  );
}

export default App;
