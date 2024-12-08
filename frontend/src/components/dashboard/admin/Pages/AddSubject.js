import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import Footer from "../Footer";

const AddSubject = () => {
  const [subject, setSubject] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subject Added:", subject);
    setSubject(""); // Reset form
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">Add New Subject</h1>
              <p className="text-sm text-gray-600">
                Fill in the form below to add a new subject.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-md rounded-lg p-6 space-y-4"
            >
              <div className="flex flex-col">
                <label htmlFor="subject" className="text-gray-600 text-sm mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter subject name"
                  className="border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                Add Subject
              </button>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AddSubject;
