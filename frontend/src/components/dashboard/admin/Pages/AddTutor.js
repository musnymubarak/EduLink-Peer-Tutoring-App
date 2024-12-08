import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const AddTutor = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    expertise: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Tutor Data Submitted:", formData);
    setFormData({ name: "", email: "", expertise: "" }); // Reset form
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">Add New Tutor</h1>
              <p className="text-sm text-gray-600">
                Fill in the form below to add a new tutor.
              </p>
            </div>

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
                  placeholder="Enter tutor's name"
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
                  placeholder="Enter tutor's email"
                  className="border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="expertise" className="text-gray-600 text-sm mb-1">
                  Expertise
                </label>
                <input
                  type="text"
                  id="expertise"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  placeholder="Enter expertise (e.g., Math, Science)"
                  className="border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                Add Tutor
              </button>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AddTutor;
