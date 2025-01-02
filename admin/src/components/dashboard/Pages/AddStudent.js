import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import Footer from "../Footer";

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subjects: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Student Data Submitted:", formData);
    // Add logic to send formData to the backend
    setFormData({ name: "", email: "", subjects: "" }); // Reset form
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          <div className="container mx-auto max-w-7xl">
            {/* Page Title */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">Add New Student</h1>
              <p className="text-sm text-gray-600">
                Fill in the form below to add a new student.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-md rounded-lg p-6 space-y-4"
            >
              <div className="flex flex-col">
                <label htmlFor="name" className="text-gray-600 text-sm mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter student's name"
                  className="border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="text-gray-600 text-sm mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter student's email"
                  className="border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="subjects" className="text-gray-600 text-sm mb-1">
                  Subjects
                </label>
                <input
                  type="text"
                  id="subjects"
                  name="subjects"
                  value={formData.subjects}
                  onChange={handleChange}
                  placeholder="Enter subjects (comma-separated)"
                  className="border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                Add Student
              </button>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AddStudent;
